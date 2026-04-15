import {
  LayoutDashboard,
  Briefcase,
  Mail,
  User as UserIcon,
  FileText
} from 'lucide-react';
import styles from './BottomNavigation.module.scss';

interface BottomNavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function BottomNavigation({
  currentView,
  onNavigate,
}: BottomNavigationProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'emails', label: 'Emails', icon: Mail },
    { id: 'cover-letter', label: 'Cover', icon: FileText },
    { id: 'account', label: 'Account', icon: UserIcon },
  ];

  const handleItemClick = (item: typeof navItems[0]) => {
    onNavigate(item.id);
  };

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        // Map account to settings for active state - check for both 'account' and 'settings'
        const isActive = item.id === 'account'
          ? (currentView === 'settings' || currentView === 'account') && !item.isAdd
          : currentView === item.id && !item.isAdd;
        const isAddButton = item.isAdd;

        return (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={`${styles.bottomNav__item} ${isActive ? styles['bottomNav__item--active'] : ''} ${isAddButton ? styles['bottomNav__item--add'] : ''}`}
            aria-label={item.label}
          >
            <Icon className={styles.bottomNav__icon} />
            <span className={styles.bottomNav__label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

