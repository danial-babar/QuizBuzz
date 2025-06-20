# QuizBuzz Backend

This is the backend API for the QuizBuzz application, built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login, update details)
- Quiz management (CRUD operations)
- Quiz submission and scoring
- Leaderboard and user statistics
- Secure API with JWT authentication
- Data validation and sanitization
- Error handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```
4. Start the development server:
   ```bash
   npm run server
   ```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update password

### Quizzes

- `GET /api/v1/quiz` - Get all quizzes
- `GET /api/v1/quiz/:id` - Get single quiz
- `POST /api/v1/quiz` - Create new quiz (protected)
- `PUT /api/v1/quiz/:id` - Update quiz (protected)
- `DELETE /api/v1/quiz/:id` - Delete quiz (protected)
- `POST /api/v1/quiz/:id/submit` - Submit quiz (protected)
- `GET /api/v1/quiz/results` - Get user's quiz results (protected)
- `GET /api/v1/quiz/leaderboard` - Get leaderboard

### Users

- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/:id` - Get single user (admin)
- `POST /api/v1/users` - Create user (admin)
- `PUT /api/v1/users/:id` - Update user (admin)
- `DELETE /api/v1/users/:id` - Delete user (admin)
- `GET /api/v1/users/stats` - Get user stats (protected)
- `GET /api/v1/users/history` - Get user quiz history (protected)
- `GET /api/v1/users/achievements` - Get user achievements (protected)

## Security

- Passwords are hashed using bcryptjs
- JWT for authentication
- Data sanitization
- XSS protection
- HTTP headers security with helmet
- Rate limiting (to be implemented)
- CORS enabled

## Error Handling

All errors are returned in the following format:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT
- `JWT_EXPIRE` - JWT expiration time (e.g., 30d)
- `NODE_ENV` - Environment (development/production)

## Deployment

1. Set up a MongoDB database (MongoDB Atlas recommended for production)
2. Configure environment variables in production
3. Install PM2 for process management:
   ```bash
   npm install -g pm2
   ```
4. Start the server in production:
   ```bash
   NODE_ENV=production pm2 start server.js
   ```

## License

MIT
