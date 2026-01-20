"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Analytics.module.css';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number[];
    growth: number;
  };
  crops: {
    planted: number;
    harvested: number;
    yield: number;
    varieties: { name: string; area: number; yield: number }[];
  };
  expenses: {
    total: number;
    categories: { name: string; amount: number; percentage: number }[];
  };
  weather: {
    rainfall: number[];
    temperature: number[];
    alerts: number;
  };
  trends: {
    marketPrices: { crop: string; price: number; change: number }[];
    demand: { crop: string; level: 'High' | 'Medium' | 'Low' }[];
  };
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  useEffect(() => {
    // Mock analytics data
    setTimeout(() => {
      setAnalyticsData({
        revenue: {
          total: 250000,
          monthly: [35000, 42000, 38000, 45000, 52000, 41000],
          growth: 15.8
        },
        crops: {
          planted: 25,
          harvested: 18,
          yield: 85,
          varieties: [
            { name: 'Wheat', area: 12, yield: 92 },
            { name: 'Rice', area: 8, yield: 78 },
            { name: 'Cotton', area: 5, yield: 85 }
          ]
        },
        expenses: {
          total: 180000,
          categories: [
            { name: 'Seeds & Fertilizers', amount: 65000, percentage: 36 },
            { name: 'Equipment', amount: 45000, percentage: 25 },
            { name: 'Labor', amount: 35000, percentage: 19 },
            { name: 'Transportation', amount: 25000, percentage: 14 },
            { name: 'Other', amount: 10000, percentage: 6 }
          ]
        },
        weather: {
          rainfall: [45, 32, 67, 23, 89, 54],
          temperature: [28, 31, 29, 33, 27, 30],
          alerts: 3
        },
        trends: {
          marketPrices: [
            { crop: 'Wheat', price: 2200, change: 8.5 },
            { crop: 'Rice', price: 3200, change: -3.2 },
            { crop: 'Cotton', price: 5800, change: 12.1 }
          ],
          demand: [
            { crop: 'Wheat', level: 'High' as const },
            { crop: 'Rice', level: 'Medium' as const },
            { crop: 'Cotton', level: 'High' as const }
          ]
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <h2>Loading Analytics...</h2>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/dashboard" className={styles.backButton}>
            ← Back to Dashboard
          </Link>
          <h1 className={styles.title}>Farm Analytics</h1>
          <p className={styles.subtitle}>Unable to load analytics data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          ← Back to Dashboard
        </Link>
        <h1 className={styles.title}>Farm Analytics</h1>
        <p className={styles.subtitle}>Comprehensive insights into your farming operations</p>

        <div className={styles.periodSelector}>
          <button
            className={`${styles.periodBtn} ${selectedPeriod === '3months' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('3months')}
          >
            3 Months
          </button>
          <button
            className={`${styles.periodBtn} ${selectedPeriod === '6months' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('6months')}
          >
            6 Months
          </button>
          <button
            className={`${styles.periodBtn} ${selectedPeriod === '1year' ? styles.active : ''}`}
            onClick={() => setSelectedPeriod('1year')}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>💰</div>
          <div className={styles.metricInfo}>
            <h3>Total Revenue</h3>
            <p className={styles.metricValue}>₹{analyticsData.revenue.total.toLocaleString()}</p>
            <span className={`${styles.metricChange} ${analyticsData.revenue.growth > 0 ? styles.positive : styles.negative}`}>
              {analyticsData.revenue.growth > 0 ? '+' : ''}{analyticsData.revenue.growth}%
            </span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>🌾</div>
          <div className={styles.metricInfo}>
            <h3>Crop Yield</h3>
            <p className={styles.metricValue}>{analyticsData.crops.yield}%</p>
            <span className={styles.metricLabel}>Average efficiency</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>📊</div>
          <div className={styles.metricInfo}>
            <h3>Total Expenses</h3>
            <p className={styles.metricValue}>₹{analyticsData.expenses.total.toLocaleString()}</p>
            <span className={styles.metricLabel}>This period</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>🌧️</div>
          <div className={styles.metricInfo}>
            <h3>Weather Alerts</h3>
            <p className={styles.metricValue}>{analyticsData.weather.alerts}</p>
            <span className={styles.metricLabel}>Active alerts</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h3>Revenue Trend</h3>
          <div className={styles.chartPlaceholder}>
            <div className={styles.barChart}>
              {analyticsData.revenue.monthly.map((value, index) => (
                <div key={index} className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{ height: `${(value / 60000) * 100}%` }}
                  ></div>
                  <span className={styles.barLabel}>₹{(value / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Expense Breakdown</h3>
          <div className={styles.pieChart}>
            {analyticsData.expenses.categories.map((category, index) => (
              <div key={index} className={styles.pieSlice}>
                <div
                  className={styles.sliceFill}
                  style={{
                    background: `conic-gradient(#${Math.floor(Math.random()*16777215).toString(16)} 0% ${category.percentage}%, #e5e7eb ${category.percentage}% 100%)`
                  }}
                ></div>
                <div className={styles.sliceLabel}>
                  <span>{category.name}</span>
                  <span>{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className={styles.detailsSection}>
        <div className={styles.detailCard}>
          <h3>Crop Performance</h3>
          <div className={styles.cropList}>
            {analyticsData.crops.varieties.map((variety, index) => (
              <div key={index} className={styles.cropItem}>
                <div className={styles.cropInfo}>
                  <span className={styles.cropName}>{variety.name}</span>
                  <span className={styles.cropArea}>{variety.area} acres</span>
                </div>
                <div className={styles.cropYield}>
                  <span className={styles.yieldValue}>{variety.yield}%</span>
                  <div className={styles.yieldBar}>
                    <div
                      className={styles.yieldFill}
                      style={{ width: `${variety.yield}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.detailCard}>
          <h3>Market Trends</h3>
          <div className={styles.marketTrends}>
            {analyticsData.trends.marketPrices.map((item, index) => (
              <div key={index} className={styles.trendItem}>
                <div className={styles.trendInfo}>
                  <span className={styles.trendCrop}>{item.crop}</span>
                  <span className={styles.trendPrice}>₹{item.price}/quintal</span>
                </div>
                <span className={`${styles.trendChange} ${item.change > 0 ? styles.positive : styles.negative}`}>
                  {item.change > 0 ? '+' : ''}{item.change}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.detailCard}>
          <h3>Demand Analysis</h3>
          <div className={styles.demandList}>
            {analyticsData.trends.demand.map((item, index) => (
              <div key={index} className={styles.demandItem}>
                <span className={styles.demandCrop}>{item.crop}</span>
                <span className={`styles.demandLevel ${styles[item.level.toLowerCase()]}`}>
                  {item.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className={styles.recommendations}>
        <h3>AI Recommendations</h3>
        <div className={styles.recommendationGrid}>
          <div className={styles.recommendationCard}>
            <div className={styles.recIcon}>🌱</div>
            <h4>Optimize Irrigation</h4>
            <p>Based on weather patterns, reduce water usage by 15% in the next 2 weeks.</p>
          </div>
          <div className={styles.recommendationCard}>
            <div className={styles.recIcon}>📈</div>
            <h4>Market Timing</h4>
            <p>Wheat prices are expected to rise. Consider holding harvest for 1-2 weeks.</p>
          </div>
          <div className={styles.recommendationCard}>
            <div className={styles.recIcon}>🛡️</div>
            <h4>Pest Management</h4>
            <p>Monitor cotton fields for early signs of pest infestation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;