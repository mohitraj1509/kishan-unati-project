"use client"

import React, { useState, useRef, useEffect } from 'react'
import ChatbotService, { ChatMessage } from '../lib/chatbotService'
import styles from './Chatbot.module.css'

interface ChatbotProps {
  isOpen: boolean
  onClose: () => void
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatbotService = useRef(new ChatbotService())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // Add user message
    const userMessage = chatbotService.current.addUserMessage(message)
    setMessages(chatbotService.current.getMessages())
    setInputMessage('')
    setShowSuggestions(false)
    setIsTyping(true)

    try {
      // Get bot response
      const botMessage = await chatbotService.current.sendMessage(message)
      setMessages(chatbotService.current.getMessages())
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputMessage)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) return null

  return (
    <div className={styles.chatbotOverlay}>
      <div className={styles.chatbotContainer}>
        {/* Header */}
        <div className={styles.chatbotHeader}>
          <div className={styles.headerContent}>
            <div className={styles.botAvatar}>
              <span className={styles.botIcon}>🤖</span>
            </div>
            <div className={styles.botInfo}>
              <h3>Kisan AI Assistant</h3>
              <span className={styles.botStatus}>
                <span className={styles.statusDot}></span>
                Online
              </span>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className={styles.messagesContainer}>
          {messages.length === 0 && (
            <div className={styles.welcomeMessage}>
              <div className={styles.welcomeContent}>
                <h4>👋 Welcome to Kisan Unnati!</h4>
                <p>I'm your AI farming assistant. How can I help you today?</p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${msg.isBot ? styles.botMessage : styles.userMessage}`}
            >
              <div className={styles.messageContent}>
                <div className={styles.messageText}>{msg.message}</div>
                <div className={styles.messageTime}>{formatTime(msg.timestamp)}</div>
                {msg.isBot && msg.intent && (
                  <div className={styles.intentBadge}>
                    {msg.intent.replace('_', ' ')}
                  </div>
                )}
              </div>
              {msg.isBot && (
                <div className={styles.botAvatarSmall}>
                  <span className={styles.botIconSmall}>🤖</span>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className={`${styles.message} ${styles.botMessage} ${styles.typing}`}>
              <div className={styles.messageContent}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className={styles.botAvatarSmall}>
                <span className={styles.botIconSmall}>🤖</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {showSuggestions && messages.length === 0 && (
          <div className={styles.suggestionsContainer}>
            <div className={styles.suggestionsTitle}>Try asking:</div>
            <div className={styles.suggestionsGrid}>
              {chatbotService.current.getSuggestedQuestions().map((suggestion, index) => (
                <button
                  key={index}
                  className={styles.suggestionButton}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about farming..."
              className={styles.messageInput}
              disabled={isTyping}
            />
            <button
              className={`${styles.sendButton} ${inputMessage.trim() ? styles.active : ''}`}
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isTyping}
            >
              {isTyping ? (
                <div className={styles.loadingSpinner}></div>
              ) : (
                <span className={styles.sendIcon}>📤</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbot