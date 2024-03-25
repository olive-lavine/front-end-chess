import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function About() {
  return (
    <Grid container spacing={3} direction={"column"}>
      <Grid item>
        <Typography
          style={{
            fontSize: "2em",
          }}
        >
          PLAY
        </Typography>
        <Typography variant="h6">
          Play chess! Explore top moves in the opening theorized and played by
          professionals. Save openings that you want to study in your
          repertoire.
        </Typography>
      </Grid>

      <Grid item>
        <Typography
          style={{
            fontSize: "2em",
          }}
        >
          PRACTICE
        </Typography>
        <Typography variant="h6">
          Practice, learn, and memorize beginner openings, or more advanced
          lines in your repertoire.
        </Typography>
      </Grid>

      <Grid item>
        <Typography
          style={{
            fontSize: "2em",
          }}
        >
          THANKS
        </Typography>
        <Typography variant="h6">
          Thanks to{" "}
          <Link href="https://github.com/jhlywa/chess.js/blob/master/README.md">
            Chess.js{" "}
          </Link>
          and{" "}
          <Link href="https://github.com/Clariity/react-chessboard">
            React-Chessboard
          </Link>{" "}
          for the chess board, <Link href="https://kenney.nl/">Kenney</Link> for
          the sounds, and{" "}
          <Link href="https://lichess.org/api#tag/Opening-Explorer">
            Lichess
          </Link>{" "}
          for the openings database!
        </Typography>
      </Grid>
    </Grid>
  );
}

export default About;
