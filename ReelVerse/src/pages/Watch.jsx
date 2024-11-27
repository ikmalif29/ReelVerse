import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Watch = () => {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [genre, setGenre] = useState(null);
  const token = Cookies.get("token");
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/get-film/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch film data.");
        }
        const data = await response.json();
        setFilm(data);
      } catch (error) {
        console.error("Error fetching film:", error);
      }
    };
    fetchFilm();
  }, [id, token]);

  useEffect(() => {
    if (film) {
      const fetchGenre = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/get-genre-by-id/${film.id_type}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch genre data.");
          }
          const data = await response.json();
          setGenre(data);
        } catch (error) {
          console.error("Error fetching genre:", error);
        }
      };
      fetchGenre();
    }
  }, [film, token]);

  if (!film) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white -z-10">
      {/* Main Content */}
      <main className="p-6 max-w-6xl mx-auto">
        <div className="relative">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)} // Navigate back to the previous page
            className="text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 mb-6"
          >
            Back
          </button>

          {/* Video Section */}
          <div className="relative rounded-lg overflow-hidden shadow-lg mb-6">
            <video
              controls
              className="w-full h-auto object-cover"
              src={`http://localhost:3000/uploads/${film.video}`}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Film Details */}
          <div className="bg-black bg-opacity-60 rounded-lg p-6 shadow-md">
            <h2 className="text-3xl font-bold mb-4">{film.judul_film}</h2>
            <p className="mb-4">{film.deskripsi}</p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center justify-between space-y-2 text-sm md:text-base">
              <p>
                <strong>Release Date:</strong> {new Date(film.rilis).toLocaleDateString()}
              </p>
              <p>
                <strong>Director/Actor:</strong> {film.artist}
              </p>
              <p>
                <strong>Genre:</strong> {genre ? genre[0].genre : "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Watch;
