"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './CropRecommendation.module.css';

interface FormData {
  soilType: string;
  location: string;
  season: string;
  budget: string;
  landSize: string;
}

interface RecommendationResult {
  primary: {
    crop: string;
    confidence: number;
    reason: string;
    yield: string;
    profit: string;
    waterRequirement: string;
    growthPeriod: string;
  };
  alternatives: Array<{
    crop: string;
    confidence: number;
    reason: string;
    yield: string;
    profit: string;
  }>;
  factors: {
    soilSuitability: number;
    weatherSuitability: number;
    marketDemand: number;
    profitability: number;
  };
}

const CropRecommendation = () => {
  const [formData, setFormData] = useState<FormData>({
    soilType: '',
    location: '',
    season: '',
    budget: '',
    landSize: ''
  });

  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Mock API call - replace with actual API
    setTimeout(() => {
      setRecommendations({
        primary: {
          crop: 'Wheat',
          confidence: 92,
          reason: 'Based on your soil type and current season',
          yield: '4.5-5.5 tons/acre',
          profit: '₹45,000-55,000/acre',
          waterRequirement: 'Medium',
          growthPeriod: '120-150 days'
        },
        alternatives: [
          {
            crop: 'Rice',
            confidence: 78,
            reason: 'Good alternative for water availability',
            yield: '5.0-6.0 tons/acre',
            profit: '₹50,000-60,000/acre'
          },
          {
            crop: 'Cotton',
            confidence: 65,
            reason: 'Quick growing crop with good market demand',
            yield: '2.5-3.5 tons/acre',
            profit: '₹40,000-50,000/acre'
          },
          {
            crop: 'Maize',
            confidence: 65,
            reason: 'Quick growing crop with good market demand',
            yield: '3.5-4.5 tons/acre',
            profit: '₹35,000-45,000/acre'
          }
        ],
        factors: {
          soilSuitability: 88,
          weatherSuitability: 92,
          marketDemand: 85,
          profitability: 90
        }
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          ← Back to Dashboard
        </Link>
        <h1 className={styles.title}>AI Crop Recommendation</h1>
        <p className={styles.subtitle}>
          Get personalized crop suggestions based on your farm conditions
        </p>
      </div>

      <div className={styles.content}>
        {/* Input Form */}
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <h2>Farm Information</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="soilType">Soil Type</label>
                  <select
                    id="soilType"
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select soil type</option>
                    <option value="alluvial">Alluvial Soil</option>
                    <option value="black">Black Soil</option>
                    <option value="red">Red Soil</option>
                    <option value="laterite">Laterite Soil</option>
                    <option value="sandy">Sandy Soil</option>
                    <option value="clay">Clay Soil</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter your district/city"
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="season">Growing Season</label>
                  <select
                    id="season"
                    name="season"
                    value={formData.season}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select season</option>
                    <option value="kharif">Kharif (Monsoon)</option>
                    <option value="rabi">Rabi (Winter)</option>
                    <option value="zaid">Zaid (Summer)</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="budget">Budget per Acre (₹)</label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="50000"
                    min="1000"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="landSize">Land Size (Acres)</label>
                  <input
                    type="number"
                    id="landSize"
                    name="landSize"
                    value={formData.landSize}
                    onChange={handleInputChange}
                    placeholder="5"
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className={styles.spinner}></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    🤖 Get AI Recommendations
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results */}
        {recommendations && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsCard}>
              <h2>🌾 Recommended Crops</h2>

              {/* Primary Recommendation */}
              <div className={styles.primaryRecommendation}>
                <div className={styles.recommendationHeader}>
                  <h3>🏆 Best Choice: {recommendations.primary.crop}</h3>
                  <div className={styles.confidence}>
                    <span className={styles.confidenceScore}>
                      {recommendations.primary.confidence}%
                    </span>
                    <span className={styles.confidenceLabel}>Confidence</span>
                  </div>
                </div>
                <p className={styles.reason}>{recommendations.primary.reason}</p>
                <div className={styles.metrics}>
                  <div className={styles.metric}>
                    <span className={styles.metricIcon}>📊</span>
                    <div>
                      <div className={styles.metricValue}>{recommendations.primary.yield}</div>
                      <div className={styles.metricLabel}>Expected Yield</div>
                    </div>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricIcon}>💰</span>
                    <div>
                      <div className={styles.metricValue}>{recommendations.primary.profit}</div>
                      <div className={styles.metricLabel}>Potential Profit</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alternative Recommendations */}
              <div className={styles.alternatives}>
                <h3>Alternative Options</h3>
                <div className={styles.alternativesGrid}>
                  {recommendations.alternatives.map((crop, index) => (
                    <div key={index} className={styles.alternativeCard}>
                      <div className={styles.alternativeHeader}>
                        <h4>{crop.crop}</h4>
                        <span className={styles.altConfidence}>
                          {crop.confidence}%
                        </span>
                      </div>
                      <p className={styles.altReason}>{crop.reason}</p>
                      <div className={styles.altMetrics}>
                        <div className={styles.altMetric}>
                          <span>Yield: {crop.yield}</span>
                        </div>
                        <div className={styles.altMetric}>
                          <span>Profit: {crop.profit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actions}>
                <button className={styles.primaryAction}>
                  📋 Save Recommendation
                </button>
                <button className={styles.secondaryAction}>
                  📊 View Detailed Report
                </button>
                <button className={styles.secondaryAction}>
                  📞 Consult Expert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;