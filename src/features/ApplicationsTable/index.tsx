import { useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

import { Application } from '../../types';
import { ApplicationDetailsModal } from '../ApplicationDetails';
import { StatusModal } from '../Common/StatusModal';
import { Email } from '../../types';
import { useApplicationsTable } from '../../hooks/useApplicationsTable';
import { useApplicationMutation } from '../../hooks/useApplicationMutation';
import { useResponsive } from '../../hooks/useResponsive';
import { normalizeStatus } from '../../utils/status';
import { formatDate } from '../../utils/date';
import styles from './ApplicationsTable.module.scss';

interface ApplicationsTableProps {
  applications: Application[];
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const { isMobile } = useResponsive(767);
  const {
    searchQuery,
    setSearchQuery,
    filterResult,
    setFilterResult,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    paginatedApplications,
    totalPages,
    startIndex,
    totalResults,
  } = useApplicationsTable(applications);
  const { handleUpdateApp, isSaving, statusModal, setStatusModal } = useApplicationMutation();

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = (id: string, updates: Partial<Application>) => {
    handleUpdateApp({ id, data: updates });
    setSelectedApp(null);
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
              {totalResults === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.applicationsTable__empty}>
                    No applications found
                  </td>
                </tr>
              ) : (
                paginatedApplications.map((app, index) => {
                  const statusKey = normalizeStatus(app.status);
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
                        {formatDate(app.date)}
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
        <div className={styles.applicationsTable__mobile}>
          {totalResults === 0 ? (
            <div className={styles.applicationsTable__empty}>No applications found</div>
          ) : (
            <div>
              {paginatedApplications.map((app, index) => {
                const isExpanded = expandedRows[app._id];
                const statusKey = normalizeStatus(app.status);
                const globalIndex = startIndex + index;

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
                          <div>{formatDate(app.date)}</div>
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
            Showing {totalResults === 0 ? 0 : startIndex} to{' '}
            {Math.min(startIndex + itemsPerPage - 1, totalResults)} of{' '}
            {totalResults} results
          </p>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
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
          onSave={handleSave}
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

