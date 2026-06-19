import React, { useEffect, useState } from "react";
import {  
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem, Alert, 
  CircularProgress 
} from "@mui/material";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '@mui/material/styles';
import { motion } from "framer-motion";

const NewItem = ({ field, handleChange, removeItem, role }) => {

  const calcKwotaaPremii = (procent, koszt) => {
  if (koszt === 0) return 0;

  const rzeczywistyProcent = parseFloat(procent) === 0 ? 100 : parseFloat(procent);

  return ((rzeczywistyProcent / 100) * koszt).toFixed(2);
};

  const kwota = calcKwotaaPremii(field.map(item => parseFloat(item.value)), field.map(item => parseFloat(item.valueKoszt)));

  return (
    <Stack spacing={2} mt={2}>
      {field.map((item, index) => (
        <Paper key={index} elevation={3} sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center" >
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
              sx={{ maxWidth: 150 }}
              label={`Koszt usługi ${index + 1}`}
              value={item.valueKoszt}
              onChange={(e) => handleChange(index, "valueKoszt", e.target.value)}
            />

            <TextField
              variant="outlined"
              type="number"
              sx={{ maxWidth: 150 }}
              label={`Procent premii z usługi ${index + 1}`}
              value={item.value}
              onChange={(e) => handleChange(index, "value", e.target.value)}
            />

            <FormControl sx={{ width: 400}}>
              <InputLabel id={`select-label-${index}`}>Typ</InputLabel>
              <Select
                labelId={`select-label-${index}`}
                
                value={item.typ || ""}
                label="Typ"
                onChange={(e) => handleChange(index, "typ", e.target.value)}
              >
                <MenuItem value="A">Pr. wprowadzający</MenuItem>
                <MenuItem value="B">Pr. wykonujący</MenuItem>
              </Select>
            </FormControl>

            <TextField
              variant="outlined"
              type="number"
              sx={{ maxWidth: 150 }}
              label={`Kwota premii ${index + 1}`}
              value={calcKwotaaPremii(item.value, item.valueKoszt)}
             
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

const PremieCz2 = () => {
  const [data, setData] = useState([]);
  const [proc, setProc ] = useState([{name: "", proc: ""}]);
  const [selected, setSelected] = useState("");
  const [obecnyEmail, setObecnyEmail] = useState("");
  const [mapa, setMapa] = useState(new Map());
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [miesiacDane, setMiesiacDane] = useState();
  const [setYear, setCurrentYear] = useState(2025)
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [networkError, setNetworkError] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("online");
  const theme = useTheme();
  

  useEffect(() => {
      const handleRoleChange = () => {
        setRole(localStorage.getItem("role"));
      };
  
      window.addEventListener("roleChange", handleRoleChange);
      return () => window.removeEventListener("roleChange", handleRoleChange);
    }, []);

  const [field, setField] = useState(() => {
    const stored = localStorage.getItem("nowePremie");
    return stored ? JSON.parse(stored) : [{ name: "", value: "", valueKoszt: "", typ: "" }];
  });


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
  const isValid = field.every(
    (item) =>
      item.name.trim() !== "" &&
      item.value !== "" &&
      !isNaN(item.value) &&
      item.valueKoszt !== "" &&
      !isNaN(item.valueKoszt) &&
      item.typ !== ""
  );

  if (!isValid) {
    setError("Wszystkie pola muszą być wypełnione poprawnie.");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setSuccess("");
    setNetworkError(false);

    await axios.post(
      "http://localhost:8081/pracownicy/miesiacDane",
      { month: currentMonth },
      { timeout: 10000 }
    );

    await axios.post(
      "http://localhost:8081/pracownicy/input",
      field,
      { timeout: 10000 }
    );

    const updatedData = await axios.get(
      "http://localhost:8081/pracownicy/idkMan",
      { timeout: 10000 }
    );

    setData(updatedData.data);

    setSuccess("Dane zostały wysłane poprawnie.");
    setServerStatus("online");

  } catch (err) {
    console.error(err);

    setNetworkError(true);
    setServerStatus("offline");

    setError(getErrorMessage(err));

  } finally {
    setLoading(false);
  }
};

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
  

  console.log(field);

  useEffect(() => {
    axios
      .get("http://localhost:8081/pracownicy/idkMan")
      .then((response) => {
        console.log("Odpowiedź z serwera:", response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Wystąpił błąd podczas pobierania danych:", error);
      });
  }, []);

  const handleChange = (index, key, value) => {
    const updFields = [...field];
    updFields[index][key] = value;
    setField(updFields);
  }

  const calcPerc = (val, valKoszt) => {
      if(valKoszt === 0) {
        return 0;
      }else{
        return ((val / valKoszt) * 100).toFixed(2);
      }
    }
  
    useEffect(() => {
      const procField = field.map((item) => {
        const val = parseFloat(item.value);
        const koszt = parseFloat(item.valueKoszt);
        const proc = calcPerc(val, koszt);
        return { name: item.name, proc }
      })
      setProc(procField);
    }, [field]);

  const addItem = () => {
    setField([...field, { name: "", value: "", valueKoszt: "", typ: "" }]);
  };

  const removeItem = (indexRemove) => {
    if(role === "admin"){
      setField(field.filter((_, index) => index !== indexRemove))
    }
  }

  useEffect(() => {
    setSelected(localStorage.getItem("pozwoleniaUsługi"));
    setObecnyEmail(localStorage.getItem("email"));
    localStorage.setItem("nowePremie", JSON.stringify(field));
  }, [field]);

  const labels = Object.keys(data);           
  const values = Object.values(data); 

  const months = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

    console.log("Dane dla miesiąca:", { month: currentMonth });

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
  }

  const fetchData = async () => {
  try {
    setFetchLoading(true);
    setError("");
    setNetworkError(false);

    const response = await axios.get(
      "http://localhost:8081/pracownicy/idkMan",
      { timeout: 10000 }
    );

    setData(response.data);
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
  fetchData();
}, []);

 return (
  <Box
  component={motion.div}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.25 }}
>
  <Box
    component="main"
    sx={{ maxWidth: 1000, mx: "auto", p: 2, mt: 4 }}
  >
    <Typography component="h1" variant="h4" gutterBottom>
      Premie
    </Typography>

    <Box component="section" aria-labelledby="warunki-premii">
      <Typography
        id="warunki-premii"
        component="h2"
        variant="subtitle1"
        gutterBottom
      >
        Warunki obliczania premii
      </Typography>

      <NewItem
        field={field}
        handleChange={handleChange}
        removeItem={removeItem}
        role={role}
      />

      <Stack direction="row" spacing={2} mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={addItem}
          disabled={loading}
          aria-label="Dodaj nowy warunek"
        >
          +
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={sendData}
          disabled={loading}
          aria-label="Wyślij dane do obliczenia premii"
        >
          {loading ? (
            <CircularProgress
              size={24}
              color="inherit"
              aria-label="Ładowanie"
            />
          ) : (
            "Wyślij dane"
          )}
        </Button>
      </Stack>

      {success && (
        <Alert
          severity="success"
          sx={{ mt: 2 }}
          role="status"
          aria-live="polite"
        >
          {success}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
          role="alert"
          aria-live="assertive"
        >
          {error}
        </Alert>
      )}
    </Box>

    <Divider sx={{ my: 4 }} />

    <Box
      component="nav"
      aria-label="Nawigacja między miesiącami"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        marginBottom: 4,
      }}
    >
      <Button
        sx={{
          backgroundColor: "#8FCFD1",
          color: "white",
          minWidth: "40px",
          height: "40px",
          borderRadius: "50%",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#75b5b7",
          },
        }}
        onClick={handlePrevMonth}
        aria-label="Poprzedni miesiąc"
      >
        <ArrowBackIcon sx={{ color: "#1a1a1a" }}/>
      </Button>

      <Typography
        component="h2"
        variant="h6"
        sx={{
          width: "100px",
          textAlign: "center",
          fontWeight: "bold",
          color: theme.palette.text.primary,
        }}
        aria-live="polite"
      >
        {months[currentMonth]}
      </Typography>

      <Button
        sx={{
          backgroundColor: "#8FCFD1",
          color: "white",
          minWidth: "40px",
          height: "40px",
          borderRadius: "50%",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#75b5b7",
          },
        }}
        onClick={handleNextMonth}
        aria-label="Następny miesiąc"
      >
        <ArrowForwardIcon sx={{ color: "#1a1a1a" }}/>
      </Button>
    </Box>

    <Box
      component="section"
      aria-labelledby="lista-premii"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
          <Typography
            id="lista-premii"
            component="h2"
            variant="h5"
            gutterBottom
          >
            Obliczone premie rejestratorów
          </Typography>

          <Box component="ul" sx={{ pl: 3, mb: 0 }}>
            {mapa.has(obecnyEmail) &&
              Array.isArray(mapa.get(obecnyEmail)) &&
              Object.entries(data)
                .filter(([name]) =>
                  mapa.get(obecnyEmail).includes(name)
                )
                .map(([name, value]) => (
                  <Box component="li" key={name} sx={{ mb: 1 }}>
                    <Typography component="span">
                      <strong>{name}:</strong> {value.toFixed(2)} zł
                    </Typography>
                  </Box>
                ))}
          </Box>
          {serverStatus === "offline" && (
            <Alert
              severity="warning"
              sx={{ mb: 2 }}
              role="alert"
              aria-live="assertive"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={fetchData}
                >
                  Ponów
                </Button>
              }
            >
              Problem z połączeniem z serwerem.
            </Alert>
          )}
        </Paper>
      </Box>
    </Box>
  </Box>
  </Box>
);
};

export default PremieCz2;
