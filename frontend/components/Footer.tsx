import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.brand}>
            <h3 className={styles.logo}>किसान उन्नति</h3>
            <p className={styles.tagline}>
              खेती से जुड़े काम आसान भाषा में, एक ही जगह।
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>जरूरी सेवाएँ</h4>
              <ul className={styles.linkList}>
                <li><Link href="/dashboard" className={styles.link}>सेवाएँ</Link></li>
                <li><Link href="/marketplace" className={styles.link}>मंडी भाव</Link></li>
                <li><Link href="/schemes" className={styles.link}>सरकारी योजना</Link></li>
                <li><Link href="/weather" className={styles.link}>मौसम</Link></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>सहायता</h4>
              <ul className={styles.linkList}>
                <li><Link href="/help" className={styles.link}>मदद</Link></li>
                <li><Link href="/contact" className={styles.link}>संपर्क करें</Link></li>
                <li><Link href="/faq" className={styles.link}>प्रश्न</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>&copy; 2026 Kisan Unnati. All rights reserved.</p>
          </div>
          <div className={styles.bottomLinks}>
            <Link href="/terms" className={styles.bottomLink}>नियम</Link>
            <Link href="/privacy" className={styles.bottomLink}>प्राइवेसी</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;