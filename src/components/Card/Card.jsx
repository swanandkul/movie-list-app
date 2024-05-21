import "./Card.css";

const Card = ({
  id,
  title,
  releaseYear,
  poster,
  overview,
  vote,
  cast,
  director,
  genres,
}) => {
  return (
    <div className="card">
      <h2 className="card-title">
        {title} - ({releaseYear})
      </h2>
      <img
        className="card-image"
        src={`https://image.tmdb.org/t/p/w500${poster}`}
        alt={title}
      />
      <h3>Director: {director}</h3>
      <h3>
        Rating: <span>{vote.toFixed(1)}</span>
      </h3>
      <p className="card-genres">
        <strong>Genres:</strong> {genres.join(", ")}
      </p>
      <p className="card-cast">
        <strong>Cast</strong>: {cast}
      </p>
      <p className="card-overview">{overview}</p>
    </div>
  );
};

export default Card;
