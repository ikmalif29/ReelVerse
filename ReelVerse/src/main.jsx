import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter } from 'react-router-dom';
import { RouterProvider } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AnimatePresence } from 'framer-motion';
import ProfileUser from './pages/ProfileUser.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import FilmController from './pages/FilmController.jsx';
import GenreController from './pages/GenreController.jsx';
import ListFilm from './pages/ListFilm.jsx';
import Watch from './pages/Watch.jsx';
import GenreList from './pages/GenreList.jsx';
import AccessDenied from './pages/AccessDenied.jsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement : <AccessDenied />,
    children: [
      {
        path: "/user",
        element: <Home />,
      },
      {
        path: "/user/profileUser",
        element: <ProfileUser />,
      },
      {
        path: "/admin/dash",
        element: <DashboardPage />,
      },
      {
        path: "/admin/filmcon",
        element: <FilmController />,
      },
      {
        path: "/admin/genrecon",
        element: <GenreController />,
      },
      {
        path: "/user/list",
        element: <ListFilm />,
      },
      {
        path: "/watch/:id",
        element: <Watch />,
      },
      {
        path: "/user/genre",
        element: <GenreList />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AnimatePresence>
      <RouterProvider router={router} />
    </AnimatePresence>
  </StrictMode>
);
