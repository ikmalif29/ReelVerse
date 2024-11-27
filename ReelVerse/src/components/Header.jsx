import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Film } from 'lucide-react';
import { TvMinimalPlay } from 'lucide-react';
import { User } from 'lucide-react';
import { searchContext } from "../App";

const Header = () => {
  const navigate = useNavigate();
  const { search, setSearch } = useContext(searchContext);

  const handleSearch = (e) => {
    setSearch(e.target.value);  // Update search query from context
  };

  return (
    <header className="bg-gray-900 text-white px-4 py-4 shadow-lg flex flex-wrap items-center justify-between h-auto md:h-24 sticky top-0 z-50">
      <div
        className="flex items-center space-x-2 cursor-pointer hover:text-orange-600 transition-all mb-4 md:mb-0"
        onClick={() => navigate('/user/')}
      >
        <TvMinimalPlay className='icon' size={34} />
        <h1 className="text-xl md:text-3xl font-bold">ReelVerse</h1>
      </div>

      <form
        className="relative flex items-center w-full md:max-w-md mx-4 mb-4 md:mb-0"
      >
        <Search className="absolute left-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search movies..."
          value={search}  // Bind the input field to the search value from context
          onChange={handleSearch}  // Directly call handleSearch when input changes
          className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 transition-all"
        />
      </form>

      <div className="flex flex-wrap items-center space-y-2 md:space-y-0 md:space-x-4">
        <button
          onClick={() => navigate("/user/list")}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:ring-4 focus:ring-green-300 transition-all"
        >
          <Film size={20} />
          <span className="font-bold">List Film</span>
        </button>

        <button
          onClick={() => navigate('/user/genre')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 transition-all"
        >
          <Film size={20} />
          <span className="font-bold">Genres</span>
        </button>

        <button
          onClick={() => navigate("/user/profileUser")}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 transition-all"
        >
          <User size={20} className="text-white" />
          <span className="font-bold">Profile</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
