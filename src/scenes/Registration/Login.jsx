import { Box, Typography, TextField, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { motion } from "framer-motion";

function Login(){
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [color, setColor] = useState("grey");
    const [godLog, setGodLog] = useState("");
    const theme = useTheme();

    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value} = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    

    const sentData = () => {
        setLoading(true);
        axios.post("http://localhost:8081/auth/login", data)
        .then((response) => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            window.dispatchEvent(new Event("roleChange"));
            window.location.href = response.data.role === "admin" ? "/homeAdmin" : "/homeUser";

            setError(null);
            console.log("Dane zostały wysłane pomyślnie", response.data);
            console.log("Zalogowano jako: ", response.data.role);
            localStorage.setItem("email", data.email);
        })
        .catch((error) => {
            if (error.response) {
                if (error.response.status === 429) {
                    alert(`${error.response.data.error} Spróbuj ponownie za ${error.response.data.retryAfter} sekund.`);
                } else {
                    setError(error.response.data.message || "Wystąpił błąd podczas logowania");
                    setColor("red");
                    setGodLog("Błędne hasło lub e-mail");
                }
            } else {
                setError("Brak połączenia z serwerem");
            }
            console.error("Wystąpił błąd podczas wysyłania danych", error);
        })
        .finally(() => setLoading(false));
    }


   return (
    <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      px: 2,
    }}
  >
    <Box
      sx={{
        width: "100%",
        maxWidth: 420,
        p: { xs: 2.5, sm: 4 },
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: { xs: 20, sm: 24 },
          }}
        >
          Login
        </Typography>
      </Box>

      <Typography
        align="center"
        sx={{
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
        color={color}
      >
        {godLog}
      </Typography>

      <TextField
        name="email"
        variant="outlined"
        fullWidth
        label="Wpisz e-mail"
        value={data.email}
        onChange={handleChange}
        InputProps={{
          style: { color: color },
        }}
        InputLabelProps={{ style: { color } }}
      />

      <TextField
        name="password"
        type="password"
        variant="outlined"
        fullWidth
        label="Wpisz hasło"
        value={data.password}
        onChange={handleChange}
        InputProps={{
          style: { color: color },
        }}
        InputLabelProps={{ style: { color } }}
      />

      {error && (
        <Typography color="error" sx={{ fontSize: "0.9rem" }}>
          {error}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={sentData}
          fullWidth
        >
          {isLoading ? "Logowanie..." : "Login"}
        </Button>

        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/register"
          fullWidth
        >
          Register
        </Button>
      </Box>
    </Box>
  </Box>
  </Box>
);
}

export default Login;
