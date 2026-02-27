import axios from 'axios'

// Create AI Service API instance for price predictions
const aiPriceApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_PRICE_API_URL || 'http://localhost:3001/api/ai',
  timeout: 15000,
})

// Interceptors
aiPriceApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

aiPriceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('AI Price API Error:', error)
    return Promise.reject(error)
  }
)

// Types
export interface PricePredictionResponse {
  predicted_price: number
  risk_level: string
  confidence: number
  historical_avg?: number
  forecast_range?: {
    min: number
    max: number
  }
}

export interface PriceHistoryData {
  month: string
  price: number
  date?: string
}

// API Functions
export const getPricePrediction = async (
  crop: string,
  district: string,
  arrivalQuantity: number = 1000
): Promise<PricePredictionResponse> => {
  try {
    const response = await aiPriceApi.get('/predict-price', {
      params: {
        crop,
        district,
        arrival_quantity: arrivalQuantity,
      },
    })
    // Backend returns {success, data: {...}}, we need the data object
    return response.data.data || response.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch price prediction'
    )
  }
}

export const getPriceHistory = async (
  crop: string,
  district: string,
  months: number = 12
): Promise<PriceHistoryData[]> => {
  try {
    const response = await aiPriceApi.get('/price-history', {
      params: {
        crop,
        district,
        months,
      },
    })
    // Backend returns {success, data: {...}}, we need the data object
    return response.data.data || response.data
  } catch (error: any) {
    console.error('Failed to fetch price history:', error)
    // Return mock data for demo purposes
    return generateMockPriceHistory(months)
  }
}

export const getRiskAssessment = async (
  crop: string,
  district: string
): Promise<{ risk_level: string; factors: string[] }> => {
  try {
    const response = await aiPriceApi.get('/risk-assessment', {
      params: { crop, district },
    })
    // Backend returns {success, data: {...}}, we need the data object
    return response.data.data || response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch risk assessment')
  }
}

// Mock data generator for development
function generateMockPriceHistory(months: number): PriceHistoryData[] {
  const data: PriceHistoryData[] = []
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  for (let i = Math.max(0, months - 12); i < months; i++) {
    const monthIndex = i % 12
    const basePrice = 2000 + Math.random() * 500
    data.push({
      month: monthNames[monthIndex],
      price: Math.round(basePrice + (Math.random() - 0.5) * 200),
    })
  }

  return data
}

export default aiPriceApi
