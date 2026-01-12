import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Mail, RefreshCw } from 'lucide-react';
import { fetchEmails } from '../services/api';
import { Email } from '../types';

const statusColors: Record<string, string> = {
    Applied: 'text-gray-600 bg-gray-100',
    Interview: 'text-yellow-700 bg-yellow-100',
    Offer: 'text-green-700 bg-green-100',
    Rejected: 'text-red-700 bg-red-100',
};

interface RecentEmailsListProps {
    onSync: () => void;
    isSyncing: boolean;
}

export function RecentEmailsList({ onSync, isSyncing }: RecentEmailsListProps) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { data: rawEmails, isLoading } = useQuery({
        queryKey: ['emails'],
        queryFn: fetchEmails,
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
                                {!isMobile ? (
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
                                ) : (
                                    <div className="mb-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[email.status] || 'text-gray-600 bg-gray-100'}`}>
                                                {email.status}
                                            </span>
                                            <span className="text-xs opacity-70">
                                                {new Date(email.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {email.subject}
                                        </h4>
                                    </div>
                                )}

                                <p className="line-clamp-2 opacity-70">
                                    {email.snippet}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
                        <div className="text-2xl font-semibold dark:text-white mb-2">No Recent Emails</div>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Sync your Gmail to see your recent job-related emails here.</p>
                        <button
                            onClick={onSync}
                            disabled={isSyncing}
                            className="flex items-center gap-2 rounded-lg disabled:opacity-50 font-medium btn-primary"
                        >
                            <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                            <span>{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
