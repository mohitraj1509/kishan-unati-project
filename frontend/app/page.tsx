'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import Features from '../components/Features';
import NearestShops from '../components/NearestShops';
import FarmingTips from '../components/FarmingTips';
import Testimonials from '../components/Testimonials';
import Statistics from '../components/Statistics';
import Footer from '../components/Footer';
import ChatbotFAB from '../components/ChatbotFAB';
import { isAuthenticated } from '../lib/auth';
import styles from './home.module.css';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
      setLoading(false);
    };
    
    checkAuth();
    
    const handleAuthChange = () => checkAuth();
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <p className={styles.loadingText}>लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {isLoggedIn ? (
        <>
          <Dashboard />
          <Features />
          <NearestShops />
          <FarmingTips />
          <Testimonials />
          <Statistics />
        </>
      ) : (
        <>
          {/* Modern Hero Section */}
          <section className={styles.hero}>
            <div className={styles.heroBackground}></div>
            
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>
                  🌾 किसान उन्नति
                </h1>
                <p className={styles.heroSubtitle}>
                  आपकी खेती का <span className={styles.highlight}>भरोसेमंद साथी</span>
                </p>
                
                <p className={styles.heroDescription}>
                  AI-Powered खेती की सलाह, रोग पहचान, लाइव मंडी भाव — हिंदी में, बिना खाता बनाए
                </p>

                <div className={styles.heroStats}>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>50M+</div>
                    <div className={styles.statLabel}>किसान</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>95%</div>
                    <div className={styles.statLabel}>सटीक</div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.statNumber}>24/7</div>
                    <div className={styles.statLabel}>सहायता</div>
                  </div>
                </div>

                <div className={styles.heroCTA}>
                  <Link href="/voice-assistant" className={styles.primaryBtn}>
                    <span className={styles.btnIcon}>🎤</span>
                    बोलकर पूछें
                  </Link>
                  <Link href="/crop-recommendation" className={styles.secondaryBtn}>
                    <span className={styles.btnIcon}>🌾</span>
                    फसल सुझाव
                  </Link>
                  <Link href="/register" className={styles.tertiaryBtn}>
                    <span className={styles.btnIcon}>👤</span>
                    खाता बनाएं
                  </Link>
                </div>

                <div className={styles.heroTrust}>
                  <span className={styles.trustIcon}>✓</span>
                  <span className={styles.trustText}>बिना लॉगिन के सभी सेवाएँ शुरू करें</span>
                </div>
              </div>

              <div className={styles.heroVisual}>
                <div className={styles.animatedCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardIcon}>🤖</div>
                    <div className={styles.cardLabel}>AI Farming Guide</div>
                  </div>
                  <div className={styles.cardFeatures}>
                    <div className={styles.feature}>✓ तुरंत सलाह</div>
                    <div className={styles.feature}>✓ रोग पहचान</div>
                    <div className={styles.feature}>✓ मंडी भाव</div>
                  </div>
                </div>

                <div className={styles.floatingElements}>
                  <div className={`${styles.floatingBox} ${styles.delay0}`}>
                    <span className={styles.floatingIcon}>🌾</span>
                    <span>फसल सलाह</span>
                  </div>
                  <div className={`${styles.floatingBox} ${styles.delay1}`}>
                    <span className={styles.floatingIcon}>📊</span>
                    <span>मंडी भाव</span>
                  </div>
                  <div className={`${styles.floatingBox} ${styles.delay2}`}>
                    <span className={styles.floatingIcon}>🔍</span>
                    <span>रोग पहचान</span>
                  </div>
                  <div className={`${styles.floatingBox} ${styles.delay3}`}>
                    <span className={styles.floatingIcon}>🎤</span>
                    <span>बोलकर पूछें</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid Section */}
          <section className={styles.featuresSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>✨ हमारी शक्तिशाली सेवाएँ</h2>
              <p className={styles.sectionSubtitle}>सभी farmers के लिए designed, सभी के लिए free</p>
            </div>

            <div className={styles.servicesGrid}>
              <Link href="/crop-recommendation" className={styles.serviceCard}>
                <div className={styles.serviceIcon}>🤖</div>
                <h3 className={styles.serviceTitle}>फसल सुझाव</h3>
                <p className={styles.serviceDesc}>AI से जानें आपके क्षेत्र के लिए सबसे अच्छी फसल</p>
                <div className={styles.serviceArrow}>→</div>
              </Link>

              <Link href="/disease-detection" className={styles.serviceCard}>
                <div className={styles.serviceIcon}>🔍</div>
                <h3 className={styles.serviceTitle}>रोग पहचान</h3>
                <p className={styles.serviceDesc}>फोटो लगाएं, हम बताएंगे रोग और इलाज</p>
                <div className={styles.serviceArrow}>→</div>
              </Link>

              <Link href="/marketplace" className={styles.serviceCard}>
                <div className={styles.serviceIcon}>📊</div>
                <h3 className={styles.serviceTitle}>मंडी भाव</h3>
                <p className={styles.serviceDesc}>Live prices देश भर की मंडियों से</p>
                <div className={styles.serviceArrow}>→</div>
              </Link>

              <Link href="/voice-assistant" className={styles.serviceCard}>
                <div className={styles.serviceIcon}>🎤</div>
                <h3 className={styles.serviceTitle}>बोलकर पूछें</h3>
                <p className={styles.serviceDesc}>अपनी भाषा में, अपने सवालों के जवाब</p>
                <div className={styles.serviceArrow}>→</div>
              </Link>

              <Link href="/schemes" className={styles.serviceCard}>
                <div className={styles.serviceIcon}>📋</div>
                <h3 className={styles.serviceTitle}>सरकारी योजनाएँ</h3>
                <p className={styles.serviceDesc}>सभी मिलने वाली सहायता एक जगह</p>
                <div className={styles.serviceArrow}>→</div>
              </Link>

              <div className={`${styles.serviceCard} ${styles.communityCard}`}>
                <div className={styles.serviceIcon}>👥</div>
                <h3 className={styles.serviceTitle}>कम्युनिटी</h3>
                <p className={styles.serviceDesc}>दूसरे किसानों से सीखें और जुड़ें</p>
                <div className={styles.serviceArrow}>→</div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className={styles.statsSection}>
            <div className={styles.statsContainer}>
              <div className={styles.statBox}>
                <div className={styles.statBigNumber}>2M+</div>
                <div className={styles.statBoxTitle}>Active Farmers</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBigNumber}>10M+</div>
                <div className={styles.statBoxTitle}>सवालों के जवाब</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBigNumber}>98%</div>
                <div className={styles.statBoxTitle}>खुश किसान</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statBigNumber}>₹500Cr</div>
                <div className={styles.statBoxTitle}>बचाई गई फसल</div>
              </div>
            </div>
          </section>

          {/* How it Works Section */}
          <section className={styles.howItWorks}>
            <h2 className={styles.sectionTitle}>कैसे काम करता है?</h2>
            <div className={styles.stepsContainer}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4>अपनी समस्या बताएं</h4>
                  <p>बोलकर या लिखकर अपनी खेती की समस्या बताएं</p>
                </div>
              </div>
              <div className={styles.stepArrow}>→</div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4>AI विश्लेषण करता है</h4>
                  <p>हमारा AI आपकी समस्या का विश्लेषण करता है</p>
                </div>
              </div>
              <div className={styles.stepArrow}>→</div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4>तुरंत समाधान पाएं</h4>
                  <p>मिनटों में सटीक और व्यावहारिक सलाह पाएं</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Carousel */}
          <section className={styles.testimonials}>
            <h2 className={styles.sectionTitle}>किसानों का अनुभव</h2>
            <div className={styles.testimonialsGrid}>
              <div className={styles.testimonialCard}>
                <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                <p className={styles.testimonialText}>"Kisan Unnati ने मेरी गेहूँ की फसल बचा दी। Disease identification बिल्कुल सही था।"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>आ</div>
                  <div>
                    <div className={styles.authorName}>आयुष शर्मा</div>
                    <div className={styles.authorLocation}>पंजाब</div>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialCard}>
                <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                <p className={styles.testimonialText}>"मंडी भाव से मुझे सही समय पर बेचने का पता चल जाता है। कमाई 30% बढ़ गई।"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>रा</div>
                  <div>
                    <div className={styles.authorName}>राज मल्हारा</div>
                    <div className={styles.authorLocation}>महाराष्ट्र</div>
                  </div>
                </div>
              </div>

              <div className={styles.testimonialCard}>
                <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                <p className={styles.testimonialText}>"Voice feature बहुत अच्छी है। मेरे बुजुर्ग माता-पिता भी आसानी से use करते हैं।"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorAvatar}>वि</div>
                  <div>
                    <div className={styles.authorName}>विजय कुमार</div>
                    <div className={styles.authorLocation}>उत्तर प्रदेश</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>आज ही शुरू करें</h2>
              <p className={styles.ctaSubtitle}>बिना खाता बनाए, बिना किसी खर्च के</p>
              
              <div className={styles.ctaButtons}>
                <Link href="/voice-assistant" className={styles.ctaPrimaryBtn}>
                  🎤 अभी शुरू करें
                </Link>
                <Link href="/register" className={styles.ctaSecondaryBtn}>
                  खाता बनाएं
                </Link>
              </div>

              <p className={styles.ctaInfo}>
                ✓ Free forever • ✓ हिंदी में • ✓ 24/7 support
              </p>
            </div>
          </section>

          <Features />
          <NearestShops />
          <FarmingTips />
          <Testimonials />
          <Statistics />
        </>
      )}
      <Footer />
      <ChatbotFAB />
    </div>
  );
}