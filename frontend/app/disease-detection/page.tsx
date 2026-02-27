'use client'

import React, { useState, useRef } from 'react';
import { AlertCircle, Upload, CheckCircle, X } from 'lucide-react';
import Header from '../../components/Header';
import styles from './disease.module.css';

interface DiseaseResult {
  name: string;
  severity: string;
  treatment: string;
  prevention: string;
  confidence: number;
}

export default function DiseaseDetection() {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockResults: { [key: string]: DiseaseResult } = {
    'leaf_spot': {
      name: 'पत्ती धब्बा (Leaf Spot)',
      severity: 'मध्यम',
      treatment: 'ट्राइकोडर्मा या कॉपर फंगिसाइड का उपयोग करें। 15 दिन के अंतराल पर 2-3 बार छिड़काव करें।',
      prevention: 'फसल चक्र अपनाएं, स्वस्थ बीज का उपयोग करें, पानी का छिड़काव नहीं करें।',
      confidence: 87
    },
    'powdery_mildew': {
      name: 'पाउडरी मिल्ड्यू (सफेद चूर्ण)',
      severity: 'हल्का',
      treatment: 'सल्फर पाउडर या सल्फर स्प्रे का उपयोग करें। 10 दिन के अंतराल पर छिड़काव करें।',
      prevention: 'अच्छी हवा का प्रवाह सुनिश्चित करें, भीड़ को कम करें, उचित दूरी बनाए रखें।',
      confidence: 92
    },
    'early_blight': {
      name: 'जल्दी अंगमारी (Early Blight)',
      severity: 'गंभीर',
      treatment: 'कार्बेंडाजिम 0.5% या क्लोरोथैलोनिल का छिड़काव करें। 7-10 दिन के अंतराल पर दोहराएं।',
      prevention: 'संक्रमित पत्तियों को हटाएं, फसल अवशेष को नष्ट करें, जल निकासी में सुधार करें।',
      confidence: 85
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (!imageFile && !imageUrl) {
      alert('कृपया एक तस्वीर अपलोड करें');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const diseases = Object.keys(mockResults);
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      setResult(mockResults[randomDisease]);
      setLoading(false);
    }, 2000);
  };

  const handleClear = () => {
    setImageFile(null);
    setImageUrl('');
    setPreview('');
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.header}>
        <h1 className={styles.title}>🔍 रोग पहचान</h1>
        <p className={styles.subtitle}>अपनी फसल की तस्वीर अपलोड करें और रोग की पहचान करें</p>
      </div>

      <div className={styles.content}>
        <div className={styles.uploadSection}>
          <div className={styles.uploadArea}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.fileInput}
              placeholder="तस्वीर चुनें"
              title="तस्वीर चुनें"
            />
            <div
              className={styles.uploadBox}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className={styles.preview} />
              ) : (
                <>
                  <Upload size={48} color="#16a34a" />
                  <p className={styles.uploadText}>
                    क्लिक करके तस्वीर चुनें
                  </p>
                  <p className={styles.uploadSubtext}>
                    या यहाँ ड्रैग करें
                  </p>
                </>
              )}
            </div>

            {preview && (
              <button
                onClick={handleClear}
                className={styles.clearBtn}
              >
                <X size={20} />
                तस्वीर बदलें
              </button>
            )}
          </div>

          {!preview && (
            <div className={styles.orDivider}>
              <span>या</span>
            </div>
          )}

          {!preview && (
            <div className={styles.urlSection}>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="तस्वीर का URL दर्ज करें..."
                className={styles.urlInput}
              />
            </div>
          )}
        </div>

        {preview && (
          <div className={styles.actionArea}>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={styles.analyzeBtn}
            >
              {loading ? 'विश्लेषण कर रहे हैं...' : 'रोग की पहचान करें'}
            </button>
          </div>
        )}

        {result && (
          <div className={styles.resultSection}>
            <div className={styles.resultHeader}>
              <AlertCircle size={32} color="#dc2626" />
              <h2 className={styles.diseaseName}>{result.name}</h2>
            </div>

            <div className={styles.confidenceBar}>
              <div className={styles.confidenceLabel}>
                सटीकता: {result.confidence}%
              </div>
              <div className={styles.bar}>
                <div
                  className={styles.fill}
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.severityBadge}>
              गंभीरता: <strong>{result.severity}</strong>
            </div>

            <div className={styles.details}>
              <div className={styles.detail}>
                <h3 className={styles.detailTitle}>💊 इलाज</h3>
                <p className={styles.detailText}>{result.treatment}</p>
              </div>

              <div className={styles.detail}>
                <h3 className={styles.detailTitle}>🛡️ रोकथाम</h3>
                <p className={styles.detailText}>{result.prevention}</p>
              </div>
            </div>

            <button
              onClick={handleClear}
              className={styles.checkAgainBtn}
            >
              दूसरी तस्वीर चेक करें
            </button>
          </div>
        )}

        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>कृपया प्रतीक्षा करें, आपकी तस्वीर का विश्लेषण हो रहा है...</p>
          </div>
        )}
      </div>
    </div>
  );
}
