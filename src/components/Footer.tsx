import styles from './Footer.module.scss';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
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
