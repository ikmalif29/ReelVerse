import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useState } from 'react';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

import { createContext } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const searchContext = createContext();

export default function App() {
  const [search, setSearch] = useState([]);
  const [role, setRole] = useState();

  useEffect(() => {
    setRole(Cookies.get("role"));
  }, [role]);
  return (
    <searchContext.Provider value={{ search, setSearch }} >
      {
        role == "user" ? (<Header />) : null
      }
      <Outlet />
      {
        role == "user" ? (<Footer />) : null
      }
    </searchContext.Provider>
  );
}