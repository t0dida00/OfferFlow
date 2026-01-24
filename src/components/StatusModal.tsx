import { Check, AlertTriangle, Loader2 } from 'lucide-react';
import styles from './StatusModal.module.scss';
import modalStyles from './Modal.module.scss';

interface StatusModalProps {
    type: 'success' | 'error' | 'loading';
    title: string;
    message: string;
    onClose?: () => void;
}

export function StatusModal({ type, title, message, onClose }: StatusModalProps) {
    const isSuccess = type === 'success';
    const isError = type === 'error';
    const isLoading = type === 'loading';

    return (
        <div className={modalStyles['modal__overlay']} onClick={isLoading ? undefined : onClose}>
            <div className={styles.statusModal__dialog} onClick={(e) => e.stopPropagation()}>
                <div className={`
                    ${styles.statusModal__iconWrapper} 
                    ${isSuccess ? styles['statusModal__iconWrapper--success'] : ''}
                    ${isError ? styles['statusModal__iconWrapper--error'] : ''}
                    ${isLoading ? styles['statusModal__iconWrapper--loading'] : ''}
                `}>
                    {isSuccess && <Check className={styles.statusModal__icon} />}
                    {isError && <AlertTriangle className={styles.statusModal__icon} />}
                    {isLoading && <Loader2 className={`${styles.statusModal__icon} ${styles.animateSpin}`} />}
                </div>

                <h2 className={styles.statusModal__title}>{title}</h2>

                <p className={styles.statusModal__message}>
                    {message}
                </p>

                {!isLoading && onClose && (
                    <button
                        onClick={onClose}
                        className={styles.statusModal__button}
                    >
                        {isSuccess ? 'Close' : 'Dismiss'}
                    </button>
                )}
            </div>
        </div>
    );
}
