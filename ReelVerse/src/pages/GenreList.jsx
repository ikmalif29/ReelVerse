import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const GenreList = () => {
  const [genres, setGenres] = useState([]);
  const [films, setFilms] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filmsPerPage] = useState(6);
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
    setCurrentPage(1);
  };

  const filteredFilms = selectedGenre
    ? films.filter((film) => film.genre_id === selectedGenre)
    : films;

  const indexOfLastFilm = currentPage * filmsPerPage;
  const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
  const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);

  const totalPages = Math.ceil(filteredFilms.length / filmsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <motion.div
      className="bg-gray-900 text-white min-h-screen py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10">Discover Films by Genre</h1>

        <div className="flex flex-wrap gap-6 justify-center mb-12">
          {genres.map((genre) => (
            <motion.div
              key={genre.id}
              className={`p-6 rounded-lg shadow-md border-2 border-blue-500 backdrop-blur-lg bg-opacity-50 hover:shadow-lg transform transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer ${
                selectedGenre === genre.id ? "border-green-500" : ""
              }`}
              onClick={() => handleGenreClick(genre.id)}
            >
              <h2 className="text-2xl font-semibold text-center">{genre.genre}</h2>
              <p className="text-gray-300 mt-2 text-center">View films in this genre</p>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center">
          {selectedGenre ? `Films in Selected Genre` : `All Films`}
        </h2>

        <div className="mt-6">
            {currentFilms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {currentFilms.map((film) => (
                  <div
                    key={film.id_film}
                    className="relative bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white p-6 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <Link to={`/watch/${film.id_film}`} className="block group">
                      <div className="relative">
                        <img
                          src={film.image}
                          alt="Film cover"
                          className="w-full h-56 object-cover rounded-lg transition-transform transform group-hover:scale-110 group-hover:rotate-3"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60 rounded-lg"></div>
                      </div>
                      <h2 className="text-2xl font-bold mt-4 group-hover:text-yellow-300 transition-colors duration-300">
                        {film.judul_film}
                      </h2>
                      <p className="text-gray-300 text-sm">{film.artist}</p>
                      <p className="text-gray-200 text-xs">{new Date(film.rilis).toLocaleDateString()}</p>
                    </Link>
                    
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center col-span-4">No films available.</p>
            )}
          </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-green-500 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GenreList;
