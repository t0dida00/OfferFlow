/**
 * Custom hook for ApplicationsTable business logic
 */

import { useState, useEffect } from 'react';
import { Application } from '../types';
import { filterApplications } from '../utils/filtering';
import { sortApplications, SortField, SortDirection, toggleSortDirection } from '../utils/sorting';
import { paginate, PaginationOptions } from '../utils/pagination';

export const useApplicationsTable = (applications: Application[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterResult, setFilterResult] = useState('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterResult, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(toggleSortDirection(sortDirection));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredApplications = filterApplications(applications, {
    searchQuery,
    statusFilter: filterResult,
  });

  const sortedApplications = sortApplications(filteredApplications, {
    field: sortField,
    direction: sortDirection,
  });

  const { paginatedItems, totalPages, startIndex, endIndex } = paginate(sortedApplications, {
    currentPage,
    itemsPerPage,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return {
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
    filteredApplications: sortedApplications,
    paginatedApplications: paginatedItems,
    totalPages,
    startIndex,
    endIndex,
    totalResults: filteredApplications.length,
  };
};

