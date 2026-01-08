import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './components/ProtectedRoute';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import AdminMoviesPage from './pages/AdminMoviesPage';
import AdminAddMoviePage from './pages/AdminAddMoviePage';
import UserManagementPage from './pages/UserManagementPage';
import UserProfilePage from './pages/UserProfilePage';
import Login from './auth/login';
import Signup from './auth/signup';
import ForgotPassword from './auth/forgotpassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/movies" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route
            path="/admin/movies"
            element={
              <AdminRoute>
                <AdminMoviesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/movies/add"
            element={
              <AdminRoute>
                <AdminAddMoviePage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/movies/edit/:id"
            element={
              <AdminRoute>
                <AdminAddMoviePage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
