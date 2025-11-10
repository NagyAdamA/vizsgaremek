# Users API

A RESTful API for managing users and authentication built with Node.js, Express, and MySQL/Sequelize.

## Features

- **User Management**: Create and retrieve user information
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Authorization**: Admin role-based access control
- **Error Handling**: Comprehensive error handling with custom error classes
- **Database**: MySQL database with Sequelize ORM
- **Security**: Password hashing, JWT tokens, cookie-based authentication
- **Architecture**: Layered architecture (Controllers → Services → Repositories → Models)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **ORM**: Sequelize 6.x
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Additional**: CORS, Cookie Parser

## Project Structure

```
users/
├── api/
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   └── userController.js
│   ├── db/                   # Database configuration
│   │   └── index.js
│   ├── errors/               # Custom error classes
│   │   ├── AppError.js
│   │   ├── BadRequestError.js
│   │   ├── DbError.js
│   │   ├── NotFoundError.js
│   │   ├── UnauthorizedError.js
│   │   ├── ValidationError.js
│   │   └── index.js
│   ├── middlewares/          # Express middlewares
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/               # Sequelize models
│   │   ├── User.js
│   │   ├── Order.js
│   │   └── index.js
│   ├── repositories/         # Data access layer
│   │   ├── UserRepository.js
│   │   └── index.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── services/             # Business logic layer
│   │   ├── UserService.js
│   │   └── index.js
│   └── utilities/            # Helper functions
│       └── authUtils.js
├── app.js                    # Express app configuration
├── server.js                 # Server entry point
└── package.json
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd users
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000

# Database Configuration
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_DIALECT=mysql
DB_HOST=localhost

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:8000` by default.

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/login`
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "userID": "user_identifier",
  "password": "user_password"
}
```

**Response:**
- `200 OK`: Returns JWT token
- `401 Unauthorized`: Wrong password

**Response Example:**
```json
{
  "userID": 1,
  "username": "john_doe",
  "isAdmin": false,
  "iat": 1234567890,
  "exp": 1234567890
}
```

#### GET `/api/auth/status`
Check authentication status (requires authentication).

**Headers:**
- `Cookie: user_token=<jwt_token>`

**Response:**
- `200 OK`: Returns current user data
- `401 Unauthorized`: Not authenticated

#### DELETE `/api/auth/logout`
Logout the current user.

**Response:**
- `200 OK`: Success

### User Routes (`/api/users`)

#### POST `/api/users`
Create a new user (registration).

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response:**
- `201 Created`: Returns created user data
- `400 Bad Request`: Missing or invalid data

#### GET `/api/users/:userID`
Get a specific user by ID.

**Parameters:**
- `userID`: User identifier

**Response:**
- `200 OK`: Returns user data
- `404 Not Found`: User not found
- `400 Bad Request`: Missing userID

#### GET `/api/users`
Get all users (admin only).

**Headers:**
- `Cookie: user_token=<jwt_token>`

**Response:**
- `200 OK`: Returns array of all users
- `401 Unauthorized`: Not authenticated or not admin

## User Model

```javascript
{
  ID: Integer (Primary Key, Auto Increment)
  name: String (Unique, Required)
  email: String (Unique, Required, Validated)
  password: String (Required, Hashed)
  isAdmin: Boolean (Default: false)
  registeredAt: Date (Auto-generated on creation)
}
```

## Order Model

```javascript
{
  ID: Integer (Primary Key, Auto Increment)
  product_name: String (Unique, Required)
  price: Float (Required, Validated)
  orderedAt: Date (Auto-generated on creation)
  userID: Foreign Key (References User.ID)
}
```

## Authentication Flow

1. **Login**: User submits credentials → Server validates → Returns JWT token
2. **Token Storage**: JWT token is stored in an HTTP-only cookie named `user_token`
3. **Protected Routes**: Middleware verifies token on protected routes
4. **Authorization**: Admin routes check `isAdmin` flag from decoded token

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Tokens**: Secure, stateless authentication tokens
- **Cookie-based**: Tokens stored in HTTP-only cookies
- **CORS**: Configured to allow requests from `http://localhost:3001`
- **Input Validation**: Email validation, numeric validation for prices
- **Error Handling**: Comprehensive error handling with descriptive messages

## Error Handling

The API uses custom error classes:
- `AppError`: Base error class
- `BadRequestError`: 400 - Invalid request data
- `NotFoundError`: 404 - Resource not found
- `UnauthorizedError`: 401 - Authentication/authorization failed
- `ValidationError`: 422 - Validation failed
- `DbError`: 500 - Database operation failed

## Development

The project uses nodemon for automatic server restarts during development:

```bash
npm start  # Runs with nodemon
```

## Scripts

- `npm start`: Start the development server with nodemon
- `npm test`: Run tests (currently not implemented)

## Architecture

The API follows a layered architecture pattern:

1. **Routes**: Define API endpoints and apply middlewares
2. **Controllers**: Handle HTTP requests and responses
3. **Services**: Implement business logic and validation
4. **Repositories**: Handle data access operations
5. **Models**: Define database schema and relationships
6. **Middlewares**: Process requests (auth, error handling)

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

ISC

