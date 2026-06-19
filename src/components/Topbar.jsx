import {Box, Grow, IconButton, Button, useTheme} from "@mui/material";
import {use, useContext, useState} from "react";
import { Link } from "react-router-dom";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HomeIcon from '@mui/icons-material/Home';
import Fade from '@mui/material/Fade';
import Dropdown from 'react-bootstrap/Dropdown';
import './Topbar.css';
import { FaChevronDown } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import DarkMode from "./DarkMode.tsx";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const Topbar = ({setMode}) => {
    const [modeIcon, setModeIcon] = useState(localStorage.getItem("mode") || "light");
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.reload();
        navigate("/login");
    }

return (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      px: { xs: 1, sm: 2 },
      py: 1.5,
      borderBottom: "1px solid #e0e0e0",
      gap: 1,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton onClick={() => navigate("/")}>
        <HomeIcon />
      </IconButton>
    </Box>

    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 0.5, sm: 1 },
      }}
    >
      <IconButton
        onClick={() => {
          setMode((prev) => {
            const newMode = prev === "light" ? "dark" : "light";
            setModeIcon(newMode);
            localStorage.setItem("mode", newMode);
            return newMode;
          });
        }}
      >
        {modeIcon === "light" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>

      <Dropdown>
        <Dropdown.Toggle className="custom-dropdown-toggle">
          Log
        </Dropdown.Toggle>

        <Dropdown.Menu className="custom-dropdown-menu">
          <Dropdown.Item
            onClick={() => navigate("/login")}
            className="custom-dropdown-item"
          >
            Logowanie
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => navigate("/register")}
            className="custom-dropdown-item"
          >
            Rejestracja
          </Dropdown.Item>

          <Dropdown.Item
            onClick={logout}
            className="custom-dropdown-item"
          >
            Wyloguj
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Box>
  </Box>
);
}


export default Topbar;