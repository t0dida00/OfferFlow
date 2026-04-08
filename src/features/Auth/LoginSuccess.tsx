import styles from './LoginSuccess.module.scss';
import { useLoginSuccess } from '../../hooks/useLoginSuccess';

interface LoginSuccessProps {
    onLogin: (token: string) => Promise<void>;
}

export function LoginSuccess({ onLogin }: LoginSuccessProps) {
    useLoginSuccess(onLogin);

    return (
        <div className={styles.loginSuccess}>
            <div className={styles.loginSuccess__content}>
                <div className={styles.loginSuccess__spinner}></div>
                <h2 className={styles.loginSuccess__title}>Completing login...</h2>
            </div>
        </div>
    );
}

