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

  const [selectedSquare, setSelectedSquare] = useState('');
  const [optionSquares, setOptionSquares] = useState({});
  const [cloudEval, setCloudEval] = useState("");


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

  const getCloudEvalAsync = (fen) => {
    return axios
      .get(`https://lichess.org/api/cloud-eval?fen=${fen}`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        setCloudEval("")
        throw new Error("error getting cloud eval");
      });
  };

  const getCloudEval= useCallback((fen) => {
    console.log(fen)
    getCloudEvalAsync(fen)
      .then((response) => {
        console.log(response)
        if (response.pvs) {
          const num = response.pvs[0].cp
          if (num === 0) {
            setCloudEval(0)
          } else if (num > 0) {
            setCloudEval('+'+Math.ceil((num/100) * 10) / 10);
          } else if (num < 0) {
            setCloudEval(Math.ceil((num/100) * 10) / 10);
          } else {
            game.turn === 'w' 
              ? setCloudEval('#' + response.pvs[0].mate) 
              : setCloudEval('#-' + response.pvs[0].mate);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // keep track of move logic for openings
  function moveLogic(sourceSquare, targetSquare) {
      setMoveCount(moveCount + 1);
      if (sound) {
        moveSound.play();
      }
      getCloudEval(game.fen())

      const uciMove = `${sourceSquare}${targetSquare}`;
      if (!uci) {
        setUci(uciMove);
        getOpening(uciMove);
      } else {
        setUci(`${uci},${uciMove}`);
        getOpening(`${uci},${uciMove}`);
      }

  }

  // when user drags/drops pieces
  function onDrop(sourceSquare, targetSquare) {
    setMessage("");
    const gameCopy = { ...game };
    const move = gameCopy.move({ 
      from: sourceSquare, 
      to: targetSquare,
      promotion: 'q',
    });
    setGame(gameCopy);

    if (move) { moveLogic(sourceSquare, targetSquare) }
    
    if (game.in_check()) {
      setMessage("check");
    }
    if (game.in_checkmate()) {
      setMessage("checkmate");
    }

    setSelectedSquare('');
    setOptionSquares({});
  }

  // when user clicks on a piece 
  function onSquareClick(square) {
    if (game.get(square) && !selectedSquare) {
      setSelectedSquare(square);
      getMoveOptions(square);
      return;
    }
    // attempt to make move
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: selectedSquare,
      to: square,
      promotion: 'q' // always promote to a queen for example simplicity
    });

    // if illegal move, reset initial selected square
    if (game.get(square) && !move) {
      setSelectedSquare(square);
      getMoveOptions(square);
      return;
    }

    // make move
    setGame(gameCopy);
    moveLogic(selectedSquare, square) 
    setMessage("");

    if (game.in_check()) {
      setMessage("check");
    }
    if (game.in_checkmate()) {
      setMessage("checkmate");
    }

    setSelectedSquare('');
    setOptionSquares({});
  }

  function onMouseOverSquare(square) {
    if(!selectedSquare) getMoveOptions(square);
  }

  function onMouseOutSquare() {
      if (Object.keys(optionSquares).length !== 0 && !selectedSquare) setOptionSquares({});
    
  }

  // highlight move options for selected/hovered piece 
  function getMoveOptions(square) {
    // get valid moves
    const moves = game.moves({
      square,
      verbose: true
    });

    // no moves found
    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }

    // highlight move options
    const options = {};
    moves.forEach((move) => {
      options[move.to] = {
        background: game.get(move.to) && game.get(move.to).color !== game.get(square).color
          ? `radial-gradient(circle at center, transparent 55%, rgba(0,0,0,.1) 55% )`// opponent piece
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)', // normal piece/square
        borderRadius: '50%',
      };
    });
    setOptionSquares(options);
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

// make move chosen from top moves list
  function handleMoveClick(chosenMove) {
    // handle castles
    if (chosenMove === "e1h1") {
      onDrop("e1","g1");
    }
    if (chosenMove === "e8h8") {
      onDrop("e8","g8");
    }
    if (chosenMove === "e1a1") {
      onDrop("e1","c1");
    }
    if (chosenMove === "e8a8") {
      onDrop("e8","c8");
    }
    onDrop(chosenMove.slice(0, 2), chosenMove.slice(2));
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
    setSelectedSquare('');
    setOptionSquares({});
    setCloudEval("")
  }

  function handleUndo() {
    const gameCopy = { ...game };
    gameCopy.undo();
    setGame(gameCopy);
    setMoveCount(moveCount - 1);
    getCloudEval(game.fen())
    setUci(uci.slice(0, -5));
    if (uci.slice(0, -5)) {
      getOpening(uci.slice(0, -5));
    } else {
      handleReset();
    }
    if (game.in_check()) {
      setMessage("check");
    } else {
      setMessage("");
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
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography variant="h6">{opening}</Typography>
          </Toolbar>
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography variant="h7">{cloudEval}</Typography>
          </Toolbar>
        </Grid>
        <Grid item xs={10} sm={8} md={6} >
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            onMouseOutSquare={onMouseOutSquare}
            onMouseOverSquare={onMouseOverSquare}
            onSquareClick={onSquareClick}
            boardOrientation={orientation}
            customDarkSquareStyle={colorTheme.dark}
            customLightSquareStyle={colorTheme.light}
            customDropSquareStyle={colorTheme.drop}
            customSquareStyles={optionSquares}
          />
          <Typography class = "message" > {message}</Typography>
        </Grid>
        <Grid item xs={10} sm={4} md={3} >
          <ButtonGroup
            variant="outlined"
            orientation="vertical"s
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
        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center' }}>
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
        </Grid>
        {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <span class="message">{message}</span>
        </Grid> */}
      </Grid>
    );
    };


export default PlayBoard;
