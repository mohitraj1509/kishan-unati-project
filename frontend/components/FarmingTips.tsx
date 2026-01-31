'use client'

import React, { useCallback } from 'react';
import Link from 'next/link';
import styles from './FarmingTips.module.css';

const FarmingTips = () => {
  const tips = [
    {
      title: 'कीट से बचाव (बिना दवा)',
      excerpt: 'प्राकृतिक तरीके जो फसल को सुरक्षित रखें।',
      image: '🌿',
      category: 'कीट नियंत्रण',
      color: '#22c55e',
      readTime: '2 मिनट'
    },
    {
      title: 'पानी बचाने के तरीके',
      excerpt: 'कम पानी में अच्छी सिंचाई के आसान उपाय।',
      image: '💧',
      category: 'सिंचाई',
      color: '#3b82f6',
      readTime: '2 मिनट'
    },
    {
      title: 'मिट्टी कैसे सुधारें',
      excerpt: 'मिट्टी की ताकत बढ़ाने के सरल उपाय।',
      image: '🌱',
      category: 'मिट्टी',
      color: '#8b5cf6',
      readTime: '3 मिनट'
    },
    {
      title: 'मौसम के अनुसार फसल',
      excerpt: 'किस मौसम में कौन‑सी फसल लगाएं।',
      image: '📅',
      category: 'प्लानिंग',
      color: '#f59e0b',
      readTime: '3 मिनट'
    }
  ];

  const speakTip = useCallback((text: string) => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    synth.speak(utterance);
  }, []);

  return (
    <section className={styles.farmingTips}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>किसान के लिए आसान टिप्स</h2>
          <p className={styles.subtitle}>
            छोटे और आसान सुझाव — रोज़मर्रा के काम में मदद
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
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.listenBtn}
                      onClick={() => speakTip(`${tip.title}. ${tip.excerpt}`)}
                    >
                      🔊 सुनें
                    </button>
                    <Link href="#" className={styles.readMore} style={{ color: tip.color }}>
                      पूरा पढ़ें →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.viewAll}>
          <Link href="/tips" className={styles.viewAllButton}>
            सभी टिप्स देखें
            <span className={styles.arrow}>📚</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FarmingTips;