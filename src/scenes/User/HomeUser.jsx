import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, Button, Paper, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EmojiEvents, Star } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

function HomeUser() {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    const theme = useTheme();


    const handleClick1 = () => {
        navigate('/premie');
    }

    const handleClick2 = () => {
        navigate('/premiecz2');
    }

    const sections = [
      {
        title: 'Obliczanie premii dla deklaracji',
        buttonText: 'Premie Deklaracje',
        onClick: handleClick1,
      },
      {
        title: 'Obliczanie premii dla usług',
        buttonText: 'Premie Usługi',
        onClick: handleClick2,
      }
    ]

  return (
    <Box>
        <Container maxWidth="sm" sx={{ py: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center'}}>
          Program do obliczania premii dla pracowników
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
          Panel administratora
        </Typography>
        
        <Stack spacing={3} mt={4}>
          {sections.map((section, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{ p: 3, borderRadius: 3, textAlign: "center"}}>
              <Typography variant="subtitle1" gutterBottom>
                {section.title}
              </Typography>  
              <Button
                variant="contained"
                onClick={section.onClick}
                sx={{
                  mt: 1,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  mx: 'auto',
                  transition: '0.4s',
                  "&:hover": {
                    backgroundColor: "#1565c0"
                  }
                }}
                
              >
                {section.buttonText}
              </Button>
            </Paper>

          ))}
        </Stack>

      </Container >
    </Box>
  );
}

export default HomeUser;
