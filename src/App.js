import { useState } from "react";
import PlayBoard from "./components/PlayBoard";
import StudyBoard from "./components/StudyBoard";
import LogIn from "./components/LogIn";
import About from "./components/About";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import "./App.css";
import SignUp from "./components/SignUp";

export default function App() {
  const [selectedPage, setSelectedPage] = useState("Home");
  const [player, setPlayer] = useState("");

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
    <Container 
      // sx={{
      //   backgroundColor: "rgb(232, 229, 222)",
      //   width: "100vh",
      //   height: "100vh",
      // }}
    >
      {!player && <SignUp setPlayer={setPlayer} />}
      {player && (
        <Grid item>
          <AppBar
            sx={{
              boxShadow: "none",
              backgroundColor: "rgb(232, 229, 222)",
            }}
          >
            <Toolbar >
              <Typography
                fontFamily="serif"
                variant="h5"
                // component="div"
                flexGrow="1"
                display={{ xs: "none", md: "block" }}
              >
                <Button
                  style={{
                    fontSize: "3em",
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
                size="large"
              >
                play
              </Button>
              <Button
                onClick={() => {
                  setSelectedPage("StudyBoard");
                }}
                style={{ color: "rgb(52, 108, 140)" }}
                size="large"
              >
                practice
              </Button>
              <Button
                onClick={() => {
                  setSelectedPage("About");
                }}
                style={{ color: "rgb(52, 108, 140)" }}
                size="large"
              >
                about
              </Button>
            </Toolbar>
          </AppBar>
          <Grid container pt={17}>
            {getSelectedPage()}
          </Grid>
          </Grid>
      )}
    </Container>
  );
}