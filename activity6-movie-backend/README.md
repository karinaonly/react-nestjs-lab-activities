# Movie Recommendation System - Backend

A robust NestJS backend for the Movie Recommendation System, providing a RESTful API for movie management, user authentication, and review systems.

## Features

- **Authentication:** Secure registration and login using JWT (JSON Web Tokens).
- **Movie Management:** Full CRUD operations for movies, including image uploads.
- **Review System:** Users can rate and review movies, with automated average rating calculations.
- **User Management:** Admin controls for managing user roles and profiles.
- **Swagger Documentation:** Interactive API documentation for easy testing.
- **CORS Enabled:** Configured for seamless frontend integration.

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** MySQL
- **ORM:** TypeORM
- **Documentation:** Swagger UI
- **Language:** TypeScript

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://www.mysql.com/) Server

## Installation

1. Navigate to the backend directory:
   ```bash
   cd activity6-movie-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables. Create a `.env` file in the root of the backend folder:
   ```env
   PORT=3001
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=movie_db
   DB_SYNC=true
   JWT_SECRET=your_secret_key
   ```

## Running the App

```bash
# development
$ npm run start

# watch mode (highly recommended for development)
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

Once the server is running, you can access the interactive Swagger documentation at:
[http://localhost:3001/api/docs](http://localhost:3001/api/docs)
