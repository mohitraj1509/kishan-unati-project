'use client';

import React from 'react';
import styles from './RiskIndicator.module.css';

interface RiskIndicatorProps {
  risk?: string;
  factors?: string[];
  size?: 'small' | 'medium' | 'large';
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  risk = 'Unknown',
  factors = [],
  size = 'medium',
}) => {
  const getRiskColor = (riskLevel: string): string => {
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

  const getRiskBgColor = (riskLevel: string): string => {
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

  const getRiskIcon = (riskLevel: string): string => {
    if (!riskLevel) return '📊';
    switch (riskLevel.toLowerCase()) {
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      case 'low':
        return '✅';
      default:
        return '📊';
    }
  };

  return (
    <div className={`${styles.indicator} ${styles[size]}`}>
      <div
        className={styles.badge}
        style={{
          backgroundColor: getRiskBgColor(risk),
          color: getRiskColor(risk),
          borderColor: getRiskColor(risk),
        }}
      >
        <span className={styles.icon}>{getRiskIcon(risk)}</span>
        <div className={styles.content}>
          <span className={styles.label}>Market Risk</span>
          <span className={styles.value}>{risk}</span>
        </div>
      </div>

      {factors && factors.length > 0 && (
        <div className={styles.factors}>
          <h4 className={styles.factorsTitle}>Risk Factors:</h4>
          <ul className={styles.factorsList}>
            {factors.map((factor, index) => (
              <li key={index} className={styles.factorItem}>
                <span className={styles.factorIcon}>•</span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RiskIndicator;
