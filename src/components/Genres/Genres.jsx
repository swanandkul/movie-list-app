import axios from "axios";
import { useEffect } from "react";
import "./Genres.css";

const Genres = ({ selectedGenres, setSelectedGenres, genres, setGenres }) => {
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleAdd = (genre) => {
    setSelectedGenres((prevSelected) => [...prevSelected, genre]);
    setGenres((prevGenres) => prevGenres.filter((g) => g.id !== genre.id));
  };

  const handleRemove = (genre) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.filter((selected) => selected.id !== genre.id)
    );
    setGenres((prevGenres) => [genre, ...prevGenres]);
  };

  const fetchGenres = async () => {
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
      );
      setGenres(data.genres);
    } catch (error) {
      console.error("Failed to load genres:", error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <div className="genres-container">
      {selectedGenres.map((genre) => (
        <div
          key={genre.id}
          className="genre-block selected"
          onClick={() => handleRemove(genre)}
        >
          {genre.name}
        </div>
      ))}

      {genres.map((genre) => (
        <div
          key={genre.id}
          className="genre-block"
          onClick={() => handleAdd(genre)}
        >
          {genre.name}
        </div>
      ))}
    </div>
  );
};

export default Genres;
