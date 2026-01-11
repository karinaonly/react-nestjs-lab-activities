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

3. Configure environment variables. Create a `.env` file in the root of the frontend folder:
   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```

## Running the App

```bash
# development
$ npm start
```

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

- `src/auth`: Authentication pages (Login, Signup, Forgot Password).
- `src/components`: Reusable UI components (Nav, Dropdowns, Pagination).
- `src/context`: Authentication and Theme providers.
- `src/pages`: Main view components (MoviesPage, AdminDashboard, etc.).
- `src/service`: API abstraction layers using Axios instance.
- `src/hooks`: Custom hooks for data fetching and logic.

## License

This project is [MIT licensed](LICENSE).
