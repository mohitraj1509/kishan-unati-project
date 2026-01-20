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
              Empowering farmers with AI-driven agricultural solutions
            </p>
            <div className={styles.social}>
              <a href="#" className={`${styles.socialLink} ${styles.facebook}`}>📘</a>
              <a href="#" className={`${styles.socialLink} ${styles.twitter}`}>🐦</a>
              <a href="#" className={`${styles.socialLink} ${styles.instagram}`}>📷</a>
              <a href="#" className={`${styles.socialLink} ${styles.linkedin}`}>💼</a>
            </div>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Platform</h4>
              <ul className={styles.linkList}>
                <li><Link href="/dashboard" className={styles.link}>Dashboard</Link></li>
                <li><Link href="/marketplace" className={styles.link}>Marketplace</Link></li>
                <li><Link href="/schemes" className={styles.link}>Schemes</Link></li>
                <li><Link href="/analytics" className={styles.link}>Analytics</Link></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>AI Tools</h4>
              <ul className={styles.linkList}>
                <li><Link href="/crop-recommendation" className={styles.link}>Crop Recommendation</Link></li>
                <li><Link href="/disease-detection" className={styles.link}>Disease Detection</Link></li>
                <li><Link href="/weather" className={styles.link}>Weather Insights</Link></li>
                <li><Link href="/chatbot" className={styles.link}>AI Assistant</Link></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Support</h4>
              <ul className={styles.linkList}>
                <li><Link href="/help" className={styles.link}>Help Center</Link></li>
                <li><Link href="/contact" className={styles.link}>Contact Us</Link></li>
                <li><Link href="/faq" className={styles.link}>FAQ</Link></li>
                <li><Link href="/feedback" className={styles.link}>Feedback</Link></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.groupTitle}>Company</h4>
              <ul className={styles.linkList}>
                <li><Link href="/about" className={styles.link}>About Us</Link></li>
                <li><Link href="/careers" className={styles.link}>Careers</Link></li>
                <li><Link href="/blog" className={styles.link}>Blog</Link></li>
                <li><Link href="/privacy" className={styles.link}>Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>&copy; 2026 Kisan Unnati. All rights reserved.</p>
          </div>
          <div className={styles.bottomLinks}>
            <Link href="/terms" className={styles.bottomLink}>Terms of Service</Link>
            <Link href="/privacy" className={styles.bottomLink}>Privacy Policy</Link>
            <Link href="/cookies" className={styles.bottomLink}>Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;