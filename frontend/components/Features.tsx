import React from 'react';
import styles from './Features.module.css';

const Features = () => {
  const features = [
    {
      icon: '🌾',
      title: 'फसल सलाह (Crop Advice)',
      description: 'मिट्टी और मौसम देखकर सही फसल का आसान सुझाव।'
    },
    {
      icon: '🔍',
      title: 'रोग पहचान (Disease Scan)',
      description: 'पौधे की फोटो डालें और बीमारी का इलाज जानें।'
    },
    {
      icon: '📈',
      title: 'मंडी भाव (Market Prices)',
      description: 'फसल के आज के दाम आसानी से देखें।'
    },
    {
      icon: '📋',
      title: 'सरकारी योजना (Schemes)',
      description: 'आपके लिए कौन‑सी योजना है, जल्दी पता करें।'
    }
  ];

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>आसान सुविधाएँ</h2>
          <p className={styles.subtitle}>
            कम पढ़े‑लिखे किसान भी आसानी से इस्तेमाल कर सकें
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