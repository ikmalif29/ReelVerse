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
      <main className="flex">
        <div className="w-64 h-screen bg-gray-200">
          <SideBar />
        </div>
        <div className="p-6   shadow-md min-h-screen w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2">
                <span className="font-semibold">Sort By:</span>
                <select
                  className="rounded-lg border-2 border-solid border-gray-200 h-9 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="id_film">Normal</option>
                  <option value="judul_film">Title Film</option>
                  <option value="rilis">Rilis</option>
                </select>
              </label>
              <label className="flex items-center gap-2">
                <span className="font-semibold">Order:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="h-9 p-2 text-sm rounded-lg outline-blue-400 border-2 border-solid border-gray-500"
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
                className="flex items-center gap-2 p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
              >
                <PlusCircle size={20} className="text-white" /> Add New Film
              </button>
            )}
          </div>
          <div className="mt-6">
            {filterData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterData.map((film) => (
                  <div
                    key={film.id_film}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Link to={`/watch/${film.id_film}`}>
                      <h2 className="text-xl font-semibold mb-2">
                        {film.judul_film}
                      </h2>
                      <img
                        src={film.image}
                        alt="not found"
                        className="w-full h-40 object-cover mb-2 rounded-lg"
                      />
                      <p className="text-gray-600">{film.artist}</p>
                      <p className="text-gray-500">
                        {new Date(film.rilis).toLocaleDateString()}
                      </p>
                    </Link>
                    {role == "admin" &&
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => setUpdateFilm(film)}
                          className="text-blue-500 hover:text-blue-600 p-2 rounded-md border border-blue-500 hover:border-blue-600 transition-colors"
                          aria-label="Edit film"
                        >
                          <FilePenLine size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteFilm(film.id_film)}
                          className="text-red-500 hover:text-red-600 p-2 rounded-md border border-red-500 hover:border-red-600 transition-colors"
                          aria-label="Delete film"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No Film available.</p>
            )}
          </div>
          {newFilm && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddNewFilm();
                  }}
                >
                  <h2 className="text-2xl font-bold mb-6">Add New Film</h2>

                  <label className="block mb-2 font-semibold">Judul Film</label>
                  <input
                    type="text"
                    id="judul_film"
                    value={newFilm.judul_film || ""}
                    onChange={(e) =>
                      setNewFilm({ ...newFilm, judul_film: e.target.value })
                    }
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="block mb-2 font-semibold">Artist</label>
                  <input
                    type="text"
                    id="artist"
                    value={newFilm.artist || ""}
                    onChange={(e) =>
                      setNewFilm({ ...newFilm, artist: e.target.value })
                    }
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="block mb-2 font-semibold">Rilis</label>
                  <input
                    type="date"
                    id="rilis"
                    value={newFilm.rilis || ""}
                    onChange={(e) =>
                      setNewFilm({ ...newFilm, rilis: e.target.value })
                    }
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="block mb-2 font-semibold">Genre</label>
                  <select
                    id="id_type"
                    value={newFilm.id_type || ""}
                    onChange={(e) =>
                      setNewFilm({
                        ...newFilm,
                        id_type: parseInt(e.target.value, 10),
                      })
                    }
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                  <label className="block mb-2 font-semibold">Image URL</label>
                  <input
                    type="text"
                    id="image"
                    value={newFilm.image || ""}
                    onChange={(e) =>
                      setNewFilm({ ...newFilm, image: e.target.value })
                    }
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="block mb-2 font-semibold">video</label>
                  <input
                    type="file"
                    id="video"
                    onChange={handleFileChange}
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewFilm(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {updatedFilms && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateFilm();
                  }}
                >
                  <h2 className="text-2xl font-bold mb-6">Add New Film</h2>

                  <label className="block mb-2 font-semibold">Judul Film</label>
                  <input
                    type="text"
                    id="judul_film"
                    value={updatedFilms.judul_film || ""}
                    onChange={(e) =>
                      setUpdateFilm({ ...updatedFilms, judul_film: e.target.value })
                    }
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="block mb-2 font-semibold">Artist</label>
                  <input
                    type="text"
                    id="artist"
                    value={updatedFilms.artist || ""}
                    onChange={(e) =>
                      setUpdateFilm({ ...updatedFilms, artist: e.target.value })
                    }
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="block mb-2 font-semibold">Rilis</label>
                  <input
                    type="date"
                    id="rilis"
                    value={updatedFilms.rilis || ""}
                    onChange={(e) =>
                      setUpdateFilm({ ...updatedFilms, rilis: e.target.value })
                    }
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="block mb-2 font-semibold">Image URL</label>
                  <input
                    type="text"
                    id="image"
                    value={updatedFilms.image || ""}
                    onChange={(e) =>
                      setUpdateFilm({ ...updatedFilms, image: e.target.value })
                    }
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="block mb-2 font-semibold">Genre</label>
                  <select
                    id="id_type"
                    value={updatedFilms.id_type || ""}
                    onChange={(e) =>
                      setUpdateFilm({
                        ...updatedFilms,
                        id_type: parseInt(e.target.value, 10),
                      })
                    }
                    className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpdateFilm(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
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
