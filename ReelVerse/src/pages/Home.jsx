import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

const movies = [
    { id: 1, title: "Shadow and Bone", description: "A story of light and shadow in a fantasy world.", image: "https://occ-0-8407-114.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABZRYyrqI2bjlYZiWQqzzJAYM8m__aNCMB2z9RB9AD4bXfFOX-aiGyvaAOq5xdTjPT9CN7jfPbzb4vE-UerYSeFZhUwZblPQ4-Bv2QIBMYPuqRFE6w_qPPCA4gG7qt5aPGkWygA.webp?r=d5b" },
    { id: 2, title: "The Night Agent", description: "A thrilling spy story with unexpected twists.", image: "https://occ-0-8407-114.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABRTyNqGN71jPGYh8ODB1hjlPg4ScqQfe_geHYoDI_OuZ1BViJUICKKs0OfX2fBsxoPoGcekinCuBswnaVOEtMm8Krfokj3qHbIvKEZ3IRU6cv47C1H0JHVR2_2FQlzOjgjB60A.webp?r=71f" },
    { id: 3, title: "Gladiator II", description: "A sequel to the 2000s classic, starring Paul Mescal, Denzel Washington, and Pedro Pascal. It will explore the brutal Roman Empire and its gladiatorial combat.", image: "https://d1tgyzt3mf06m9.cloudfront.net/v3-staging/2024/11/Review-Gladiator-II.jpg" },
    { id: 4, title: "Elevation", description: "A post-apocalyptic horror-sci-fi film where a father and his companions face monsters in the Rocky Mountains.", image: "https://erakini.id/images/post/16_9/img-20241103-wa0000_1730588076.webp" },
    { id: 5, title: "Wicked", description: "A musical adaptation starring Ariana Grande and Cynthia Erivo, exploring the witches' backstory from The Wizard of Oz.", image: "https://media.suara.com/pictures/653x366/2024/11/21/77383-sinopsis-film-wicked.jpg" },
    { id: 6, title: "Heretic", description: "A suspenseful thriller featuring Hugh Grant in a dark, villainous role..", image: "https://pbcdn1.podbean.com/imglogo/ep-logo/pbblog788999/HERETICMAIN.jpg" },
    { id: 7, title: "Red One", description: "A holiday action-comedy starring Dwayne Johnson and Chris Evans saving Santa Claus.", image: "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/46/2024/11/14/FotoJet-68-1957755682.jpg" },
];

const sliderImages = [
    "https://occ-0-8407-114.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABZRYyrqI2bjlYZiWQqzzJAYM8m__aNCMB2z9RB9AD4bXfFOX-aiGyvaAOq5xdTjPT9CN7jfPbzb4vE-UerYSeFZhUwZblPQ4-Bv2QIBMYPuqRFE6w_qPPCA4gG7qt5aPGkWygA.webp?r=d5b",
    "https://occ-0-8407-114.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABRTyNqGN71jPGYh8ODB1hjlPg4ScqQfe_geHYoDI_OuZ1BViJUICKKs0OfX2fBsxoPoGcekinCuBswnaVOEtMm8Krfokj3qHbIvKEZ3IRU6cv47C1H0JHVR2_2FQlzOjgjB60A.webp?r=71f",
    "https://d1tgyzt3mf06m9.cloudfront.net/v3-staging/2024/11/Review-Gladiator-II.jpg",
    "https://erakini.id/images/post/16_9/img-20241103-wa0000_1730588076.webp",
    "https://media.suara.com/pictures/653x366/2024/11/21/77383-sinopsis-film-wicked.jpg",
    "https://pbcdn1.podbean.com/imglogo/ep-logo/pbblog788999/HERETICMAIN.jpg",
];

const Home = () => {
    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [currentSliderIndex, setCurrentSliderIndex] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [role, setRole] = useState("");

    const totalPages = Math.ceil(movies.length / itemsPerPage);
    const currentMovies = movies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const closePopup = () => setSelectedMovie(null);


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSliderIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setRole(Cookies.get("role"))
        console.log("useEffect called");
    }, []);

    return (
        <motion.div
            className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 via-indigo-800 to-purple-800"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
        >
            <main className="p-4 md:p-6 space-y-8 w-full max-w-screen-xl bg-gradient-to-b from-blue-900 via-indigo-800 to-purple-800">
                {/* Slider Section */}
                <section className="relative w-full h-60 md:h-80 lg:h-96 mb-8">
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center rounded-lg"
                        style={{ backgroundImage: `url(${sliderImages[currentSliderIndex]})` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    ></motion.div>
                </section>

                {/* Movies Grid */}
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentMovies.map((movie) => (
                            <div
                                key={movie.id}
                                className="group bg-gray-700 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                onClick={() => setSelectedMovie(movie)}
                            >
                                <img
                                    src={movie.image}
                                    alt={movie.title}
                                    className="w-full h-40 md:h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-base md:text-lg font-semibold text-center group-hover:text-yellow-400 transition-colors">
                                        {movie.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pagination Controls */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="text-sm md:text-lg font-semibold">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${currentPage === index + 1
                                    ? "bg-yellow-400"
                                    : "bg-gray-500 hover:bg-yellow-400"
                                    } transition-colors duration-200`}
                            ></button>
                        ))}
                    </div>
                </div>

                {/* Movie Details Popup */}
                {selectedMovie && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full space-y-4 relative">
                            <button
                                className="absolute top-2 right-2 text-white hover:text-red-500"
                                onClick={closePopup}
                            >
                                ✖
                            </button>
                            <img
                                src={selectedMovie.image}
                                alt={selectedMovie.title}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                            <h3 className="text-xl md:text-2xl font-bold text-yellow-400">
                                {selectedMovie.title}
                            </h3>
                            <p className="text-gray-300">{selectedMovie.description}</p>
                            <button
                                onClick={closePopup}
                                className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </motion.div>
    );
};

export default Home;
