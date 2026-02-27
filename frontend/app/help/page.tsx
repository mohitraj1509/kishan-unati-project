'use client'

import React from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import styles from './help.module.css';

export default function Help() {
  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.content}>
        <h1 className={styles.title}>❓ मदद केंद्र</h1>
        <p className={styles.subtitle}>हम आपकी मदद के लिए हमेशा तैयार हैं</p>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="अपनी समस्या खोजें..."
            className={styles.searchInput}
          />
          <button className={styles.searchBtn}>खोजें</button>
        </div>

        <div className={styles.sections}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📚 लोकप्रिय विषय</h2>
            <div className={styles.topicGrid}>
              <Link href="/help/registration" className={styles.topicCard}>
                <div className={styles.topicIcon}>📝</div>
                <h3>पंजीकरण कैसे करें</h3>
                <p>नया खाता बनाने की पूरी जानकारी</p>
              </Link>

              <Link href="/help/marketplace" className={styles.topicCard}>
                <div className={styles.topicIcon}>🛒</div>
                <h3>मंडी में बेचें</h3>
                <p>अपनी फसल कैसे बेचें</p>
              </Link>

              <Link href="/help/schemes" className={styles.topicCard}>
                <div className={styles.topicIcon}>🎯</div>
                <h3>योजना के लिए आवेदन</h3>
                <p>सरकारी योजनाओं में आवेदन करें</p>
              </Link>

              <Link href="/help/payment" className={styles.topicCard}>
                <div className={styles.topicIcon}>💰</div>
                <h3>भुगतान की जानकारी</h3>
                <p>पैसे कैसे मिलेंगे</p>
              </Link>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📞 संपर्क करें</h2>
            <div className={styles.contactGrid}>
              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>📱</div>
                <h3>हेल्पलाइन</h3>
                <p className={styles.contactInfo}>1800-123-4567</p>
                <p className={styles.contactTime}>सुबह 9 बजे - शाम 6 बजे</p>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>✉️</div>
                <h3>ईमेल</h3>
                <p className={styles.contactInfo}>help@kisanunnati.com</p>
                <p className={styles.contactTime}>24 घंटे में जवाब</p>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>💬</div>
                <h3>WhatsApp</h3>
                <p className={styles.contactInfo}>+91 98765-43210</p>
                <p className={styles.contactTime}>तुरंत जवाब</p>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>❓ अक्सर पूछे जाने वाले प्रश्न</h2>
            <div className={styles.faqList}>
              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>खाता कैसे बनाएं?</summary>
                <div className={styles.faqAnswer}>
                  <p>1. होम पेज पर "खाता बनाएं" पर क्लिक करें</p>
                  <p>2. किसान या दुकानदार चुनें</p>
                  <p>3. अपनी जानकारी भरें</p>
                  <p>4. मोबाइल नंबर वेरिफाई करें</p>
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>फसल कैसे बेचें?</summary>
                <div className={styles.faqAnswer}>
                  <p>मंडी सेक्शन में जाकर अपनी फसल की डिटेल डालें। खरीदार सीधे आपसे संपर्क करेंगे।</p>
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>योजना के लिए कौन आवेदन कर सकता है?</summary>
                <div className={styles.faqAnswer}>
                  <p>सभी किसान जिनके पास खेती की जमीन है, वे सरकारी योजनाओं के लिए आवेदन कर सकते हैं।</p>
                </div>
              </details>

              <details className={styles.faqItem}>
                <summary className={styles.faqQuestion}>पैसे कब मिलेंगे?</summary>
                <div className={styles.faqAnswer}>
                  <p>फसल बिकने के 2-3 दिन में पैसे आपके बैंक खाते में ट्रांसफर हो जाएंगे।</p>
                </div>
              </details>
            </div>
          </div>

          <div className={styles.ctaSection}>
            <h2>फिर भी समस्या है?</h2>
            <p>हमारी टीम से सीधे बात करें</p>
            <Link href="/contact" className={styles.ctaBtn}>
              संपर्क करें →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
