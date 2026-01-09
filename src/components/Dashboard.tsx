import { useEffect, useState } from 'react';
import {
  LogOut,
  Plus,
  Briefcase,
  Mail,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { StatsSection } from './StatsSection';
import { ApplicationsTable } from './ApplicationsTable';
import { ChartsSection } from './ChartsSection';
import { AddApplicationModal } from './AddApplicationModal';
import { RecentEmailsList } from './RecentEmailsList';
import { mockApplications } from '../data/mockData';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
  accessToken?: string;
}

interface EmailMessage {
  id: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
  body: string;
}

export function Dashboard({ userEmail, onLogout, accessToken }: DashboardProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [latestEmailId, setLatestEmailId] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      fetchemails();
    }
  }, [accessToken]);

  const fetchemails = async () => {
    if (!accessToken) return;
    setIsLoadingEmails(true);
    setIsSyncing(true);
    setLastSync(new Date());
    try {
      const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=category:primary', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const listData = await listRes.json();

      if (!listData.messages) {
        if (emails.length === 0) setEmails([]);
        setIsSyncing(false);
        setIsLoadingEmails(false);
        return;
      }

      let newMessagesToFetch = [];
      const rawMessages = listData.messages;

      if (latestEmailId) {
        const lastIndex = rawMessages.findIndex((m: any) => m.id === latestEmailId);
        if (lastIndex === -1) {
          // If not found, fetch top 10 to be safe
          newMessagesToFetch = rawMessages.slice(0, 10);
        } else {
          // Fetch everything new (before the last known id)
          newMessagesToFetch = rawMessages.slice(0, lastIndex);
        }
      } else {
        // First fetch
        newMessagesToFetch = rawMessages.slice(0, 10);
      }

      if (newMessagesToFetch.length === 0) {
        setIsLoadingEmails(false);
        setIsSyncing(false);
        return;
      }
      const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

      const messages: EmailMessage[] = [];
      for (const msg of newMessagesToFetch) {
        try {
          const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });

          if (detailRes.status === 429) {
            // If we hit a rate limit even with sequential fetching, wait longer
            await sleep(1000);
            // formatting note: simplistic retry logic could be added here, but for now just skip or fail safely
            continue;
          }

          const detailData = await detailRes.json();

          const headers = detailData.payload?.headers || [];
          const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(No Subject)';
          const from = headers.find((h: any) => h.name === 'From')?.value || '(Unknown)';
          const date = headers.find((h: any) => h.name === 'Date')?.value || '';

          // Helper to extract body
          const getBody = (payload: any): string => {
            let encodedBody = '';
            if (payload.parts) {
              const findPart = (parts: any[], mimeType: string): any => {
                for (const part of parts) {
                  if (part.mimeType === mimeType) return part;
                  if (part.parts) {
                    const found = findPart(part.parts, mimeType);
                    if (found) return found;
                  }
                }
                return null;
              };
              const htmlPart = findPart(payload.parts, 'text/html');
              const textPart = findPart(payload.parts, 'text/plain');
              const part = htmlPart || textPart;
              if (part && part.body && part.body.data) {
                encodedBody = part.body.data;
              }
            } else if (payload.body && payload.body.data) {
              encodedBody = payload.body.data;
            }

            if (encodedBody) {
              let decoded = '';
              try {
                decoded = decodeURIComponent(escape(atob(encodedBody.replace(/-/g, '+').replace(/_/g, '/'))));
              } catch (e) {
                decoded = atob(encodedBody.replace(/-/g, '+').replace(/_/g, '/'));
              }

              // Extract text from HTML
              try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(decoded, 'text/html');
                return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
              } catch (e) {
                // Fallback regex strip
                return decoded.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
              }
            }
            return payload.snippet || '';
          };

          const body = getBody(detailData.payload);

          messages.push({
            id: msg.id,
            snippet: detailData.snippet || '',
            subject,
            from,
            date,
            body
          });

          // Small delay between requests to be nice to the API
          await sleep(50);
        } catch (err) {
          console.error(`Failed to fetch message ${msg.id}`, err);
        }
      }

      if (messages.length > 0) {
        setEmails(prev => {
          const updated = [...messages, ...prev];
          return updated.slice(0, 100);
        });
        setLatestEmailId(messages[0].id);

      }

    } catch (error) {
      console.error("Error fetching emails", error);
    } finally {
      setIsLoadingEmails(false);
      setIsSyncing(false);
    }
  };

  const handleGmailSync = () => {
    if (accessToken) {
      fetchemails();
    }
  };

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
          <div className="lg:col-span-2 ">
            <ApplicationsTable applications={mockApplications} />
          </div>

          {/* Recent Emails List */}
          {/* Recent Emails List */}
          <RecentEmailsList
            emails={emails}
            isLoading={isLoadingEmails}
            onSync={handleGmailSync}
          />
        </div>
      </main>

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <AddApplicationModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}