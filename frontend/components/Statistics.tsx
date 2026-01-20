import React from 'react';
import styles from './Statistics.module.css';

const Statistics = () => {
  const stats = [
    {
      number: '500K+',
      label: 'Farmers Empowered',
      icon: '👨‍🌾',
      color: '#22c55e'
    },
    {
      number: '95%',
      label: 'Accuracy in Disease Detection',
      icon: '🔬',
      color: '#3b82f6'
    },
    {
      number: '₹2.5Cr+',
      label: 'Farmer Earnings Increased',
      icon: '💰',
      color: '#f59e0b'
    },
    {
      number: '50+',
      label: 'Crop Types Supported',
      icon: '🌾',
      color: '#ef4444'
    }
  ];

  return (
    <section className={styles.statistics}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Our Impact in Numbers</h2>
          <p className={styles.subtitle}>
            Transforming agriculture through technology and innovation
          </p>
        </div>

        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.iconWrapper} style={{ backgroundColor: stat.color + '20' }}>
                <span className={styles.icon}>{stat.icon}</span>
              </div>
              <div className={styles.number} style={{ color: stat.color }}>
                {stat.number}
              </div>
              <div className={styles.label}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;