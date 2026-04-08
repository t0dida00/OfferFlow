import { useLocation } from 'react-router-dom';
import styles from './Footer.module.scss';
import { getCurrentYear, hasBottomNavigation } from '../../helpers/footer';

export function Footer() {
    const currentYear = getCurrentYear();
    const location = useLocation();
    const hasBottomNav = hasBottomNavigation(location.pathname);

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
