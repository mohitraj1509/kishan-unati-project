# Kisan Unnati Backend

A comprehensive REST API backend for the Kisan Unnati agricultural platform, built with Node.js, Express, and MongoDB.

## Features

- **User Management**: Registration, authentication, and role-based access control
- **Crop Management**: Comprehensive crop database with growing conditions and economics
- **Marketplace**: Product listing, ordering, and payment processing
- **Weather Services**: Real-time weather data and agricultural insights
- **AI Integration**: OpenAI-powered crop advice and image analysis
- **Notification System**: SMS, email, and push notifications
- **Government Schemes**: Scheme information and eligibility checking
- **Admin Dashboard**: Analytics and system management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston
- **AI**: OpenAI API
- **Payments**: Stripe
- **Caching**: Redis (optional)
- **File Upload**: Multer

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis (optional, for caching)

### Installation

1. Clone the repository and navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration values

5. Start MongoDB service

6. Run the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Crop Management

- `GET /api/crops` - Get all crops
- `GET /api/crops/:id` - Get crop by ID
- `POST /api/crops` - Create new crop (Admin)
- `PUT /api/crops/:id` - Update crop (Admin)
- `DELETE /api/crops/:id` - Delete crop (Admin)
- `POST /api/crops/recommendations` - Get crop recommendations

### Marketplace

- `GET /api/marketplace/products` - Get all products
- `POST /api/marketplace/products` - Create product
- `GET /api/marketplace/orders` - Get user orders
- `POST /api/marketplace/orders` - Create order

### Weather Services

- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast
- `GET /api/weather/alerts` - Get weather alerts

### AI Services

- `POST /api/ai/crop-advice` - Get AI crop advice
- `POST /api/ai/analyze-image` - Analyze crop image
- `POST /api/ai/chat` - AI chat response

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server startup
│   ├── config/             # Configuration files
│   │   ├── db.js          # Database connection
│   │   ├── env.js         # Environment validation
│   │   └── redis.js       # Redis connection
│   ├── routes/            # API route handlers
│   ├── controllers/       # Business logic
│   ├── models/           # MongoDB schemas
│   ├── services/         # External service integrations
│   ├── middlewares/      # Custom middleware
│   └── utils/            # Utility functions
├── logs/                 # Application logs
├── .env.example         # Environment template
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Environment Variables

See `.env.example` for all required environment variables.

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Validation

Request data is validated using Joi schemas. Invalid requests return detailed validation errors.

## Logging

Application logs are stored in the `logs/` directory:
- `error.log` - Error messages only
- `all.log` - All log levels

## Testing

Run tests with:
```bash
npm test
```

## Deployment

1. Set `NODE_ENV=production` in environment
2. Ensure all required environment variables are set
3. Run `npm start` to start the production server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.