import { useCallback, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const closeModal = useCallback(() => setSelectedMovie(null), []);

    const handleSearch = async (query: string) => {
        setMovies([]);
        setHasError(false);
        setIsLoading(true);

        try {
            const results = await fetchMovies(query);

            if (results.length === 0) {
                toast.error('no movies found for your request.');
                return;
            }

            setMovies(results);
        } catch (error) {
            console.log('TMDB request failed:', error)
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch} />

      {isLoading ? <Loader /> : hasError ? <ErrorMessage /> : (
        <MovieGrid
          movies={movies}
          onSelect={setSelectedMovie}
        />
            )}
            {selectedMovie && (
                <MovieModal
                    movie={selectedMovie}
                    onClose={closeModal}
  />
)}
    </>
  );
}