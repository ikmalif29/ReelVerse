import { User, Facebook, Twitter, Instagram, Globe, Edit, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ProfileUser = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem("userLogin");
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
    }, []);

    const handleLogOut = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userLogin");
        navigate("/login");
    };

    return (
        <motion.div
            className="w-full h-auto min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-indigo-800 to-purple-900"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start justify-center p-6">
                {/* Sidebar */}
                <div className="w-full lg:w-1/3 bg-gray-900 shadow-lg rounded-lg p-6 mb-6 lg:mb-0 lg:mr-6">
                    <div className="text-center mb-6">
                        <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                            <User className="text-gray-400" size={48} />
                        </div>
                        <button className="mt-4 text-blue-500 text-sm font-semibold hover:underline">
                            Upload Picture
                        </button>
                    </div>
                    <div className="space-y-4">
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500">
                            <Facebook size={20} />
                            <span>Add Facebook</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500">
                            <Twitter size={20} />
                            <span>Add Twitter</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500">
                            <Instagram size={20} />
                            <span>Add Instagram</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500">
                            <Globe size={20} />
                            <span>Add Google+</span>
                        </button>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="w-full lg:w-2/3 bg-gray-900 shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-semibold text-gray-100 mb-4 text-center lg:text-left">PROFILE</h1>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Username:</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full p-3 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={userData.username ? userData.username.split('@')[0] : ""}
                                    readOnly
                                />
                                <Edit className="absolute right-3 top-3 text-gray-500" size={20} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">E-mail:</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full p-3 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={userData.username || ""}
                                    readOnly
                                />
                                <Edit className="absolute right-3 top-3 text-gray-500" size={20} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password:</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full p-3 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={userData.password || ""}
                                    readOnly
                                />
                                <Edit className="absolute right-3 top-3 text-gray-500" size={20} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">About Me:</label>
                            <textarea
                                className="w-full p-3 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                rows="3"
                                value={
                                    userData.about ||
                                    "Tell us more about yourself!"
                                }
                                readOnly
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Update Information
                        </button>

                        <button
                            type="button"
                            onClick={handleLogOut}
                            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 mt-4 flex items-center justify-center"
                        >
                            <LogOut className="mr-2" size={20} />
                            Log Out
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileUser;
