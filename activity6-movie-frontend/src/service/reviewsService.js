import axiosInstance from "./axiosInstance";

// Get all reviews for a specific movie
export const getMovieReviews = async (movieId) => {
  const response = await axiosInstance.get(`/reviews/movie/${movieId}`);
  return response.data;
};

// Get average rating for a movie
export const getMovieRating = async (movieId) => {
  const response = await axiosInstance.get(`/reviews/movie/${movieId}/average`);
  return response.data;
};

// Create a new review (requires authentication)
export const createReview = async (reviewData) => {
  const response = await axiosInstance.post("/reviews", reviewData);
  return response.data;
};

// Update a review (requires authentication)
export const updateReview = async (reviewId, reviewData) => {
  const response = await axiosInstance.patch(`/reviews/${reviewId}`, reviewData);
  return response.data;
};

// Delete a review (requires authentication)
export const deleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(`/reviews/${reviewId}`);
  return response.data;
};

// Get current user's reviews
export const getMyReviews = async () => {
  const response = await axiosInstance.get("/reviews/user/my-reviews");
  return response.data;
};
