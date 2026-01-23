import { useState, useEffect } from 'react';
import { X, Mail, Calendar, MapPin, Building, Briefcase, ExternalLink, Plus } from 'lucide-react';
import { Application, Email } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import { EmailSelectionModal } from './EmailSelectionModal';
import modalStyles from './Modal.module.scss';
import styles from './ApplicationDetailsModal.module.scss';

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

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    return (
        <div className={modalStyles['modal__backdrop']} onClick={onClose}>
            <div
                className={modalStyles['modal__dialog']}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={modalStyles['modal__header']}>
                    <div>
                        <h2 className={modalStyles['modal__title']}>Application Details</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className={modalStyles['modal__close']}
                    >
                        <X />
                    </button>
                </div>

                <div className={styles.appDetailsModal__layout}>
                    <div className={styles.appDetailsModal__formSection}>
                        <form id="edit-form" onSubmit={handleSubmit} className={styles.appDetailsModal__form}>
                            <div className={styles.appDetailsModal__field}>
                                <label className={styles.appDetailsModal__label}>
                                    <Building /> Company
                                </label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className={styles.appDetailsModal__input}
                                />
                            </div>
                            <div className={styles.appDetailsModal__field}>
                                <label className={styles.appDetailsModal__label}>
                                    <Briefcase /> Role
                                </label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className={styles.appDetailsModal__input}
                                />
                            </div>
                            <div className={styles.appDetailsModal__field}>
                                <label className={styles.appDetailsModal__label}>
                                    <MapPin /> Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className={styles.appDetailsModal__input}
                                />
                            </div>
                            <div className={styles.appDetailsModal__field}>
                                <label className={styles.appDetailsModal__label}>
                                    <Calendar /> Date Applied
                                </label>
                                <input
                                    type="date"
                                    value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className={styles.appDetailsModal__input}
                                />
                            </div>
                            <div className={styles.appDetailsModal__field}>
                                <label className={styles.appDetailsModal__label}>
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className={styles.appDetailsModal__select}
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </form>
                    </div>

                    <div className={styles.appDetailsModal__emailsSection}>
                        <div className={styles.appDetailsModal__emailsHeader}>
                            <h3 className={styles.appDetailsModal__emailsTitle}>
                                <Mail /> Related Emails
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsEmailModalOpen(true)}
                                className={styles.appDetailsModal__emailsManageButton}
                                title="Manage linked emails"
                            >
                                <Plus />
                            </button>
                        </div>

                        <div className={styles.appDetailsModal__emailsList}>
                            {relatedEmails.length > 0 ? (
                                relatedEmails.map((email: Email) => (
                                    <a
                                        key={email.emailId}
                                        href={`https://mail.google.com/mail/u/0/#inbox/${email.emailId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.appDetailsModal__emailCard}
                                    >
                                        <div className={styles.appDetailsModal__emailHeader}>
                                            <h4 className={styles.appDetailsModal__emailSubject}>
                                                {email.subject}
                                            </h4>
                                            <div className={styles.appDetailsModal__emailMeta}>
                                                <span>{new Date(email.date).toLocaleDateString()}</span>
                                                <ExternalLink />
                                            </div>
                                        </div>
                                        <p className={styles.appDetailsModal__emailSnippet}>
                                            {email.snippet}
                                        </p>
                                    </a>
                                ))
                            ) : (
                                <div className={styles.appDetailsModal__emailsEmpty}>
                                    No related emails found for this application.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.appDetailsModal__footer}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.appDetailsModal__footerButton}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="edit-form"
                        className={`${styles.appDetailsModal__footerButton} ${styles['appDetailsModal__footerButton--primary']}`}
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
