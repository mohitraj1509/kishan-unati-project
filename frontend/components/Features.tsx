import React from 'react';
import styles from './Features.module.css';

const Features = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI Crop Recommendations',
      description: 'Get personalized crop suggestions based on soil type, weather, and market demand using advanced machine learning.'
    },
    {
      icon: '🔍',
      title: 'Disease Detection',
      description: 'Upload plant images to instantly detect diseases and get treatment recommendations powered by computer vision.'
    },
    {
      icon: '🌤️',
      title: 'Weather Insights',
      description: 'Real-time weather forecasts and agricultural advisories to help you plan your farming activities.'
    },
    {
      icon: '💰',
      title: 'Direct Marketplace',
      description: 'Connect directly with buyers, eliminate middlemen, and get fair prices for your produce.'
    },
    {
      icon: '📚',
      title: 'Government Schemes',
      description: 'Stay updated with latest agricultural schemes, subsidies, and government initiatives.'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track your farm performance, yields, expenses, and get insights to improve productivity.'
    }
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Why Choose Kisan Unnati?</h2>
          <p className={styles.subtitle}>
            Experience the future of farming with our comprehensive suite of AI-powered tools
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.icon}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>
                {feature.title}
              </h3>
              <p className={styles.featureDescription}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;