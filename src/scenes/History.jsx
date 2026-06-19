import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Grid,
  Button,
  IconButton,Alert,
CircularProgress
} from "@mui/material";
import axios from "axios";
import { useTheme } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from "framer-motion";

function History() {
  const theme = useTheme();
  const [groupedData, setGroupedData] = useState({});
  const [pracData, setPracData] = useState({});
  const [loading, setLoading] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(null);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [networkError, setNetworkError] = useState(false);
const [serverStatus, setServerStatus] = useState("online");

  console.log("Grouped Data:", groupedData);

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
        return "Nie znaleziono danych.";
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

const fetchHistoryData = async () => {
  try {
    setLoading(true);
    setError("");
    setSuccess("");
    setNetworkError(false);

    const [
      premieRes,
      warunkiRes,
      pracPremieRes,
      pracWarunkiRes
    ] = await Promise.all([
      axios.get(
        "http://localhost:8081/patients/histpremie",
        { timeout: 10000 }
      ),
      axios.get(
        "http://localhost:8081/patients/histWarPremie",
        { timeout: 10000 }
      ),
      axios.get(
        "http://localhost:8081/pracownicy/histpremie",
        { timeout: 10000 }
      ),
      axios.get(
        "http://localhost:8081/pracownicy/histWarPremie",
        { timeout: 10000 }
      )
    ]);

    const patientCombined = [
      ...premieRes.data,
      ...warunkiRes.data
    ];

    const pracCombined = [
      ...pracPremieRes.data,
      ...pracWarunkiRes.data
    ];

    const groupedPatients = patientCombined.reduce((acc, item) => {
      const fullTimestamp = item.czas;

      if (!acc[fullTimestamp]) {
        acc[fullTimestamp] = [];
      }

      acc[fullTimestamp].push(item);

      return acc;
    }, {});

    const groupedPrac = pracCombined.reduce((acc, item) => {
      const fullTimestamp = item.czas;

      if (!acc[fullTimestamp]) {
        acc[fullTimestamp] = [];
      }

      acc[fullTimestamp].push(item);

      return acc;
    }, {});

    setGroupedData(groupedPatients);
    setPracData(groupedPrac);

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
  fetchHistoryData();
}, []);

useEffect(() => {
  const handleOffline = () => {
    setNetworkError(true);
    setServerStatus("offline");
    setError("Utracono połączenie z internetem.");
  };

  const handleOnline = () => {
    setNetworkError(false);
    setServerStatus("online");
    setSuccess("Połączenie zostało przywrócone.");
  };

  window.addEventListener("offline", handleOffline);
  window.addEventListener("online", handleOnline);

  return () => {
    window.removeEventListener("offline", handleOffline);
    window.removeEventListener("online", handleOnline);
  };
}, []);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8081/patients/histpremie"),
      axios.get("http://localhost:8081/patients/histWarPremie")
    ])
      .then(([premieRes, warunkiRes]) => {
        const premieData = premieRes.data;
        const warunkiData = warunkiRes.data;
        const combined = [...premieData, ...warunkiData];

        const grouped = combined.reduce((acc, item) => {
          const fullTimestamp = item.czas;
          if (!acc[fullTimestamp]) {
            acc[fullTimestamp] = [];
          }
          acc[fullTimestamp].push(item);
          return acc;
        }, {});

        setGroupedData(grouped);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania danych:", error);
      });
  }, []);

    useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8081/pracownicy/histpremie"),
      axios.get("http://localhost:8081/pracownicy/histWarPremie")
    ])
      .then(([premieRes, warunkiRes]) => {
        const premieData = premieRes.data;
        const warunkiData = warunkiRes.data;
        const combined = [...premieData, ...warunkiData];

        const grouped = combined.reduce((acc, item) => {
          const fullTimestamp = item.czas;
          if (!acc[fullTimestamp]) {
            acc[fullTimestamp] = [];
          }
          acc[fullTimestamp].push(item);
          return acc;
        }, {});

        setPracData(grouped);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania danych:", error);
      });
  }, []);

const handleDelete = async (timestamp) => {
  try {
    setDeleteLoading(timestamp);
    setError("");

    await axios.delete(
      `http://localhost:8081/patients/deleteByTimestamp/${encodeURIComponent(timestamp)}`,
      { timeout: 10000 }
    );

    const updatedData = { ...groupedData };
    delete updatedData[timestamp];

    setGroupedData(updatedData);

    setSuccess("Historia została usunięta.");

  } catch (err) {
    console.error(err);

    setError(getErrorMessage(err));

  } finally {
    setDeleteLoading(null);
  }
};

