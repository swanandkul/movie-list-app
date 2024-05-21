import { useEffect, useState, useCallback } from "react";
import Card from "../Card/Card";
import axios from "axios";
import Genres from "../Genres/Genres";
import useGenre from "../../hooks/useGenre";
import "../Card/Card.css";
import "../Genres/Genres.css";
import "./Movies.css";
import Spinner from "../Spinner/Spinner";
import Header from "../Header/Header";

const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [year, setYear] = useState(2012);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const genreforURL = useGenre(selectedGenres);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
  const BASE_IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;
  const API = `${BASE_API_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API}&primary_release_year=${year}&page=1&vote_count.gte=100&with_genres=${genreforURL}`
      );
      const moviesData = await res.data.results.slice(0, 20);

      const moviesWithDetails = await Promise.all(
        moviesData.map(async (movie) => {
          const creditsRes = await axios.get(
            `${BASE_API_URL}/movie/${movie.id}/credits?api_key=${API_KEY}`
          );
          const castData = await creditsRes.data.cast;
          const crewData = await creditsRes.data.crew;

          const cast = castData
            .slice(0, 5)
            .map((member) => member.name)
            .join(", ");
          const director =
            crewData.find((member) => member.job === "Director")?.name ||
            "Unknown";

          return { ...movie, cast, director };
        })
      );

      setMovies(moviesWithDetails);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setError("Failed to load movies");
    } finally {
      setLoading(false);
    }
  }, [year, genreforURL, API]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies, selectedGenres]);

  const handleInfiniteScroll = useCallback(async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setYear((prev) => prev + 1);
    } else if (document.documentElement.scrollTop <= 1) {
      setYear((prev) => prev - 1);
    }
  }, []);

  useEffect(() => {
    const debouncedScrollHandler = debounce(handleInfiniteScroll, 500);
    window.addEventListener("scroll", debouncedScrollHandler);
    return () => window.removeEventListener("scroll", debouncedScrollHandler);
  }, [handleInfiniteScroll]);

  const createGenreLookup = (genres) => {
    return genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
  };

  const allGenres = [...genres, ...selectedGenres];
  const genreLookup = createGenreLookup(allGenres);

  const moviesWithGenres = movies.map((movie) => ({
    ...movie,
    genres: movie.genre_ids.map((id) => genreLookup[id] || "Unknown"),
  }));

  return (
    <>
      <Header />
      <nav className="navbar">
        <Genres
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          genres={genres}
          setGenres={setGenres}
        />
      </nav>
      <div className="card-container">
        {moviesWithGenres.length > 0 ? (
          moviesWithGenres.map((movie, index) => (
            <Card
              key={index}
              title={movie.title}
              releaseYear={movie.release_date.split("-")[0]}
              overview={movie.overview}
              poster={`${BASE_IMAGE_URL}${movie.poster_path}`}
              vote={movie.vote_average}
              cast={movie.cast}
              director={movie.director}
              genres={movie.genres}
            />
          ))
        ) : (
          <p>No Movies Found!</p>
        )}
      </div>
      {loading && <Spinner />}
      {error && <p className="error-message">{error}</p>}
    </>
  );
};

export default Movies;
