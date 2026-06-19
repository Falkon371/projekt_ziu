import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function Register() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mess, setMess] = useState("");

  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    userName: "",
  });

  const [error, setError] = useState({});

  const validateData = (name, value) => {
    switch (name) {
      case "email":
        if (
          !value.includes("@") ||
          !(
            value.endsWith(".com") ||
            value.endsWith(".pl") ||
            value.endsWith(".org")
          )
        )
          return "Email musi zawierać '@' oraz końcówkę .com/.pl/.org";
        break;
      case "password":
        if (value.length < 6)
          return "Hasło musi mieć co najmniej 6 znaków";
        break;
      case "name":
      case "userName":
        if (!value) return "To pole jest wymagane";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const errorMessage = validateData(name, value);

    setError((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const validData = ({ email, password, name, userName }) => {
    if (
      !email.includes("@") ||
      !(
        email.endsWith(".com") ||
        email.endsWith(".pl") ||
        email.endsWith(".org")
      )
    )
      return false;
    if (password.length < 6) return false;
    if (!name) return false;
    if (!userName) return false;
    return true;
  };

  const sendData = () => {
    const isValid = validData(data);
    if (!isValid) {
      console.error("Wszystkie pola muszą być wypełnione poprawnie.");
      return;
    }

    axios
      .post("http://localhost:8081/auth/register", data)
      .then((response) => {
        console.log("Dane zostały wysłane pomyślnie", response.data);
        setMess(response.data)
      })
      .catch((error) => {
        if(error.response){
          setMess(error.data)
        }else{
          setMess("Błąd połączenia z serwerem")
        }
        console.error("Wystąpił błąd podczas wysyłania danych:", error);
      });
  };

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
      backgroundColor: theme.palette.background.default,
    }}
  >
    <Box
      sx={{
        width: "100%",
        maxWidth: 480,
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
      <Typography
        variant="h5"
        align="center"
        fontWeight="bold"
        sx={{ fontSize: { xs: "1.3rem", sm: "1.5rem" } }}
      >
        Rejestracja
      </Typography>

      <TextField
        name="email"
        label="Wpisz e-mail"
        fullWidth
        value={data.email}
        error={!!error.email}
        helperText={error.email}
        onChange={handleChange}
      />

      <TextField
        name="password"
        type="password"
        label="Wpisz hasło"
        fullWidth
        value={data.password}
        error={!!error.password}
        helperText={error.password}
        onChange={handleChange}
      />

      <TextField
        name="name"
        label="Wpisz imię i nazwisko"
        fullWidth
        value={data.name}
        error={!!error.name}
        helperText={error.name}
        onChange={handleChange}
      />

      <TextField
        name="userName"
        label="Wpisz nazwę użytkownika"
        fullWidth
        value={data.userName}
        error={!!error.userName}
        helperText={error.userName}
        onChange={handleChange}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mt: 2,
        }}
      >
        <Button
          component={Link}
          to="/login"
          variant="outlined"
          fullWidth
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? "#f0f8ff"
                  : "#334a5e",
            },
          }}
        >
          Login
        </Button>

        <Button
          variant="contained"
          onClick={sendData}
          fullWidth
          sx={{
            color: "#fff",
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? "#75b5b7"
                  : "#5cacc4",
            },
          }}
        >
          Register
        </Button>
      </Box>

      {mess && (
        <Typography
          variant="body2"
          color="primary"
          align="center"
          sx={{ mt: 1, fontSize: "0.9rem" }}
        >
          {mess}
        </Typography>
      )}
    </Box>
  </Box>
  </Box>
);
}

export default Register;
