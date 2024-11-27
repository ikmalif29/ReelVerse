import { Trash2, FilePenLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import SideBar from "../components/SideBar";

const GenreController = () => {
    const [genres, setGenres] = useState([]);
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
        <main className="flex">
        <div className="w-64 h-screen bg-gray-200">
          <SideBar />
        </div>
        <div className="p-6 bg-gray-100 min-h-screen w-full">
            <button
                onClick={() => setAddGenre({ genre: "" })}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
                Add Genre
            </button>
            <h1 className="text-2xl font-bold mb-4">Genres</h1>
            {genres.length > 0 ? (
                <div className="flex flex-wrap gap-4">
                    {genres.map((genre) => (
                        <div key={genre.id_type} className="flex items-center">
                            <button
                                onClick={() => handleButtonClick(genre.id_type)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                {genre.genre}
                            </button>
                            <div className="mt-2 flex space-x-2">
                                <button
                                    onClick={() => setUpdateGenre(genre)}
                                    className="text-white hover:text-yellow-300 p-1 ml-2"
                                    aria-label="Edit genre"
                                >
                                    <FilePenLine size={20} />
                                </button>
                                <button
                                    onClick={() => handleDeleteGenre(genre.id_type)}
                                    className="text-red-500 hover:text-red-600 p-1 ml-2"
                                    aria-label="Delete genre"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No genres available.</p>
            )}

            <div className="mb-5">
                {getGenre.length > 0 && (
                    <div className="mt-5">
                        <h1 className="text-2xl font-bold mb-4">{selectedGenre}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {getGenre.map((film) => (
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
                                            className="w-full h-40 object-cover mb-2 rounded-lg"
                                        />
                                        <p className="text-gray-600">{film.artist}</p>
                                        <p className="text-gray-500">
                                            {new Date(film.rilis).toLocaleDateString()}
                                        </p>
                                    </Link>
                                </div>
                            ))}
                        </div></div>
                )}
            </div>
            {addGenre && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddGenre();
                            }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Add New Genre</h2>
                            <label htmlFor="genre" className="block mb-2 font-semibold">
                                Genre
                            </label>
                            <input
                                type="text"
                                id="genre"
                                value={addGenre.genre || ""}
                                onChange={(e) =>
                                    setAddGenre({ ...addGenre, genre: e.target.value })
                                }
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
                                    onClick={() => setAddGenre(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {updateGenre && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdateGenre(updateGenre.id_type);
                            }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Update Genre</h2>
                            <label htmlFor="genre" className="block mb-2 font-semibold">
                                Genre
                            </label>
                            <input
                                type="text"
                                id="genre"
                                value={updateGenre.genre || ""}
                                onChange={(e) =>
                                    setUpdateGenre({ ...updateGenre, genre: e.target.value })
                                }
                                className="border border-gray-300 p-2 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUpdateGenre(null)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {film.length > 0 && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">List Film</h1> {/* Judul "List Film" */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {film.map((item) => (
                            <div
                                key={item.id_film}
                                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            >
                                <Link to={`/watch/${item.id_film}`}>
                                    <h2 className="text-xl font-semibold mb-2">
                                        {item.judul_film}
                                    </h2>
                                    <img
                                        src={item.image}
                                        alt={item.judul_film}
                                        className="w-full h-40 object-cover mb-2 rounded-lg"
                                    />
                                    <p className="text-gray-600">{item.artist}</p> {/* Corrected here */}
                                    <p className="text-gray-500">
                                        {new Date(item.rilis).toLocaleDateString()}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        </main>
    );
};

export default GenreController;
