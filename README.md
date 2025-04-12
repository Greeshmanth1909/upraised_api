# Upraised API

A RESTful API for managing gadgets with authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables in `.env` file:
```
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
```

3. Run the server:
```bash
# Default port (8080)
node src/index.js


```

## Database Setup

### Running PostgreSQL with Docker

1. Make sure Docker is installed on your system

2. Start the PostgreSQL container:
```bash
docker-compose up -d
```

3. Verify the container is running:
```bash
docker ps
```

4. To stop the container:
```bash
docker-compose down
```

5. To view container logs:
```bash
docker-compose logs -f
```

The PostgreSQL container will be available at:
- Host: localhost
- Port: 5432
- Database: devdb
- Username: postgres
- Password: devpass

## Authentication

### Create User
```http
POST /auth/create_user
Content-Type: application/json

{
    "userName": "your_username",
    "password": "your_password"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
    "userName": "your_username",
    "password": "your_password"
}
```

Response includes a JWT token that should be used in the Authorization header for protected routes:
```
Authorization: Bearer <your_jwt_token>
```

## Gadget Endpoints

### Get All Gadgets
```http
GET /gadgets
Authorization: Bearer <your_jwt_token>

# Optional query parameter
GET /gadgets?status=Available|Deployed|Destroyed|Decommissioned
```

### Create a New Gadget
```http
POST /gadgets
Authorization: Bearer <your_jwt_token>
```

### Update Gadget
```http
PATCH /gadgets
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
    "name": "gadget_name",
    "status": "Available|Deployed|Destroyed|Decommissioned",
    "success": 0-100
}
```

### Delete Gadget (Decommission)
```http
DELETE /gadgets
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
    "name": "gadget_name"
}
```

### Self-Destruct Gadget
```http
POST /gadgets/{id_of_gadget}/self-destruct
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
    "confirmationCode": "your_confirmation_code"
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 422: Unprocessable Entity
- 500: Internal Server Error

## Response Format

All responses follow this format:
```json
{
    "success": true|false,
    "message": "response message",
}
``` 
