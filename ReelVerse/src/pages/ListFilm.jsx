import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { searchContext } from "../App"; // Make sure searchContext is defined in App.js

const ListFilm = () => {
  const { search } = useContext(searchContext); // Get search from context
  const [films, setFilms] = useState([]);
  const [filteredFilms, setFilteredFilms] = useState([]); // State for storing filter results
  const [favorites, setFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("judul_film");
  const [loading, setLoading] = useState(true); // Loading state
  const token = Cookies.get("token");
  const role = Cookies.get("role");

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/get-all-films`, {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        });
        const data = await response.json();
        setFilms(data);
        setLoading(false); // Set loading to false after films are fetched
      } catch (error) {
        console.error("Failed to fetch films:", error);
        setLoading(false); // Set loading to false even if there’s an error
      }
    };

    if (token) {
      fetchFilms();
    }

    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, [token]);

  // Update filtered results when search or films change
  useEffect(() => {
    const searchValue = typeof search === "string" ? search.toLowerCase() : ""; // Ensure search is a string
    const filtered = films.filter((film) =>
      film.judul_film.toLowerCase().includes(searchValue)
    );
    setFilteredFilms(filtered);
  }, [search, films]);

  const handleFavorite = (film) => {
    const isFavorite = favorites.some((fav) => fav.id_film === film.id_film);
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = favorites.filter((fav) => fav.id_film !== film.id_film);
    } else {
      updatedFavorites = [...favorites, film];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Handle Sorting
  const handleSort = () => {
    const sortedFilms = [...filteredFilms].sort((a, b) => {
      if (sortColumn === "judul_film") {
        return sortOrder === "asc"
          ? a.judul_film.localeCompare(b.judul_film)
          : b.judul_film.localeCompare(a.judul_film);
      } else if (sortColumn === "rilis") {
        return sortOrder === "asc"
          ? new Date(a.rilis) - new Date(b.rilis)
          : new Date(b.rilis) - new Date(a.rilis);
      }
      return 0;
    });

    setFilteredFilms(sortedFilms);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
            Please Sign in
          </h1>
          <p className="text-gray-600 text-center mb-6">
            You need to be logged in to access this content.
          </p>
          <div className="flex justify-center">
            <Link
              to="/signin"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 via-indigo-800 to-purple-900 text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="w-full p-8">
          <h1 className="text-4xl font-bold text-center mb-8 animate-pulse">
            Explore Your Favorite Films
          </h1>

          {/* Sorting Options */}
          <div className="flex justify-center items-center mb-8 gap-4">
            <div className="relative">
              <select
                onChange={(e) => setSortColumn(e.target.value)}
                value={sortColumn}
                className="appearance-none bg-gray-800 text-white px-6 py-3 rounded-lg border border-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="judul_film">Sort by Title</option>
                <option value="rilis">Sort by Release Date</option>
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </div>
            </div>

            {/* Button to change sorting order */}
            <button
              onClick={handleSort}
              className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:scale-105 transform transition-transform hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span>Sort Order: {sortOrder === "asc" ? "Asc" : "Desc"}</span>
              <svg
                className="w-5 h-5 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {sortOrder === "asc" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 15l7-7 7 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Loading Animation */}
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-indigo-600"></div>
              <p className="text-white text-lg">Loading films...</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto space-x-6 p-4 scrollbar-hide snap-x snap-mandatory">
              {filteredFilms.length > 0 ? (
                filteredFilms.map((film) => {
                  const isFavorite = favorites.some(
                    (fav) => fav.id_film === film.id_film
                  );

                  return (
                    <motion.div
                      key={film.id_film}
                      className="relative flex-none w-72 bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transform transition-transform hover:-translate-y-4 snap-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Link to={`/watch/${film.id_film}`}>
                        <img
                          src={film.image}
                          alt={film.judul_film}
                          className="w-full h-96 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                          <h2 className="text-xl font-bold mb-2">{film.judul_film}</h2>
                          <p className="text-gray-400 mb-2">{film.rilis}</p>
                          <div className="absolute top-2 right-2">
                            <button
                              onClick={() => handleFavorite(film)}
                              className="text-white"
                            >
                              {isFavorite ? (
                                <AiFillHeart className="text-red-600" />
                              ) : (
                                <AiOutlineHeart />
                              )}
                            </button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-center text-white">No films found</p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }
};


export default ListFilm;
