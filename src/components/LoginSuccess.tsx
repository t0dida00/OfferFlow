import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './LoginSuccess.module.scss';

interface LoginSuccessProps {
    onLogin: (token: string) => void;
}

export function LoginSuccess({ onLogin }: LoginSuccessProps) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            onLogin(token);
            navigate('/dashboard');
        } else {
            console.error("Missing token in URL params");
            navigate('/');
        }
    }, [searchParams, navigate, onLogin]);

    return (
        <div className={styles.loginSuccess}>
            <div className={styles.loginSuccess__content}>
                <div className={styles.loginSuccess__spinner}></div>
                <h2 className={styles.loginSuccess__title}>Completing login...</h2>
            </div>
        </div>
    );
}
