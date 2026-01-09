import { Mail, RefreshCw } from 'lucide-react';

interface EmailMessage {
    id: string;
    snippet: string;
    subject: string;
    from: string;
    date: string;
    body?: string;
}

interface RecentEmailsListProps {
    emails: EmailMessage[];
    isLoading: boolean;
    onSync: () => void;
}

export function RecentEmailsList({ emails, isLoading, onSync }: RecentEmailsListProps) {
    console.log(emails);
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[600px]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    Recent Related Emails
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Last 20 emails</p>
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
                                key={email.id}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                                onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox/${email.id}`, '_blank')}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[180px]" title={email.from}>
                                        {email.from.replace(/<.*>/, '').trim()}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                        {new Date(email.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 truncate mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                                    {email.subject}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                    {email.snippet}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8 text-center">
                        <Mail className="w-12 h-12 mb-3 opacity-20" />
                        <p>No recent emails found</p>
                        <button onClick={onSync} className="mt-4 text-blue-600 hover:underline text-sm">Try syncing again</button>
                    </div>
                )}
            </div>
        </div>
    );
}
