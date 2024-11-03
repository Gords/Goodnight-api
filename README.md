# Goodnight API

A REST API for tracking sleep patterns and following friends' sleep records.

## Setup & Installation

### Prerequisites
- Node.js 
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)

### Running with Docker (Recommended)
1. Clone the repository
```bash
git clone https://github.com/Gords/Goodnight-api
cd Goodnight-api
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory, for example:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=goodnight_dev
DB_PORT=5432
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=development
```

4. Start the application using Docker Compose
```bash
docker-compose up --build
```

5. Run migrations and seed data
```bash
npm run migrate
npm run seed
```

## Testing the API

### Demo Users
The seed data creates three users:
- username: `alice`, password: `password123`
- username: `bob`, password: `password123`
- username: `charlie`, password: `password123`

### API Endpoints

#### Authentication
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "password123"}'
```

#### Sleep Operations
```bash
# Clock In (Start Sleep Session)
curl -X POST http://localhost:3000/api/sleep/clock-in \
  -H "Authorization: Bearer YOUR_TOKEN"

# Clock Out (End Sleep Session)
curl -X POST http://localhost:3000/api/sleep/clock-out \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get Sleep Records
curl http://localhost:3000/api/sleep/records \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Follow Operations
```bash
# Follow a User (replace USER_ID)
curl -X POST http://localhost:3000/api/follows/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Unfollow a User (replace USER_ID)
curl -X DELETE http://localhost:3000/api/follows/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get Friends' Sleep Records
curl http://localhost:3000/api/follows/sleep-records \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### User Operations
```bash
# Get User Profile (includes following/followers)
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example Responses

#### Successful Login
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### User Profile
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "username": "alice",
    "createdAt": "2024-02-10T08:00:00.000Z",
    "following": [
      {
        "id": 2,
        "username": "bob"
      }
    ],
    "followers": [
      {
        "id": 3,
        "username": "charlie"
      }
    ]
  }
}
```

#### Sleep Record
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "userId": 1,
    "clockIn": "2024-02-10T08:00:00.000Z",
    "clockOut": "2024-02-10T16:00:00.000Z",
    "duration": "8:00:00",
    "durationFormatted": "8h 0m"
  }
}
```

#### Friends' Sleep Records
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "clockIn": "2024-02-10T08:00:00.000Z",
      "clockOut": "2024-02-10T16:00:00.000Z",
      "duration": "8:00:00",
      "user": {
        "username": "bob"
      }
    }
  ]
}
```

## Security Features

- JWT Authentication (Bearer token)
- Password hashing
- Rate limiting
- CORS enabled
- Security headers
- Input validation
- SQL injection protection

## API Documentation

Full API documentation is available at `http://localhost:3000/api-docs`. This interactive documentation provides:
- Detailed endpoint descriptions
- Request/response examples
- Authentication requirements
- Testing interface

### Postman Collection

The Postman collection is available in the `postman` directory.
