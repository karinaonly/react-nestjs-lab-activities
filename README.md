# Activity 6 - Movie Rating Web Application

This repository contains a full-stack Movie Recommendation System built with **React** (Frontend) and **NestJS** (Backend). It features user authentication, movie management, and an interactive review system.

## Project Structure

- `activity6-movie-backend/`: NestJS backend API.
- `activity6-movie-frontend/`: React frontend application.

## Getting Started

### 1. Database Setup
Ensure you have a MySQL server running and create a database named `lab_activity_db`:
```sql
CREATE DATABASE lab_activity_db;
```

### 2. Configure Database & Environment
The backend uses TypeORM with MySQL. Make sure you have a database created, for example:

- **host**: localhost
- **port**: 3306
- **database**: movie_db
- **user**: e.g. root
- **password**: your_password

Then configure your connection in the `.env` file (usually something like):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=movie_db
JWT_SECRET=your_jwt_secret
```

Adjust the actual variable names to match your `database.config.ts` and auth configuration.

The API server will run by default on [http://localhost:3001](http://localhost:3001).

### 3. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd activity6-movie-backend
npm install
```

Start the server:
```bash
npm run start:dev
```

### 4. Frontend Setup (React App)
Frontend folder: `activity6-movie-frontend`

```bash
cd activity6-movie-frontend
npm install
```

#### 4.1 Configure API URL
The frontend uses an environment variable `REACT_APP_API_URL` to talk to the backend.

Create a `.env` file inside `activity6-movie-frontend` (same level as `package.json`) with:

```env
REACT_APP_API_URL=http://localhost:3001
```

If this file is missing, the frontend falls back to `http://localhost:3001` by default.

#### 4.2 Run the Frontend
From the project root:
```bash
npm run start:frontend
```

Or inside the frontend folder:
```bash
cd activity6-movie-frontend
npm start
```

The React app will start on [http://localhost:3000](http://localhost:3000).

### 5. Run Frontend & Backend Together
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
