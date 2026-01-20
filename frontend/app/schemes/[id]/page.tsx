'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './SchemeDetail.module.css';

interface Scheme {
  _id: string;
  name: string;
  description: string;
  category: string;
  ministry: string;
  status: string;
  eligibilityCriteria: {
    farmerType: string[];
    incomeLimit?: {
      min: number;
      max: number;
    };
    landSize?: {
      min: number;
      max: number;
    };
    states: string[];
    districts: string[];
    ageLimit?: {
      min: number;
      max: number;
    };
    gender: string[];
    crops: any[];
  };
  benefits: {
    subsidyAmount?: {
      min: number;
      max: number;
      unit: string;
    };
    subsidyPercentage?: {
      min: number;
      max: number;
    };
    coverage: string[];
    duration: number;
  };
  applicationProcess: {
    online: boolean;
    documents: string[];
    deadline?: string;
    applicationFee?: number;
  };
  startDate: string;
  endDate?: string;
  budget?: {
    allocated: number;
    utilized: number;
    unit: string;
  };
  contactInfo: {
    helpline: string;
    email: string;
    website?: string;
  };
  createdBy: {
    name: string;
  };
}

const SchemeDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (params.id) {
      fetchScheme();
    }
  }, [params.id]);

  const fetchScheme = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/schemes/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setScheme(data.data);
      } else {
        setError(data.message || 'Failed to fetch scheme details');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading scheme details...</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className={styles.error}>
        <h2>Scheme Not Found</h2>
        <p>{error || 'The requested scheme could not be found.'}</p>
        <Link href="/schemes" className={styles.backButton}>
          ← Back to Schemes
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/schemes" className={styles.breadcrumbLink}>
            Schemes
          </Link>
          <span className={styles.breadcrumbSeparator}>→</span>
          <span className={styles.breadcrumbCurrent}>{scheme.name}</span>
        </div>

        <div className={styles.schemeHeader}>
          <div className={styles.schemeIcon}>
            {getCategoryIcon(scheme.category)}
          </div>
          <div className={styles.schemeInfo}>
            <h1 className={styles.schemeTitle}>{scheme.name}</h1>
            <div className={styles.schemeMeta}>
              <span
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(scheme.status) }}
              >
                {scheme.status}
              </span>
              <span className={styles.category}>
                {scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)}
              </span>
              <span className={styles.ministry}>
                {scheme.ministry.replace('_', ' ').charAt(0).toUpperCase() + scheme.ministry.slice(1).replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        {[
          { id: 'overview', label: 'Overview', icon: '📋' },
          { id: 'eligibility', label: 'Eligibility', icon: '✅' },
          { id: 'benefits', label: 'Benefits', icon: '🎁' },
          { id: 'application', label: 'Application', icon: '📝' },
          { id: 'contact', label: 'Contact', icon: '📞' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.content}>
        {activeTab === 'overview' && (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h2>Description</h2>
              <p className={styles.description}>{scheme.description}</p>
            </div>

            <div className={styles.overviewGrid}>
              <div className={styles.overviewCard}>
                <h3>📅 Duration</h3>
                <p>
                  {formatDate(scheme.startDate)}
                  {scheme.endDate && ` - ${formatDate(scheme.endDate)}`}
                </p>
              </div>

              <div className={styles.overviewCard}>
                <h3>⏱️ Duration</h3>
                <p>{scheme.benefits.duration} year{scheme.benefits.duration > 1 ? 's' : ''}</p>
              </div>

              {scheme.budget && (
                <div className={styles.overviewCard}>
                  <h3>💰 Budget</h3>
                  <p>
                    {formatCurrency(scheme.budget.allocated)} {scheme.budget.unit}
                    {scheme.budget.utilized && (
                      <small> ({Math.round((scheme.budget.utilized / scheme.budget.allocated) * 100)}% utilized)</small>
                    )}
                  </p>
                </div>
              )}

              <div className={styles.overviewCard}>
                <h3>🏛️ Ministry</h3>
                <p>{scheme.ministry.replace('_', ' ').charAt(0).toUpperCase() + scheme.ministry.slice(1).replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h2>Eligibility Criteria</h2>

              <div className={styles.eligibilityGrid}>
                {scheme.eligibilityCriteria.farmerType.length > 0 && (
                  <div className={styles.eligibilityItem}>
                    <h3>👨‍🌾 Farmer Type</h3>
                    <div className={styles.tags}>
                      {scheme.eligibilityCriteria.farmerType.map(type => (
                        <span key={type} className={styles.tag}>
                          {type.charAt(0).toUpperCase() + type.slice(1)} Farmer
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {scheme.eligibilityCriteria.incomeLimit && (
                  <div className={styles.eligibilityItem}>
                    <h3>💰 Income Limit</h3>
                    <p>
                      {formatCurrency(scheme.eligibilityCriteria.incomeLimit.min)} -
                      {formatCurrency(scheme.eligibilityCriteria.incomeLimit.max)} per annum
                    </p>
                  </div>
                )}

                {scheme.eligibilityCriteria.landSize && (
                  <div className={styles.eligibilityItem}>
                    <h3>🌾 Land Size</h3>
                    <p>
                      {scheme.eligibilityCriteria.landSize.min} -
                      {scheme.eligibilityCriteria.landSize.max} acres
                    </p>
                  </div>
                )}

                {scheme.eligibilityCriteria.states.length > 0 && (
                  <div className={styles.eligibilityItem}>
                    <h3>📍 Applicable States</h3>
                    <div className={styles.tags}>
                      {scheme.eligibilityCriteria.states.map(state => (
                        <span key={state} className={styles.tag}>{state}</span>
                      ))}
                    </div>
                  </div>
                )}

                {scheme.eligibilityCriteria.ageLimit && (
                  <div className={styles.eligibilityItem}>
                    <h3>🎂 Age Limit</h3>
                    <p>
                      {scheme.eligibilityCriteria.ageLimit.min} -
                      {scheme.eligibilityCriteria.ageLimit.max} years
                    </p>
                  </div>
                )}

                {scheme.eligibilityCriteria.gender.length > 0 && (
                  <div className={styles.eligibilityItem}>
                    <h3>⚥ Gender</h3>
                    <div className={styles.tags}>
                      {scheme.eligibilityCriteria.gender.map(gender => (
                        <span key={gender} className={styles.tag}>
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h2>Scheme Benefits</h2>

              <div className={styles.benefitsGrid}>
                {scheme.benefits.subsidyAmount && (
                  <div className={styles.benefitCard}>
                    <div className={styles.benefitIcon}>💰</div>
                    <div className={styles.benefitContent}>
                      <h3>Subsidy Amount</h3>
                      <p className={styles.benefitValue}>
                        {formatCurrency(scheme.benefits.subsidyAmount.min)} -
                        {formatCurrency(scheme.benefits.subsidyAmount.max)}
                      </p>
                    </div>
                  </div>
                )}

                {scheme.benefits.subsidyPercentage && (
                  <div className={styles.benefitCard}>
                    <div className={styles.benefitIcon}>📊</div>
                    <div className={styles.benefitContent}>
                      <h3>Subsidy Percentage</h3>
                      <p className={styles.benefitValue}>
                        {scheme.benefits.subsidyPercentage.min}% -
                        {scheme.benefits.subsidyPercentage.max}%
                      </p>
                    </div>
                  </div>
                )}

                <div className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>⏱️</div>
                  <div className={styles.benefitContent}>
                    <h3>Duration</h3>
                    <p className={styles.benefitValue}>
                      {scheme.benefits.duration} year{scheme.benefits.duration > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {scheme.benefits.coverage.length > 0 && (
                  <div className={styles.benefitCard}>
                    <div className={styles.benefitIcon}>🎁</div>
                    <div className={styles.benefitContent}>
                      <h3>Coverage</h3>
                      <div className={styles.coverageList}>
                        {scheme.benefits.coverage.map(item => (
                          <span key={item} className={styles.coverageItem}>{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'application' && (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h2>Application Process</h2>

              <div className={styles.applicationInfo}>
                <div className={styles.applicationItem}>
                  <h3>📱 Application Method</h3>
                  <p>{scheme.applicationProcess.online ? 'Online Application Available' : 'Offline Application Only'}</p>
                </div>

                {scheme.applicationProcess.deadline && (
                  <div className={styles.applicationItem}>
                    <h3>📅 Application Deadline</h3>
                    <p>{formatDate(scheme.applicationProcess.deadline)}</p>
                  </div>
                )}

                {scheme.applicationProcess.applicationFee && (
                  <div className={styles.applicationItem}>
                    <h3>💳 Application Fee</h3>
                    <p>{formatCurrency(scheme.applicationProcess.applicationFee)}</p>
                  </div>
                )}

                {scheme.applicationProcess.documents.length > 0 && (
                  <div className={styles.applicationItem}>
                    <h3>📄 Required Documents</h3>
                    <ul className={styles.documentsList}>
                      {scheme.applicationProcess.documents.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className={styles.tabContent}>
            <div className={styles.section}>
              <h2>Contact Information</h2>

              <div className={styles.contactGrid}>
                <div className={styles.contactCard}>
                  <div className={styles.contactIcon}>📞</div>
                  <div className={styles.contactContent}>
                    <h3>Helpline</h3>
                    <p>{scheme.contactInfo.helpline}</p>
                  </div>
                </div>

                <div className={styles.contactCard}>
                  <div className={styles.contactIcon}>📧</div>
                  <div className={styles.contactContent}>
                    <h3>Email</h3>
                    <p>{scheme.contactInfo.email}</p>
                  </div>
                </div>

                {scheme.contactInfo.website && (
                  <div className={styles.contactCard}>
                    <div className={styles.contactIcon}>🌐</div>
                    <div className={styles.contactContent}>
                      <h3>Website</h3>
                      <a href={scheme.contactInfo.website} target="_blank" rel="noopener noreferrer">
                        {scheme.contactInfo.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button className={styles.applyButton}>
          🚀 Apply for this Scheme
        </button>
        <button className={styles.shareButton}>
          📤 Share Scheme
        </button>
        <button className={styles.saveButton}>
          💾 Save for Later
        </button>
      </div>
    </div>
  );
};

export default SchemeDetail;