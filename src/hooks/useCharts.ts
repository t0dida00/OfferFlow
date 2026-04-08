/**
 * Custom hook for ChartsSection business logic
 */

import { useState } from 'react';
import { Application } from '../types';
import { TimeRange, processBarChartData, processPieChartData } from '../helpers/charts';
import { getAvailableYears } from '../utils/date';

export const useCharts = (applications: Application[]) => {
  const currentYear = new Date().getFullYear();

  // Bar Chart State
  const [timeRange, setTimeRange] = useState<TimeRange>('annually');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Pie Chart State
  const [pieTimeRange, setPieTimeRange] = useState<TimeRange>('annually');
  const [pieSelectedYear, setPieSelectedYear] = useState<number>(currentYear);

  const availableYears = getAvailableYears(
    applications.map(app => app.date),
    currentYear
  );

  const { data: chartData, label: chartLabel } = processBarChartData(
    applications,
    timeRange,
    selectedYear
  );

  const { data: pieData, label: pieLabel } = processPieChartData(
    applications,
    pieTimeRange,
    pieSelectedYear
  );

  return {
    // Bar chart
    timeRange,
    setTimeRange,
    selectedYear,
    setSelectedYear,
    chartData,
    chartLabel,
    // Pie chart
    pieTimeRange,
    setPieTimeRange,
    pieSelectedYear,
    setPieSelectedYear,
    pieData,
    pieLabel,
    // Common
    availableYears,
  };
};

