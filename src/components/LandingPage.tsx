import { ArrowRight, BarChart3, Mail, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.scss';
import logo from '../public/icons/logo.svg';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

export function LandingPage({ isDarkMode, onToggleTheme }: LandingPageProps) {
    return (
        <div className={styles.landing}>
            <nav className={styles.nav}>
                <div className={styles.nav__logo}>
                    <img src={logo} alt="JLog Logo" />
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle isDark={isDarkMode} onToggle={onToggleTheme} />
                    <Link to="/login" className={styles.nav__login}>
                        Login
                    </Link>
                </div>
            </nav>

            <section className={styles.hero}>
                <div className={styles.hero__bg}></div>
                <div className={styles.hero__content}>
                    <div className={styles.hero__badge}>
                        Now in Beta 🚀
                    </div>
                    <h1 className={styles.hero__title}>
                        Master Your Job Search <br /> with Intelligent Tracking
                    </h1>
                    <p className={styles.hero__subtitle}>
                        JLog syncs with your Gmail to track applications, status updates, and interview requests. Visualize your progress and land your dream job faster.
                    </p>
                    <Link to="/login" className={styles.hero__cta}>
                        Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles.features__grid}>
                    <div className={styles.features__card}>
                        <div className={`${styles.features__iconWrapper} ${styles['features__iconWrapper--blue']}`}>
                            <RefreshCw className="w-8 h-8" />
                        </div>
                        <h3 className={styles.features__cardTitle}>Auto-Sync Gmail</h3>
                        <p className={styles.features__cardText}>
                            Connect your Gmail and let JLog scan for job applications. No more manual data entry for every single application.
                        </p>
                    </div>

                    <div className={styles.features__card}>
                        <div className={`${styles.features__iconWrapper} ${styles['features__iconWrapper--purple']}`}>
                            <BarChart3 className="w-8 h-8" />
                        </div>
                        <h3 className={styles.features__cardTitle}>Visual Insights</h3>
                        <p className={styles.features__cardText}>
                            See your application funnel at a glance. Track response rates and identify which stages need more attention.
                        </p>
                    </div>

                    <div className={styles.features__card}>
                        <div className={`${styles.features__iconWrapper} ${styles['features__iconWrapper--green']}`}>
                            <Mail className="w-8 h-8" />
                        </div>
                        <h3 className={styles.features__cardTitle}>Smart Updates</h3>
                        <p className={styles.features__cardText}>
                            We detect status changes from "Applied" to "Interview" or "Rejected" automatically based on email content.
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.howItWorks}>
                <div className={styles.howItWorks__container}>
                    <h2 className={styles.howItWorks__title}>How JLog Works</h2>

                    <div className={styles.howItWorks__step}>
                        <div className={styles.howItWorks__stepNumber}>1</div>
                        <div className={styles.howItWorks__stepContent}>
                            <h3 className={styles.howItWorks__stepTitle}>Connect your Gmail</h3>
                            <p className={styles.howItWorks__stepDesc}>Securely link your Google account. We only read emails related to job applications.</p>
                        </div>
                    </div>

                    <div className={styles.howItWorks__step}>
                        <div className={styles.howItWorks__stepNumber}>2</div>
                        <div className={styles.howItWorks__stepContent}>
                            <h3 className={styles.howItWorks__stepTitle}>We Analyze & Organize</h3>
                            <p className={styles.howItWorks__stepDesc}>Our smart engine identifies application confirmations, interview invites, and rejections.</p>
                        </div>
                    </div>

                    <div className={styles.howItWorks__step}>
                        <div className={styles.howItWorks__stepNumber}>3</div>
                        <div className={styles.howItWorks__stepContent}>
                            <h3 className={styles.howItWorks__stepTitle}>Track & succeed</h3>
                            <p className={styles.howItWorks__stepDesc}>View your dashboard, see upcoming interviews, and optimize your application strategy.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className={styles.cta__content}>
                    <h2 className={styles.cta__title}>Ready to land your dream job?</h2>
                    <p className={styles.cta__text}>Join thousands of job seekers who are saving time and staying organized with JLog.</p>
                    <Link to="/login" className={styles.cta__button}>
                        Start Tracking Free <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
