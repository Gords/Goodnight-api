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

3. Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=goodnight_dev
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
PORT=3000
```

3. Start the application using Docker Compose
```bash
docker-compose up --build
```

4. Run migrations and seed data
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
# Clock In
curl -X POST http://localhost:3000/api/sleep/clock-in \
  -H "Authorization: Bearer YOUR_TOKEN"

# Clock Out
curl -X POST http://localhost:3000/api/sleep/clock-out \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get Sleep Records
curl http://localhost:3000/api/sleep/records \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Follow Operations
```bash
# Follow a User (replace USER_ID)
curl -X POST http://localhost:3000/api/users/USER_ID/follow \
  -H "Authorization: Bearer YOUR_TOKEN"

# Unfollow a User (replace USER_ID)
curl -X DELETE http://localhost:3000/api/users/USER_ID/follow \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get Friends' Sleep Records
curl http://localhost:3000/api/users/friends/sleep-records \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Testing Flow Example

1. Login as Alice:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "password123"}'
```
Save the returned token.

2. Clock in:
```bash
curl -X POST http://localhost:3000/api/sleep/clock-in \
  -H "Authorization: Bearer YOUR_TOKEN"
```

3. Clock out (after some time):
```bash
curl -X POST http://localhost:3000/api/sleep/clock-out \
  -H "Authorization: Bearer YOUR_TOKEN"
```

4. View your sleep records:
```bash
curl http://localhost:3000/api/sleep/records \
  -H "Authorization: Bearer YOUR_TOKEN"
```

5. Follow Bob (ID: 2):
```bash
curl -X POST http://localhost:3000/api/users/2/follow \
  -H "Authorization: Bearer YOUR_TOKEN"
```

6. View friends' sleep records:
```bash
curl http://localhost:3000/api/users/friends/sleep-records \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Responses

#### Successful Login
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Sleep Records
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "clockIn": "2024-02-10T08:00:00.000Z",
      "clockOut": "2024-02-10T16:00:00.000Z",
      "duration": "8:00:00",
      "durationFormatted": "8h 0m"
    }
  ]
}
```

#### Friends' Sleep Records
```json
[
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
```

## Error Handling

The API includes proper error handling for common scenarios:

- 400: Bad Request (invalid input)
- 401: Unauthorized (invalid/missing token)
- 404: Not Found
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

## Rate Limiting

- Auth endpoints: 5 attempts per 15 minutes
- API endpoints: 60 requests per minute

## Security Features

- JWT Authentication
- Password hashing
- Rate limiting
- CORS enabled
- Security headers (Helmet)
- Input validation
- SQL injection protection (Sequelize ORM)
