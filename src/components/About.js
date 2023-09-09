import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function About() {
  return (
    <Grid container pt={17}>
      <Typography color="primary"
        style={{
          fontSize: "3em",
          fontFamily: "Evangelina",
        }}
      >
        PLAY
      </Typography>
      <Typography variant="h6">
        Play chess! Explore top moves in the opening theorized and played by
        professionals. Save openings that you want to study in your repertoire.
      </Typography>
      <Typography color="primary"
        style={{
          fontSize: "3em",
          fontFamily: "Evangelina",
        }}
      >
        PRACTICE
      </Typography>
      <Typography variant="h6">
        Practice, learn, and memorize beginner openings, or more advanced lines in your repertoire.
      </Typography>
      <Typography color="primary"
        style={{
          fontSize: "3em",
          fontFamily: "Evangelina",
        }}
      >
        THANKS
      </Typography>
      <Typography variant="h6">
        Thanks to{" "}
        <Link
          color="rgb(52, 108, 140)"
          href="https://github.com/jhlywa/chess.js/blob/master/README.md"
        >
          Chess.js{" "}
        </Link>
        and{" "}
        <Link color="rgb(52, 108, 140)" href="https://github.com/Clariity/react-chessboard">
          React-Chessboard
        </Link>{" "}
        for the chess board,{" "}
        <Link color="rgb(52, 108, 140)" href="https://kenney.nl/">
          Kenney
        </Link>{" "}
        for the sounds, and{" "}
        <Link
          color="rgb(52, 108, 140)"
          href="https://lichess.org/api#tag/Opening-Explorer"
        >
          Lichess
        </Link>{" "}
        for the openings database!
      </Typography>
    </Grid>
  );
}

export default About;
