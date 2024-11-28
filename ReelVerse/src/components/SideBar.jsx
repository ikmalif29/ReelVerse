import { House } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
    };

    return (
        <div className="flex flex-col h-screen w-64 bg-gray-900 border-r border-gray-700 shadow-md fixed">
            <div className="flex justify-center py-6">
                <span className="text-xl text-white font-bold">Admin Panel</span>
            </div>

            <div className="flex-1 px-4 space-y-6">
                <div className="mb-6" onClick={() => navigate("/admin/dash")}>
                    <li className="flex items-center space-x-3 hover:bg-gray-800 rounded-md px-2 py-2 transition duration-300">
                        <span className="text-2xl text-white"><House /></span>
                        <a href="#genres" className="text-lg text-white hover:text-teal-500 font-medium transition duration-200">
                            Dashboard
                        </a>
                    </li>
                </div>
                <div className="mb-6" onClick={() => navigate("/admin/genrecon")}>
                    <li className="flex items-center space-x-3 hover:bg-gray-800 rounded-md px-2 py-2 transition duration-300">
                        <span className="text-2xl text-white">📚</span>
                        <a href="#genres" className="text-lg text-white hover:text-teal-500 font-medium transition duration-200">
                            Genre
                        </a>
                    </li>
                </div>

                <div onClick={() => navigate("/admin/filmcon")}>
                    <ul className="space-y-4">
                        <li className="flex items-center space-x-3 hover:bg-gray-800 rounded-md px-2 py-2 transition duration-300">
                            <span className="text-2xl text-white">🎥</span>
                            <a href="#films" className="text-lg text-white hover:text-teal-500 font-medium transition duration-200">
                                Film
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Logout Button */}
            <div className="px-4 pb-6">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white text-lg font-medium py-2 rounded-md hover:bg-red-500 transition duration-300"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default SideBar;
