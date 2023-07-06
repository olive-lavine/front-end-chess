import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

function About() {
  return (
    <Grid>
      <p></p>
      <Typography
        style={{
          fontSize: "2em",
          fontFamily: "Evangelina",
          textTransform: "none",
          color: "rgb(52, 108, 140)",
        }}
      >
        PLAY
      </Typography>
      <p></p>
      <Typography variant="h6">
        Play chess! Explore top moves in the opening theorized and played by
        professionals. Save openings that you want to study in your repertoire.
      </Typography>
      <p></p>
      <Typography
        style={{
          fontSize: "2em",
          fontFamily: "Evangelina",
          textTransform: "none",
          color: "rgb(52, 108, 140)",
        }}
      >
        PRACTICE
      </Typography>
      <p></p>
      <Typography variant="h6">
        Practice beginner openings, or more advanced lines in your repertoire.
      </Typography>
      <p></p>
      <Typography
        style={{
          fontSize: "2em",
          fontFamily: "Evangelina",
          textTransform: "none",
          color: "rgb(52, 108, 140)",
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
      <section></section>
    </Grid>
  );
}

export default About;
