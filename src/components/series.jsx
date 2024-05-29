import React, { useState, useEffect } from "react";
import "../styling/movies.css";
import star from "../pictures/star.png";
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

const TrendingSlider = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [tvTrending, setTvTrending] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&language=en-US`
    )
      .then((response) => response.json())
      .then((data) => setTvTrending(data.results))
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
        {tvTrending.map((media) => (
          <div key={media.id} className="movie-slide">
            <Link to={`/${media.media_type}/${media.id}`}>
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
              <p>{new Date(media.first_air_date).getFullYear()}</p>
            </div>
            <div className="movie-details">
              <h3 className="movie-title">{media.original_name}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

const AllSeries = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [tvShows, setTvShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueShows, setUniqueShows] = useState(new Set());

  useEffect(() => {
    fetchMovies(currentPage);
  });

  const fetchMovies = (page) => {
    fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc`
    )
      .then((response) => response.json())
      .then((data) => {
        const newShows = data.results.filter(
          (show) => !uniqueShows.has(show.id)
        );
        setUniqueShows((prevSet) => {
          newShows.forEach((show) => prevSet.add(show.id));
          return prevSet;
        });
        setTvShows((prevShows) => [...prevShows, ...newShows]);
      })
      .catch((error) => console.error("Error fetching TV shows:", error));
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container">
      <h1 style={{ margin: "10px 0 0 10px" }}>Tv Shows</h1>
      <div className="all-movies">
        {tvShows.map((media) => (
          <div key={media.id} className="movie-slide">
            <Link to={`/tv/${media.id}`}>
              <img
                className="movie-image"
                src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                alt={media.name}
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
              <p>{new Date(media.first_air_date).getFullYear()}</p>
            </div>
            <div className="movie-details">
              <h3 className="movie-title">{media.name}</h3>
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

const KdramaSeries = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [tvShows, setTvShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueShows, setUniqueShows] = useState(new Set());

  useEffect(() => {
    fetchMovies(currentPage);
  });

  const fetchMovies = (page) => {
    fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_watch_providers=8&watch_region=KR&with_origin_country=KR&sort_by=popularity.desc&page=${page}`
    )
      .then((response) => response.json())
      .then((data) => {
        const newShows = data.results.filter(
          (show) => !uniqueShows.has(show.id)
        );
        setUniqueShows((prevSet) => {
          newShows.forEach((show) => prevSet.add(show.id));
          return prevSet;
        });
        setTvShows((prevShows) => [...prevShows, ...newShows]);
      })
      .catch((error) => console.error("Error fetching TV shows:", error));
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container">
      <h1 style={{ margin: "10px 0 0 10px" }}>Kdrama Series</h1>
      <div className="all-movies">
        {tvShows.map((media) => (
          <div key={media.id} className="movie-slide">
            <Link to={`/tv/${media.id}`}>
              <img
                className="movie-image"
                src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                alt={media.name}
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
              <p>{new Date(media.first_air_date).getFullYear()}</p>
            </div>
            <div className="movie-details">
              <h3 className="movie-title">{media.name}</h3>
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

const IndianSeries = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [tvShows, setTvShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueShows, setUniqueShows] = useState(new Set());

  useEffect(() => {
    fetchMovies(currentPage);
  });

  const fetchMovies = (page) => {
    fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_watch_providers=8&watch_region=IN&with_origin_country=IN&sort_by=popularity.desc&page=${page}`
    )
      .then((response) => response.json())
      .then((data) => {
        const newShows = data.results.filter(
          (show) => !uniqueShows.has(show.id)
        );
        setUniqueShows((prevSet) => {
          newShows.forEach((show) => prevSet.add(show.id));
          return prevSet;
        });
        setTvShows((prevShows) => [...prevShows, ...newShows]);
      })
      .catch((error) => console.error("Error fetching TV shows:", error));
  };

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container">
      <h1 style={{ margin: "10px 0 0 10px" }}>Indian Series</h1>
      <div className="all-movies">
        {tvShows.map((media) => (
          <div key={media.id} className="movie-slide">
            <Link to={`/tv/${media.id}`}>
              <img
                className="movie-image"
                src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                alt={media.name}
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
              <p>{new Date(media.first_air_date).getFullYear()}</p>
            </div>
            <div className="movie-details">
              <h3 className="movie-title">{media.name}</h3>
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

const Series = () => {
  return (
    <>
      <div>
        <TrendingSlider />
      </div>
      <div>
        <div className="title"></div>
        <AllSeries />
      </div>
      <div>
        <div className="title-1"></div>
        <KdramaSeries />
      </div>
      <div>
        <div className="title-1"></div>
        <IndianSeries />
      </div>
    </>
  );
};

export default Series;
