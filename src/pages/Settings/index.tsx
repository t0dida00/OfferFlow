import { Moon, Sun, LogOut } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { DashboardOutletContext } from '../../layouts/Dashboard';
import dashboardStyles from '../../layouts/Dashboard/Dashboard.module.scss';
import settingsStyles from './Settings.module.scss';

export function SettingsPage() {
  const { user, onLogout, isDarkMode, onToggleTheme, isMobile } = useOutletContext<DashboardOutletContext>();

  return (
    <div className={`${isMobile ? 'space-y-4' : 'space-y-8'} ${dashboardStyles.dashboard__sectionNarrow}`}>
      <div className={dashboardStyles.dashboard__header}>
        <h2 className={dashboardStyles.dashboard__title}>Account Settings</h2>
        {onToggleTheme && isMobile && (
          <button
            onClick={onToggleTheme}
            className={dashboardStyles.dashboard__themeButton}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className={dashboardStyles.dashboard__iconSm} />
            ) : (
              <Moon className={dashboardStyles.dashboard__iconSm} />
            )}
          </button>
        )}
      </div>

      <div className={dashboardStyles.dashboard__card}>
        <div className={dashboardStyles.dashboard__cardHeader}>
          <h3>Profile Information</h3>
          <p>Update your account's profile information and email address.</p>
        </div>
        <div className={dashboardStyles.dashboard__cardBody}>
          <div className={settingsStyles.settingsGrid}>
            <div className={dashboardStyles.dashboard__field}>
              <label>Full Name</label>
              <input
                type="text"
                value={user?.name || ''}
                readOnly
              />
            </div>
            <div className={dashboardStyles.dashboard__field}>
              <label>Email Address</label>
              <input
                type="text"
                value={user?.email || ''}
                readOnly
              />
            </div>
            <div className={dashboardStyles.dashboard__field}>
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                defaultValue=""
              />
            </div>
            <div className={dashboardStyles.dashboard__field}>
              <label>Location</label>
              <input
                type="text"
                placeholder="City, Country"
                defaultValue=""
              />
            </div>
            <div className={dashboardStyles.dashboard__field}>
              <label>LinkedIn</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                defaultValue=""
              />
            </div>
            <div className={dashboardStyles.dashboard__field}>
              <label>GitHub</label>
              <input
                type="url"
                placeholder="https://github.com/username"
                defaultValue=""
              />
            </div>
            <div className={dashboardStyles.dashboard__field}>
              <label>Portfolio Website</label>
              <input
                type="url"
                placeholder="https://yourportfolio.com"
                defaultValue=""
              />
            </div>
          </div>

          <div className={dashboardStyles.dashboard__cardFooter}>
            <button
              onClick={onLogout}
              className={dashboardStyles.dashboard__logoutButton}
            >
              <LogOut className={dashboardStyles.dashboard__iconSm} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
