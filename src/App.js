import { Routes, useLocation, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import Topbar from "./components/Topbar";
import Login from "./scenes/Registration/Login";
import Register from "./scenes/Registration/Register";
import DefaultScreen from "./scenes/DefaultScreen";
import HomeAdmin from "./scenes/Admin/HomeAdmin";
import PremieCz2 from "./scenes/PremieCz2";
import Premie from "./scenes/Premie";
import HomeUser from "./scenes/User/HomeUser";
import AdminPanel from "./scenes/Admin/AdminPanel";
import History from "./scenes/History";
import designToken from "./components/DesignToken";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AnimatePresence, motion } from "framer-motion";


function AnimatedRoutes({ role }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {role === "admin" && (
          <>
            <Route path="/homeAdmin" element={<HomeAdmin />} />
            <Route path="/premie" element={<Premie />} />
            <Route path="/premiecz2" element={<PremieCz2 />} />
            <Route path="/adminPanel" element={<AdminPanel />} />
            <Route path="/history" element={<History />} />
            <Route path="/" element={<Navigate to="/homeAdmin" />} />
          </>
        )}

        {role === "user" && (
          <>
            <Route path="/homeUser" element={<HomeUser />} />
            <Route path="/premie" element={<Premie />} />
            <Route path="/premiecz2" element={<PremieCz2 />} />
            <Route path="/" element={<Navigate to="/homeUser" />} />
          </>
        )}

        {!role && (
          <>
            <Route path="/" element={<DefaultScreen />} />
            <Route path="/*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [mode, setMode] = useState(() => localStorage.getItem("mode") || "light");

  const theme = useMemo(() => createTheme(designToken(mode)), [mode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  useEffect(() => {
    const handleRoleChange = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("roleChange", handleRoleChange);
    return () => window.removeEventListener("roleChange", handleRoleChange);
  }, []);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <div style={{ flex: 1 }}>
          <Topbar setMode={setMode} />

          <AnimatedRoutes role={role} />
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
