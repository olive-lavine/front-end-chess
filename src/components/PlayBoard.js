import { Chessboard } from "react-chessboard";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Chess } from "chess.js";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import ButtonGroup from "@mui/material/ButtonGroup";

const kBaseUrl = "https://explorer.lichess.ovh/masters?play=";
const baseUrl = "http://localhost:8080/players/";

const PlayBoard = ({ player }) => {
  const chess = new Chess();
  const [game, setGame] = useState(chess);
  const [orientation, setOrientation] = useState("white");
  const [message, setMessage] = useState("");
  const [opening, setOpening] = useState("");
  const [topMoves, setTopMoves] = useState([]);
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

  const getOpening = useCallback((uci) => {
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
        } else {
          setTopMoves([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function onDrop(sourceSquare, targetSquare ) {
    setMessage("");
    const gameCopy = { ...game };
    const move = gameCopy.move({ 
      from: sourceSquare, 
      to: targetSquare,
      promotion: 'q',
    });
    setGame(gameCopy);

    if (move) {
      setMoveCount(moveCount + 1);
      if (sound) {
        moveSound.play();
      }

      const uciMove = `${sourceSquare}${targetSquare}`;
      if (!uci) {
        setUci(uciMove);
        getOpening(uciMove);
      } else {
        setUci(`${uci},${uciMove}`);
        getOpening(`${uci},${uciMove}`);
      }
    }
    if (game.in_check()) {
      setMessage("check");
    }
    if (game.in_checkmate()) {
      setMessage("checkmate");
    }
  }

  useEffect(() => {
    getOpening("");
  }, [getOpening]);

  function displayTopMoves() {
    const moves = topMoves.map((move) => (
      <Button
        key={move.san}
        size="medium"
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
          size="large"
          onClick={() => {
            setIsShown((current) => !current);
          }}
        >
          {!isShown && <section>view top moves</section>}
          {isShown && <section>hide top moves</section>}
        </Button>
        <p></p>
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

  function displayAddOpening() {
    if (game.pgn()) {
      return (
        <p>
          <Button size="large" onClick={addCustomOpening}>
            Add to repertoire
          </Button>
        </p>
      );
    }
  }

  function addCustomOpening() {
    const requestBody = { name: opening, pgn: game.pgn(), player: player };
    return axios
      .post(`${baseUrl}custom`, requestBody)
      .then((response) => {
        console.log(response);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        throw new Error("error posting opening");
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
    getOpening("");
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
      setSound("/assets/sounds/wood.mp3");
    }
    if (theme === "mint") {
      setColorTheme({
        light: { backgroundColor: "rgb(223, 243, 216)" },
        dark: { backgroundColor: "rgb(215, 180, 228)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(224, 170, 190)" },
      });
      setSound("/assets/sounds/glass.mp3");
    }
    if (theme === "neon") {
      setColorTheme({
        light: { backgroundColor: "rgb(49, 191, 236)" },
        dark: { backgroundColor: "rgb(230, 74, 196)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(220, 242, 132)" },
      });
      setSound("/assets/sounds/space.mp3");
    }
  }

  return (
    <Grid container>
      <Grid item xs={6}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6">{opening}</Typography>
        </Toolbar>
      </Grid>
      <Grid item>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation={orientation}
          customDarkSquareStyle={colorTheme.dark}
          customLightSquareStyle={colorTheme.light}
          customDropSquareStyle={colorTheme.drop}
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
        <span class="message">{message}</span>
      </Grid>
      <Grid item sx={{ ml: 2, width: 300 }}>
        <ButtonGroup
          variant="outlined"
          orientation="vertical"
          size="large"
          aria-label="small button group"
        >
          <Button onClick={handleReset}>start over</Button>
          <Button onClick={handleUndo}>⇐</Button>
          <Button onClick={handleFlip}>flip</Button>
        </ButtonGroup>
        <p></p>
        {displayTopMoves()}
        <p></p>
        <Grid
          item
          sx={{
            maxWidth: 200,
            padding: 0.5,
          }}
        >
          {game.pgn()}
          <p></p>
          <Grid item>{displayAddOpening()}</Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PlayBoard;
