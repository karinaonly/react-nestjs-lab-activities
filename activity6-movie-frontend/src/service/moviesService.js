import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export const moviesService = {
    getAllMovies: () =>{
        return axios.get(`${API_URL}/movies/all`).then(res => res.data);
    },

    getMovieById: (id) => {
        return axios.get(`${API_URL}/movies/${id}`).then(res => res.data);
    },

    createMovie: (movieData) => {
        return axios.post(`${API_URL}/movies`, movieData).then(res => res.data);
    },

    updateMovie: (id, movieData) => {
        return axios.put(`${API_URL}/movies/${id}`, movieData).then(res => res.data);
    },

    deleteMovie: (id) => {
        return axios.delete(`${API_URL}/movies/${id}`).then(res => res.data);
    }
}   