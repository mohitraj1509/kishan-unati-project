'use client'

import { useState } from 'react'

export default function LanguageSelector() {
  const [language, setLanguage] = useState('en')

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
  ]

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="p-2 border rounded"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  )
}