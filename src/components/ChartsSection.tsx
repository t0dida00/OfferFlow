import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import { Calendar } from 'lucide-react';

import { Application } from '../types';

interface ChartsSectionProps {
  applications: Application[];
}

type TimeRange = 'annually' | 'all';

const COLORS = {
  'Applied': '#9ca3af', // Gray
  'Interview': '#eab308', // Yellow
  'Offer': '#22c55e', // Green
  'Rejected': '#ef4444', // Red
};

export function ChartsSection({ applications }: ChartsSectionProps) {
  const currentYear = new Date().getFullYear();

  // Bar Chart State
  const [timeRange, setTimeRange] = useState<TimeRange>('annually');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Pie Chart State
  const [pieTimeRange, setPieTimeRange] = useState<TimeRange>('annually');
  const [pieSelectedYear, setPieSelectedYear] = useState<number>(currentYear);

  // Get available years from data
  const availableYears = Array.from(new Set([
    currentYear,
    ...applications.map(app => new Date(app.date).getFullYear())
  ])).sort((a, b) => b - a);

  // Process data for Bar Chart (Applications Over Time)
  const getChartData = () => {
    if (timeRange === 'annually') {
      // Annually: Jan - Dec of selected year
      const year = selectedYear;
      const yearData = [];

      for (let i = 0; i < 12; i++) {
        const monthApps = applications.filter(app => {
          const appDate = new Date(app.date);
          return appDate.getMonth() === i && appDate.getFullYear() === year;
        });

        const monthDate = new Date(year, i, 1);

        yearData.push({
          name: monthDate.toLocaleDateString('en-US', { month: 'short' }),
          applications: monthApps.length,
          interviews: monthApps.filter(app => app.status === 'interview').length,
          offers: monthApps.filter(app => app.status === 'offer').length,
        });
      }

      return {
        data: yearData,
        label: `${year}`
      };

    } else {
      // All Time: Group by Year
      const allTimeData: { [key: string]: { applications: number; interviews: number; offers: number } } = {};

      applications.forEach(app => {
        const appDate = new Date(app.date);
        const year = appDate.getFullYear().toString();

        if (!allTimeData[year]) {
          allTimeData[year] = { applications: 0, interviews: 0, offers: 0 };
        }

        allTimeData[year].applications++;
        if (app.status === 'interview') allTimeData[year].interviews++;
        if (app.status === 'offer') allTimeData[year].offers++;
      });

      const sortedData = Object.entries(allTimeData)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([name, data]) => ({
          name,
          ...data,
        }));

      // Pad with placeholders to ensure at least 12 columns like in annual view
      const filledData = [...sortedData];
      while (filledData.length < 12) {
        filledData.push({
          name: `_placeholder_${filledData.length}`,
          applications: 0,
          interviews: 0,
          offers: 0,
        });
      }

      return {
        data: filledData,
        label: 'All Time'
      };
    }
  };

  // Process data for Pie Chart (Status Distribution)
  const getPieChartData = () => {
    let filteredApps = applications;

    if (pieTimeRange === 'annually') {
      filteredApps = applications.filter(app =>
        new Date(app.date).getFullYear() === pieSelectedYear
      );
    }

    const stats = {
      'Applied': 0,
      'Interview': 0,
      'Offer': 0,
      'Rejected': 0,
    };

    filteredApps.forEach(app => {
      // Normalize status to match keys
      // Assumes app.status or app.result matches keys exactly or needs mapping
      // If db has 'Applied' instead of 'Pending':
      const status = app.status; // Assuming app.status is the correct field

      if (status && status in stats) {
        // @ts-ignore
        stats[status]++;
      } else {
        // Fallback or count as Applied?
        // If an unknown status is encountered, it will not be counted.
        // If you want to count unknown statuses as 'Applied', uncomment the line below:
        // stats['Applied']++;
      }
    });

    const data = Object.entries(stats).map(([name, value]) => ({
      name,
      value,
    })).filter(item => item.value > 0); // Optional: filter out zero values if desired

    return {
      data,
      label: pieTimeRange === 'annually' ? `${pieSelectedYear}` : 'All Time'
    };
  };

  const { data: chartData, label: chartLabel } = getChartData();
  const { data: pieData, label: pieLabel } = getPieChartData();
  const CenterLabel = ({ viewBox }: any) => {
    const { cx, cy } = viewBox;

    return (
      <>
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-gray-500 text-sm"
        >
          Total
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-gray-900 text-xl font-semibold"
        >
          {pieData.length}
        </text>
      </>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Applications Over Time - Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Applications Over Time</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{chartLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />

            {timeRange === 'annually' && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            )}

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="annually">Annually</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => value.startsWith('_placeholder_') ? '' : value}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              domain={[0, 'auto']}
              interval={0}
              allowDecimals={false}
              tickFormatter={(value) => Math.floor(value).toString()}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length && !label.toString().startsWith('_placeholder_')) {
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3">
                      <p className="text-sm font-semibold mb-2">{label}</p>
                      {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span>{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} iconType="square" />
            <Bar dataKey="applications" fill="#3b82f6" name="Total Applications" radius={[4, 4, 0, 0]} />
            <Bar dataKey="interviews" fill="#eab308" name="Interviews" radius={[4, 4, 0, 0]} />
            <Bar dataKey="offers" fill="#22c55e" name="Offers" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* Status Distribution - Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Status Distribution</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{pieLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />

            {pieTimeRange === 'annually' && (
              <select
                value={pieSelectedYear}
                onChange={(e) => setPieSelectedYear(Number(e.target.value))}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            )}

            <select
              value={pieTimeRange}
              onChange={(e) => setPieTimeRange(e.target.value as TimeRange)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="annually">Annually</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
              nameKey="name"
              label={({ value }) => value}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
              ))}
              <Label content={<CenterLabel />} />
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="square" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}