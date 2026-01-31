import React from 'react';
import Link from 'next/link';
import styles from './QuickActions.module.css';

const QuickActions = () => {
  const actions = [
    {
      title: 'Check Weather',
      description: 'Today\'s weather',
      icon: '🌤️',
      link: '/dashboard',
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      title: 'Disease Check',
      description: 'Upload plant photo',
      icon: '🔍',
      link: '/dashboard',
      color: '#ef4444',
      bgColor: '#fee2e2'
    },
    {
      title: 'Market Prices',
      description: 'Crop prices',
      icon: '📈',
      link: '/dashboard/marketplace',
      color: '#22c55e',
      bgColor: '#dcfce7'
    },
    {
      title: 'Crop Advice',
      description: 'Choose right crop',
      icon: '🤖',
      link: '/dashboard',
      color: '#8b5cf6',
      bgColor: '#e9d5ff'
    },
    {
      title: 'Government Schemes',
      description: 'View schemes/subsidies',
      icon: '📋',
      link: '/dashboard',
      color: '#f59e0b',
      bgColor: '#fef3c7'
    }
  ];

  return (
    <section className={styles.quickActions}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Direct Services</h2>
          <p className={styles.subtitle}>
            Do important tasks in one click
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
            Create Your Account
            <span className={styles.ctaIcon}>🚀</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuickActions;