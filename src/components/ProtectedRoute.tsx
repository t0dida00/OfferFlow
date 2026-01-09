import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    isLoggedIn: boolean;
    children: React.ReactNode;
}

export function ProtectedRoute({ isLoggedIn, children }: ProtectedRouteProps) {
    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
