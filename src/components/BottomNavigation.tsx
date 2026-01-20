import {
  LayoutDashboard,
  Briefcase,
  Plus,
  Mail,
  User as UserIcon
} from 'lucide-react';
import styles from './BottomNavigation.module.scss';

interface BottomNavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onAddClick: () => void;
}

export function BottomNavigation({
  currentView,
  onNavigate,
  onAddClick
}: BottomNavigationProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'add', label: 'Add', icon: Plus, isAdd: true },
    { id: 'emails', label: 'Emails', icon: Mail },
    { id: 'account', label: 'Account', icon: UserIcon },
  ];

  const handleItemClick = (item: typeof navItems[0]) => {
    if (item.isAdd) {
      onAddClick();
    } else {
      onNavigate(item.id);
    }
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

