import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import { Calendar } from 'lucide-react';

import { Application } from '../../types';
import { useCharts } from '../../hooks/useCharts';
import { useResponsive } from '../../hooks/useResponsive';
import { CHART_COLORS, TimeRange } from '../../helpers/charts';
import styles from './ChartsSection.module.scss';


interface ChartsSectionProps {
  applications: Application[];
}

export function ChartsSection({ applications }: ChartsSectionProps) {
  const { isMobile } = useResponsive(767);
  const {
    timeRange,
    setTimeRange,
    selectedYear,
    setSelectedYear,
    chartData,
    chartLabel,
    pieTimeRange,
    setPieTimeRange,
    pieSelectedYear,
    setPieSelectedYear,
    pieData,
    pieLabel,
    availableYears,
  } = useCharts(applications);
  const CenterLabel = ({ viewBox }: any) => {
    const { cx, cy } = viewBox;

    return (
      <>
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          dominantBaseline="central"
          className={styles['charts-section__center-label-text']}
        >
          Total
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          dominantBaseline="central"
          className={styles['charts-section__center-label-value']}
        >
          {pieData.length}
        </text>
      </>
    );
  };



  return (
    <div className={styles['charts-container']}>


      <div className={styles['charts-section']}>
        {/* Applications Over Time - Bar Chart */}
        <div className={styles['charts-section__card']}>
          {applications.length === 0 ?
            <div className={styles['charts-section__empty']}>
              <p className={styles['charts-section__empty-text']}>No data</p>
            </div> : <>
              <div className={styles['charts-section__header']}>
                <div className={styles['charts-section__title-group']}>
                  <h3 className={styles['charts-section__title']}>Applications Over Time</h3>
                </div>
                <div className={styles['charts-section__controls']}>
                  <Calendar className={styles['charts-section__icon']} />


                  {timeRange === 'annually' && (
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className={styles['charts-section__select']}
                    >
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  )}

                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                    className={styles['charts-section__select']}
                  >
                    <option value="annually">Annually</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className={styles['charts-section__grid']} />
                  <XAxis
                    dataKey="name"
                    className={styles['charts-section__axis']}
                    tickFormatter={(value) => value.startsWith('_placeholder_') ? '' : value}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className={styles['charts-section__axis']}
                    domain={[0, 'auto']}
                    interval={0}
                    width={30}
                    allowDecimals={false}
                    tickFormatter={(value) => Math.floor(value).toString()}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length && !label.toString().startsWith('_placeholder_')) {
                        return (
                          <div className={styles['charts-section__tooltip']}>
                            <p className={styles['charts-section__tooltip-label']}>{label}</p>
                            {payload.map((entry: any, index: number) => (
                              <div key={index} className={styles['charts-section__tooltip-item']}>
                                <div className={styles['charts-section__tooltip-dot']} style={{ backgroundColor: entry.color }} />
                                <span>{entry.name}: {entry.value}</span>
                              </div>
                            ))}
                            {isMobile && payload[0]?.payload && (
                              <div className={styles['charts-section__tooltip-total']}>
                                <span>Total Applications: {payload[0].payload.applications}</span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
                  {isMobile ? (
                    <>
                      <Bar dataKey="applied" stackId="a" fill={CHART_COLORS['Applied']} name="Applied" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="interviews" stackId="a" fill={CHART_COLORS['Interview']} name="Interview" />
                      <Bar dataKey="rejected" stackId="a" fill={CHART_COLORS['Rejected']} name="Rejected" />
                      <Bar dataKey="offers" stackId="a" fill={CHART_COLORS['Offer']} name="Offer" radius={[4, 4, 0, 0]} />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="applications" fill="#3b82f6" name="Total Applications" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="interviews" fill={CHART_COLORS['Interview']} name="Interview" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="rejected" fill={CHART_COLORS['Rejected']} name="Rejected" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="offers" fill={CHART_COLORS['Offer']} name="Offer" radius={[4, 4, 0, 0]} />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>

            </>}

        </div>

        {/* Status Distribution - Pie Chart */}
        <div className={styles['charts-section__card']}>
          {applications.length === 0 ?
            <div className={styles['charts-section__empty']}>
              <p className={styles['charts-section__empty-text']}>No data</p>
            </div> : <>
              <div className={styles['charts-section__header']}>
                <div className={styles['charts-section__title-group']}>
                  <h3 className={styles['charts-section__title']}>Status Distribution</h3>
                </div>
                <div className={styles['charts-section__controls']}>
                  <Calendar className={styles['charts-section__icon']} />


                  {pieTimeRange === 'annually' && (
                    <select
                      value={pieSelectedYear}
                      onChange={(e) => setPieSelectedYear(Number(e.target.value))}
                      className={styles['charts-section__select']}
                    >
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  )}

                  <select
                    value={pieTimeRange}
                    onChange={(e) => setPieTimeRange(e.target.value as TimeRange)}
                    className={styles['charts-section__select']}
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
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.name as keyof typeof CHART_COLORS] || '#8884d8'} />
                    ))}
                    <Label content={<CenterLabel />} />
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className={styles['charts-section__tooltip']}>
                            {payload.map((entry: any, index: number) => (
                              <div key={index} className={styles['charts-section__tooltip-item']}>
                                <div className={styles['charts-section__tooltip-dot']} style={{ backgroundColor: entry.payload.fill || entry.color }} />
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
                  <Legend verticalAlign="bottom" height={36} iconType="square" />
                </PieChart>
              </ResponsiveContainer>
            </>}
        </div>
      </div>
    </div>
  );
}

