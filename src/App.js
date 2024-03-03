import React, { useState } from "react"
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import PlayBoard from "./components/PlayBoard";
import StudyBoard from "./components/StudyBoard";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import Settings from "./components/Settings";
import About from "./components/About";
import PrivateRoute from './components/PrivateRoute';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Button, Typography, Alert, Icon } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import "./App.css";
import SignUp from "./components/SignUp";
import { useAuth } from "./contexts/AuthContext"
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/500.css'
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/700.css';




export default function App() {
  const { currentUser, logout } = useAuth()
  const [error, setError] = useState("")
  const navigate = useNavigate();
  

  async function handleLogout() {
    setError("")

    try {
        await logout()
        navigate("/login")
    } catch {
        setError("Failed to log out")
    }
}

  function handleLogin() {
    navigate("/login")
  }
  const commonButtonStyles = ({ theme }) => ({
    '&:hover': {
      color: theme.palette.primary.light,
    },
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: 'rgb(52, 108, 140)',
      },
      background: {
        paper: 'rgb(232, 229, 222)'
      }
    },
    components: {
      MuiIconButton: {
        styleOverrides: {
          root: commonButtonStyles,
        },
      },
      MuiButton: {
        styleOverrides: {
          root: commonButtonStyles,
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
    <Box bgcolor="rgb(232, 229, 222)">
      <Container maxWidth = '1500'
      sx={{
        width: "100vh",
        height: "100vh",
      }}
    >
    <AppBar color="background" sx={{ boxShadow: "none" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Button component={Link} to="/" >
          <Typography
            style={{
              fontSize: "6em",
              fontFamily: "Evangelina",
              textTransform: "none",
            }}
            display={{ xs: "none", md: "block" }}
          >
            Opening Knight
          </Typography>
        </Button>
        <Box >
          <Button
            component={Link} to="/play"
            size="large"
          >
            play
          </Button>
          <Button
            component={Link} to="/study" 
            size="large"
          >
            practice
          </Button>
          <Button
            component={Link} to="/about"
            size="large"
          >
            about
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="settings" element={<Settings/>} />
          <Route path="play" element={<PlayBoard />} />
          <Route path="/study" element={<PrivateRoute element={<StudyBoard/>} />} />
        </Routes>
      <AppBar position="fixed" color="background" sx={{ top: 'auto', bottom: 0, boxShadow:"none" }} >
        <Toolbar>
          <IconButton color="primary" component={Link} to="/settings">
                <SettingsOutlinedIcon></SettingsOutlinedIcon>
          </IconButton>
          {error && <Alert severity="error">{error}</Alert>}
          {currentUser && <IconButton color="primary" onClick={handleLogout}>
            <LockOutlinedIcon/>
          </IconButton>}
          {!currentUser && <IconButton color="primary" onClick={handleLogin}>
            <LockOpenOutlinedIcon/>
          </IconButton>}
        </Toolbar>
      </AppBar>
      </Container>
    </Box>
    </ThemeProvider>

  );
}


    // <Typography
    //             flexGrow="1"
    //             display={{ xs: "none", md: "block" }}
    //         >
    //         <Button
    //         style={{
    //             fontSize: "6em",
    //             fontFamily: "Evangelina",
    //             textTransform: "none",
    //         }}
    //         component={Link} to="/"
    //         >
    //         Opening Knight
    //         </Button>
    //     </Typography>