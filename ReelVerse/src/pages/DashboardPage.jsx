import SideBar from "../components/SideBar";
import { Doughnut, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const DashboardPage = () => {
    // Dummy data for the charts
    const genreData = {
        labels: ["Action", "Comedy", "Drama", "Horror", "Romance"],
        datasets: [
            {
                data: [300, 150, 200, 120, 90],
                backgroundColor: [
                    "#FF5733", // Action
                    "#33FF57", // Comedy
                    "#3357FF", // Drama
                    "#FF33A1", // Horror
                    "#FFDF33", // Romance
                ],
                borderColor: "#fff",
                borderWidth: 2,
            },
        ],
    };

    const salesData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Sales",
                data: [500, 400, 450, 550, 600, 700, 800, 650, 720, 780, 850, 900],
                backgroundColor: "#FF5733",
                borderColor: "#FF5733",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="flex h-screen">
            <div className="w-64 h-screen bg-gray-200">
                <SideBar />
            </div>
            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-900 overflow-auto">
                <div className="text-center text-white text-3xl font-semibold mb-8">
                    Admin Dashboard
                </div>

                {/* Stats Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Stats Cards */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white text-center">
                        <span className="text-3xl font-bold">1,200</span>
                        <p className="text-lg">Total Users</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white text-center">
                        <span className="text-3xl font-bold">350</span>
                        <p className="text-lg">Total Watch</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white text-center">
                        <span className="text-3xl font-bold">$12,500</span>
                        <p className="text-lg">Revenue</p>
                    </div>
                </div>

                {/* Donut and Bar Chart Section (Side by Side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {/* Donut Chart */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="text-center mb-4">
                            <span className="text-2xl text-white font-semibold">Film Genre Distribution</span>
                        </div>
                        <div className="flex justify-center items-center">
                            <div style={{ maxWidth: '300px', maxHeight: '300px', width: '100%' }}>
                                <Doughnut data={genreData} />
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="text-center mb-4">
                            <span className="text-2xl text-white font-semibold">Monthly Watching</span>
                        </div>
                        <div className="flex justify-center items-center">
                            <Bar data={salesData} options={{ responsive: true }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
