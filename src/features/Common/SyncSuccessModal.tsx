import { Check } from 'lucide-react';
import styles from './SyncSuccessModal.module.scss';
import modalStyles from './Modal.module.scss';

interface SyncSuccessModalProps {
    onClose: () => void;
    count?: number; // Optional count of items synced if available
}

export function SyncSuccessModal({ onClose, count }: SyncSuccessModalProps) {
    return (
        <div className={modalStyles['modal__overlay']} onClick={onClose}>
            <div className={styles.syncSuccessModal__dialog} onClick={(e) => e.stopPropagation()}>
                <div className={styles.syncSuccessModal__iconWrapper}>
                    <Check className={styles.syncSuccessModal__icon} />
                </div>

                <h2 className={styles.syncSuccessModal__title}>Sync Complete!</h2>

                <p className={styles.syncSuccessModal__message}>
                    Your Gmail account has been successfully synced.
                    {count !== undefined && count > 0
                        ? ` We found ${count} new application updates.`
                        : ' Your applications are up to date.'}
                </p>

                <button
                    onClick={onClose}
                    className={styles.syncSuccessModal__button}
                >
                    Great, thanks!
                </button>
            </div>
        </div>
    );
}

