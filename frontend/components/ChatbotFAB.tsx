"use client"

import React, { useState } from 'react'
import Chatbot from './Chatbot'
import styles from './ChatbotFAB.module.css'

const ChatbotFAB: React.FC = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen)
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className={styles.fabContainer}>
        <button
          className={`${styles.fab} ${isChatbotOpen ? styles.active : ''}`}
          onClick={toggleChatbot}
          aria-label="Open AI Chatbot"
        >
          <span className={styles.fabIcon}>
            {isChatbotOpen ? '✕' : '🤖'}
          </span>
        </button>

        {/* FAB Label */}
        <div className={`${styles.fabLabel} ${isChatbotOpen ? styles.hide : ''}`}>
          <span>Ask AI</span>
        </div>

        {/* Pulse Animation */}
        <div className={styles.pulseRing}></div>
      </div>

      {/* Chatbot Component */}
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </>
  )
}

export default ChatbotFAB