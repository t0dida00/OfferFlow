import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Completing login...</h2>
            </div>
        </div>
    );
}
