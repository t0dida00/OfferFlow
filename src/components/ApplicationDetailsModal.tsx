import { useState } from 'react';
import { X, Mail, Calendar, MapPin, Building, Briefcase, ExternalLink, Plus } from 'lucide-react';
import { Application, Email } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import { EmailSelectionModal } from './EmailSelectionModal';

interface ApplicationDetailsModalProps {
    application: Application;
    onClose: () => void;
    onSave: (_id: string, updates: Partial<Application>) => void;
}

export function ApplicationDetailsModal({ application, onClose, onSave }: ApplicationDetailsModalProps) {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        company: application.company,
        role: application.role,
        location: application.location,
        date: application.date,
        status: application.status,
        emailIds: application.emailIds || [],
    });
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    // Get all emails from cache to find related ones
    const allEmails = queryClient.getQueryData<any>(['emails'])?.data || [];

    const relatedEmails = allEmails.filter((email: Email) =>
        formData.emailIds.includes(email.emailId)
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(application._id, formData);
    };

    const handleEmailSelectionSave = (newEmailIds: string[]) => {
        setFormData(prev => ({ ...prev, emailIds: newEmailIds }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col" style={{ maxWidth: '768px' }}>
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Application Details</h2>
                        {/* <p className="text-sm text-gray-500 dark:text-gray-400">#{application.id}</p> */}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Left Column: Edit Form */}
                    <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
                        <form id="edit-form" onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                                    <Building className="w-4 h-4" /> Company
                                </label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" /> Role
                                </label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Date Applied
                                </label>
                                <input
                                    type="date"
                                    value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Related Emails */}
                    <div className="w-full md:w-2/3 p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                <Mail className="w-5 h-5" /> Related Emails
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsEmailModalOpen(true)}
                                className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                                title="Manage linked emails"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {relatedEmails.length > 0 ? (
                                relatedEmails.map((email: Email) => (
                                    <a
                                        key={email.emailId}
                                        href={`https://mail.google.com/mail/u/0/#inbox/${email.emailId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {email.subject}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {new Date(email.date).toLocaleDateString()}
                                                </span>
                                                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-500" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                            {email.snippet}
                                        </p>
                                    </a>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No related emails found for this application.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-form"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            <EmailSelectionModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                allEmails={allEmails}
                selectedEmailIds={formData.emailIds}
                onSave={handleEmailSelectionSave}
            />
        </div>
    );
}
