import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import AccessDenied from "../pages/AccessDenied"; // Import halaman error

export default function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = Cookies.get("role");
  const location = useLocation();
  const currentPath = location.pathname; // Menggunakan `useLocation` untuk mendapatkan path
  const itsData = JSON.parse(localStorage.getItem("itsData")) || {}; // Pastikan `itsData` adalah objek

  // Debugging log
  console.log("Role:", role);
  console.log("Current Path:", currentPath);

  // Periksa jika pengguna belum login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Navigasi berdasarkan role di `itsData`
  if (itsData.role === "admin" && currentPath === "/") {
    return <Navigate to="/admin/dash" replace />;
  }

  if (itsData.role === "user" && currentPath === "/") {
    return <Navigate to="/user" replace />;
  }

  // Blok akses berdasarkan role dan path
  if (role === "admin" && currentPath.includes("user")) {
    return <AccessDenied />;
  }

  if (role === "user" && currentPath.includes("admin")) {
    return <AccessDenied />;
  }

  // Jika semua aturan terpenuhi, tampilkan anak komponen
  return children;
}
