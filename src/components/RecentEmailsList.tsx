import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, RefreshCw } from 'lucide-react';
import { fetchEmails, syncGmail } from '../services/api';
import { Email } from '../types';

const statusColors: Record<string, string> = {
    Applied: 'text-gray-600 bg-gray-100',
    Interview: 'text-yellow-700 bg-yellow-100',
    Offer: 'text-green-700 bg-green-100',
    Rejected: 'text-red-700 bg-red-100',
};

export function RecentEmailsList() {
    const queryClient = useQueryClient();
    const { data: rawEmails, isLoading } = useQuery({
        queryKey: ['emails'],
        queryFn: fetchEmails,
    });

    const { mutate: handleSync, isPending: isSyncing } = useMutation({
        mutationFn: syncGmail,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emails'] });
            queryClient.invalidateQueries({ queryKey: ['applications'] });
        },
        onError: (error) => {
            console.error('Failed to sync Gmail:', error);
        }
    });

    const emails: Email[] = rawEmails?.data || [];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[600px]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Recent Related Emails
                </h2>
                <p className="mt-1 opacity-70">Last 20 emails</p>
            </div>

            <div className="flex-1 overflow-y-auto p-0">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : emails.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {emails.map(email => (
                            <div
                                key={email.emailId}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                                onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox/${email.emailId}`, '_blank')}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {email.subject}
                                        </h4>
                                        <span className={`font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusColors[email.status] || 'text-gray-600 bg-gray-100'}`}>
                                            {email.status}
                                        </span>
                                    </div>
                                    <span className="whitespace-nowrap ml-4 opacity-70 shrink-0">
                                        {new Date(email.date).toLocaleDateString()}
                                    </span>
                                </div>

                                <p className="line-clamp-2 opacity-70">
                                    {email.snippet}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <Mail className="w-12 h-12 mb-3 opacity-20" />
                        <p>No recent emails found</p>
                        <button
                            onClick={() => handleSync()}
                            disabled={isSyncing}
                            className="mt-4 text-blue-600 hover:underline cursor-pointer text-sm flex items-center gap-2 disabled:opacity-50 disabled:no-underline"
                        >
                            {isSyncing ? (
                                <>
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                    Syncing...
                                </>
                            ) : (
                                'Sync now'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
