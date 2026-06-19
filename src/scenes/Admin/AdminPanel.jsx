import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid, 
  Paper,
  Select,
  MenuItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import Autocomplete from '@mui/material/Autocomplete';
import { motion } from "framer-motion";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [userScores, setUserScores] = useState({});
  const [selectedEmails, setSelectedEmails] = useState({});
  const [selectedService, setSelectedService] = useState({});
  const [unikRej, setUnikRej] = useState([]);
  const [unikRejPracownik, setUnikRejPracownik] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchUserScores();
    fetchUnikRej();
  }, []);

  

  const fetchUsers = () => {
    axios.get("http://localhost:8081/auth/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania użytkowników:", error);
      });
  };

  const fetchUnikRej = () => {
    axios.get("http://localhost:8081/patients/unikRej")
      .then((response) => {
        setUnikRej(response.data);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania unikalnych rejestracji:", error);
      });

      axios.get("http://localhost:8081/pracownicy/unikRej")
      .then((response) => {
        setUnikRejPracownik(response.data);
      })
      .catch((error) => {
        console.error("Błąd podczas pobierania unikalnych rejestracji pracowników:", error);
      })
  }

  console.log(selectedService)

  const fetchUserScores = () => {
    const scoresFromStorage = localStorage.getItem("premie");
    try {
      const parsedScores = scoresFromStorage ? JSON.parse(scoresFromStorage) : {};
      setUserScores(parsedScores);
    } catch (error) {
      console.error("Błąd podczas parsowania danych z localStorage:", error);
    }
  };

  const saveData = () => {
    localStorage.setItem("pozwolenia", JSON.stringify(selectedEmails));
    localStorage.setItem("pozwoleniaUsługi", JSON.stringify(selectedService));
  };

  console.log("Selected Emails:", selectedEmails);
  console.log("Selected Service:", selectedService);

  const selectAllRej = (emails) => {
   setSelectedEmails((prev) => ({
      ...prev,
      [emails]: unikRej,
    })); 
  }

  const selectAllUslugi = (emails) =>{
    setSelectedService((prev) => ({
      ...prev,
      [emails]: unikRejPracownik
    }))
  }

  const handleChange = (email, value) => {
    setSelectedService((prev) => ({
        ...prev,
        [email]: value,
    }))
  }

  const handleChangeRej = (email, value) => {
    setSelectedEmails((prev) => ({
      ...prev,
      [email]: value,
    }))
  }

return (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.25 }}
  >
    <Box sx={{ width: "100%", px: { xs: 2, sm: 3 }, py: 2 }}>
      <Typography
        component="h1"         
        variant="h4"
        sx={{
          fontSize: { xs: "1.6rem", sm: "2.2rem" },
          fontWeight: "bold",
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Panel Administratora
      </Typography>

      <Typography
        component="h2"         
        variant="h6"
        sx={{
          mt: 1,
          fontSize: { xs: "1rem", sm: "1.25rem" },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        Wybierz czyje premie będzie widzieć użytkownik
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mt: 3,
        }}
      >
        <Paper
          component="section"   
          aria-labelledby="section-users-title"
          elevation={3}
          sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, width: { xs: "100%", md: "33%" } }}
        >
          <Typography
            id="section-users-title"
            component="h3"
            variant="h5"
            gutterBottom
            sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            User
          </Typography>

          <Box component="fieldset" sx={{ border: "none", p: 0, m: 0 }}>
            <Box component="legend" sx={{ display: "none" }}>
              Wybierz użytkowników
            </Box>

            {users.map((user) => (
              <FormControlLabel
                key={user.email}
                sx={{ display: "flex", alignItems: "center", wordBreak: "break-word" }}
                control={
                  <Checkbox
                    checked={selectedEmails?.hasOwnProperty(user.email)}
                    inputProps={{
                      "aria-label": `Wybierz użytkownika ${user.email}`,
                    }}
                    onChange={(e) => {
                      const updatedEmails = { ...selectedEmails };
                      const updatedService = { ...selectedService };
                      if (e.target.checked) {
                        updatedEmails[user.email] = [];
                        updatedService[user.email] = [];
                      } else {
                        delete updatedEmails[user.email];
                        delete updatedService[user.email];
                      }
                      setSelectedEmails(updatedEmails);
                      setSelectedService(updatedService);
                    }}
                  />
                }
                label={user.email}
              />
            ))}
          </Box>
        </Paper>

        <Paper
          component="section"
          aria-labelledby="section-dek-title"
          elevation={3}
          sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, width: { xs: "100%", md: "33%" } }}
        >
          <Typography
            id="section-dek-title"
            component="h3"
            variant="h5"
            gutterBottom
            sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            Uprawnienia Deklaracje
          </Typography>

          {Object.keys(selectedEmails).map((email) => (
            <Box key={email} mt={2}>
              <Autocomplete
                multiple
                options={unikRej}
                value={selectedEmails[email] || []}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`Deklaracje – ${email}`}   
                    inputProps={{
                      ...params.inputProps,
                      "aria-label": `Wybierz deklaracje dla ${email}`,
                    }}
                  />
                )}
                onChange={(_, value) => handleChangeRej(email, value)}
              />
              <Button
                variant="outlined"
                onClick={() => selectAllRej(email)}
                sx={{ mt: 1 }}
                fullWidth
                aria-label={`Zaznacz wszystkie deklaracje dla ${email}`}
              >
                Zaznacz wszystkie
              </Button>
            </Box>
          ))}
        </Paper>

        <Paper
          component="section"
          aria-labelledby="section-usl-title"
          elevation={3}
          sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, width: { xs: "100%", md: "33%" } }}
        >
          <Typography
            id="section-usl-title"
            component="h3"
            variant="h5"
            gutterBottom
            sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            Uprawnienia Usługi
          </Typography>

          {Object.keys(selectedEmails).map((email) => (
            <Box key={email} mt={2}>
              <Autocomplete
                multiple
                options={unikRejPracownik}
                value={selectedService[email] || []}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`Usługi – ${email}`}       
                    inputProps={{
                      ...params.inputProps,
                      "aria-label": `Wybierz usługi dla ${email}`,
                    }}
                  />
                )}
                onChange={(_, value) => handleChange(email, value)}
              />
              <Button
                variant="outlined"
                onClick={() => selectAllUslugi(email)}
                sx={{ mt: 1 }}
                fullWidth
                aria-label={`Zaznacz wszystkie usługi dla ${email}`}
              >
                Zaznacz wszystkie
              </Button>
            </Box>
          ))}
        </Paper>
      </Box>

      <Box mt={3} display="flex" justifyContent={{ xs: "center", md: "flex-start" }}>
        <Button variant="contained" color="primary" onClick={saveData}>
          Zapisz dane
        </Button>
      </Box>
    </Box>
  </Box>
);
}

export default AdminPanel;
