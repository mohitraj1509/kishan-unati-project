'use client';

import React, { useState, useEffect } from 'react';
import { getPricePrediction, PricePredictionResponse } from '../lib/aiPriceService';
import PricePredictionCard from './PricePredictionCard';
import RiskIndicator from './RiskIndicator';
import PriceChart from './PriceChart';
import styles from './PricePredictionModal.module.css';

interface PricePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDistrict?: string;
}

const crops = [
  'Wheat',
  'Rice',
  'Corn',
  'Cotton',
  'Sugarcane',
  'Pulses',
  'Oilseeds',
  'Potato',
];

const PricePredictionModal: React.FC<PricePredictionModalProps> = ({
  isOpen,
  onClose,
  userDistrict = 'Hisar',
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>(crops[0]);
  const [district, setDistrict] = useState<string>(userDistrict);
  const [prediction, setPrediction] = useState<PricePredictionResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && selectedCrop && district) {
      fetchPrediction();
    }
  }, [isOpen, selectedCrop, district]);

  const fetchPrediction = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPricePrediction(selectedCrop, district);
      setPrediction(data);
    } catch (err: any) {
      setError(err.message);
      // Mock data for development
      setPrediction({
        predicted_price: 2450,
        risk_level: 'Medium',
        confidence: 0.85,
        historical_avg: 2200,
        forecast_range: { min: 2200, max: 2700 },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>📈 Price Prediction</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.formGroup}>
              <label htmlFor="crop">Select Crop</label>
              <select
                id="crop"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className={styles.select}
              >
                {crops.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="district">District</label>
              <input
                id="district"
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={styles.input}
                placeholder="Enter district name"
              />
            </div>

            <button
              onClick={fetchPrediction}
              disabled={loading}
              className={styles.searchBtn}
            >
              {loading ? '⏳ Analyzing...' : '🔍 Predict Price'}
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {/* Results */}
          {prediction && (
            <div className={styles.results}>
              <div className={styles.gridRow}>
                <div className={styles.col}>
                  <PricePredictionCard
                    crop={selectedCrop}
                    district={district}
                    price={prediction.predicted_price}
                    risk={prediction.risk_level}
                    confidence={prediction.confidence}
                    historicalAvg={prediction.historical_avg}
                  />
                </div>
                <div className={styles.col}>
                  <RiskIndicator
                    risk={prediction.risk_level}
                    factors={[
                      'Market volatility: 25%',
                      'Supply variation: 18%',
                      'Seasonal demand: 12%',
                    ]}
                  />
                </div>
              </div>

              <div className={styles.chartContainer}>
                <PriceChart
                  crop={selectedCrop}
                  district={district}
                  months={12}
                  chartType="area"
                />
              </div>

              {prediction.forecast_range && (
                <div className={styles.forecastRange}>
                  <h4>Price Forecast Range</h4>
                  <div className={styles.rangeContent}>
                    <div className={styles.rangeItem}>
                      <span className={styles.rangeLabel}>Minimum</span>
                      <span className={styles.rangeValue}>
                        ₹{prediction.forecast_range.min}
                      </span>
                    </div>
                    <div className={styles.rangeBar}>
                      <div className={styles.rangeSlider}></div>
                    </div>
                    <div className={styles.rangeItem}>
                      <span className={styles.rangeLabel}>Maximum</span>
                      <span className={styles.rangeValue}>
                        ₹{prediction.forecast_range.max}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Fetching price prediction...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePredictionModal;
