import { createTheme } from "@mui/material/styles";

const designToken = (mode) => ({
  palette: {
    mode,

    ...(mode === "light"
      ? {
          background: {
            default: "#ffffff",
            paper: "#f6f7f9",
          },
          text: {
            primary: "#1c1c1c",
            secondary: "#4a4a4a",
          },
          primary: {
            main: "#2f6fed",
            contrastText: "#ffffff",
          },
        }
      : {
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
          text: {
            primary: "#ffffff",
            secondary: "#b3b3b3",
          },
          primary: {
            main: "#FFD54F",
            contrastText: "#1a1a1a",
          },
        }),  
  },
    components: {
    MuiButton: {
      styleOverrides: {
        root: {
          "&:focus-visible": {
            outline: "3px solid #ffbf47",
            outlineOffset: "3px",
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:focus-visible": {
            outline: "3px solid #ffbf47",
            outlineOffset: "3px",
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root:focus-within fieldset": {
            borderWidth: "2px",
            borderColor: "#ffbf47",
          },
        },
      },
    },
  },
});


export default designToken;