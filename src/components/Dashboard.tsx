import { useState } from 'react';
import {
  Plus,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApplicationsTable } from './ApplicationsTable';
import { ChartsSection } from './ChartsSection';
import { AddApplicationModal } from './AddApplicationModal';
import { RecentEmailsList } from './RecentEmailsList';
import { Sidebar } from './Sidebar';
import { fetchApplications, syncGmail } from '../services/api';
import { User } from '../types';


interface DashboardProps {
  user: User | null;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const queryClient = useQueryClient();
  const [currentView, setCurrentView] = useState('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(user?.lastSyncTime ? new Date(user.lastSyncTime) : null);

  const { data: rawApplications } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
  });
  const applications = rawApplications?.data || [];

  const { mutate: handleSync, isPending: isSyncing } = useMutation({
    mutationFn: syncGmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      setLastSync(new Date());
    },
    onError: (error) => {
      console.error('Failed to sync Gmail:', error);
    }
  });

  const handleGmailSync = () => {
    handleSync();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
              <div className="flex items-center gap-3">
                {lastSync && (
                  <div className=" flex flex-row items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span>Last sync: {lastSync.toLocaleString()}</span>
                  </div>
                )}
                <button
                  onClick={handleGmailSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg btn-primary"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Application</span>
                </button>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-2xl font-semibold dark:text-white mb-2">No Data</div>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Sync your Gmail to get started tracking your job applications.</p>
                <button
                  onClick={handleGmailSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 rounded-lg disabled:opacity-50 font-medium btn-primary"
                >
                  <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
                </button>
              </div>
            ) : (
              <ChartsSection applications={applications} />
            )}
          </div>
        );

      case 'applications':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Applications</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 rounded-lg btn-primary"
              >
                <Plus className="w-4 h-4" />
                <span>Add Application</span>
              </button>
            </div>
            <ApplicationsTable applications={applications} />
          </div>
        );

      case 'emails':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Emails</h2>
              <button
                onClick={handleGmailSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Gmail'}</span>
              </button>
            </div>
            <RecentEmailsList onSync={handleGmailSync} isSyncing={isSyncing} />
          </div>
        );

      case 'calendar':
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Calendar Coming Soon</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              We're working hard to bring you a fully integrated calendar view. Stay tuned!
            </p>
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-4xl space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h2>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your account's profile information and email address.</p>
              </div>
              <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input
                      type="text"
                      value={user?.email || ''}
                      readOnly
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        user={user}
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={onLogout}
      />

      <main className="flex-1 min-w-0 transition-all duration-300">
        <div className="max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-6 mt-6 ">
          {renderContent()}
        </div>
      </main>

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <AddApplicationModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}
