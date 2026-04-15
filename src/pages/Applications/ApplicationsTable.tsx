import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

import { Application } from '../../types';
import { ApplicationDetailsModal } from '../../pages/Applications/ApplicationDetailsModal';
import { StatusModal } from '../../components/common/StatusModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateApplication } from '../../services/api';
import styles from './ApplicationsTable.module.scss';

interface ApplicationsTableProps {
  applications: Application[];
}

const statusMap: Record<string, 'Applied' | 'Interview' | 'Offer' | 'Rejected'> = {
  Applied: 'Applied',
  Interview: 'Interview',
  Offer: 'Offer',
  Rejected: 'Rejected',
};

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterResult, setFilterResult] = useState('all');
  const [sortField, setSortField] = useState<keyof Application>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [statusModal, setStatusModal] = useState<{ type: 'success' | 'error' | 'loading', title: string, message: string } | null>(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 767);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 767);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { mutate: handleUpdateApp, isPending: isSaving } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Application> }) => {
      const start = Date.now();
      const result = await updateApplication(id, data);
      const elapsed = Date.now() - start;
      if (elapsed < 2000) {
        await new Promise(resolve => setTimeout(resolve, 2000 - elapsed));
      }
      return result;
    },
    onMutate: () => {
      setStatusModal({
        type: 'loading',
        title: 'Updating Application',
        message: 'Please wait while we update your application details...'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      // Keep loading state visible for at least a moment or switch immediately? 
      // Usually immediate switch is fine.
      setSelectedApp(null);
      setStatusModal({
        type: 'success',
        title: 'Update Successful',
        message: 'The application details have been successfully updated.'
      });
    },
    onError: (error) => {
      console.error("Failed to update application", error);
      setStatusModal({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update application. Please try again.'
      });
    }
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterResult, itemsPerPage]);

  const handleSort = (field: keyof Application) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredApplications = applications
    .filter(app => {
      const matchesSearch =
        (app.company?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (app.role?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (app.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesFilter = filterResult === 'all' || app.status === filterResult;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.applicationsTable}>
      <div className={styles.applicationsTable__header}>
        <h2 className={styles.applicationsTable__title}>All Applications</h2>

        <div className={styles.applicationsTable__controls}>
          <div className={styles.applicationsTable__searchWrapper}>
            <Search className={styles.applicationsTable__searchIcon} />
            <input
              type="text"
              placeholder="Search company, role, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.applicationsTable__search}
            />
          </div>

          <div className={styles.applicationsTable__filterWrapper}>
            <Filter className={styles.applicationsTable__filterIcon} />
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className={styles.applicationsTable__filter}
            >
              <option value="all">All Results</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {!isMobile ? (
        <div className={styles.applicationsTable__tableWrapper}>
          <table className={styles.applicationsTable__table}>
            <thead className={styles.applicationsTable__thead}>
              <tr>
                {(['_id', 'company', 'role', 'location', 'date', 'status'] as (keyof Application | '_id')[]).map(
                  (field, idx) => (
                    <th key={field} className={styles.applicationsTable__th}>
                      <button
                        onClick={() => handleSort(field as keyof Application)}
                        className={styles.applicationsTable__sortBtn}
                      >
                        {['ID', 'Company', 'Role', 'Location', 'Applied', 'Result'][idx]}
                        <ArrowUpDown className={styles.applicationsTable__icon} />
                      </button>
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className={styles.applicationsTable__tbody}>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.applicationsTable__empty}>
                    No applications found
                  </td>
                </tr>
              ) : (
                paginatedApplications.map((app, index) => {
                  const statusKey = statusMap[app.status] || 'Applied';
                  return (
                    <tr
                      key={app._id}
                      onClick={() => setSelectedApp(app)}
                      className={styles.applicationsTable__row}
                    >
                      <td className={clsx(styles.applicationsTable__td, styles['applicationsTable__td--id'])}>
                        #{index + 1}
                      </td>
                      <td className={clsx(styles.applicationsTable__td, styles['applicationsTable__td--company'])}>
                        <div>{app.company}</div>
                      </td>
                      <td className={clsx(styles.applicationsTable__td, styles['applicationsTable__td--role'])}>
                        <div>{app.role}</div>
                      </td>
                      <td className={clsx(styles.applicationsTable__td, styles['applicationsTable__td--muted'])}>
                        {app.location}
                      </td>
                      <td className={clsx(styles.applicationsTable__td, styles['applicationsTable__td--muted'])}>
                        {new Date(app.date).toLocaleDateString()}
                      </td>
                      <td className={styles.applicationsTable__td}>
                        <span
                          className={clsx(
                            styles.applicationsTable__status,
                            styles[`applicationsTable__status--${statusKey}`],
                          )}
                        >
                          <span
                            className={clsx(
                              styles.applicationsTable__statusDot,
                              styles[`applicationsTable__statusDot--${statusKey}`],
                            )}
                          />
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Mobile Accordion Layout (visible < 600px) */
        <div className={styles.applicationsTable__mobile}>
          {filteredApplications.length === 0 ? (
            <div className={styles.applicationsTable__empty}>No applications found</div>
          ) : (
            <div>
              {paginatedApplications.map((app, index) => {
                const isExpanded = expandedRows[app._id];
                const statusKey = statusMap[app.status] || 'Applied';
                const globalIndex = startIndex + index + 1;

                return (
                  <div key={app._id} className={styles.applicationsTable__mobileCard}>
                    <div
                      onClick={(e) => toggleRow(app._id, e)}
                      className={styles.applicationsTable__mobileHeader}
                    >
                      <div className={styles.applicationsTable__mobileMeta}>
                        <span>#{globalIndex} {app.company}</span>
                        <span
                          className={clsx(
                            styles.applicationsTable__status,
                            styles[`applicationsTable__status--${statusKey}`],
                          )}
                        >
                          <span
                            className={clsx(
                              styles.applicationsTable__statusDot,
                              styles[`applicationsTable__statusDot--${statusKey}`],
                            )}
                          />
                          {app.status}
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </div>

                    {isExpanded && (
                      <div
                        className={styles.applicationsTable__mobileBody}
                        onClick={() => setSelectedApp(app)}
                      >
                        <div className={styles.applicationsTable__mobileDetails}>
                          <div>ID: {app._id}</div>
                          <div>{app.role}</div>
                          <div>{app.location}</div>
                          <div>{new Date(app.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className={styles.applicationsTable__pagination}>
        <div className={styles.applicationsTable__paginationInfo}>
          <p>
            Showing {filteredApplications.length === 0 ? 0 : startIndex + 1} to{' '}
            {Math.min(startIndex + itemsPerPage, filteredApplications.length)} of{' '}
            {filteredApplications.length} results
          </p>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={styles.applicationsTable__paginationSelect}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>

        <div className={styles.applicationsTable__paginationControls}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.applicationsTable__paginationBtn}
          >
            <ChevronLeft />
          </button>

          <span className={styles.applicationsTable__paginationPage}>
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={styles.applicationsTable__paginationBtn}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {selectedApp && (
        <ApplicationDetailsModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onSave={(id, updates) => handleUpdateApp({ id, data: updates })}
          isSaving={isSaving}
        />
      )}

      {statusModal && (
        <StatusModal
          type={statusModal.type}
          title={statusModal.title}
          message={statusModal.message}
          onClose={() => setStatusModal(null)}
        />
      )}
    </div>
  );
}