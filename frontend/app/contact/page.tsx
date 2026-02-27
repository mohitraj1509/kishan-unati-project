'use client'

import React, { useState } from 'react';
import Header from '../../components/Header';
import styles from './contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    }, 500);
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.content}>
        <h1 className={styles.title}>📞 संपर्क करें</h1>
        <p className={styles.subtitle}>हम आपकी मदद के लिए हमेशा तैयार हैं</p>

        <div className={styles.layout}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>📱</div>
              <h3>हेल्पलाइन नंबर</h3>
              <p className={styles.infoValue}>1800-123-4567</p>
              <p className={styles.infoTime}>सुबह 9 बजे - शाम 6 बजे (सोमवार-शनिवार)</p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>✉️</div>
              <h3>ईमेल पता</h3>
              <p className={styles.infoValue}>support@kisanunnati.com</p>
              <p className={styles.infoTime}>24 घंटे में जवाब मिलेगा</p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>💬</div>
              <h3>WhatsApp</h3>
              <p className={styles.infoValue}>+91 98765-43210</p>
              <p className={styles.infoTime}>तुरंत जवाब पाएं</p>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>📍</div>
              <h3>पता</h3>
              <p className={styles.infoValue}>किसान भवन, कृषि नगर</p>
              <p className={styles.infoTime}>नई दिल्ली - 110001</p>
            </div>

            <div className={styles.socialLinks}>
              <h3>सोशल मीडिया</h3>
              <div className={styles.socialIcons}>
                <a href="#" className={styles.socialIcon}>📘 Facebook</a>
                <a href="#" className={styles.socialIcon}>📸 Instagram</a>
                <a href="#" className={styles.socialIcon}>🐦 Twitter</a>
                <a href="#" className={styles.socialIcon}>📹 YouTube</a>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            {submitted ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✅</div>
                <h3>धन्यवाद!</h3>
                <p>आपका संदेश प्राप्त हो गया है। हम जल्द ही आपसे संपर्क करेंगे।</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className={styles.newMessageBtn}
                >
                  नया संदेश भेजें
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.formTitle}>हमें संदेश भेजें</h2>

                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>नाम *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="अपना नाम लिखें"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>मोबाइल नंबर *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={styles.input}
                      placeholder="10 अंकों का नंबर"
                      pattern="[0-9]{10}"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>ईमेल (वैकल्पिक)</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="आपका ईमेल"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>विषय *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={styles.select}
                  >
                    <option value="">विषय चुनें</option>
                    <option value="registration">पंजीकरण की समस्या</option>
                    <option value="marketplace">मंडी से जुड़ा सवाल</option>
                    <option value="schemes">योजना की जानकारी</option>
                    <option value="payment">भुगतान की समस्या</option>
                    <option value="technical">तकनीकी समस्या</option>
                    <option value="other">अन्य</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>संदेश *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={styles.textarea}
                    placeholder="अपना संदेश विस्तार से लिखें..."
                    rows={6}
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  संदेश भेजें →
                </button>

                <p className={styles.formNote}>
                  * आवश्यक फील्ड
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
