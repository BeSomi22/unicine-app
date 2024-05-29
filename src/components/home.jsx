import "../styling/home.css";
import React, { useState, useEffect } from "react";
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

const TrendingSlider = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [tvTrending, setTvTrending] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}&language=en-US`
    )
      .then((response) => response.json())
      .then((data) => setTvTrending(data.results))
      .catch((error) => console.error("Error fetching movies:", error));
  }, [apiKey]);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {tvTrending.map((media) => (
          <div key={media.id} className="slider">
            <div className="slide-content">
              <div className="backdrop">
              <Link to={`/${media.media_type}/${media.id}`}>
                <img
                  className="backdrop-image"
                  src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                  alt={media.title ||media.name}
                />
              </Link>
              </div>
              <div className="overlay">
                <div className="poster">
                <Link to={`/${media.media_type}/${media.id}`}>
                  <img
                    className="poster-image"
                    src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                    alt={media.title || media.name}
                  />
                </Link>
                </div>
                <div className="extra-info">
                  <h3>{media.title || media.name}</h3>
                  <div className="info">
                    <div className="vote-backdeop-poster">
                      <img
                        src={star}
                        alt="star"
                      />
                      <span>{media.vote_average.toFixed(1)}</span>
                    </div>
                    <p>
                      {new Date(
                        media.release_date || media.first_air_date
                      ).getFullYear()}
                    </p>
                    <span style={{textTransform: "capitalize"}}>{media.media_type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

const Popular = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
    )
      .then((response) => response.json())
      .then((data) => setMovies(data.results))
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
        {movies.map((media) => (
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

const TrendingSeries = () => {
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
        {tvTrending.map((media) => (
          <div key={media.id} className="movie-slide">
            <Link to={`/${media.media_type}/${media.id}`}>
            <img
              className="movie-image"
              src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
              alt={ media.title}
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

const IndianMovies = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [indianMovies, setIndianMovies] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_providers=8&watch_region=IN&with_origin_country=IN&sort_by=popularity.desc&page=1`
    )
      .then((response) => response.json())
      .then((data) => setIndianMovies(data.results))
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
        {indianMovies.map((media) => (
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
              <p>
                {new Date(
                  media.first_air_date || media.release_date
                ).getFullYear()}
              </p>
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

const KoreanMovies = () => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const [koreanMovies, setKoreanMovies] = useState([]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_watch_providers=8&watch_region=KR&with_origin_country=KR&sort_by=popularity.desc&page=1`
    )
      .then((response) => response.json())
      .then((data) => setKoreanMovies(data.results))
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
        {koreanMovies.map((media) => (
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
              <p>
                {new Date(
                  media.first_air_date || media.release_date
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

const Home = () => {
  return (
    <>
      <div>
        <div className="title-1"></div>
        <TrendingSlider />
        <div className="title"></div>
      </div>
      <div>
        <div className="more">
          <h2 style={{ margin: "10px 0 0 10px" }}>Popular</h2>
          <a href="/movies">More..</a>
        </div>
        <Popular />
        <div className="title-1"></div>
      </div>
      <div>
        <div className="more">
          <h2 style={{ margin: "10px 0 0 10px" }}>Trending TvShows</h2>
          <a href="/series">More..</a>
        </div>
        <TrendingSeries />
        <div className="title-1"></div>
      </div>
      <div>
        <div className="more">
          <h2 style={{ margin: "10px 0 0 10px" }}>Netflix Movies</h2>
          <a href="/netflix">More..</a>
        </div>
        <NetflixMoviesSlider />
        <div className="title-1"></div>
      </div>
      <div>
        <div className="more">
          <h2 style={{ margin: "10px 0 0 10px" }}>Indian Movies</h2>
          <a href="/">More..</a>
        </div>
        <IndianMovies />
        <div className="title-1"></div>
      </div>
      <div>
        <div className="more">
          <h2 style={{ margin: "10px 0 0 10px" }}>South Korea Movies</h2>
          <a href="/">More..</a>
        </div>
        <KoreanMovies />
      </div>
    </>
  );
};

export default Home;
