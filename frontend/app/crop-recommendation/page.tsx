'use client'

import React, { useState } from 'react';
import { Leaf, ArrowRight, CheckCircle } from 'lucide-react';
import styles from './crops.module.css';

interface CropSuggestion {
  name: string;
  season: string;
  waterNeeded: string;
  minTemp: number;
  maxTemp: number;
  yield: string;
  description: string;
}

export default function CropRecommendation() {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [soilType, setSoilType] = useState('');
  const [suggestions, setSuggestions] = useState<CropSuggestion[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const stateDistricts: { [key: string]: string[] } = {
    'महाराष्ट्र': ['नागपुर', 'पुणे', 'मुंबई', 'औरंगाबाद'],
    'कर्नाटक': ['बेंगलुरु', 'कोलार', 'कोप्पल'],
    'उत्तर प्रदेश': ['आगरा', 'लखनऊ', 'कानपुर', 'वाराणसी'],
    'पंजाब': ['अमृतसर', 'लुधियाना', 'जालंधर'],
    'हरियाणा': ['करनाल', 'हिसार', 'रोहतक']
  };

  const cropData: { [key: string]: CropSuggestion[] } = {
    'काली मिट्टी': [
      {
        name: 'कपास',
        season: 'गर्मी',
        waterNeeded: 'मध्यम',
        minTemp: 20,
        maxTemp: 35,
        yield: '15-20 क्विंटल/हेक्टेयर',
        description: 'काली मिट्टी में कपास की खेती अत्यंत उपयुक्त है'
      },
      {
        name: 'ज्वार',
        season: 'मानसून',
        waterNeeded: 'कम',
        minTemp: 22,
        maxTemp: 35,
        yield: '10-15 क्विंटल/हेक्टेयर',
        description: 'सूखा सहन करने वाली फसल'
      },
      {
        name: 'मूंगफली',
        season: 'गर्मी',
        waterNeeded: 'कम से मध्यम',
        minTemp: 20,
        maxTemp: 30,
        yield: '12-18 क्विंटल/हेक्टेयर',
        description: 'तेल के लिए महत्वपूर्ण फसल'
      }
    ],
    'दोमट': [
      {
        name: 'गेहूँ',
        season: 'सर्दी',
        waterNeeded: 'मध्यम',
        minTemp: 10,
        maxTemp: 25,
        yield: '40-50 क्विंटल/हेक्टेयर',
        description: 'दोमट मिट्टी में गेहूँ अधिक उपज देता है'
      },
      {
        name: 'सोयाबीन',
        season: 'मानसून',
        waterNeeded: 'मध्यम',
        minTemp: 20,
        maxTemp: 30,
        yield: '20-25 क्विंटल/हेक्टेयर',
        description: 'प्रोटीन से भरपूर फसल'
      },
      {
        name: 'चना',
        season: 'सर्दी',
        waterNeeded: 'कम',
        minTemp: 15,
        maxTemp: 25,
        yield: '15-20 क्विंटल/हेक्टेयर',
        description: 'दलहन की महत्वपूर्ण फसल'
      }
    ],
    'बलुई': [
      {
        name: 'मूंग',
        season: 'गर्मी',
        waterNeeded: 'कम',
        minTemp: 25,
        maxTemp: 35,
        yield: '8-12 क्विंटल/हेक्टेयर',
        description: 'सूखा सहन करने वाली दलहन'
      },
      {
        name: 'तरबूज',
        season: 'गर्मी',
        waterNeeded: 'मध्यम',
        minTemp: 20,
        maxTemp: 35,
        yield: '200-300 क्विंटल/हेक्टेयर',
        description: 'गर्मी के लिए उत्तम फल'
      }
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state && soilType) {
      setSuggestions(cropData[soilType] || []);
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setState('');
    setDistrict('');
    setSoilType('');
    setSuggestions([]);
    setSubmitted(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🌾 फसल सुझाव</h1>
        <p className={styles.subtitle}>अपनी जमीन के अनुसार सही फसल चुनें</p>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>अपना राज्य चुनें *</label>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setDistrict('');
              }}
              className={styles.select}
              aria-label="अपना राज्य चुनें"
              required
            >
              <option value="">- चुनें -</option>
              {Object.keys(stateDistricts).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>जिला चुनें</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={styles.select}
              aria-label="जिला चुनें"
              disabled={!state}
            >
              <option value="">- चुनें -</option>
              {state && stateDistricts[state]?.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>मिट्टी का प्रकार *</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className={styles.select}
              aria-label="मिट्टी का प्रकार"
              required
            >
              <option value="">- चुनें -</option>
              <option value="काली मिट्टी">काली मिट्टी</option>
              <option value="दोमट">दोमट</option>
              <option value="बलुई">बलुई</option>
              <option value="दोमट रेतीली">दोमट रेतीली</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitBtn}>
              <Leaf size={20} />
              सुझाव पाएं
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetBtn}
            >
              रीसेट करें
            </button>
          </div>
        </form>

        {submitted && suggestions.length > 0 && (
          <div className={styles.resultsSection}>
            <h2 className={styles.resultsTitle}>
              आपके लिए सुझाई गई फसलें
            </h2>

            <div className={styles.cropsGrid}>
              {suggestions.map((crop, idx) => (
                <div key={idx} className={styles.cropCard}>
                  <div className={styles.cropHeader}>
                    <h3 className={styles.cropName}>{crop.name}</h3>
                    <span className={styles.season}>{crop.season}</span>
                  </div>

                  <p className={styles.description}>{crop.description}</p>

                  <div className={styles.details}>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>मौसम</span>
                      <span className={styles.value}>{crop.season}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>पानी की जरूरत</span>
                      <span className={styles.value}>{crop.waterNeeded}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>तापमान</span>
                      <span className={styles.value}>{crop.minTemp}°C - {crop.maxTemp}°C</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.label}>उपज</span>
                      <span className={styles.value}>{crop.yield}</span>
                    </div>
                  </div>

                  <div className={styles.action}>
                    <CheckCircle size={20} color="#16a34a" />
                    <span>यह फसल आपके लिए उपयुक्त है</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {submitted && suggestions.length === 0 && (
          <div className={styles.noResults}>
            <p>इस मिट्टी के लिए सुझाव उपलब्ध नहीं हैं</p>
          </div>
        )}
      </div>
    </div>
  );
}
