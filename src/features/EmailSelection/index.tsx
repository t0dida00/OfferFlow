import { X, Search, Check } from 'lucide-react';
import { Email } from '../../types';
import { useEmailSelection } from '../../hooks/useEmailSelection';
import { useModal } from '../../hooks/useModal';
import { formatDate } from '../../utils/date';
import styles from './EmailSelectionModal.module.scss';

interface EmailSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    allEmails: Email[];
    selectedEmailIds: string[];
    onSave: (newEmailIds: string[]) => void;
}

export function EmailSelectionModal({ isOpen, onClose, allEmails, selectedEmailIds, onSave }: EmailSelectionModalProps) {
    const {
        searchQuery,
        setSearchQuery,
        tempSelectedIds,
        filteredEmails,
        toggleEmail,
        getSelectedIds,
    } = useEmailSelection(allEmails, selectedEmailIds, isOpen);
    
    useModal(isOpen);

    const onSaveClick = () => {
        onSave(getSelectedIds());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.emailSelection} onClick={(e) => {
            e.stopPropagation();
            onClose();
        }}>
            <div
                className={styles.emailSelection__dialog}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.emailSelection__header}>
                    <div className={styles.emailSelection__headerContent}>
                        <h2>Link Emails</h2>
                        <p>Select emails to link to this application</p>
                    </div>
                    <button
                        onClick={onClose}
                        className={styles.emailSelection__closeButton}
                    >
                        <X />
                    </button>
                </div>

                {/* Sub-header with Search */}
                <div className={styles.emailSelection__searchSection}>
                    <div className={styles.emailSelection__searchWrapper}>
                        <Search className={styles.emailSelection__searchIcon} />
                        <input
                            type="text"
                            placeholder="Search emails by subject or snippet..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.emailSelection__searchInput}
                        />
                    </div>
                </div>

                {/* Email List */}
                <div className={styles.emailSelection__emailList}>
                    {filteredEmails.length > 0 ? (
                        filteredEmails.map(email => {
                            const isSelected = tempSelectedIds.has(email.emailId);
                            return (
                                <div
                                    key={email.emailId}
                                    onClick={() => toggleEmail(email.emailId)}
                                    className={`${styles.emailSelection__emailItem} ${isSelected ? styles['emailSelection__emailItem--selected'] : ''}`}
                                >
                                    <div className={`${styles.emailSelection__checkbox} ${isSelected ? styles['emailSelection__checkbox--selected'] : ''}`}>
                                        {isSelected && <Check />}
                                    </div>
                                    <div className={styles.emailSelection__emailContent}>
                                        <div className={styles.emailSelection__emailHeader}>
                                            <h4 className={`${styles.emailSelection__emailSubject} ${isSelected ? styles['emailSelection__emailSubject--selected'] : ''}`}>
                                                {email.subject || '(No Subject)'}
                                            </h4>
                                            <span className={styles.emailSelection__emailDate}>
                                                {formatDate(email.date)}
                                            </span>
                                        </div>
                                        <p className={styles.emailSelection__emailSnippet}>
                                            {email.snippet}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.emailSelection__emptyState}>
                            No emails found matching "{searchQuery}"
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.emailSelection__footer}>
                    <div className={styles.emailSelection__selectedCount}>
                        {tempSelectedIds.size} selected
                    </div>
                    <div className={styles.emailSelection__footerActions}>
                        <button
                            onClick={onClose}
                            className={styles.emailSelection__cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSaveClick}
                            className={styles.emailSelection__saveButton}
                        >
                            Save Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

