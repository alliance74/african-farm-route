# AgriMove Backend API

A comprehensive backend API for the AgriMove platform - connecting farmers to reliable transport solutions.

## Features

- **User Management**: Registration, authentication, and profile management for farmers and drivers
- **Vehicle Management**: Vehicle registration, listing, and availability tracking
- **Booking System**: Create, manage, and track transport bookings
- **Rating System**: Rate and review completed bookings
- **Notifications**: Email and SMS notifications for booking updates
- **Real-time Updates**: Status tracking and live updates
- **Security**: JWT authentication, rate limiting, and data validation

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens
- **Validation**: express-validator
- **Security**: Helmet, CORS, rate limiting
- **Notifications**: Nodemailer (email), Twilio (SMS)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd agrimove-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
   - Supabase credentials
   - JWT secret
   - Email service credentials (optional)
   - SMS service credentials (optional)

5. Run database migrations:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the migration files in order from `supabase/migrations/`

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

#### Vehicles
- `GET /vehicles/available` - Get available vehicles
- `GET /vehicles/:id` - Get vehicle by ID
- `POST /vehicles/register` - Register a new vehicle (drivers only)
- `GET /vehicles/my/vehicles` - Get driver's vehicles
- `PUT /vehicles/:id` - Update vehicle
- `DELETE /vehicles/:id` - Delete vehicle

#### Bookings
- `POST /bookings` - Create a new booking (farmers only)
- `GET /bookings/my` - Get user's bookings
- `GET /bookings/:id` - Get booking by ID
- `GET /bookings/available/list` - Get available bookings (drivers only)
- `PUT /bookings/:id/status` - Update booking status
- `PUT /bookings/:id/cancel` - Cancel booking
- `PUT /bookings/:id/assign` - Assign driver to booking (admin only)

### Request/Response Examples

#### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "+254700000000",
  "email": "john@example.com",
  "password": "securepassword",
  "user_type": "farmer"
}
```

#### Create Booking
```bash
POST /api/v1/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickup_location": "Nakuru Farm",
  "delivery_location": "Nairobi Market",
  "goods_type": "Vegetables",
  "goods_weight": 500,
  "scheduled_date": "2024-01-20",
  "scheduled_time": "08:00",
  "special_instructions": "Handle with care"
}
```

## Database Schema

### Users Table
- Stores farmer, driver, and admin information
- Includes authentication data and profile information
- Driver-specific fields: rating, total_trips, earnings, availability

### Vehicles Table
- Vehicle registration and specifications
- Linked to driver accounts
- Includes capacity, rates, and availability status

### Bookings Table
- Transport booking requests and assignments
- Status tracking from pending to delivered
- Price calculation and distance tracking

### Booking Ratings Table
- Rating and review system for completed bookings
- Automatically updates driver ratings

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse and spam
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Controlled cross-origin access
- **Helmet Security**: Additional security headers

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Code Structure
```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
└── server.ts        # Main server file
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables

3. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.