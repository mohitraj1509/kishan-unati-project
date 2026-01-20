'use client'

import { useState } from 'react'

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

export default function VoiceInput() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => setIsListening(true)
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0][0].transcript
        setTranscript(result)
      }
      recognition.onend = () => setIsListening(false)

      recognition.start()
    } else {
      alert('Speech recognition not supported in this browser.')
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={startListening}
        className={`p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        disabled={isListening}
      >
        {isListening ? '🎤' : '🎙️'}
      </button>
      <span>{transcript || 'Click to speak'}</span>
    </div>
  )
}