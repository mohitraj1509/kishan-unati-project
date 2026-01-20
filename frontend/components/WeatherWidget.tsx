'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    // Mock weather data - in real app, fetch from API
    setWeather({
      temperature: 28,
      condition: 'Sunny',
      humidity: 65
    })
  }, [])

  if (!weather) return <div>Loading weather...</div>

  return (
    <div className="bg-blue-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Current Weather</h3>
      <div className="flex items-center space-x-4">
        <div className="text-3xl">☀️</div>
        <div>
          <p className="text-xl font-bold">{weather.temperature}°C</p>
          <p>{weather.condition}</p>
          <p>Humidity: {weather.humidity}%</p>
        </div>
      </div>
    </div>
  )
}