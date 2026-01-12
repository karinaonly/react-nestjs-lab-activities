# Movie Recommendation System (Full Stack)

This repository contains a full-stack Movie Recommendation System built with **React** (Frontend) and **NestJS** (Backend). It features user authentication, movie management, and an interactive review system.

## Project Structure

- `activity6-movie-backend/`: NestJS backend API.
- `activity6-movie-frontend/`: React frontend application.

## Getting Started

### 1. Database Setup
Ensure you have a MySQL server running and create a database named `movie_db`:
```sql
CREATE DATABASE movie_db;
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd activity6-movie-backend
npm install
```
Configure your `.env` file (see backend README for details) and start the server:
```bash
npm run start:dev
```

### 3. Frontend Setup
Navigate to the frontend folder and install dependencies:
```bash
cd activity6-movie-frontend
npm install
```
Configure your `.env` file (see frontend README for details) and start the app:
```bash
npm start
```

### 4. Run Frontend & Backend Together
In the root folder, there are helper scripts in `package.json`:

```json
{
  "scripts": {
    "start:frontend": "npm start --prefix activity6-movie-frontend",
    "start:backend": "npm run start:dev --prefix activity6-movie-backend",
    "dev": "concurrently \"npm run start:backend\" \"npm run start:frontend\""
  }
}
```

First, install the root dependencies (for `concurrently`):
```bash
npm install
```

Then start both servers with one command:
```bash
npm run dev
```

- Backend runs on [http://localhost:3001](http://localhost:3001)
- Frontend runs on [http://localhost:3000](http://localhost:3000)

## Key Features

- **Authentication:** JWT-based secure login and registration.
- **Admin & User Roles:** Role-based access control for different features.
- **Movie Management:** Admins can add, edit, and delete movies with image support.
- **Search & Filters:** Real-time search by title, genre filtering, and sorting.
- **Review System:** Rate movies and share feedback with other users.
- **Theme Support:** Toggle between Light and Dark mode.

## API Documentation
The backend provides a Swagger UI at `http://localhost:3001/api/docs` when running in development mode.
