import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "./loading.jsx";
import { Link } from "react-router-dom";
import "../styling/artistDetails.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import star from "../pictures/star.png";
import styles from "../styling/slider.modules.css";

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.slickPrev}`}
      onClick={onClick}
      style={{ ...style }}
    />
  );
};
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.slickNext}`}
      onClick={onClick}
      style={{ ...style }}
    />
  );
};

const MovieCredits = () => {
  const { artistId } = useParams();
  const apiKey = process.env.REACT_APP_API_KEY;
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/person/${artistId}/movie_credits?api_key=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => setMovies(data.cast))
      .catch((error) => console.error("Error fetching  Artist movies:", error));
  }, [apiKey, artistId]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="movie-slider">
      <Slider {...settings}>
        {movies &&
          movies.map((media) => (
            <div key={media.id} className="movie-slide">
              <Link to={`/movie/${media.id}`}>
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

const TvShowCredits = () => {
  const { artistId } = useParams();
  const apiKey = process.env.REACT_APP_API_KEY;
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/person/${artistId}/tv_credits?api_key=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => setMovies(data.cast))
      .catch((error) =>
        console.error("Error fetching  Artist tvShows:", error)
      );
  }, [apiKey, artistId]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="movie-slider">
      <Slider {...settings}>
        {movies &&
          movies.map((media) => (
            <div key={media.id} className="movie-slide">
              <Link to={`/tv/${media.id}`}>
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
                <p>
                  {new Date(
                    media.release_date || media.first_air_date
                  ).getFullYear()}
                </p>
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

export default function ArtistDetails() {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        setIsLoading(true);
        const artistResponse = await axios.get(
          `https://api.themoviedb.org/3/person/${artistId}`,
          {
            params: {
              api_key: process.env.REACT_APP_API_KEY,
            },
          }
        );
        setArtist(artistResponse.data);
      } catch (error) {
        console.error("Error fetching artist details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistDetails();
  }, [artistId]);

  if (isLoading || !artist) {
    return <Loading />;
  }

  return (
    <div className="artist-details">
      <div className="artist-info">
        <img
          className="artist-image"
          src={`https://image.tmdb.org/t/p/w300${artist.profile_path}`}
          alt={artist.name}
        />
        <div className="artist-info-text">
          <h1>{artist.name}</h1>
          <p>
            {isExpanded
              ? artist.biography
              : `${artist.biography.slice(0, 200)} ...`}
            {artist.biography.length > 200 && (
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
        </div>
      </div>
      <div>
        <div className="title-1" style={{ marginTop: "15px" }}></div>
        <h2>Movies</h2>
        <MovieCredits />
      </div>
      <div>
        <div className="title-1" style={{ marginTop: "15px" }}></div>
        <h2>TvShows</h2>
        <TvShowCredits />
      </div>
    </div>
  );
}
