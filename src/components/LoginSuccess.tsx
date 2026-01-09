import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface LoginSuccessProps {
    onLogin: (email: string, token: string) => void;
}

interface JwtPayload {
    email: string;
    // add other fields if needed
}

export function LoginSuccess({ onLogin }: LoginSuccessProps) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                // Assuming the token contains the email. If not, we might need a fallback or a fetch.
                // The user request implies "login by Gmail is handled by backend" and returns a token.
                // Standard JWTs usually have 'email' or 'sub' as identifiers.
                // Let's assume 'email' is in the payload for now based on typical OAuth flows, 
                // or we'll use a placeholder if decoding fails but token exists? 
                // No, better to try/catch.

                if (decoded.email) {
                    onLogin(decoded.email, token);
                    navigate('/dashboard');
                } else {
                    console.error("Token missing email field");
                    navigate('/');
                }
            } catch (error) {
                console.error("Invalid token:", error);
                navigate('/');
            }
        } else {
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
