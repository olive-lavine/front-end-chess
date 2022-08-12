import { useState, useEffect } from "react";
import PlayBoard from "./components/PlayBoard";
import StudyBoard from "./components/StudyBoard";
import About from "./components/About";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ButtonGroup from "@mui/material/ButtonGroup";
import "./App.css";

export default function App() {
  const [selectedPage, setSelectedPage] = useState("");
  const getSelectedPage = () => {
    if (selectedPage === "PlayBoard") {
      return <PlayBoard></PlayBoard>;
    } else if (selectedPage === "StudyBoard") {
      return <StudyBoard></StudyBoard>;
    } else if (selectedPage === "About") {
      return <About></About>;
    }
  };

  return (
    <main>
      <Container sx={{ backgroundColor: "rgb(232, 229, 222)" }}>
        <AppBar
          sx={{ backgroundColor: "rgb(232, 229, 222)", color: "#173A5E" }}
        >
          {/* <section class="nav justify-content-end"> */}
          <Toolbar>
            <Typography
              fontFamily="serif"
              variant="h4"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Opening Knight
            </Typography>
            <Button
              onClick={() => {
                setSelectedPage("PlayBoard");
              }}
              color="inherit"
            >
              play
            </Button>
            <Button
              onClick={() => {
                setSelectedPage("StudyBoard");
              }}
              color="inherit"
            >
              practice
            </Button>
            <Button
              onClick={() => {
                setSelectedPage("About");
              }}
              color="inherit"
            >
              about
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Toolbar />
        <Box>{getSelectedPage()}</Box>
      </Container>
    </main>
  );
}
// display:"flex" justifyContent="center" alignItems="center"
