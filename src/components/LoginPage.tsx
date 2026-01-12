import { useState } from 'react';
import './LoginPage.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const BACKEND_GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  // const loginWithGoogle = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   const params = new URLSearchParams({
  //     client_id: GOOGLE_CLIENT_ID,
  //     redirect_uri: `${BACKEND_URL}`,
  //     response_type: "code",
  //     scope: [
  //       "openid",
  //       "email",
  //       "profile",
  //       "https://www.googleapis.com/auth/gmail.readonly"
  //     ].join(" "),
  //     access_type: "offline",
  //     prompt: "consent"
  //   });

  //   window.location.href =
  //     `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  // };
  const loginWithGoogle = (e: React.MouseEvent) => {
    e.preventDefault();

    // 🔐 Frontend only redirects to backend
    window.location.href = BACKEND_GOOGLE_AUTH_URL;
  };
  return (
    <div className="login-page-body">
      <div className={`auth-wrapper ${isSignUp ? "panel-active" : ""}`} id="authWrapper">
        {/* Login Form */}
        <div className="auth-form-box login-form-box">
          <form action="#" onSubmit={(e) => e.preventDefault()}>
            <h1>Sign In</h1>
            <div className="social-links">

              <a href="#" aria-label="Google" onClick={loginWithGoogle}>
                <svg className="social-icon" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
              </a>

            </div>
            <span>Login with Email Account</span>
            {/* Inputs Removed as requested */}


          </form>
        </div>

        {/* Overlay Panel */}
        <div className="slide-panel-wrapper">
          <div className="slide-panel">
            <div className="panel-content panel-content-right">
              <h1>Jobber!</h1>
              <p>Begin tracking your applications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}