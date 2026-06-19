import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  Divider,
  Grid, Alert,
    CircularProgress
} from "@mui/material";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '@mui/material/styles';
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";


const NewItem = ({ field, handleChange, removeItem, role }) => {
  return (
    <Stack spacing={2} mt={2}>
      {field.map((item, index) => (
        <Paper key={index} elevation={3} sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              variant="outlined"
              fullWidth
              label={`Warunek ${index + 1}`}
              value={item.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
            <TextField
              variant="outlined"
              type="number"
              fullWidth
              label={`Premia dla rejestratora ${index + 1}`}
              value={item.valueRes}
              onChange={(e) => handleChange(index, "valueRes", e.target.value)}

            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => removeItem(index)}
            >
              Usuń
            </Button>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

const Premie = () => {
  const [selected, setSelected] = useState("");
  const [obecnyEmail, setObecnyEmail] = useState("");
  const [mapa, setMapa] = useState(new Map());
  const [numbRejestrator, setNumRejestrator] = useState([]);
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [networkError, setNetworkError] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("online");
  //const [selectedDate, setSelectedDate] = useState(new Date());
  const theme = useTheme();

  useEffect(() => {
    const handleRoleChange = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("roleChange", handleRoleChange);
    return () => window.removeEventListener("roleChange", handleRoleChange);
  }, []);

  const [field, setField] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("premie"));
      return Array.isArray(stored)
        ? stored
        : [{ name: "", valueRes: "" }];
    } catch (e) {
      return [{ name: "", valueRes: "" }];
    }
  });
  
  const months = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

  const [dane, setDane] = useState([]);
  const [miesiacDane, setMiesiacDane] = useState();

  console.log("Dane: ", dane);

  const handleChange = (index, key, value) => {
    const updFields = [...field];
    updFields[index][key] = value;
    setField(updFields);
  };

  const addItem = () => {
    setField([...field, { name: "", valueRes: "" }]);
  };

  const removeItem = (indexRemove) => {
    if(role === "admin"){
      setField(field.filter((_, index) => index !== indexRemove));
    }
  };

  const getErrorMessage = (err) => {
  if (!navigator.onLine) {
    return "Brak połączenia z internetem.";
  }

  if (err.code === "ECONNABORTED") {
    return "Przekroczono czas oczekiwania na odpowiedź serwera.";
  }

  if (err.response) {
    switch (err.response.status) {
      case 400:
        return "Niepoprawne dane.";
      case 401:
        return "Brak autoryzacji.";
      case 403:
        return "Brak uprawnień.";
      case 404:
        return "Nie znaleziono zasobu.";
      case 500:
        return "Błąd serwera.";
      default:
        return `Błąd serwera (${err.response.status}).`;
    }
  }

  if (err.request) {
    return "Serwer nie odpowiada.";
  }

  return "Wystąpił nieznany błąd.";
};

  const sendData = async () => {
  setLoading(true);
  setError("");
  setSuccess("");
  setNetworkError(false);

  const isValidRes = field.every(
    (item) =>
      item.name &&
      item.valueRes &&
      !isNaN(item.valueRes)
  );

  if (!isValidRes) {
    setError("Wszystkie pola muszą być wypełnione poprawnie.");
    setLoading(false);
    return;
  }

  const resFieldData = field.map(({ name, valueRes }) => ({
    name: name.replace(/\s+/g, ""),
    value: valueRes,
  }));

  try {
    await axios.post(
      "http://localhost:8081/patients/inputRejestr",
      resFieldData,
      { timeout: 10000 }
    );

    const ikResponse = await axios.get(
      "http://localhost:8081/patients/ikMan",
      { timeout: 10000 }
    );

    setDane({ ...ikResponse.data });

    const wtfResponse = await axios.get(
      "http://localhost:8081/patients/wtfMan",
      { timeout: 10000 }
    );

    setNumRejestrator(wtfResponse.data);

    setServerStatus("online");
    setSuccess("Dane zostały wysłane poprawnie");

  } catch (err) {
    console.error(err);

    setNetworkError(true);
    setServerStatus("offline");

    setError(getErrorMessage(err));

  } finally {
    setLoading(false);
  }
};

const fetchMonthData = async () => {
  try {
    setFetchLoading(true);
    setError("");
    setNetworkError(false);

    const response = await axios.post(
      "http://localhost:8081/patients/miesiacDane",
      { month: currentMonth },
      { timeout: 10000 }
    );

    setMiesiacDane(response.data);

    setServerStatus("online");

  } catch (err) {
    console.error(err);

    setNetworkError(true);
    setServerStatus("offline");

    setError(getErrorMessage(err));

  } finally {
    setFetchLoading(false);
  }
};

useEffect(() => {
  fetchMonthData();
}, [currentMonth]);

  useEffect(() => {
    axios.post("http://localhost:8081/patients/miesiacDane", { month: currentMonth })
      .then((response) => {
        setMiesiacDane(response.data);
        console.log("Dane dla miesiąca:", response.data);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania danych dla miesiąca:", error.response ? error.response.data : error.message);
      });  
  }, [currentMonth]); 

  console.log("Numery rejestratorów: ", numbRejestrator);

  useEffect(() => {
    setSelected(localStorage.getItem("pozwolenia"));
    localStorage.setItem("premie", JSON.stringify(field));
    setObecnyEmail(localStorage.getItem("email"));

  }, [field]);

    useEffect(() => {
    if (selected) {
      try {
        const obj = JSON.parse(selected);
        const map = new Map(Object.entries(obj));
        setMapa(map)
        console.log("Pozwolenia: ", map);
        console.log("Obecny email: ", obecnyEmail);
      } catch (e) {
        console.error("Niepoprawny JSON w selected:", selected);
      }
    }
  }, [selected]);

  console.log("Months: ", {month: currentMonth})

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
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
      width: "100%",
      maxWidth: "100%",
      px: { xs: 2, sm: 3 },
      py: 3,
    }}
  >
    <Typography
      variant="h4"
      gutterBottom
      sx={{
        fontSize: { xs: "1.8rem", sm: "2.2rem" },
        textAlign: { xs: "center", sm: "left" },
      }}
    >
      Premie
    </Typography>

    <Typography
      variant="subtitle1"
      gutterBottom
      sx={{
        fontSize: { xs: "0.9rem", sm: "1rem" },
        textAlign: { xs: "center", sm: "left" },
      }}
    >
      Warunki obliczania premii dla rejestratorów
      (muszą być oddzielone przecinkiem)
    </Typography>

    <NewItem
      field={field}
      handleChange={handleChange}
      removeItem={removeItem}
      role={role}
    />

   <Stack
  direction={{ xs: "column", sm: "row" }}
  spacing={2}
  mt={3}
  width="100%"
