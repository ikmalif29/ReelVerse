import { FilePenLine } from "lucide-react";
import { Trash2 } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import SideBar from "../components/SideBar";

const FilmController = () => {
  const [films, setFilms] = useState([]);
  const [newFilm, setNewFilm] = useState(null);
  const [sortBy, setSortBy] = useState("id_film");
  const [sortOrder, setSortOrder] = useState("asc");
  const [updatedFilms, setUpdateFilm] = useState(null);
  const [genre, setGenre] = useState([]);
  const token = Cookies.get("token");
  const role = Cookies.get('role');

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/get-all-films`, {
          headers: { "Authorization": `Bearer ${token}` },
          method: "GET"
        }
        );
        const data = await response.json();
        setFilms(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch films:", error);
      }
    };
    const fetchGenre = async () => {
      const response = await fetch(
        `http://localhost:3000/api/get-genre`, {
        headers: { "Authorization": `Bearer ${token}` }
      }
      );
      const data = await response.json();
      setGenre(data);
    };
    if (token) {
      fetchFilms();
      fetchGenre();
    }
  }, [token]);

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
            <Link to="/signin"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }
  else {
    const filterData = films
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortBy] < b[sortBy] ? -1 : 1;
        } else {
          return a[sortBy] > b[sortBy] ? -1 : 1;
        }
      });
    const handleUpdateFilm = async () => {
      await fetch(
        `http://localhost:3000/api/update-film/${updatedFilms.id_film
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(updatedFilms),
        }
      )
      const updatedResponse = await fetch(
        `http://localhost:3000/api/get-all-films`, {
        headers: { "Authorization": `Bearer ${token}` },
      }
      );
      const updateFilms = await updatedResponse.json();
      setFilms(updateFilms);
      setUpdateFilm(null);
    }
    const handleDeleteFilm = async (id_film) => {
      if (confirm("Apakah anda yakin akan menghapus produk ini?")) {
        await fetch(`http://localhost:3000/api/delete-film/${id_film}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` },
        })
          .then((response) => response.text())
          .then((message) => {
            alert(message);
          });
        const updatedResponse = await fetch(
          `http://localhost:3000/api/get-all-films`, {
          headers: { "Authorization": `Bearer ${token}` },
        }
        );
        const updateFilms = await updatedResponse.json();
        setFilms(updateFilms);
      }
    }
    const handleFileChange = (event) => {
      const { id, files } = event.target;
      if (files.length > 0) {
        setNewFilm((prev) => ({
          ...prev,
          [id]: files[0],
        }));
      }
    };

    const handleAddNewFilm = async () => {
      try {
        const filmExist = filterData.some((item) => item.judul_film === newFilm.judul_film);
        if (!filmExist) {
          const formData = new FormData();
          formData.append("judul_film", newFilm.judul_film || "");
          formData.append("artist", newFilm.artist || "");
          formData.append("rilis", newFilm.rilis || "");
          formData.append("id_type", newFilm.id_type || "");
          formData.append("image", newFilm.image || "");
          if (newFilm.video) {
            formData.append("video", newFilm.video);
          }
          const response = await fetch(`http://localhost:3000/api/post-film`, {
            method: "POST",
            body: formData,
            headers: { "Authorization": `Bearer ${token}` },
          }
          );
          await response.json();
          const updatedResponse = await fetch(
            `http://localhost:3000/api/get-all-films`, {
            headers: { "Authorization": `Bearer ${token}` },
          }
          );
          const updateFilms = await updatedResponse.json();
          setFilms(updateFilms);
        }
        else {
          alert('Film already exists');
        }
      } catch (error) {
        console.error("Failed to add new film:", error);
      }
      setNewFilm(null);
    };

    return (
      <main className="flex gap-10">
        <div className="w-64 h-screen bg-gray-200">
          <SideBar />
        </div>
        <div className="p-6 shadow-md min-h-screen w-full bg-gray-900 ">
          <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 rounded-lg shadow-lg">
            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-3">
                <span className="font-semibold text-white">Sort By:</span>
                <select
                  className="rounded-lg border-2 border-solid border-gray-600 h-10 text-sm text-white bg-gray-800 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="id_film">Normal</option>
                  <option value="judul_film">Title Film</option>
                  <option value="rilis">Rilis</option>
                </select>
              </label>
              <label className="flex items-center gap-3">
                <span className="font-semibold text-white">Order:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="h-10 text-sm rounded-lg bg-gray-800 text-white border-2 border-solid border-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </label>
            </div>
            {role === "admin" && (
              <button
                onClick={() =>
                  setNewFilm({
                    judul_film: "",
                    artist: "",
                    rilis: "",
                    id_type: "",
                    image: "",
                    video: null,
                  })
                }
                className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <PlusCircle size={20} className="text-white" />
                <span>Add New Film</span>
              </button>
            )}
          </div>

          <div className="mt-6">
            {filterData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {filterData.map((film) => (
                  <div
                    key={film.id_film}
                    className="relative bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white p-6 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    <Link to={`/watch/${film.id_film}`} className="block">
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
                    {role === "admin" && (
                      <div className="absolute bottom-4 right-4 flex space-x-4">
                        <button
                          onClick={() => setUpdateFilm(film)}
                          className="text-yellow-500 hover:text-yellow-600 p-2 rounded-full border-2 border-yellow-500 hover:border-yellow-900 transition-all"
                          aria-label="Edit film"
                        >
                          <FilePenLine size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteFilm(film.id_film)}
                          className="text-red-500 hover:text-red-600 p-2 rounded-full border-2 border-red-500 hover:border-red-900 transition-all"
                          aria-label="Delete film"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center col-span-4">No films available.</p>
            )}
          </div>

          {newFilm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 animate-fadeIn">
              <div className="bg-gray-900 text-white p-8 rounded-xl w-full max-w-lg shadow-2xl transform transition-all scale-95 animate-slideUp">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddNewFilm();
                  }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-center text-yellow-400 animate-pulse">
                    Add New Film
                  </h2>

                  <div className="group relative">
                    <label className="block mb-2 font-semibold text-gray-300">Judul Film</label>
                    <input
                      type="text"
                      id="judul_film"
                      value={newFilm.judul_film || ""}
                      onChange={(e) =>
                        setNewFilm({ ...newFilm, judul_film: e.target.value })
                      }
                      className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                  </div>

                  <div className="group relative">
                    <label className="block mb-2 font-semibold text-gray-300">Artist</label>
                    <input
                      type="text"
                      id="artist"
                      value={newFilm.artist || ""}
                      onChange={(e) =>
                        setNewFilm({ ...newFilm, artist: e.target.value })
                      }
                      className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                  </div>

                  <div className="group relative">
                    <label className="block mb-2 font-semibold text-gray-300">Rilis</label>
                    <input
                      type="date"
                      id="rilis"
                      value={newFilm.rilis || ""}
                      onChange={(e) =>
                        setNewFilm({ ...newFilm, rilis: e.target.value })
                      }
                      className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                  </div>

                  <div className="group relative">
                    <label className="block mb-2 font-semibold text-gray-300">Genre</label>
                    <select
                      id="id_type"
                      value={newFilm.id_type || ""}
                      onChange={(e) =>
                        setNewFilm({
                          ...newFilm,
                          id_type: parseInt(e.target.value, 10),
                        })
                      }
                      className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    >
                      <option value="" disabled>
                        Select Genre
                      </option>
                      {genre.map((gen) => (
                        <option key={gen.id_type} value={gen.id_type}>
                          {gen.genre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="group relative">
                    <label className="block mb-2 font-semibold text-gray-300">Image URL</label>
                    <input
                      type="text"
                      id="image"
                      value={newFilm.image || ""}
                      onChange={(e) =>
                        setNewFilm({ ...newFilm, image: e.target.value })
                      }
                      className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                  </div>

                  <div className="group relative">
                    <label className="block mb-2 font-semibold text-gray-300">Video</label>
                    <input
                      type="file"
                      id="video"
                      onChange={handleFileChange}
                      className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                  </div>

                  <div className="flex justify-between gap-4">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-all shadow-md transform hover:scale-105"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewFilm(null)}
                      className="w-full py-3 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all shadow-md transform hover:scale-105"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {updatedFilms && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 animate-fadeIn">
              <div className="bg-gray-900 text-white p-8 rounded-xl w-full max-w-lg shadow-2xl transform transition-all scale-95 animate-slideUp">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateFilm();
                  }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-center text-yellow-400 animate-pulse">
                    Update Film
                  </h2>

                  <div className="group relative">
                    <label className="block mb-2 font-semibold text-gray-300">Judul Film</label>
                    <input
                      type="text"
                      id="judul_film"
                      value={updatedFilms.judul_film || ""}
                      onChange={(e) =>
                        setUpdateFilm({ ...updatedFilms, judul_film: e.target.value })
                      }
                      className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                  </div>

                  <div className="group relative">
                    <label className="block mb-2 font-semibold text-gray-300">Artist</label>
                    <input
                      type="text"
                      id="artist"
                      value={updatedFilms.artist || ""}
                      onChange={(e) =>
                        setUpdateFilm({ ...updatedFilms, artist: e.target.value })
                      }
                      className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                  </div>

                  <div className="group relative">
                    <label className="block mb-2 font-semibold text-gray-300">Rilis</label>
                    <input
                      type="date"
                      id="rilis"
                      value={updatedFilms.rilis || ""}
                      onChange={(e) =>
                        setUpdateFilm({ ...updatedFilms, rilis: e.target.value })
                      }
                      className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                  </div>

                  <div className="group relative">
                    <label className="block mb-2 font-semibold text-gray-300">Image URL</label>
                    <input
                      type="text"
                      id="image"
                      value={updatedFilms.image || ""}
                      onChange={(e) =>
                        setUpdateFilm({ ...updatedFilms, image: e.target.value })
                      }
                      className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                  </div>

                  <div className="group relative">
                    <label className="block mb-2 font-semibold text-gray-300">Genre</label>
                    <select
                      id="id_type"
                      value={updatedFilms.id_type || ""}
                      onChange={(e) =>
                        setUpdateFilm({
                          ...updatedFilms,
                          id_type: parseInt(e.target.value, 10),
                        })
                      }
                      className="border border-gray-700 bg-gray-800 text-white p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    >
                      <option value="" disabled>
                        Select Genre
                      </option>
                      {genre.map((gen) => (
                        <option key={gen.id_type} value={gen.id_type}>
                          {gen.genre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between gap-4">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-all shadow-md transform hover:scale-105"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpdateFilm(null)}
                      className="w-full py-3 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all shadow-md transform hover:scale-105"
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
  }
};

export default FilmController;
