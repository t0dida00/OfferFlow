import { useState, useEffect } from 'react';
import {
  Menu,
  RefreshCw,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AddApplicationModal } from '../../pages/Applications/AddApplicationModal';
import { SyncSuccessModal } from '../../components/common/SyncSuccessModal';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { syncGmail } from '../../services/api';
import { User } from '../../types';
import './Dashboard.css';
import logo from '../../public/icons/logo.svg';

interface DashboardProps {
  user: User | null;
  onLogout: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export type DashboardOutletContext = {
  user: User | null;
  lastSync: Date | null;
  isSyncing: boolean;
  handleGmailSync: () => void;
  openAddModal: () => void;
  isMobile: boolean;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme?: () => void;
};

export function Dashboard({ user, onLogout, isDarkMode = false, onToggleTheme }: DashboardProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncSuccessModalOpen, setIsSyncSuccessModalOpen] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(user?.lastSyncTime ? new Date(user.lastSyncTime) : null);
  
  // Deriving current view from location for the sidebar/bottom-nav highlights
  let currentView = location.pathname.replace(/^\//, '');
  if (!currentView || currentView === 'dashboard') currentView = 'overview';
  
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 1024;
    }
    return true;
  });

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const mobile = width <= 1024;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkMobile, 100);
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  const handleNavigate = (view: string) => {
    navigate(`/${view}`);
  };

  const { mutate: handleSync, isPending: isSyncing } = useMutation({
    mutationFn: syncGmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      setLastSync(new Date());
      setIsSyncSuccessModalOpen(true);
    },
    onError: (error) => {
      console.error('Failed to sync Gmail:', error);
    }
  });

  const handleGmailSync = () => {
    handleSync();
  };

  const contextProps: DashboardOutletContext = {
    user,
    lastSync,
    isSyncing,
    handleGmailSync,
    openAddModal: () => setIsAddModalOpen(true),
    isMobile,
    onLogout,
    isDarkMode,
    onToggleTheme,
  };

  return (
    <div className={`flex min-h-screen bg-gray-50 dark:bg-gray-900 ${isMobile ? 'mobile-view' : 'desktop-view'}`}>
      {/* Mobile Header */}
      {isMobile && (
        <header className="mobile-header">
          <div className="mobile-header__content">
            <button
              type="button"
              className="mobile-header__icon-button"
              aria-label="Open menu"
              style={{ visibility: 'hidden' }}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div
              aria-label="Go to overview"
              onClick={() => handleNavigate('overview')}
            >
              <img src={logo} alt="Logo" />
            </div>
            <button
              type="button"
              className="mobile-header__icon-button"
              aria-label="Sync Gmail"
              onClick={handleGmailSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          user={user}
          currentView={currentView}
          onNavigate={handleNavigate}
          onLogout={onLogout}
        />
      )}

      <main className="flex-1 min-w-0 transition-all duration-300">
        <div className={`max-w-[1440px] mx-auto ${isMobile ? 'p-4' : 'p-4 sm:p-6 lg:p-6'} ${isMobile ? 'mt-2' : 'mt-6'}`}>
          <Outlet context={contextProps} />
        </div>
      </main>

      {/* Bottom Navigation */}
      {isMobile && (
        <BottomNavigation
          currentView={currentView === 'settings' ? 'account' : currentView}
          onNavigate={handleNavigate}
          onAddClick={() => setIsAddModalOpen(true)}
        />
      )}

      {/* Modals */}
      {isAddModalOpen && (
        <AddApplicationModal onClose={() => setIsAddModalOpen(false)} />
      )}
      {isSyncSuccessModalOpen && (
        <SyncSuccessModal onClose={() => setIsSyncSuccessModalOpen(false)} />
      )}
    </div>
  );
}
