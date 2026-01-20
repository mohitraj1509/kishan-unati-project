import React from 'react';
import Link from 'next/link';
import styles from './QuickActions.module.css';

const QuickActions = () => {
  const actions = [
    {
      title: 'Check Weather',
      description: 'Get real-time weather updates',
      icon: '🌤️',
      link: '/dashboard',
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      title: 'Crop Disease Scan',
      description: 'Upload photo to detect diseases',
      icon: '🔍',
      link: '/dashboard',
      color: '#ef4444',
      bgColor: '#fee2e2'
    },
    {
      title: 'Market Prices',
      description: 'Check current crop prices',
      icon: '📈',
      link: '/dashboard/marketplace',
      color: '#22c55e',
      bgColor: '#dcfce7'
    },
    {
      title: 'AI Crop Advice',
      description: 'Get personalized recommendations',
      icon: '🤖',
      link: '/dashboard',
      color: '#8b5cf6',
      bgColor: '#e9d5ff'
    },
    {
      title: 'Government Schemes',
      description: 'Find eligible schemes & subsidies',
      icon: '📋',
      link: '/dashboard',
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      title: 'Farm Analytics',
      description: 'Track your farm performance',
      icon: '📊',
      link: '/dashboard',
      color: '#06b6d4',
      bgColor: '#cffafe'
    }
  ];

  return (
    <section className={styles.quickActions}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Quick Actions</h2>
          <p className={styles.subtitle}>
            Access your most-used farming tools instantly
          </p>
        </div>

        <div className={styles.grid}>
          {actions.map((action, index) => (
            <Link key={index} href={action.link} className={styles.actionCard}>
              <div className={styles.iconWrapper} style={{ backgroundColor: action.bgColor }}>
                <span className={styles.icon} style={{ color: action.color }}>
                  {action.icon}
                </span>
              </div>
              <div className={styles.content}>
                <h3 className={styles.actionTitle}>{action.title}</h3>
                <p className={styles.actionDescription}>{action.description}</p>
              </div>
              <div className={styles.arrow} style={{ color: action.color }}>
                →
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.ctaSection}>
          <Link href="/register" className={styles.ctaButton}>
            Start Your Smart Farming Journey
            <span className={styles.ctaIcon}>🚀</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuickActions;