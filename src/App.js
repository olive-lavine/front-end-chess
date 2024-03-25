import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import PlayBoard from "./components/PlayBoard";
import StudyBoard from "./components/StudyBoard";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import Settings from "./components/Settings";
import About from "./components/About";
import PrivateRoute from "./components/PrivateRoute";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useSettingsContext } from "./contexts/SettingsContext";

import {
  Button,
  Typography,
  Alert,
  Grid,
  Icon,
  CssBaseline,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import "./App.css";
import SignUp from "./components/SignUp";
import { useAuth } from "./contexts/AuthContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HamburgerMenu from "./components/HamburgerMenu";

export default function App() {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = currentUser !== null;

  const { primaryColor, mode } = useSettingsContext();

  async function handleLogout() {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  function handleLogin() {
    navigate("/login");
  }

  const commonButtonStyles = ({ theme }) => ({
    "&:hover": {
      color: theme.palette.primary.light,
    },
  });

  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: `rgb(${primaryColor})`,
      },
      secondary: {
        main: "rgb(246, 245, 242)",
      },
      background: {
        paper: mode === "dark" ? "rgb(87, 94, 97)" : "rgb(235, 234, 230)",
        default: mode === "dark" ? "rgb(47, 52, 54)" : "rgb(246, 245, 242)",
        // #c9c8c3" #D0CFC8, "#c4c2bb" "#dbdad3" 245, 242, 233
        // default: "rgb(232, 229, 222)",
      },
    },
    components: {
      MuiIconButton: {
        styleOverrides: {
          root: commonButtonStyles,
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: commonButtonStyles,
        },
      },
      MuiButton: {
        styleOverrides: {
          root: commonButtonStyles,
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: commonButtonStyles,
        },
      },
    },
    typography: {
      fontFamily: "Montserrat, sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar sx={{ boxShadow: "none" }} position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Button component={Link} to="/">
            <Typography
              style={{
                fontSize: "6em",
                fontFamily: "Evangelina",
                textTransform: "none",
              }}
              display={{ xs: "none", md: "block" }}
              color="secondary"
            >
              Opening Knight
            </Typography>
          </Button>
          <Box>
            <Button component={Link} to="/play" size="large" color="secondary">
              play
            </Button>
            <Button component={Link} to="/study" size="large" color="secondary">
              practice
            </Button>
            <HamburgerMenu
              isAuthenticated={isAuthenticated}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
            ></HamburgerMenu>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ marginTop: 2 }}>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/play" element={<PlayBoard />} />
          <Route
            path="/study"
            element={<PrivateRoute element={<StudyBoard />} />}
          />
        </Routes>
      </Container>
    </ThemeProvider>
  );
}
