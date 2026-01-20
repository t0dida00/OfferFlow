import { useState } from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Application } from '../types';
import { ApplicationDetailsModal } from './ApplicationDetailsModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApplication } from '../services/api';

interface RecentApplicationsListProps {
    applications: Application[];
    onViewAll?: () => void;
}

const statusColors: Record<string, string> = {
    Applied: 'text-gray-600 bg-gray-100',
    Interview: 'text-yellow-700 bg-yellow-100',
    Offer: 'text-green-700 bg-green-100',
    Rejected: 'text-red-700 bg-red-100',
};

export function RecentApplicationsList({ applications, onViewAll }: RecentApplicationsListProps) {
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const queryClient = useQueryClient();

    const { mutate: handleUpdateApp } = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) => updateApplication(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            setSelectedApp(null);
        },
        onError: (error) => {
            console.error("Failed to update application", error);
        }
    });

    // Sort by date descending and take top 5
    const recentApplications = [...applications]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row" style={{ height: 'fit-content' }}>
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 flex items-center justify-between md:flex-col md:items-start md:justify-start md:min-w-[200px] md:flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                        <Briefcase className="w-5 h-5" />
                        Recent Applications
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-normal mt-1 ml-7">
                        Last 5 applications
                    </p>
                </div>
                {onViewAll && (
                    <button
                        onClick={onViewAll}
                        className="flex items-center gap-2 rounded-lg btn-primary md:mt-4"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-0 recent-apps-scroll" style={{ height: 'fit-content' }}>
                {recentApplications.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentApplications.map(app => (
                            <div
                                key={app._id}
                                onClick={() => setSelectedApp(app)}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                            {app.company}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {app.role}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[app.status] || 'text-gray-600 bg-gray-100'}`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {app.location}
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {new Date(app.date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center p-6">
                        <p className="text-gray-500 dark:text-gray-400 mb-2">No applications yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Add an application to see it here</p>
                    </div>
                )}
            </div>

            {selectedApp && (
                <ApplicationDetailsModal
                    application={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onSave={(id, updates) => handleUpdateApp({ id, data: updates })}
                />
            )}
        </div>
    );
}
