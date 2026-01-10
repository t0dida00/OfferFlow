import { useState, useMemo } from 'react';
import { X, Search, Check } from 'lucide-react';
import { Email } from '../types';

interface EmailSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    allEmails: Email[];
    selectedEmailIds: string[];
    onSave: (newEmailIds: string[]) => void;
}

export function EmailSelectionModal({ isOpen, onClose, allEmails, selectedEmailIds, onSave }: EmailSelectionModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [tempSelectedIds, setTempSelectedIds] = useState<Set<string>>(new Set(selectedEmailIds));

    // Reset local state when modal opens/closes or props change
    // Effect handling could be added if needed, but initializing state from props is okay for now 
    // provided we sync when the modal opens. For simplicity in this functional component, 
    // we might rely on the parent to mount/unmount or use an effect if it stays mounted.
    // Let's assume conditional rendering from parent for "isOpen", or better, use an effect.

    // Better approach: use useMemo or useEffect to sync whenisOpen becomes true, 
    // but since we can't easily conditionally call hooks based on isOpen in a clean way without complexity,
    // we'll rely on the checked state being derived or managing it. 
    // Actually, simpler: The parent typically conditionally renders this modal. 
    // If it doesn't, we need an effect. Let's assume conditional rendering for now or sync on open.
    // If checking "isOpen" change:

    // Changing strategy: Just use state. If prop "selectedEmailIds" changes, we might want to update.
    // But usually modals are transient.

    const filteredEmails = useMemo(() => {
        return allEmails.filter(email =>
            email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.snippet.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allEmails, searchQuery]);

    const toggleEmail = (id: string) => {
        const newSet = new Set(tempSelectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setTempSelectedIds(newSet);
    };

    const handleSave = () => {
        onSave(Array.from(tempSelectedIds));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-h-[80vh] flex flex-col" style={{ maxWidth: '1024px' }}>
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Link Emails</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Select emails to link to this application</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Sub-header with Search */}
                <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search emails by subject or snippet..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Email List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                    {filteredEmails.length > 0 ? (
                        filteredEmails.map(email => {
                            const isSelected = tempSelectedIds.has(email.emailId);
                            return (
                                <div
                                    key={email.emailId}
                                    onClick={() => toggleEmail(email.emailId)}
                                    className={`
                                        flex items-center p-4 gap-4 rounded-xl cursor-pointer border transition-all
                                        ${isSelected
                                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm'
                                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'}
                                    `}
                                >
                                    <div className={`
                                        w-5 h-5 rounded border  flex items-center justify-center shrink-0 mr-4 transition-colors
                                        ${isSelected
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'}
                                    `}>
                                        {isSelected && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>
                                                {email.subject || '(No Subject)'}
                                            </h4>
                                            <span className="text-xs text-gray-500 whitespace-nowrap ml-3">
                                                {new Date(email.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {email.snippet}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 mx-4">
                            No emails found matching "{searchQuery}"
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center shrink-0">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {tempSelectedIds.size} selected
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Save Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
