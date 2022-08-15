import { useState, useEffect } from "react";
import PlayBoard from "./components/PlayBoard";
import StudyBoard from "./components/StudyBoard";
import LogIn from "./components/LogIn";
import About from "./components/About";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import ButtonGroup from "@mui/material/ButtonGroup";
import "./App.css";

export default function App() {
  const [selectedPage, setSelectedPage] = useState("Home");
  const [player, setPlayer] = useState(false);

  const getSelectedPage = () => {
    if (selectedPage === "Home") {
      return (
        <Card>
          <CardMedia
            component="img"
            image="./assets/images/chess.jpg"
            alt="vintage chess pieces on blue background"
          ></CardMedia>
        </Card>
      );
    } else if (selectedPage === "PlayBoard") {
      return <PlayBoard player={player}></PlayBoard>;
    } else if (selectedPage === "StudyBoard") {
      return <StudyBoard player={player}></StudyBoard>;
    } else if (selectedPage === "About") {
      return <About></About>;
    }
  };

  return (
    <Container sx={{ backgroundColor: "rgb(232, 229, 222)" }}>
      {/* {!player && <LogIn setPlayer={setPlayer} />} */}
      {/* {player && ( */}

      <AppBar
        sx={{
          boxShadow: "none",
          backgroundColor: "rgb(232, 229, 222)",
          color: "#173A5E",
        }}
      >
        <Toolbar>
          <Typography
            fontFamily="serif"
            variant="h4"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            <Button
              style={{
                fontSize: "2em",
                fontFamily: "Evangelina",
                textTransform: "none",
                color: "rgb(52, 108, 140)",
              }}
              onClick={() => {
                setSelectedPage("Home");
              }}
            >
              Opening Knight
            </Button>
          </Typography>
          <Button
            onClick={() => {
              setSelectedPage("PlayBoard");
            }}
            style={{ color: "rgb(52, 108, 140)" }}
          >
            play
          </Button>
          <Button
            onClick={() => {
              setSelectedPage("StudyBoard");
            }}
            style={{ color: "rgb(52, 108, 140)" }}
          >
            practice
          </Button>
          <Button
            onClick={() => {
              setSelectedPage("About");
            }}
            style={{ color: "rgb(52, 108, 140)" }}
          >
            about
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: "150px" }}>{getSelectedPage()}</Box>
    </Container>
  );
}
// display:"flex" justifyContent="center" alignItems="center"
