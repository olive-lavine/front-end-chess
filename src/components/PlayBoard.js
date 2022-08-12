import Chessboard from "chessboardjsx";
import { useState } from "react";
import { Chess } from "chess.js";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import ButtonGroup from "@mui/material/ButtonGroup";

const PlayBoard = () => {
  const chess = new Chess();
  const [game, setGame] = useState(chess);
  const [orientation, setOrientation] = useState("white");
  const [message, setMessage] = useState("");
  const [colorTheme, setColorTheme] = useState({
    light: { backgroundColor: "rgb(217, 227, 242)" },
    dark: { backgroundColor: "rgb(141, 171, 215)" },
    drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
  });
  const [sound, setSound] = useState("");

  const moveSound = new Audio(sound);

  function onDrop({ sourceSquare, targetSquare }) {
    setMessage("");
    const gameCopy = { ...game };
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare });
    setGame(gameCopy);
    if (move) {
      moveSound.play();
    }

    if (game.in_check()) {
      setMessage("check");
    }
    if (game.in_checkmate()) {
      setMessage("checkmate");
    }
  }

  function handleReset() {
    const gameCopy = { ...game };
    gameCopy.reset();
    setGame(gameCopy);
  }

  function handleUndo() {
    const gameCopy = { ...game };
    gameCopy.undo();
    setGame(gameCopy);
  }

  function handleFlip() {
    orientation === "white" ? setOrientation("black") : setOrientation("white");
  }

  function handleThemeChange(event) {
    const theme = event.target.value;
    if (theme === "blue") {
      setColorTheme({
        light: { backgroundColor: "rgb(217, 227, 242)" },
        dark: { backgroundColor: "rgb(141, 171, 215)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
      });
      setSound("");
    }
    if (theme === "rose") {
      setColorTheme({
        light: { backgroundColor: "rgb(235, 224, 224)" },
        dark: { backgroundColor: "rgb(148, 107, 107)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(121, 160, 103)" },
      });
      setSound("./sounds/wood.mp3");
    }
    if (theme === "mint") {
      setColorTheme({
        light: { backgroundColor: "rgb(223, 243, 216)" },
        dark: { backgroundColor: "rgb(215, 180, 228)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(224, 170, 190)" },
      });
      setSound("./sounds/glass.mp3");
    }
    if (theme === "neon") {
      setColorTheme({
        light: { backgroundColor: "rgb(49, 191, 236)" },
        dark: { backgroundColor: "rgb(230, 74, 196)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(220, 242, 132)" },
      });
      setSound("./sounds/space.mp3");
    }
  }

  return (
    <main>
      <Grid container spacing={2}>
        <section>
          <Chessboard
            position={game.fen()}
            onDrop={onDrop}
            orientation={orientation}
            darkSquareStyle={colorTheme.dark}
            lightSquareStyle={colorTheme.light}
            dropSquareStyle={colorTheme.drop}
          />
        </section>
        <h2>{message}</h2>

        <Grid>
          <Button onClick={handleReset} variant="outlined" size="small">
            start over
          </Button>
          <Button onClick={handleUndo} variant="outlined" size="small">
            ⇐
          </Button>
          <Button onClick={handleFlip} variant="outlined" size="small">
            flip
          </Button>
        </Grid>
        <Grid>
          <FormControl sx={{ minWidth: 120 }} size="small" margin="dense">
            <InputLabel>colors</InputLabel>
            <Select onChange={handleThemeChange}>
              <MenuItem value="blue">Blue</MenuItem>
              <MenuItem value="rose">Rose</MenuItem>
              <MenuItem value="mint">Mint</MenuItem>
              <MenuItem value="neon">Neon</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <section>{game.pgn()}</section>
    </main>
  );
};

export default PlayBoard;
