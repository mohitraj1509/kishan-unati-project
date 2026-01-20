import React from 'react';
import Link from 'next/link';
import styles from './FarmingTips.module.css';

const FarmingTips = () => {
  const tips = [
    {
      title: 'Organic Pest Control Methods',
      excerpt: 'Learn natural ways to protect your crops from pests without harmful chemicals.',
      image: '🌿',
      category: 'Pest Control',
      color: '#22c55e',
      readTime: '5 min read'
    },
    {
      title: 'Water Conservation Techniques',
      excerpt: 'Smart irrigation methods to save water and improve crop yield.',
      image: '💧',
      category: 'Irrigation',
      color: '#3b82f6',
      readTime: '4 min read'
    },
    {
      title: 'Soil Health Management',
      excerpt: 'Essential tips for maintaining healthy soil for better crop production.',
      image: '🌱',
      category: 'Soil Health',
      color: '#8b5cf6',
      readTime: '6 min read'
    },
    {
      title: 'Seasonal Crop Planning',
      excerpt: 'Plan your crops according to seasons for maximum profitability.',
      image: '📅',
      category: 'Planning',
      color: '#f59e0b',
      readTime: '7 min read'
    }
  ];

  return (
    <section className={styles.farmingTips}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Farming Tips & Insights</h2>
          <p className={styles.subtitle}>
            Expert advice to help you grow better crops and increase your farm's productivity
          </p>
        </div>

        <div className={styles.grid}>
          {tips.map((tip, index) => (
            <div key={index} className={styles.tipCard}>
              <div className={styles.imageWrapper} style={{ backgroundColor: tip.color + '20' }}>
                <span className={styles.tipImage}>{tip.image}</span>
              </div>
              <div className={styles.content}>
                <div className={styles.category} style={{ color: tip.color }}>
                  {tip.category}
                </div>
                <h3 className={styles.tipTitle}>{tip.title}</h3>
                <p className={styles.excerpt}>{tip.excerpt}</p>
                <div className={styles.meta}>
                  <span className={styles.readTime}>{tip.readTime}</span>
                  <Link href="#" className={styles.readMore} style={{ color: tip.color }}>
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.viewAll}>
          <Link href="/tips" className={styles.viewAllButton}>
            View All Farming Tips
            <span className={styles.arrow}>📚</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FarmingTips;