>
      

  <Button
    fullWidth
    variant="contained"
    sx={{
      color: theme.palette.text.another,
      py: 1.4,
      fontSize: "1rem",
    }}
    onClick={addItem}
    disabled={loading}
  >
    +
  </Button>

  <Button
    fullWidth
    variant="contained"
    onClick={sendData}
    disabled={loading}
    sx={{
      color: theme.palette.text.another,
      py: 1.4,
      fontSize: "1rem",
    }}
  >
    {loading ? "Wysyłanie..." : "Wyślij dane"}
  </Button>
</Stack>

{success && (
  <Alert severity="success" sx={{ mt: 2 }}>
    {success}
  </Alert>
)}

{serverStatus === "offline" && (
          <Alert
            severity="warning"
            sx={{ mt: 2 }}
            role="alert"
            aria-live="assertive"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={fetchMonthData}
              >
                Ponów
              </Button>
            }
          >
            Problem z połączeniem z serwerem.
          </Alert>
        )}

    <Divider sx={{ my: 4 }} />

    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: { xs: 1, sm: 2 },
        mb: 4,
      }}
    >
      <Button
        onClick={handlePrevMonth}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          minWidth: { xs: "38px", sm: "45px" },
          width: { xs: "38px", sm: "45px" },
          height: { xs: "38px", sm: "45px" },
          borderRadius: "50%",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#75b5b7",
          },
        }}
      >
        <ArrowBackIcon sx={{ color: "#1a1a1a" }} />
      </Button>

      <Typography
        variant="h6"
        sx={{
          width: { xs: "120px", sm: "160px" },
          textAlign: "center",
          fontWeight: "bold",
          fontSize: { xs: "1rem", sm: "1.3rem" },
        }}
      >
        {months[currentMonth]}
      </Typography>

      <Button
        onClick={handleNextMonth}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          minWidth: { xs: "38px", sm: "45px" },
          width: { xs: "38px", sm: "45px" },
          height: { xs: "38px", sm: "45px" },
          borderRadius: "50%",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#75b5b7",
          },
        }}
      >
        <ArrowForwardIcon sx={{ color: "#1a1a1a" }}/>
      </Button>
    </Box>

    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              Obliczone premie rejestratorów
            </Typography>

            {mapa.has(obecnyEmail) &&
              Array.isArray(mapa.get(obecnyEmail)) &&
              Object.entries(dane)
                .filter(([name]) =>
                  mapa.get(obecnyEmail).includes(name)
                )
                .map(([name, value]) => (
                  <Typography
                    key={name}
                    sx={{
                      py: 0.5,
                      wordBreak: "break-word",
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                    }}
                  >
                    <strong>{name}:</strong> {value} zł
                  </Typography>
                ))}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              Liczby Rejestracji
            </Typography>

            {mapa.has(obecnyEmail) &&
              Array.isArray(mapa.get(obecnyEmail)) &&
              Object.entries(numbRejestrator)
                .filter(([name]) =>
                  mapa.get(obecnyEmail).includes(name)
                )
                .map(([name, value]) => (
                  <Typography
                    key={name}
                    sx={{
                      py: 0.5,
                      wordBreak: "break-word",
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                    }}
                  >
                    <strong>{name}:</strong> {value}
                  </Typography>
                ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  </Box>
  </Box>
);
}

export default Premie;