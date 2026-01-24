import { useLocation } from 'react-router-dom';
import styles from './Footer.module.scss';

export function Footer() {
    const currentYear = new Date().getFullYear();
    const location = useLocation();

    // Only dashboard (and its sub-routes if any, though app seems flat) needs the bottom padding
    // for the bottom navigation bar.
    const hasBottomNav = location.pathname.startsWith('/dashboard');

    return (
        <footer className={`${styles.footer} ${!hasBottomNav ? styles['footer--no-nav'] : ''}`}>
            <div className={styles.footer__content}>
                <div className={styles.footer__placeholder}>

                </div>
                <div className={styles.footer__copyright}>
                    &copy; {currentYear} JLog. All rights reserved.
                </div>
                <div className={styles.footer__links}>
                    <a href="#" className={styles.footer__link}>Privacy Policy</a>
                    <a href="#" className={styles.footer__link}>Terms of Service</a>
                    <a href="#" className={styles.footer__link}>Contact</a>
                </div>
            </div>
        </footer>
    );
}
