import Chessboard from "chessboardjsx";
import axios from "axios";
import { useState } from "react";
import { Chess } from "chess.js";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ButtonGroup from "@mui/material/ButtonGroup";
import { width } from "@mui/system";

const kBaseUrl = "https://explorer.lichess.ovh/masters?play=";

const PlayBoard = ({ player }) => {
  const chess = new Chess();
  const [game, setGame] = useState(chess);
  const [orientation, setOrientation] = useState("white");
  const [message, setMessage] = useState("");
  const [opening, setOpening] = useState("");
  const [topMoves, setTopMoves] = useState([]);
  const [book, setBook] = useState(true);
  const [bookMessage, setBookMessage] = useState("");
  const [uci, setUci] = useState("");
  const [isShown, setIsShown] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [colorTheme, setColorTheme] = useState({
    light: { backgroundColor: "rgb(217, 227, 242)" },
    dark: { backgroundColor: "rgb(141, 171, 215)" },
    drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
  });
  const [sound, setSound] = useState("");

  const moveSound = new Audio(sound);

  const getOpeningAsync = (uci) => {
    return axios
      .get(`${kBaseUrl}${uci}&moves=5&topGames=0`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        throw new Error("error getting opening");
      });
  };

  const getOpening = (uci) => {
    getOpeningAsync(uci)
      .then((response) => {
        if (response.opening) {
          setOpening(response.opening.name);
        }
        if (response.moves.length > 0) {
          const movesList = [];
          for (const move of response.moves) {
            movesList.push({ san: move.san, uci: move.uci });
          }
          setTopMoves(movesList);
          setBook(true);
        } else {
          setTopMoves([]);
          setBook(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function onDrop({ sourceSquare, targetSquare }) {
    setMessage("");
    const gameCopy = { ...game };
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare });
    setGame(gameCopy);
    if (move) {
      setMoveCount(moveCount + 1);
      if (sound) {
        moveSound.play();
      }
      if (book) {
        setBookMessage("");
        const uciMove = `${sourceSquare}${targetSquare}`;
        if (!uci) {
          setUci(uciMove);
          getOpening(uciMove);
        } else {
          setUci(`${uci},${uciMove}`);
          getOpening(`${uci},${uciMove}`);
        }
      } else {
        setBookMessage("Out of book, but follow your curiosity...");
      }
    }
    if (game.in_check()) {
      setMessage("check");
    }
    if (game.in_checkmate()) {
      setMessage("checkmate");
    }
  }

  function displayTopMoves() {
    if (!moveCount) {
      getOpening("");
    }
    const moves = topMoves.map((move) => (
      <Button
        key={move.san}
        onClick={() => {
          handleMoveClick(move.uci);
        }}
      >
        {move.san}
      </Button>
    ));
    return (
      <section>
        <Button
          onClick={() => {
            setIsShown((current) => !current);
          }}
        >
          {!isShown && <section>view top moves</section>}
          {isShown && <section>hide top moves</section>}
        </Button>
        {isShown && (
          <ButtonGroup size="small" aria-label="small button group">
            {moves}
          </ButtonGroup>
        )}
      </section>
    );
  }

  function handleMoveClick(chosenMove) {
    if (chosenMove === "e1h1") {
      onDrop({
        sourceSquare: "e1",
        targetSquare: "g1",
      });
    }
    if (chosenMove === "e8h8") {
      onDrop({
        sourceSquare: "e8",
        targetSquare: "g8",
      });
    }
    if (chosenMove === "e1a1") {
      onDrop({
        sourceSquare: "e1",
        targetSquare: "c1",
      });
    }
    if (chosenMove === "e8a8") {
      onDrop({
        sourceSquare: "e8",
        targetSquare: "c8",
      });
    }
    onDrop({
      sourceSquare: chosenMove.slice(0, 2),
      targetSquare: chosenMove.slice(2),
    });
  }

  function handleReset() {
    const gameCopy = { ...game };
    gameCopy.reset();
    setGame(gameCopy);
    setUci("");
    setOpening("");
    setTopMoves([]);
    setMoveCount(0);
    setMessage("");
    setBookMessage("");
  }

  function handleUndo() {
    const gameCopy = { ...game };
    gameCopy.undo();
    setGame(gameCopy);
    setMoveCount(moveCount - 1);
    setUci(uci.slice(0, -5));
    if (uci.slice(0, -5)) {
      getOpening(uci.slice(0, -5));
    } else {
      handleReset();
    }
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
    <Grid
      container
      justifyContent="space-around"
      spacing={2}
      sx={{ border: "1px dashed grey" }}
    >
      <Grid item xs={12} sx={{ height: "3vh", border: "1px dashed grey" }}>
        <Typography>{opening}</Typography>
      </Grid>
      <Grid item xs={6.5} sx={{ border: "1px dashed grey" }}>
        <Chessboard
          position={game.fen()}
          onDrop={onDrop}
          orientation={orientation}
          darkSquareStyle={colorTheme.dark}
          lightSquareStyle={colorTheme.light}
          dropSquareStyle={colorTheme.drop}
        />
        <FormControl
          sx={{ mt: 1.5, minWidth: 120 }}
          size="small"
          margin="dense"
        >
          <InputLabel>colors</InputLabel>
          <Select onChange={handleThemeChange} value="">
            <MenuItem value="blue">Blue</MenuItem>
            <MenuItem value="rose">Rose</MenuItem>
            <MenuItem value="mint">Mint</MenuItem>
            <MenuItem value="neon">Neon</MenuItem>
          </Select>
        </FormControl>
        <Typography> {message}</Typography>
        <Typography> {bookMessage}</Typography>
      </Grid>
      <Grid item xs={5.5} sx={{ border: "1px dashed grey" }}>
        <ButtonGroup
          variant="outlined"
          orientation="vertical"
          size="small"
          aria-label="small button group"
        >
          <Button onClick={handleReset}>start over</Button>
          <Button onClick={handleUndo}>⇐</Button>
          <Button onClick={handleFlip}>flip</Button>
        </ButtonGroup>
        <Grid item sx={{ border: "1px dashed grey" }}>
          {displayTopMoves()}
        </Grid>

        <Grid item sx={{ border: "1px dashed grey" }}>
          {game.pgn()}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PlayBoard;

// stateHistory = [
//   {
//     opening:
//     topMoves:
//     uci:
//   },

// ]

// const updatedHistory = [...openingHistory, response.opening.name];
// setOpeningHistory(updatedHistory);

// const historyCopy = [...openingHistory];
// historyCopy.pop();
// setOpeningHistory(historyCopy);
// setOpening(historyCopy[historyCopy.length - 1]);
// const [openingHistory, setOpeningHistory] = useState([]);
// sx={{
//   display: "flex",
//   "& > *": {
//     ml: 1,
//   },
// }}
