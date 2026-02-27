'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import NearestShops from '../components/NearestShops';
import Testimonials from '../components/Testimonials';
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
      {/* 1. Navbar */}
      <Header />
      
      {isLoggedIn ? (
        <>
          <Dashboard />
          <NearestShops />
          <Testimonials />
        </>
      ) : (
        <>
          {/* 2. Hero Section - Two Containers */}
          <section className={styles.hero}>
            <div className={styles.heroBackground}></div>
            
            <div className={styles.heroContent}>
              {/* Container 1: Details */}
              <div className={styles.heroText}>
                <h1 className={styles.heroTitle}>
                  🌾 किसान उन्नति
                </h1>
                <p className={styles.heroSubtitle}>
                  आपकी खेती का <span className={styles.highlight}>भरोसेमंद साथी</span>
                </p>
                
                <p className={styles.heroDescription}>
                  AI-Powered खेती की सलाह, रोग पहचान और लाइव मंडी भाव — सब कुछ एक जगह।
                </p>

                <div className={styles.heroFeatures}>
                  <div className={styles.featureItem}>
                    <span className={styles.featureIcon}>✓</span>
                    <span>तुरंत AI सलाह</span>
                  </div>
                  <div className={styles.featureItem}>
                    <span className={styles.featureIcon}>✓</span>
                    <span>रोग पहचान</span>
                  </div>
                  <div className={styles.featureItem}>
                    <span className={styles.featureIcon}>✓</span>
                    <span>लाइव मंडी भाव</span>
                  </div>
                </div>

                <div className={styles.heroCTA}>
                  <Link href="/voice-assistant" className={styles.primaryBtn}>
                    <span className={styles.btnIcon}>🎤</span>
                    बोलकर पूछें
                  </Link>
                  <Link href="/register" className={styles.secondaryBtn}>
                    <span className={styles.btnIcon}>👤</span>
                    शुरू करें
                  </Link>
                </div>
              </div>

              {/* Container 2: Demo Video */}
              <div className={styles.heroVisual}>
                <div className={styles.videoContainer}>
                  <div className={styles.videoWrapper}>
                    <div className={styles.videoPlaceholder}>
                      <div className={styles.playButton}>
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                          <circle cx="30" cy="30" r="30" fill="rgba(16, 185, 129, 0.9)" />
                          <path d="M24 18L42 30L24 42V18Z" fill="white" />
                        </svg>
                      </div>
                      <div className={styles.videoOverlay}>
                        <p className={styles.videoTitle}>देखें कैसे काम करता है</p>
                        <p className={styles.videoSubtitle}>2 मिनट का डेमो</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. All Services Section */}
          <section className={styles.servicesSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>✨ हमारी सभी सेवाएँ</h2>
              <p className={styles.sectionSubtitle}>
                किसानों के लिए विशेष रूप से डिज़ाइन की गई, पूर्णतः निःशुल्क
              </p>
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

              <Link href="/marketplace" className={`${styles.serviceCard} ${styles.communityCard}`}>
                <div className={styles.serviceIcon}>🛒</div>
                <h3 className={styles.serviceTitle}>मार्केटप्लेस</h3>
                <p className={styles.serviceDesc}>सीधे किसानों और खरीदारों को जोड़ें</p>
                <div className={styles.serviceArrow}>→</div>
              </Link>
            </div>
          </section>

          {/* 4. Nearest Shops */}
          <NearestShops />

          {/* 5. Testimonials - Kishan ka Anubav */}
          <section className={styles.testimonialsSection}>
            <Testimonials />
          </section>

          {/* 6. Social Media Handles - 3 Parallel Containers */}
          <section className={styles.socialSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>📱 हमसे जुड़ें</h2>
              <p className={styles.sectionSubtitle}>सोशल मीडिया पर हमारे साथ रहें और नई जानकारी पाएं</p>
            </div>

            <div className={styles.socialGrid}>
              {/* Facebook Post */}
              <div className={styles.socialCard}>
                <div className={styles.socialHeader}>
                  <div className={styles.socialIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className={styles.socialInfo}>
                    <h3 className={styles.socialTitle}>किसान उन्नति</h3>
                    <p className={styles.socialTime}>2 घंटे पहले</p>
                  </div>
                </div>
                <div className={styles.socialPost}>
                  <p className={styles.postContent}>
                    🌾 इस रबी सीजन में गेहूं की नई किस्म HD-3086 से 20% ज्यादा उपज! 
                    पंजाब के 500+ किसानों ने इस्तेमाल किया और शानदार परिणाम मिले। 
                    जानें कैसे आप भी बढ़ा सकते हैं अपनी फसल की पैदावार।
                  </p>
                  <div className={styles.postImage}>🌾</div>
                </div>
                <div className={styles.socialStats}>
                  <span>❤️ 1.2K</span>
                  <span>💬 89</span>
                  <span>🔄 234</span>
                </div>
                <a 
                  href="https://facebook.com/kisanunnati" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  Facebook पर देखें →
                </a>
              </div>

              {/* X (Twitter) Post */}
              <div className={styles.socialCard}>
                <div className={styles.socialHeader}>
                  <div className={styles.socialIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div className={styles.socialInfo}>
                    <h3 className={styles.socialTitle}>@KisanUnnati</h3>
                    <p className={styles.socialTime}>5 घंटे पहले</p>
                  </div>
                </div>
                <div className={styles.socialPost}>
                  <p className={styles.postContent}>
                    🚨 मौसम अलर्ट: अगले 3 दिन में उत्तर भारत के कई हिस्सों में बारिश की संभावना। 
                    किसान भाइयों से निवेदन है कि फसल की कटाई को 4-5 दिन के लिए टाल दें। 
                    #KisanUnnati #WeatherAlert #FarmingTips
                  </p>
                </div>
                <div className={styles.socialStats}>
                  <span>❤️ 892</span>
                  <span>💬 45</span>
                  <span>🔄 567</span>
                </div>
                <a 
                  href="https://x.com/kisanunnati" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  X पर देखें →
                </a>
              </div>

              {/* Blog Post */}
              <div className={styles.socialCard}>
                <div className={styles.socialHeader}>
                  <div className={styles.socialIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                  </div>
                  <div className={styles.socialInfo}>
                    <h3 className={styles.socialTitle}>किसान ब्लॉग</h3>
                    <p className={styles.socialTime}>1 दिन पहले</p>
                  </div>
                </div>
                <div className={styles.socialPost}>
                  <p className={styles.postContent}>
                    📝 "ड्रिप इरिगेशन से कैसे बचाएं 60% पानी"
                    <br /><br />
                    आधुनिक खेती में ड्रिप इरिगेशन तकनीक से न सिर्फ पानी की बचत होती है, 
                    बल्कि फसल की गुणवत्ता भी बेहतर होती है। पढ़ें पूरा लेख...
                  </p>
                </div>
                <div className={styles.socialStats}>
                  <span>👁️ 3.4K पाठक</span>
                  <span>⭐ 4.8/5</span>
                </div>
                <a 
                  href="/blog" 
                  className={styles.socialLink}
                >
                  ब्लॉग पढ़ें →
                </a>
              </div>
            </div>
          </section>
        </>
      )}
      
      {/* 7. Footer */}
      <Footer />
      <ChatbotFAB />
    </div>
  );
}