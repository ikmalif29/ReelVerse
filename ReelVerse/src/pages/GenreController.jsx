import { Trash2, FilePenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import SideBar from "../components/SideBar";

const GenreController = () => {
    const [genres, setGenres] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [getGenre, setGetGenre] = useState([]);
    const [addGenre, setAddGenre] = useState(null);
    const [updateGenre, setUpdateGenre] = useState(null);
    const [film, setFilms] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/get-genre`, {
                    headers: { "Authorization": `Bearer ${token}` }
                }
                );
                if (!response.ok) throw new Error("Failed to fetch genres");
                const data = await response.json();
                setGenres(data);
            } catch (error) {
                console.error("Failed to fetch genres:", error);
            }
        };

        const fetchFilms = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/get-all-films`, {
                    headers: { "Authorization": `Bearer ${token}` }
                }
                );
                const data = await response.json();
                setFilms(data);
            } catch (error) {
                console.error("Failed to fetch films:", error);
            }
        };

        fetchGenres();
        fetchFilms();
    }, [token]);

    const handleButtonClick = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/get-film-by-genre/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            }
            );
            if (!response.ok) throw new Error("Failed to fetch films by genre");
            const data = await response.json();
            const selected = genres.find((item) => item.id_type === data[0].id_type);
            setSelectedGenre(selected?.genre || "Unknown");
            setGetGenre(data);
        } catch (error) {
            console.error("Failed to fetch films by genre:", error);
        }
    };

    const handleAddGenre = async () => {
        if (!addGenre || !addGenre.genre) return;
        try {
            const genreExist = genres.some((item) => item.genre === addGenre.genre);
            if (!genreExist) {
                await fetch(`http://localhost:3000/api/post-genre`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify(addGenre),
                });
                const response = await fetch(`http://localhost:3000/api/get-genre`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setGenres(data);
                }
                setAddGenre(null);
            } else {
                alert('Genre already exists');
            }
        } catch (error) {
            console.error("Failed to add genre:", error);
        }
    };

    const handleUpdateGenre = async (id) => {
        if (!updateGenre || !updateGenre.genre) return;
        try {
            await fetch(
                `http://localhost:3000/api/update-genre/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(updateGenre),
            }
            );
            setUpdateGenre(null);
            const response = await fetch(`http://localhost:3000/api/get-genre`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setGenres(data);
            }
        } catch (error) {
            console.error("Failed to update genre:", error);
        }
    };

    const handleDeleteGenre = async (id) => {
        if (window.confirm("Are you sure you want to delete this genre?")) {
            try {
                await fetch(
                    `http://localhost:3000/api/delete-genre/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                }
                );
                const response = await fetch(`http://localhost:3000/api/get-genre`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setGenres(data);
                }
            } catch (error) {
                console.error("Failed to delete genre:", error);
            }
        }
    };

    return (
        <main className="flex gap-10">
        <div className="w-64 h-screen bg-gray-800 text-white">
          <SideBar />
        </div>
        <div className="p-8 bg-gray-900 text-white min-h-screen w-full">
          <button
            onClick={() => setAddGenre({ genre: "" })}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Add Genre
          </button>
      
          <h1 className="text-3xl font-bold mb-6">Genres</h1>
          {genres.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {genres.map((genre) => (
                <div key={genre.id_type} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                  <button
                    onClick={() => handleButtonClick(genre.id_type)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {genre.genre}
                  </button>
                  <div className="mt-3 flex space-x-3">
                    <button
                      onClick={() => setUpdateGenre(genre)}
                      className="text-yellow-400 hover:text-yellow-500 p-2"
                      aria-label="Edit genre"
                    >
                      <FilePenLine size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteGenre(genre.id_type)}
                      className="text-red-500 hover:text-red-600 p-2"
                      aria-label="Delete genre"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No genres available.</p>
          )}
      
          {/* Genre Films */}
          <div className="mb-6">
            {film.length > 0 && (
              <div>
                <h1 className="text-2xl font-bold mb-4">{selectedGenre}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {film.map((film) => (
                    <div key={film.id_film} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                      <Link to={`/watch/${film.id_film}`}>
                        <h2 className="text-xl font-semibold mb-2">{film.judul_film}</h2>
                        <img
                          src={film.image}
                          className="w-full h-40 object-cover mb-3 rounded-lg"
                          alt={film.judul_film}
                        />
                        <p className="text-gray-400">{film.artist}</p>
                        <p className="text-gray-500">{new Date(film.rilis).toLocaleDateString()}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
      
          {/* Add Genre Modal */}
          {addGenre && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-lg w-full">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddGenre();
                  }}
                >
                  <h2 className="text-2xl font-bold mb-4">Add New Genre</h2>
                  <label htmlFor="genre" className="block mb-2 text-white">Genre</label>
                  <input
                    type="text"
                    id="genre"
                    value={addGenre.genre || ""}
                    onChange={(e) => setAddGenre({ ...addGenre, genre: e.target.value })}
                    className="bg-gray-900 text-white border border-gray-600 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddGenre(null)}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
      
          {/* Update Genre Modal */}
          {updateGenre && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-gray-700 p-8 rounded-lg shadow-lg max-w-lg w-full">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateGenre(updateGenre.id_type);
                  }}
                >
                  <h2 className="text-2xl font-bold mb-4">Update Genre</h2>
                  <label htmlFor="genre" className="block mb-2 text-white">Genre</label>
                  <input
                    type="text"
                    id="genre"
                    value={updateGenre.genre || ""}
                    onChange={(e) => setUpdateGenre({ ...updateGenre, genre: e.target.value })}
                    className="bg-gray-900 text-white border border-gray-600 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpdateGenre(null)}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      
    );
};

export default GenreController;
