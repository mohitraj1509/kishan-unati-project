'use client';

import React from 'react';
import styles from './PricePredictionCard.module.css';

interface PricePredictionCardProps {
  crop: string;
  district: string;
  price: number;
  risk?: string;
  confidence?: number;
  historicalAvg?: number;
}

const PricePredictionCard: React.FC<PricePredictionCardProps> = ({
  crop,
  district,
  price,
  risk = 'Unknown',
  confidence = 0,
  historicalAvg,
}) => {
  const getRiskColor = (riskLevel: string) => {
    if (!riskLevel) return '#6b7280';
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const getRiskBgColor = (riskLevel: string) => {
    if (!riskLevel) return '#f3f4f6';
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return '#fee2e2';
      case 'medium':
        return '#fef3c7';
      case 'low':
        return '#dcfce7';
      default:
        return '#f3f4f6';
    }
  };

  const priceChange = historicalAvg
    ? ((price - historicalAvg) / historicalAvg) * 100
    : 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.cropInfo}>
          <h3 className={styles.cropName}>{crop}</h3>
          <p className={styles.district}>{district}</p>
        </div>
        <div
          className={styles.riskBadge}
          style={{
            backgroundColor: getRiskBgColor(risk),
            color: getRiskColor(risk),
          }}
        >
          {risk} Risk
        </div>
      </div>

      <div className={styles.priceSection}>
        <div className={styles.priceValue}>
          <span className={styles.currency}>₹</span>
          <span className={styles.amount}>{Math.round(price)}</span>
        </div>
        <p className={styles.label}>Predicted Price</p>
      </div>

      {historicalAvg && (
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Historical Avg</span>
            <span className={styles.statValue}>₹{Math.round(historicalAvg)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Change</span>
            <span
              className={styles.statValue}
              style={{
                color: priceChange > 0 ? '#22c55e' : '#ef4444',
              }}
            >
              {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {confidence > 0 && (
        <div className={styles.confidence}>
          <div className={styles.confidenceLabel}>
            <span>Confidence Level</span>
            <span className={styles.confidenceValue}>{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className={styles.confidenceBar}>
            <div
              className={styles.confidenceFill}
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <small>Last updated: {new Date().toLocaleDateString()}</small>
      </div>
    </div>
  );
};

export default PricePredictionCard;
