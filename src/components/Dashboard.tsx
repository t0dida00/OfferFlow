import { useState } from 'react';
import {
  LogOut,
  Plus,
  Briefcase,
  Mail,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { ApplicationsTable } from './ApplicationsTable';
import { ChartsSection } from './ChartsSection';
import { AddApplicationModal } from './AddApplicationModal';
// import { RecentEmailsList } from './RecentEmailsList';
import { mockApplications } from '../data/mockData';


interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

  const handleGmailSync = async () => {
    setIsSyncing(true);
    setLastSync(new Date());
    // Placeholder for backend sync logic
    // e.g., await fetch('/api/v1/sync', { method: 'POST', headers: { ... } });
    setTimeout(() => {
      setIsSyncing(false);
    }, 2000);
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
        <ChartsSection applications={mockApplications} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications Table */}
          <div className="lg:col-span-3">
            {/* Expanded col-span to 3 since email list is gone/hidden */}
            <ApplicationsTable applications={mockApplications} />
          </div>

          {/* Recent Emails List - Removed for now */}
          {/* <RecentEmailsList
            emails={[]}
            isLoading={false}
            onSync={() => {}}
          /> */}
        </div>
      </main>

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <AddApplicationModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}
