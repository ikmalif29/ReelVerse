import { useState } from 'react';
import Cookies from 'js-cookie';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        Cookies.set('token', data.token, { expires: 1 });
        Cookies.set('role', data.role, { expires: 1 });
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("itsData", JSON.stringify(data));
        localStorage.setItem("userLogin", JSON.stringify({username,password}))
        Cookies.get("role") == "admin" ? navigate("/admin/dash") : navigate("/user/");
      } else {
        setError('Login failed. Please check your username and password.');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <motion.div
      className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-900 via-indigo-800 to-purple-800"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-900 via-indigo-800 to-purple-800 px-4 w-[480px]">
        <div className="relative bg-gray-900 text-white rounded-xl shadow-2xl p-8 w-full max-w-wd">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-4 border-green-400">
              <User className="text-green-400" size={48} />
            </div>
          </div>

          <div className="flex justify-between text-gray-400 mt-16 mb-8">
            <button className="w-1/2 text-center font-medium text-lg text-white border-b-2 border-green-400 pb-2 hover:text-green-300 transition-colors">
              Login
            </button>
            <button
              className="w-1/2 text-center font-medium text-lg pb-2 hover:text-green-300 hover:border-green-300 transition-colors"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition-all"
            >
              Submit
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-gray-400 hover:text-green-300">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
