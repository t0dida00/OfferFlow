/**
 * Chart data processing helpers
 * Domain-specific helpers for processing application chart data
 */

import { Application } from '../types';
import { getYear, getMonth } from '../utils/date';

export type TimeRange = 'annually' | 'all';

export interface ChartDataPoint {
  name: string;
  applications: number;
  applied: number;
  interviews: number;
  offers: number;
  rejected: number;
}

export interface PieChartDataPoint {
  name: string;
  value: number;
}

export const CHART_COLORS = {
  'Applied': '#9ca3af',
  'Interview': '#eab308',
  'Offer': '#22c55e',
  'Rejected': '#ef4444',
} as const;

export const processBarChartData = (
  applications: Application[],
  timeRange: TimeRange,
  selectedYear: number
): { data: ChartDataPoint[]; label: string } => {
  if (timeRange === 'annually') {
    const yearData: ChartDataPoint[] = [];

    for (let i = 0; i < 12; i++) {
      const monthApps = applications.filter(app => {
        return getMonth(app.date) === i && getYear(app.date) === selectedYear;
      });

      const monthDate = new Date(selectedYear, i, 1);

      yearData.push({
        name: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        applications: monthApps.length,
        applied: monthApps.filter(app => app.status === 'Applied').length,
        interviews: monthApps.filter(app => app.status === 'Interview').length,
        offers: monthApps.filter(app => app.status === 'Offer').length,
        rejected: monthApps.filter(app => app.status === 'Rejected').length,
      });
    }

    return {
      data: yearData,
      label: `${selectedYear}`,
    };
  } else {
    // All Time: Group by Year
    const allTimeData: { [key: string]: { applications: number; interviews: number; offers: number; rejected: number; applied: number } } = {};

    applications.forEach(app => {
      const year = getYear(app.date).toString();

      if (!allTimeData[year]) {
        allTimeData[year] = { applications: 0, interviews: 0, offers: 0, rejected: 0, applied: 0 };
      }

      allTimeData[year].applications++;
      if (app.status === 'Interview') allTimeData[year].interviews++;
      if (app.status === 'Offer') allTimeData[year].offers++;
      if (app.status === 'Rejected') allTimeData[year].rejected++;
      if (app.status === 'Applied') allTimeData[year].applied++;
    });

    const sortedData = Object.entries(allTimeData)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([name, data]) => ({
        name,
        ...data,
      }));

    // Pad with placeholders to ensure at least 12 columns like in annual view
    const filledData: ChartDataPoint[] = [...sortedData];
    while (filledData.length < 12) {
      filledData.push({
        name: `_placeholder_${filledData.length}`,
        applications: 0,
        applied: 0,
        interviews: 0,
        offers: 0,
        rejected: 0,
      });
    }

    return {
      data: filledData,
      label: 'All Time',
    };
  }
};

export const processPieChartData = (
  applications: Application[],
  timeRange: TimeRange,
  selectedYear: number
): { data: PieChartDataPoint[]; label: string } => {
  let filteredApps = applications;

  if (timeRange === 'annually') {
    filteredApps = applications.filter(app =>
      getYear(app.date) === selectedYear
    );
  }

  const stats = {
    'Applied': 0,
    'Interview': 0,
    'Offer': 0,
    'Rejected': 0,
  };

  filteredApps.forEach(app => {
    const status = app.status;
    if (status && status in stats) {
      (stats as any)[status]++;
    }
  });

  const data = Object.entries(stats)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .filter(item => item.value > 0);

  return {
    data,
    label: timeRange === 'annually' ? `${selectedYear}` : 'All Time',
  };
};

