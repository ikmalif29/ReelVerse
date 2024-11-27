import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const GenreList = () => {
  const [genres, setGenres] = useState([]);
  const [films, setFilms] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null); // Selected genre
  const [currentPage, setCurrentPage] = useState(1);
  const [filmsPerPage] = useState(6); // Number of films per page
  const token = Cookies.get("token");
  const role = Cookies.get("role");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/get-genre`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch genres");
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };

    const fetchFilms = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/get-all-films`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setFilms(data);
      } catch (error) {
        console.error("Failed to fetch films:", error);
      }
    };

    if (role) {
      fetchGenres();
      fetchFilms();
    }
  }, [role, token]);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1); // Reset to first page when selecting a genre
  };

  const filteredFilms = selectedGenre
    ? films.filter((film) => film.genre_id === selectedGenre)
    : films;

  // Pagination Logic
  const indexOfLastFilm = currentPage * filmsPerPage;
  const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
  const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);

  const totalPages = Math.ceil(filteredFilms.length / filmsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <motion.div
      className="bg-gradient-to-b from-blue-900 to-purple-900 text-white min-h-screen py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-12 animate-pulse">
          Explore Films by Genre
        </h1>

        {/* Genre List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {genres.map((genre) => (
            <div
              key={genre.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleGenreClick(genre.id)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-100">{genre.genre}</h2>
                <div className="flex items-center text-green-500">
                  <span className="mr-2">Active</span>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-2">Click to view films</p>
            </div>
          ))}
        </div>

        {/* Films List */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-center">
            {selectedGenre ? `Films in Selected Genre` : `All Films`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentFilms.length > 0 ? (
              currentFilms.map((film) => (
                <div
                  key={film.id_film}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transform transition-transform hover:-translate-y-4"
                >
                  <Link to={`/watch/${film.id_film}`}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xl font-extrabold text-gray-100 truncate">{film.judul_film}</div>
                      <div className="text-sm text-gray-400">{film.rilis}</div>
                    </div>
                    <div className="text-gray-500 text-sm">{film.description || "No description available."}</div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-xl text-gray-400">No films found</p>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12 space-x-3">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            className="text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-700 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            className="text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GenreList;
