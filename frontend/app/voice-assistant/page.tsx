'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Volume2, X } from 'lucide-react';
import styles from './voice.module.css';

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'bot'; text: string }>>([]);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'hi-IN';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(transcriptSegment);
          } else {
            interim += transcriptSegment;
          }
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage = text;
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setTranscript('');

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        `आपने ${userMessage} के बारे में पूछा है। इसके लिए अधिक जानकारी के लिए कृपया दुकान या विशेषज्ञ से संपर्क करें।`,
        'आपके सवाल के लिए धन्यवाद। हम आपकी मदद करने के लिए तैयार हैं।',
        `${userMessage} के बारे में जानकारी के लिए कृपया निकटतम कृषि विभाग से संपर्क करें।`
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prev => [...prev, { type: 'bot', text: randomResponse }]);
      
      // Speak response
      const utterance = new SpeechSynthesisUtterance(randomResponse);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }, 500);
  };

  const handleSend = () => {
    if (transcript.trim()) {
      handleSendMessage(transcript);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎤 वॉइस सहायक</h1>
        <p className={styles.subtitle}>आवाज़ में अपना सवाल पूछें और तुरंत जवाब पाएं</p>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <Mic size={64} color="#16a34a" />
              <p>नीचे माइक बटन दबाकर अपना सवाल पूछना शुरू करें</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.message} ${styles[msg.type]}`}
              >
                <div className={styles.messageContent}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="या यहाँ टाइप करें..."
              className={styles.textInput}
            />
            <button
              onClick={handleSend}
              className={styles.sendBtn}
              disabled={!transcript.trim()}
            >
              <Send size={20} />
            </button>
          </div>

          <div className={styles.voiceControls}>
            <button
              onClick={isListening ? stopListening : startListening}
              className={`${styles.voiceBtn} ${isListening ? styles.listening : ''}`}
            >
              <Mic size={32} />
              <span>{isListening ? 'सुन रहे हैं...' : 'माइक दबाएं'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
