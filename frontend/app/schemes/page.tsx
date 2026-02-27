'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import styles from './Schemes.module.css';

interface Scheme {
  _id: string;
  name: string;
  description: string;
  category: string;
  ministry: string;
  status: string;
  benefits: {
    subsidyAmount?: {
      min: number;
      max: number;
    };
    subsidyPercentage?: {
      min: number;
      max: number;
    };
  };
  startDate: string;
  endDate?: string;
  eligibilityCriteria: {
    farmerType: string[];
    states: string[];
  };
}

const Schemes = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const categories = ['subsidy', 'insurance', 'loan', 'training', 'infrastructure', 'marketing', 'other'];
  const ministries = ['agriculture', 'rural_development', 'finance', 'commerce', 'other'];
  const statuses = ['active', 'inactive', 'expired', 'upcoming'];

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory, selectedMinistry, selectedStatus]);

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying && schemes.length > 0) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % Math.min(schemes.length, 6));
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, schemes.length]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % Math.min(schemes.length, 6));
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + Math.min(schemes.length, 6)) % Math.min(schemes.length, 6));
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedMinistry) params.append('ministry', selectedMinistry);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await fetch(`http://localhost:3001/api/schemes?${params}`);
      const data = await response.json();

      if (data.success) {
        setSchemes(data.data.schemes);
      } else {
        setError(data.message || 'Failed to fetch schemes');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = schemes.filter(scheme =>
    scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      subsidy: '💰',
      insurance: '🛡️',
      loan: '💳',
      training: '🎓',
      infrastructure: '🏗️',
      marketing: '📢',
      other: '📋'
    };
    return icons[category] || '📋';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: '#22c55e',
      inactive: '#6b7280',
      expired: '#ef4444',
      upcoming: '#f59e0b'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className={styles.container}>
      <Header />
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Government Schemes for Farmers</h1>
          <p className={styles.heroSubtitle}>
            Discover and apply for various government schemes designed to support farmers and agricultural development
          </p>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.schemeIcon}>🌾</div>
        </div>
      </section>

      {/* Banner Carousel */}
      <section className={styles.bannerSection}>
        <div
          className={styles.bannerCarousel}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={styles.bannerTrack}
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {schemes.slice(0, 6).map((scheme, index) => (
              <div key={scheme._id} className={styles.bannerSlide}>
                <div className={styles.bannerCard}>
                  <div className={styles.bannerImage}>
                    <div className={styles.bannerIcon}>{getCategoryIcon(scheme.category)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.carouselControls}>
          <button
            className={styles.carouselArrow}
            onClick={prevSlide}
          >
            ‹
          </button>
          <div className={styles.carouselDots}>
            {schemes.slice(0, 6).map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === activeSlide ? styles.activeDot : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
          <button
            className={styles.carouselArrow}
            onClick={nextSlide}
          >
            ›
          </button>
        </div>
      </section>

      {/* Search and Filters */}
      <section className={styles.filters}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search schemes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            🔍
          </button>
        </div>

        <div className={styles.filterOptions}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Ministries</option>
            {ministries.map(ministry => (
              <option key={ministry} value={ministry}>
                {ministry.replace('_', ' ').charAt(0).toUpperCase() + ministry.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Schemes Grid */}
      <section className={styles.schemesSection}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading schemes...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>❌ {error}</p>
            <button onClick={fetchSchemes} className={styles.retryButton}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className={styles.resultsHeader}>
              <h2>{filteredSchemes.length} Schemes Found</h2>
            </div>

            <div className={styles.schemesGrid}>
              {filteredSchemes.map(scheme => (
                <div key={scheme._id} className={styles.schemeCard}>
                  <div className={styles.schemeHeader}>
                    <div className={styles.schemeIcon}>
                      {getCategoryIcon(scheme.category)}
                    </div>
                    <div className={styles.schemeStatus}>
                      <span
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(scheme.status) }}
                      >
                        {scheme.status}
                      </span>
                    </div>
                  </div>

                  <div className={styles.schemeContent}>
                    <h3 className={styles.schemeTitle}>{scheme.name}</h3>
                    <p className={styles.schemeDescription}>
                      {scheme.description.length > 120
                        ? `${scheme.description.substring(0, 120)}...`
                        : scheme.description
                      }
                    </p>

                    <div className={styles.schemeMeta}>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Category:</span>
                        <span className={styles.metaValue}>
                          {scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)}
                        </span>
                      </div>
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Ministry:</span>
                        <span className={styles.metaValue}>
                          {scheme.ministry.replace('_', ' ').charAt(0).toUpperCase() + scheme.ministry.slice(1).replace('_', ' ')}
                        </span>
                      </div>
                      {scheme.benefits.subsidyAmount && (
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>Subsidy:</span>
                          <span className={styles.metaValue}>
                            ₹{scheme.benefits.subsidyAmount.min}-{scheme.benefits.subsidyAmount.max}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.schemeActions}>
                    <Link href={`/schemes/${scheme._id}`} className={styles.viewButton}>
                      View Details
                    </Link>
                    <button className={styles.applyButton}>
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredSchemes.length === 0 && (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h3>No schemes found</h3>
                <p>Try adjusting your search criteria or filters</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Schemes;