import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import star from "../pictures/star.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styling/movies.css";
import "../styling/details.css";
import Loading from "./loading.jsx";

function CenterModeVideo() {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchMovieVideo = async () => {
      try {
        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos`,
          {
            params: {
              api_key: process.env.REACT_APP_API_KEY,
            },
          }
        );
        setVideos(videosResponse.data.results);
      } catch (error) {
        console.error("Error fetching movie video:", error);
      }
    };

    fetchMovieVideo();
  }, [id]);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "10px",
        },
      },
    ],
  };

  return (
    <div className="slider-container">
      <h1 style={{ margin: " 0 0 20px 20px" }}>Videos</h1>
      <Slider {...settings}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video.id} className="video">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${video.key}`}
                title={video.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))
        ) : (
          <p>No videos available</p>
        )}
      </Slider>
    </div>
  );
}

const Recommendations = () => {
  const { id } = useParams();
  const apiKey = process.env.REACT_APP_API_KEY;
  const [moviesRec, setMoviesRec] = useState([]);

  useEffect(() => {
    fetchRecommendations(id);
  }, [id]);

  function fetchRecommendations(id) {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apiKey}&language=en-US&page=1`
    )
      .then((response) => response.json())
      .then((data) => {
        setMoviesRec(data.results);
      })
      .catch((error) =>
        console.error("Error fetching recommendations:", error)
      );
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="movie-slider">
      <h2 style={{ marginBottom: "15px" }}>Recommendations</h2>
      <Slider {...settings}>
        {moviesRec &&
          moviesRec.map((media) => (
            <div key={media.id} className="movie-slide">
              <Link to={`/movie/${media.id}`} key={media.id}>
                <img
                  className="movie-image"
                  src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                  alt={media.title}
                />
              </Link>
              <div className="vote-average-slider">
                <img
                  src={star}
                  alt="star"
                  style={{ width: "40%", height: "40%" }}
                />
                <span>{media.vote_average.toFixed(1)}</span>
              </div>
              <div className="movie-year">
                <p>{new Date(media.release_date).getFullYear()}</p>
              </div>
              <div className="movie-details">
                <h3 className="movie-title">{media.title}</h3>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
};

const MovieDetails = () => {
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMovie, setIsMovie] = useState(true); // Assume it's a movie by default
  const [cast, setCast] = useState([]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              api_key: process.env.REACT_APP_API_KEY,
            },
          }
        );

        if (response.data.media_type === "tv") {
          // If it's a TV show, fetch TV show details
          const tvShowResponse = await axios.get(
            `https://api.themoviedb.org/3/tv/${id}`,
            {
              params: {
                api_key: process.env.REACT_APP_API_KEY,
              },
            }
          );
          setMedia(tvShowResponse.data);
          setIsMovie(false); // Set isMovie to false for TV shows
        } else {
          // If it's a movie, use the response as is
          setMedia(response.data);
        }

        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/${
            isMovie ? "movie" : "tv"
          }/${id}/credits`,
          {
            params: {
              api_key: process.env.REACT_APP_API_KEY,
            },
          }
        );
        setCast(creditsResponse.data.cast);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, isMovie]);

  if (isLoading || !media) {
    return <Loading />;
  }

  return (
    <div>
      <div className="info-container">
        <div className="backdrop-details">
          <img
            className="backdrop-image-details"
            src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
            alt={media.title || media.name}
          />
        </div>
        <div className="overlay-details">
          <div className="wrapper">
            <div className="poster-details">
              <img
                className="poster-image-details"
                src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                alt={media.title || media.name}
              />
            </div>
            <div className="exact-info">
              <h1>{media.title}</h1>
              <div className="movie-infos">
                <p>
                  {isExpanded
                    ? media.overview
                    : `${media.overview.slice(0, 200)}... `}
                  {media.overview.length > 200 && (
                    <span
                      className="read-more"
                      onClick={toggleExpand}
                      style={{
                        color: "#bc1823",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </span>
                  )}
                </p>
                <p>
                  <strong>Release Date:</strong>{" "}
                  {media.release_date ? media.release_date : "N/A"}
                </p>
                <p>
                  <strong>Type:</strong> {isMovie ? "Movie" : "Tv"}
                </p>
                <p>
                  <strong>Origin:</strong> {media.origin_country}&nbsp;
                  {media.original_language}
                </p>
                <p>
                  <strong>Vote Average:</strong>{" "}
                  {media.vote_average ? media.vote_average.toFixed(1) : "N/A"}
                </p>
                {media.genres && (
                  <p>
                    <strong>Genres:</strong>{" "}
                    {media.genres.map((genre) => genre.name).join(", ")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="title-1" style={{ marginTop: "50px" }}></div>
      <div className="additional-info">
        <div className="movie-videos">
          <CenterModeVideo />
        </div>
        <div className="movie-cast">
          <div className="title-1" style={{ marginBottom: "10px" }}></div>
          <h1 style={{ margin: " 0 0 20px 20px" }}>Cast</h1>
          {cast.length > 0 ? (
            <ul className="cast-list">
              {cast.slice(0, 10).map((member) => (
                <li key={member.cast_id} className="cast-member">
                  <Link to={`/person/${member.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                      alt={member.name}
                      className="cast-image"
                    />
                  </Link>
                  <p>
                    <strong>{member.name}</strong> as {member.character}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No cast information available</p>
          )}
        </div>
      </div>
      <div>
        <div className="title-1" style={{ marginBottom: "10px" }}></div>
        <Recommendations />
      </div>
    </div>
  );
};

export default MovieDetails;
