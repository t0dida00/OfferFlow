import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { fetchEmails } from '../../services/api';
import { Email } from '../../types';
import styles from './EmailsTable.module.scss';

const statusMap: Record<string, 'Applied' | 'Interview' | 'Offer' | 'Rejected'> = {
  Applied: 'Applied',
  Interview: 'Interview',
  Offer: 'Offer',
  Rejected: 'Rejected',
};

interface EmailsTableProps {
  limit?: number;
}

export function EmailsTable({ limit }: EmailsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterResult, setFilterResult] = useState('all');
  const [sortField, setSortField] = useState<keyof Email>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 767);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data: rawEmails, isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: fetchEmails,
  });

  const allEmails: Email[] = rawEmails?.data || [];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterResult, itemsPerPage]);

  const handleSort = (field: keyof Email) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  let filteredEmails = allEmails
    .filter(email => {
      const searchStr = searchQuery.toLowerCase();
      const matchesSearch =
        (email.subject?.toLowerCase() || '').includes(searchStr) ||
        (email.snippet?.toLowerCase() || '').includes(searchStr);
      const matchesFilter = filterResult === 'all' || email.status === filterResult;
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

  if (limit) {
    filteredEmails = filteredEmails.slice(0, limit);
  }

  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmails = filteredEmails.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.emailsTable}>
      <div className={styles.emailsTable__header}>
        <h2 className={styles.emailsTable__title}>{limit ? 'Recent Related Emails' : 'All Emails'}</h2>

        <div className={styles.emailsTable__controls}>
          <div className={styles.emailsTable__searchWrapper}>
            <Search className={styles.emailsTable__searchIcon} />
            <input
              type="text"
              placeholder="Search subject or snippet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.emailsTable__search}
            />
          </div>

          <div className={styles.emailsTable__filterWrapper}>
            <Filter className={styles.emailsTable__filterIcon} />
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className={styles.emailsTable__filter}
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
        <div className={styles.emailsTable__tableWrapper}>
          <table className={styles.emailsTable__table}>
            <thead className={styles.emailsTable__thead}>
              <tr>
                <th className={styles.emailsTable__th}>
                  <span className={styles.emailsTable__sortBtn}>No.</span>
                </th>
                {(['subject', 'snippet', 'date', 'status'] as (keyof Email)[]).map((field, idx) => (
                  <th key={field} className={styles.emailsTable__th}>
                    <button
                      onClick={() => handleSort(field)}
                      className={styles.emailsTable__sortBtn}
                    >
                      {['Subject', 'Snippet', 'Date', 'Status'][idx]}
                      <ArrowUpDown className={styles.emailsTable__icon} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.emailsTable__tbody}>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className={styles.emailsTable__empty} style={{textAlign: 'center', padding: '2rem'}}>
                    <RefreshCw className="animate-spin" style={{margin: '0 auto', display: 'block'}} />
                  </td>
                </tr>
              ) : filteredEmails.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emailsTable__empty}>
                    No emails found
                  </td>
                </tr>
              ) : (
                paginatedEmails.map((email, index) => {
                  const statusKey = statusMap[email.status] || 'Applied';
                  return (
                    <tr
                      key={email.emailId}
                      onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox/${email.emailId}`, '_blank')}
                      className={styles.emailsTable__row}
                    >
                      <td className={clsx(styles.emailsTable__td, styles['emailsTable__td--id'])}>
                        #{startIndex + index + 1}
                      </td>
                      <td className={clsx(styles.emailsTable__td, styles['emailsTable__td--company'])}>
                        <div style={{ whiteSpace: 'normal', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {email.subject}
                        </div>
                      </td>
                      <td className={clsx(styles.emailsTable__td, styles['emailsTable__td--role'])}>
                        <div style={{ whiteSpace: 'normal', maxWidth: '400px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {email.snippet}
                        </div>
                      </td>
                      <td className={clsx(styles.emailsTable__td, styles['emailsTable__td--muted'])}>
                        {new Date(email.date).toLocaleDateString()}
                      </td>
                      <td className={styles.emailsTable__td}>
                        <span
                          className={clsx(
                            styles.emailsTable__status,
                            styles[`emailsTable__status--${statusKey}`],
                          )}
                        >
                          <span
                            className={clsx(
                              styles.emailsTable__statusDot,
                              styles[`emailsTable__statusDot--${statusKey}`],
                            )}
                          />
                          {email.status}
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
        <div className={styles.emailsTable__mobile}>
          {isLoading ? (
             <div className={styles.emailsTable__empty} style={{padding: '2rem'}}><RefreshCw className="animate-spin" style={{margin: '0 auto', display: 'block'}} /></div>
          ) : filteredEmails.length === 0 ? (
            <div className={styles.emailsTable__empty}>No emails found</div>
          ) : (
            <div>
              {paginatedEmails.map((email, index) => {
                const isExpanded = expandedRows[email.emailId];
                const statusKey = statusMap[email.status] || 'Applied';
                const globalIndex = startIndex + index + 1;

                return (
                  <div key={email.emailId} className={styles.emailsTable__mobileCard} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <div
                      onClick={(e) => toggleRow(email.emailId, e)}
                      className={styles.emailsTable__mobileHeader}
                    >
                      <div className={styles.emailsTable__mobileMeta} style={{flex: 1, marginRight: '10px', overflow: 'hidden'}}>
                        <span style={{fontWeight: 500}}>#{globalIndex}</span>
                        <span style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, marginLeft: '8px'}}>
                           {email.subject}
                        </span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span
                          className={clsx(
                            styles.emailsTable__status,
                            styles[`emailsTable__status--${statusKey}`],
                          )}
                        >
                          <span
                            className={clsx(
                              styles.emailsTable__statusDot,
                              styles[`emailsTable__statusDot--${statusKey}`],
                            )}
                          />
                          {email.status}
                        </span>
                        {isExpanded ? <ChevronUp style={{width: 16, height: 16}} /> : <ChevronDown style={{width: 16, height: 16}} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div
                        className={styles.emailsTable__mobileBody}
                        onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox/${email.emailId}`, '_blank')}
                      >
                        <div className={styles.emailsTable__mobileDetails} style={{color: '#6b7280', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer'}}>
                          <div><strong>Date:</strong> {new Date(email.date).toLocaleDateString()}</div>
                          <div><strong>Snippet:</strong> {email.snippet}</div>
                          <div style={{color: '#3b82f6', marginTop: '4px'}}>Tap to open in Gmail &rarr;</div>
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

      {(!limit || filteredEmails.length > itemsPerPage) && (
        <div className={styles.emailsTable__pagination}>
          <div className={styles.emailsTable__paginationInfo}>
            <p>
              Showing {filteredEmails.length === 0 ? 0 : startIndex + 1} to{' '}
              {Math.min(startIndex + itemsPerPage, filteredEmails.length)} of{' '}
              {filteredEmails.length} results
            </p>
            {!limit && (
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={styles.emailsTable__paginationSelect}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            )}
          </div>

          <div className={styles.emailsTable__paginationControls}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.emailsTable__paginationBtn}
            >
              <ChevronLeft />
            </button>

            <span className={styles.emailsTable__paginationPage}>
               {totalPages > 0 ? `Page ${currentPage} of ${totalPages}` : 'Page 0 of 0'}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={styles.emailsTable__paginationBtn}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