const handleDelete2 = async (timestamp) => {
  try {
    setDeleteLoading(timestamp);
    setError("");

    await axios.delete(
      `http://localhost:8081/pracownicy/deleteByTimestamp/${encodeURIComponent(timestamp)}`,
      { timeout: 10000 }
    );

    const updatedData = { ...pracData };
    delete updatedData[timestamp];

    setPracData(updatedData);

    setSuccess("Historia została usunięta.");

  } catch (err) {
    console.error(err);

    setError(getErrorMessage(err));

  } finally {
    setDeleteLoading(null);
  }
};

  console.log("Pracownicy Data:", pracData);

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
  aria-label="Historia premii pacjentów"
    sx={{
      width: "100%",
      px: { xs: 2, sm: 3, md: 4 },
      py: 2,
    }}
  >

    <Typography
    component="h1"
      variant="h4"
      fontWeight="bold"
      gutterBottom
      sx={{
        fontSize: { xs: "1.6rem", sm: "2rem" },
        textAlign: { xs: "center", sm: "left" },
      }}
    >
      Historia premii pacjentów
    </Typography>

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
        onClick={fetchHistoryData}
      >
        Ponów
      </Button>
    }
  >
    Problem z połączeniem z serwerem.
  </Alert>
)}
{loading ? (
  <Box
   role="status"
  aria-live="polite"
  aria-busy="true"
    sx={{
      display: "flex",
      justifyContent: "center",
      mt: 4,
    }}
  >
    <CircularProgress aria-label="Ładowanie historii" />
  </Box>
) : (
<Box>



{success && (
  <Alert
    severity="success"
    sx={{ mb: 2 }}
    role="status"
    aria-live="polite"
  >
    {success}
  </Alert>
)}

{error && (
  <Alert
    severity="error"
    sx={{ mb: 2 }}
    role="alert"
    aria-live="assertive"
  >
    {error}
  </Alert>
)}

    <Grid container spacing={{ xs: 2, md: 4 }}>
      <Grid item xs={12} md={6}>
        {Object.entries(groupedData).map(([timestamp, items]) => (
          <Paper
            key={timestamp}
            elevation={3}
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              borderRadius: 3,
              mb: 2,
            }}
          >
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}
  aria-controls={`panel-${timestamp}-content`}
  id={`panel-${timestamp}-header`}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                    color="primary"
                    fontWeight="bold"
                  >
                    {timestamp.substring(0, 10)}
                  </Typography>

                  <IconButton
                    onClick={() => handleDelete(timestamp)}
                    color="error"
                    size="small"
                    aria-label="usuń element"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                {items.map((item, index) =>
                  (item.premia || item.wartosc) && (
                    <Box key={index} sx={{ mb: 2 }}>
                      {item.premia && (
                        <Typography sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}>
                          <strong>Imię:</strong> {item.name} —{" "}
                          <strong>{item.premia} zł</strong>
                        </Typography>
                      )}

                      {item.wartosc && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                        >
                          Warunek: {item.warunek} — {item.wartosc} zł
                        </Typography>
                      )}

                      {index < items.length - 1 && (
                        <Divider sx={{ mt: 1.5 }} />
                      )}
                    </Box>
                  )
                )}
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))}
      </Grid>

      <Grid item xs={12} md={6}>
        {Object.entries(pracData).map(([timestamp, items]) => (
          <Paper
            key={timestamp}
            elevation={3}
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              borderRadius: 3,
              mb: 2,
            }}
          >
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}
  aria-controls={`panel-${timestamp}-content`}
  id={`panel-${timestamp}-header`}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    {timestamp.substring(0, 10)}
                  </Typography>

                  <IconButton
                    onClick={() => handleDelete2(timestamp)}
                    color="error"
                    size="small"
                    aria-label="usuń element"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                {items.map((item, index) =>
                  (item.premia || item.value) && (
                    <Box key={index} sx={{ mb: 2 }}>
                      {item.premia && (
                        <Typography sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}>
                          <strong>Imię:</strong> {item.imie} —{" "}
                          <strong>{item.premia} zł</strong>
                        </Typography>
                      )}

                      {item.value && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
                        >
                          Warunek: {item.name} — {item.value}% —{" "}
                          {item.valueKoszt} zł —{" "}
                          {item.typ.includes("A")
                            ? "Pr. wprowadzający"
                            : "Pr. wykonujący"}
                        </Typography>
                      )}

                      {index < items.length - 1 && (
                        <Divider sx={{ mt: 1.5 }} />
                      )}
                    </Box>
                  )
                )}
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))}
      </Grid>
    </Grid>
    </Box>
    )}
  </Box>
  </Box>
);
}

export default History;
