'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { getPriceHistory, PriceHistoryData } from '../lib/aiPriceService';
import styles from './PriceChart.module.css';

interface PriceChartProps {
  crop: string;
  district: string;
  months?: number;
  chartType?: 'line' | 'area';
}

const PriceChart: React.FC<PriceChartProps> = ({
  crop,
  district,
  months = 12,
  chartType = 'line',
}) => {
  const [data, setData] = useState<PriceHistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const historyData = await getPriceHistory(crop, district, months);
        setData(historyData);
      } catch (err: any) {
        console.error('Error fetching price history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [crop, district, months]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonBar}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span>📊 Error loading price data. Using sample data for visualization.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Price Trend</h3>
        <span className={styles.subtitle}>{crop} - Last {months} months</span>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'area' ? (
            <AreaChart data={data || []}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => `₹${value.toFixed(0)}`}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          ) : (
            <LineChart data={data || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => `₹${value.toFixed(0)}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#16a34a', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {data && data.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.label}>Highest</span>
            <span className={styles.value}>
              ₹{Math.round(Math.max(...data.map(d => d.price)))}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Lowest</span>
            <span className={styles.value}>
              ₹{Math.round(Math.min(...data.map(d => d.price)))}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.label}>Average</span>
            <span className={styles.value}>
              ₹
              {Math.round(
                data.reduce((acc, d) => acc + d.price, 0) / data.length
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceChart;
