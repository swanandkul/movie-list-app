import axios from "axios";
import { useEffect } from "react";
import "./Genres.css";

const Genres = ({ selectedGenres, setSelectedGenres, genres, setGenres }) => {
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleAdd = (genre) => {
    setSelectedGenres((prevSelected) => [...prevSelected, genre]);
    setGenres((prevGenres) =>
      prevGenres.map((g) => (g.id === genre.id ? { ...g, selected: true } : g))
    );
  };

  const handleRemove = (genre) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.filter((selected) => selected.id !== genre.id)
    );
    setGenres((prevGenres) =>
      prevGenres.map((g) => (g.id === genre.id ? { ...g, selected: false } : g))
    );
  };

  const fetchGenres = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
      );
      const initializedGenres = data.genres.map((genre) => ({
        ...genre,
        selected: false,
      }));
      setGenres(initializedGenres);
    } catch (error) {
      console.error("Failed to load genres:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleSelectAllGenres = () => {
    setSelectedGenres([]);
    fetchGenres();
  };

  return (
    <div className="genres-container">
      <div
        className={`genre-block genre-block-fixed ${
          selectedGenres.length === 0 ? "selected" : ""
        }`}
        value="all"
        onClick={handleSelectAllGenres}
      >
        All
      </div>
      {genres.map((genre) => (
        <div
          key={genre.id}
          className={`genre-block ${genre.selected ? "selected" : ""}`}
          onClick={() =>
            genre.selected ? handleRemove(genre) : handleAdd(genre)
          }
        >
          {genre.name}
        </div>
      ))}
    </div>
  );
};

export default Genres;
