import axios from 'axios';
import type { Movie } from '../types/movie';

interface MovieApiResponse {
    results: Movie[];
    total_pages: number;
}

interface MovieSearchResult {
    results: Movie[];
    totalPages: number;
}

const API_URL = 'https://api.themoviedb.org/3/search/movie';

export async function fetchMovies(
    query: string,
    page: number
): Promise<MovieSearchResult> {
    const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

    if (!token) {
        throw new Error('TMDB access token is not configured.');
    }

    const response = await axios.get<MovieApiResponse>(API_URL, {
        params: {
            query,
            include_adult: false,
            language: 'en-US',
            page,
        },
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    return {
        results: response.data.results,
        totalPages: response.data.total_pages,
    };
}
