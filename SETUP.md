# Authentication Setup Guide

This project includes a complete authentication system with MongoDB integration.

## Prerequisites

1. **MongoDB**: You need MongoDB installed and running locally, or a MongoDB Atlas account
2. **Node.js**: Version 18 or higher

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection String
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/mock-screen

# For MongoDB Atlas (replace with your connection string):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mock-screen

# JWT Secret Key (generate a strong secret for production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Setup Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up MongoDB**:
   - **Local MongoDB**: Make sure MongoDB is running on your machine
   - **MongoDB Atlas**: Create a cluster and get your connection string

3. **Create Environment File**:
   - Copy the environment variables above to `.env.local`

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the Application**:
   - Open [http://localhost:3000](http://localhost:3000)
   - Navigate to `/signup` to create an account
   - Navigate to `/login` to sign in

## Features

- ✅ User registration with password hashing
- ✅ User login with JWT token generation
- ✅ Form validation and error handling
- ✅ Beautiful, responsive UI with Tailwind CSS
- ✅ MongoDB integration with Mongoose
- ✅ Secure password storage with bcrypt
- ✅ JWT-based authentication

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for session management
- Input validation and sanitization
- Secure password requirements (minimum 6 characters)

## Next Steps

1. Add logout functionality
2. Implement password reset
3. Add email verification
4. Create protected routes
5. Add user profile management 