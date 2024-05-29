import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import "./styling/header.css";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import axios from "axios";
import unicine from "./pictures/unicine.png";
import star from "./pictures/star.png";
import Home from "./components/home.jsx";
import Movies from "./components/movies.jsx";
import Series from "./components/series.jsx";
import Netflix from "./components/netflix.jsx";
import Footer from "./components/footer.jsx";
import MovieDetails from "./components/movieDetails.jsx";
import TvDetails from "./components/tvDetails.jsx";
import Loading from "./components/loading.jsx";
import ArtistDetails from "./components/artistDetails.jsx";
import { debounce } from "./components/debounce.jsx";

const apiKey = process.env.REACT_APP_API_KEY;

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isInputVisible, setInputVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const toggleInput = () => {
    setClickCount(clickCount + 1);
    if (clickCount % 2 === 0) {
      setInputVisible(true);
    } else {
      setInputVisible(false);
      // Trigger search when input becomes invisible after the second click
      performSearch(searchQuery);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const clearData = () => {
    setSearchResults([]);
  };

  const performSearch = async (query) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}&include_adult=false&language=en-US`
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.log("Error fetching:", error);
    }
    setMobileMenuOpen(false); // Close mobile menu after search
  };

  const debouncedSearch = useCallback(debounce(performSearch, 500), []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      debouncedSearch(searchQuery);
    }
  };

  const handleMenuToggle = (menu) => {
    setMobileMenuOpen(false);
    clearData();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div>
        <header>
          <nav className="header-container flexN">
            <div className="logo">
              <Link to="/" onClick={() => handleMenuToggle("Home")}>
                <img src={unicine} alt="logo" />
              </Link>
            </div>
            <div className="toggle" onClick={toggleMobileMenu}>
              <i
                className={isMobileMenuOpen ? "fa fa-times" : "fa fa-bars"}
              ></i>
            </div>
            <ul className={isMobileMenuOpen ? "navMenu-list" : "flexN"}>
              <li>
                <Link to="/" onClick={() => handleMenuToggle("Home")}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/movies" onClick={() => handleMenuToggle("Movies")}>
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/series" onClick={() => handleMenuToggle("Series")}>
                  Series
                </Link>
              </li>
              <li>
                <Link to="/netflix" onClick={() => handleMenuToggle("Netflix")}>
                  Netflix
                </Link>
              </li>
            </ul>
            <div className="search-input">
              {isInputVisible ? (
                <div className="input">
                  <input
                    type="text"
                    value={searchQuery}
                    placeholder="Search"
                    onChange={handleSearch}
                    onKeyPress={handleKeyPress}
                  />
                  <div
                    className="search-toggle btn-search"
                    onClick={toggleInput}
                  >
                    <i className="fa fa-search"></i>
                  </div>
                </div>
              ) : (
                <div className="search-toggle btn-search" onClick={toggleInput}>
                  <i className="fa fa-search"></i>
                </div>
              )}
            </div>
          </nav>
        </header>

        {searchResults.length > 0 ? (
          <SearchResults
            searchResults={searchResults}
            searchQuery={searchQuery}
          />
        ) : (
          <Routes>
            <Route path="/" index element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/netflix" element={<Netflix />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<TvDetails />} />
            <Route path="/person/:artistId" element={<ArtistDetails />} />
            <Route path="*" element={<Home />} />
          </Routes>
        )}
      </div>
      <Footer />
    </Router>
  );
};

const SearchResults = ({ searchResults, searchQuery }) => {
  return (
    <div className="container-Movies">
      <h2 style={{ margin: " 10px 0  0 15px " }}>
        Search Results: "{searchQuery}"
      </h2>
      <ul className="all-movies">
        {searchResults.map((media) => (
          <div key={media.id} className="movie-slide">
            <Link to={`/${media.media_type}/${media.id}`}>
              {media.poster_path ? (
                <img
                  className="movie-image"
                  src={`https://image.tmdb.org/t/p/w200${media.poster_path}`}
                  alt={media.title}
                />
              ) : (
                <div className="placeholder-image">No Image Available</div>
              )}
            </Link>
            <div className="vote-average-slider">
              <img
                src={star}
                alt="star"
                style={{ width: "35%", height: "35%" }}
              />
              {media.vote_average ? (
                <span>{media.vote_average.toFixed(1)}</span>
              ) : (
                <span>N/A</span>
              )}
            </div>
            <div className="movie-year">
              <p>
                {new Date(
                  media.release_date || media.first_air_date
                ).getFullYear()}
              </p>
            </div>
            <div className="movie-details">
              <h3 className="movie-title">{media.title || media.name}</h3>
              <p
                className="result-type"
                style={{
                  color: "#bc1823",
                  fontWeight: "550",
                  textTransform: "capitalize",
                }}
              >
                {media.media_type}
              </p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default App;
