import { useState } from 'react';
import {
  LogOut,
  Plus,
  Briefcase,
  Mail,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApplicationsTable } from './ApplicationsTable';
import { ChartsSection } from './ChartsSection';
import { AddApplicationModal } from './AddApplicationModal';
import { RecentEmailsList } from './RecentEmailsList';
import { fetchApplications, syncGmail } from '../services/api';


interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

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


  // Email fetching logic removed as it is now handled by backend

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">JobTracker Pro</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {userEmail}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGmailSync}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="text-sm hidden sm:inline">
                  {isSyncing ? 'Syncing...' : 'Sync Gmail'}
                </span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Add Application</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Last Sync Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-900 dark:text-blue-300">
            Last Gmail sync: {lastSync.toLocaleString()}
          </span>
        </div>

        {/* Statistics Section */}
        {/* <StatsSection applications={mockApplications} /> */}

        {/* Charts Section */}
        <ChartsSection applications={applications} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications Table */}
          <div className="lg:col-span-2">
            <ApplicationsTable applications={applications} />
          </div>

          {/* Recent Emails List */}
          <div>
            <RecentEmailsList />
          </div>
        </div>
      </main>

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <AddApplicationModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}
