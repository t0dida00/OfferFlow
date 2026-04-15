import {
    LayoutDashboard,
    Briefcase,
    Mail,
    Calendar,
    Settings,
    LogOut,
    User as UserIcon,
    FileText
} from 'lucide-react';
import { User } from '../../types';
import styles from './Sidebar.module.scss';
import logo from '../../public/icons/logo.svg';

interface SidebarProps {
    user: User | null;
    currentView: string;
    onNavigate: (view: string) => void;
    onLogout: () => void;
}

export function Sidebar({
    user,
    currentView,
    onNavigate,
    onLogout
}: SidebarProps) {

    const mainNavItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'applications', label: 'Applications', icon: Briefcase },
        { id: 'emails', label: 'Emails', icon: Mail },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'cover-letter', label: 'My Cover Letter', icon: FileText },
    ];

    const supportNavItems = [
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const NavItem = ({ item }: { item: any }) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
            <button
                onClick={() => onNavigate(item.id)}
                className={`${styles['sidebar__nav-item']} ${isActive ? styles['sidebar__nav-item--active'] : ''}`}
            >
                <Icon
                    className={styles['sidebar__nav-icon']}
                />
                <span className="whitespace-nowrap">{item.label}</span>
            </button>
        );
    };

    return (
        <div className={styles.sidebar}>
            {/* Header / Logo */}
            <div className={styles.sidebar__header}>
                <img src={logo} alt="JLOG" className={styles.sidebar__logo} />
            </div>

            {/* Navigation */}
            <nav className={styles.sidebar__nav}>
                <div className={styles['sidebar__nav-group']}>
                    {mainNavItems.map((item) => (
                        <NavItem key={item.id} item={item} />
                    ))}
                </div>

                <div className={styles['sidebar__nav-group']}>
                    <div className={styles['sidebar__nav-label']}>
                        Support
                    </div>
                    <div className={styles['sidebar__nav-group']}>
                        {supportNavItems.map((item) => (
                            <NavItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </nav>

            {/* Footer / User Profile */}
            <div className={styles.sidebar__footer}>
                <div className={styles['sidebar__user-avatar-container']}>
                    <div className={styles['sidebar__user-avatar']}>
                        <UserIcon className={styles['sidebar__user-icon']} />
                    </div>
                    <div className={styles['sidebar__status-dot']}></div>
                </div>

                <div className={styles['sidebar__user-info']}>
                    <p
                        className={styles['sidebar__user-name']}
                        title={user?.name || 'User'}
                    >
                        {user?.name || 'User'}
                    </p>
                    <p
                        className={styles['sidebar__user-email']}
                        title={user?.email || ''}
                    >
                        {user?.email || ''}
                    </p>
                </div>

                <button
                    onClick={onLogout}
                    className={styles['sidebar__logout-btn']}
                    title="Logout"
                >
                    <LogOut className={styles['sidebar__logout-icon']} />
                </button>
            </div>
        </div>

    );
}
