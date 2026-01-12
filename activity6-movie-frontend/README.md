# Movie Recommendation System - Frontend

An interactive React frontend for the Movie Recommendation System, providing a seamless user experience for browsing, rating, and managing movies.

## Features

- **Browsing:** Dynamic movie list with real-time search, genre filtering, and sorting (Rating, Release Date, etc.).
- **User Roles:** Distinct experiences for regular Users and Administrators.
- **Admin Dashboard:** Tools for adding/editing movies and managing user accounts.
- **Reviews:** Interactive rating system where users can leave feedback on movies.
- **Responsive Design:** Built with Tailwind CSS for a consistent look across devices.
- **Dark Mode:** Supports both light and dark themes using CSS variables.
- **Protected Routes:** Secure navigation ensuring only authenticated users can access specific pages.

## Tech Stack

- **Library:** [React](https://reactjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Data Fetching:** Axios & TanStack Query (React Query)
- **Icons:** React Icons
- **State Management:** React Context API

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Movie Backend](activity6-movie-backend) running correctly.

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd activity6-movie-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 4. Frontend Setup (React App)

Frontend folder: `activity6-movie-frontend`

### 4.1 Configure API URL

The frontend uses an environment variable `REACT_APP_API_URL` to talk to the backend.

Create a `.env` file inside `activity6-movie-frontend` (same level as `package.json`) with:

```env
REACT_APP_API_URL=http://localhost:3001
```

If this file is missing, ensure the code points to the correct backend URL.

### 4.2 Run the Frontend

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

## Project Structure

- `src/auth`: Authentication pages (Login, Signup, Forgot Password).
- `src/components`: Reusable UI components (Nav, Dropdowns, Pagination).
- `src/context`: Authentication and Theme providers.
- `src/pages`: Main view components (MoviesPage, AdminDashboard, etc.).
- `src/service`: API abstraction layers using Axios instance.
- `src/hooks`: Custom hooks for data fetching and logic.
