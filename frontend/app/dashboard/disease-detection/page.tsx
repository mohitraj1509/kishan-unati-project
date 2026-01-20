"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import styles from './DiseaseDetection.module.css';

interface DiseaseResult {
  disease: string;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
  description: string;
  treatment: string[];
  prevention: string[];
  similarCases: Array<{
    location: string;
    date: string;
    outcome: string;
  }>;
}

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<DiseaseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageSelect(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);

    // Mock analysis - replace with actual API call
    setTimeout(() => {
      setResults({
        disease: 'Leaf Blight',
        severity: 'Medium' as const,
        confidence: 87,
        description: 'Leaf blight is a fungal disease that causes brown spots on leaves, potentially reducing crop yield by 20-30%.',
        treatment: [
          'Remove and destroy infected leaves immediately',
          'Apply copper-based fungicide every 7-10 days',
          'Ensure proper air circulation between plants',
          'Avoid overhead watering to reduce humidity'
        ],
        prevention: [
          'Plant disease-resistant varieties',
          'Practice crop rotation',
          'Maintain proper spacing between plants',
          'Apply preventive fungicide sprays'
        ],
        similarCases: [
          { location: 'Nearby Farm A', date: '2 weeks ago', outcome: 'Treated successfully' },
          { location: 'District B', date: '1 month ago', outcome: 'Partial recovery' },
          { location: 'Village C', date: '3 weeks ago', outcome: 'Under treatment' }
        ]
      });
      setLoading(false);
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setPreview(null);
    setResults(null);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          ← Back to Dashboard
        </Link>
        <h1 className={styles.title}>AI Disease Detection</h1>
        <p className={styles.subtitle}>
          Upload a photo of your crop to detect diseases instantly
        </p>
      </div>

      <div className={styles.content}>
        {/* Upload Section */}
        {!results && (
          <div className={styles.uploadSection}>
            <div className={styles.uploadCard}>
              <div className={styles.uploadHeader}>
                <h2>📷 Upload Plant Image</h2>
                <p>Take a clear photo of the affected plant leaves or fruits</p>
              </div>

              <div
                className={`${styles.uploadArea} ${dragActive ? styles.dragActive : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />

                {preview ? (
                  <div className={styles.previewContainer}>
                    <img src={preview} alt="Plant preview" className={styles.preview} />
                    <div className={styles.previewOverlay}>
                      <button
                        className={styles.changeButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        📷 Change Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <div className={styles.uploadIcon}>📷</div>
                    <div className={styles.uploadText}>
                      <p>Click to upload or drag and drop</p>
                      <p className={styles.uploadHint}>PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedImage && !loading && (
                <div className={styles.actionButtons}>
                  <button
                    className={styles.analyzeButton}
                    onClick={handleAnalyze}
                  >
                    🔍 Analyze Disease
                  </button>
                  <button
                    className={styles.resetButton}
                    onClick={resetAnalysis}
                  >
                    🔄 Reset
                  </button>
                </div>
              )}

              {loading && (
                <div className={styles.loadingState}>
                  <div className={styles.spinner}></div>
                  <p>Analyzing your plant image...</p>
                  <p className={styles.loadingHint}>This may take a few seconds</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className={styles.resultsSection}>
            <div className={styles.resultsCard}>
              {/* Header */}
              <div className={styles.resultsHeader}>
                <h2>🔬 Analysis Results</h2>
                <button className={styles.newAnalysisButton} onClick={resetAnalysis}>
                  📷 New Analysis
                </button>
              </div>

              {/* Disease Info */}
              <div className={styles.diseaseInfo}>
                <div className={styles.diseaseMain}>
                  <div className={styles.diseaseName}>
                    <h3>{results.disease}</h3>
                    <div className={`${styles.severity} ${styles[results.severity.toLowerCase()]}`}>
                      {results.severity} Risk
                    </div>
                  </div>
                  <div className={styles.confidence}>
                    <div className={styles.confidenceScore}>
                      {results.confidence}%
                    </div>
                    <div className={styles.confidenceLabel}>Confidence</div>
                  </div>
                </div>
                <p className={styles.description}>{results.description}</p>
              </div>

              {/* Treatment */}
              <div className={styles.treatmentSection}>
                <h3>💊 Recommended Treatment</h3>
                <div className={styles.treatmentList}>
                  {results.treatment.map((step, index) => (
                    <div key={index} className={styles.treatmentStep}>
                      <span className={styles.stepNumber}>{index + 1}</span>
                      <span className={styles.stepText}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prevention */}
              <div className={styles.preventionSection}>
                <h3>🛡️ Prevention Tips</h3>
                <div className={styles.preventionGrid}>
                  {results.prevention.map((tip, index) => (
                    <div key={index} className={styles.preventionTip}>
                      <span className={styles.tipIcon}>💡</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Cases */}
              <div className={styles.similarSection}>
                <h3>📊 Similar Cases Detected</h3>
                <div className={styles.similarList}>
                  {results.similarCases.map((case_, index) => (
                    <div key={index} className={styles.similarItem}>
                      <span className={styles.similarDisease}>{case_.location}</span>
                      <span className={styles.similarConfidence}>{case_.outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className={styles.resultsActions}>
                <button className={styles.primaryAction}>
                  📋 Save Report
                </button>
                <button className={styles.secondaryAction}>
                  📞 Consult Expert
                </button>
                <button className={styles.secondaryAction}>
                  📧 Share Results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetection;