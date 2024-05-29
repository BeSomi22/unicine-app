import React, { useState, useEffect } from "react";
import "../styling/movies.css";
import star from "../pictures/star.png";
import netflix from "../pictures/netflix.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
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

const NetflixMoviesSlider = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [netflixMovies, setNetflixMovies] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_providers=8&watch_region=US&sort_by=popularity.desc&page=1`
    )
      .then((response) => response.json())
      .then((data) => setNetflixMovies(data.results))
      .catch((error) => console.error("Error fetching movies:", error));
  }, [apiKey]);

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
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
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
      <Slider {...settings}>
        {netflixMovies.map((media) => (
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
            <div className="netflix-icon">
              <img
                src={netflix}
                alt="netflix-icon"
                style={{ width: "20%", height: "10%" }}
              />
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

const NetflixContent = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueIds, setUniqueIds] = useState(new Set());

  useEffect(() => {
    fetchNetflixContent(currentPage);
  });

  const fetchNetflixContent = async (page) => {
    try {
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_providers=8&watch_region=US&sort_by=popularity.desc&page=${page}`
      );
      const tvShowResponse = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_watch_providers=8&watch_region=US&sort_by=popularity.desc&page=${page}`
      );

      const movieData = await movieResponse.json();
      const tvShowData = await tvShowResponse.json();

      const combinedContent = [
        ...movieData.results.map((item) => ({ ...item, media_type: "movie" })),
        ...tvShowData.results.map((item) => ({ ...item, media_type: "tv" })),
      ];

      const filteredContent = combinedContent.filter((item) => {
        if (!uniqueIds.has(item.id)) {
          uniqueIds.add(item.id);
          return true;
        }
        return false;
      });

      setContent((prevContent) => [...prevContent, ...filteredContent]);
    } catch (error) {
      console.error("Error fetching Netflix content:", error);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container">
      <h1 style={{ margin: "10px 0 0 10px" }}>Netflix Movies and TV Shows</h1>
      <div className="all-movies">
        {content.map((media) => (
          <div key={media.id} className="movie-slide">
            <Link to={`/${media.media_type}/${media.id}`}>
              <img
                className="movie-image"
                src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                alt={media.title || media.name}
              />
            </Link>
            <div className="vote-average">
              <img
                src={star}
                alt="star"
                style={{ width: "35%", height: "35%" }}
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
            <div className="netflix-icon">
              <img
                src={netflix}
                alt="netflix-icon"
                style={{ width: "20%", height: "10%" }}
              />
            </div>
            <div className="movie-details">
              <h3 className="movie-title">{media.title || media.name}</h3>
              <p>{media.type === "movie" ? "Movie" : "TV Show"}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="animated-button" onClick={handleLoadMore}>
        <svg
          viewBox="0 0 24 24"
          className="arr-2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
        <span className="text">Load More</span>
        <span className="circle"></span>
        <svg
          viewBox="0 0 24 24"
          className="arr-1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
      </button>
    </div>
  );
};

export default function Netflix() {
  return (
    <>
      <div>
        <NetflixMoviesSlider />
        <div className="title"></div>
      </div>
      <div>
        <NetflixContent />
      </div>
    </>
  );
}
