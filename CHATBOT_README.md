# AI Chatbot Integration

## Overview

The Kisan Unnati platform now features a modern, fully-functional AI chatbot that provides intelligent agricultural assistance to farmers. The chatbot is powered by the AI services backend and offers a seamless user experience with modern UX/UI design.

## Features

### 🤖 Intelligent Conversations
- **Natural Language Processing**: Understands farmer queries in multiple languages
- **Context Awareness**: Maintains conversation context for better responses
- **Intent Classification**: Automatically categorizes queries (crop advice, disease detection, market info, etc.)
- **Smart Suggestions**: Provides relevant follow-up questions and actions

### 🎨 Modern UI/UX
- **Floating Action Button**: Easy access from any page
- **Responsive Design**: Works perfectly on desktop and mobile
- **Real-time Typing Indicators**: Shows when AI is processing responses
- **Message History**: Persistent conversation during session
- **Smooth Animations**: Modern transitions and micro-interactions

### 🔗 Full AI Services Integration
- **Crop Recommendations**: Get personalized crop suggestions
- **Disease Detection**: Help with plant disease identification
- **Weather Insights**: Agricultural weather advice
- **Market Information**: Price trends and market insights
- **Government Schemes**: Information about farmer welfare programs

## Technical Implementation

### Frontend Components

#### `ChatbotFAB.tsx`
- Floating action button with pulse animation
- Toggle functionality for opening/closing chatbot
- Responsive design for mobile devices

#### `Chatbot.tsx`
- Main chatbot interface component
- Message rendering with different styles for user/bot
- Typing indicators and loading states
- Suggested questions for new users

#### `ChatbotService.ts`
- Service layer for API communication
- Message management and state handling
- Error handling with fallback responses

### API Integration

The chatbot connects to the AI services backend at `http://localhost:8000`:

```typescript
// Environment configuration
NEXT_PUBLIC_AI_API_URL=http://localhost:8000

// API call example
const response = await aiApi.post('/chat', {
  message: userMessage,
  context: conversationContext,
  user_id: sessionId
});
```

### Message Flow

1. **User Input**: Farmer types a question or selects a suggestion
2. **Preprocessing**: Input is validated and formatted
3. **API Call**: Message sent to AI services backend
4. **Processing**: Backend processes with NLP and intent classification
5. **Response**: AI generates contextual response
6. **Display**: Response shown with typing animation

## Usage Examples

### Crop Recommendations
```
User: "What crops should I grow in sandy soil?"
Bot: "For sandy soil, I recommend drought-resistant crops like millet, groundnut, or sweet potato. These crops have better water retention and are suitable for your soil type."
```

### Disease Detection
```
User: "My wheat plants have yellow spots on leaves"
Bot: "This sounds like wheat rust disease. I recommend applying fungicide immediately and ensuring proper air circulation between plants."
```

### Weather Queries
```
User: "Will it rain tomorrow?"
Bot: "According to weather data, there's a 70% chance of moderate rainfall tomorrow. I suggest delaying irrigation and preparing for wet conditions."
```

## Setup Instructions

### 1. Environment Variables
Add to `.env.local`:
```env
NEXT_PUBLIC_AI_API_URL=http://localhost:8000
```

### 2. Start AI Services
```bash
cd ai-services
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python api.py
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Access Chatbot
- Visit the home page
- Click the green floating "🤖 Ask AI" button
- Start chatting!

## Customization

### Styling
The chatbot uses CSS modules for styling. Key files:
- `Chatbot.module.css`: Main chatbot styles
- `ChatbotFAB.module.css`: Floating button styles

### Behavior
Modify `ChatbotService.ts` to:
- Change API endpoints
- Add new message types
- Customize fallback responses
- Implement user authentication

### Suggestions
Update `getSuggestedQuestions()` in `ChatbotService.ts` to add domain-specific questions.

## Error Handling

The chatbot includes comprehensive error handling:
- **Network Errors**: Graceful fallback with user-friendly messages
- **API Timeouts**: Automatic retry with loading indicators
- **Invalid Responses**: Default responses when AI services are unavailable
- **Session Management**: Automatic session ID generation for conversation continuity

## Future Enhancements

- **Voice Input**: Speech-to-text integration
- **Multi-language Support**: Expand beyond Hindi/English
- **File Uploads**: Image sharing for disease detection
- **Offline Mode**: Cached responses for poor connectivity
- **Analytics**: Conversation insights and usage metrics

## Troubleshooting

### Common Issues

1. **Chatbot not responding**
   - Check if AI services are running on port 8000
   - Verify environment variables are set correctly
   - Check browser console for network errors

2. **Styling issues**
   - Ensure CSS modules are properly imported
   - Check for CSS conflicts with existing styles
   - Verify responsive breakpoints

3. **API connection errors**
   - Confirm CORS settings in AI services
   - Check network connectivity
   - Validate API endpoint URLs

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

This will show detailed API call logs in the browser console.