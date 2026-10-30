import { useCallback, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import { fetchMovies } from '../../services/movieService';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import Pagination from '../Pagination/Pagination';
import type { Movie } from '../../types/movie';

export default function App() {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['movies', query, page],
        queryFn: () => fetchMovies(query, page),
        enabled: query !== '',
        placeholderData: keepPreviousData,
    });

    const closeModal = useCallback(() => setSelectedMovie(null), []);

    const handleSearch = (newQuery: string) => {
        setQuery(newQuery);
        setPage(1);
    };

    const totalPages = data?.totalPages ?? 0;

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <SearchBar onSubmit={handleSearch} />

            {isSuccess && totalPages > 1 && (
                <Pagination
                    totalPages={totalPages}
                    page={page}
                    setPage={setPage}
                />
            )}

            {isLoading ? (
                <Loader />
            ) : isError ? (
                <ErrorMessage />
            ) : (
                <MovieGrid
                    movies={data?.results ?? []}
                    onSelect={setSelectedMovie}
                />
            )}

            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={closeModal} />
            )}
        </>
    );
}
