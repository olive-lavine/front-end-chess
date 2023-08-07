import { Chessboard } from "react-chessboard";
import axios from "axios";
import { useCallback, useEffect, useState, useRef } from "react";
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
import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Box from '@mui/material/Box';

const kBaseUrl = "https://explorer.lichess.ovh/masters?play=";
const baseUrl = "http://localhost:8080/players/";

const PlayBoard = ({ player }) => {
  const chessRef = useRef(new Chess());
  const moveSound = useRef(new Audio());

  const [game, setGame] = useState(chessRef.current);
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
  const [theme, setTheme] = useState("blue");
  const [selectedSquare, setSelectedSquare] = useState("");
  const [optionSquares, setOptionSquares] = useState({});
  const [cloudEval, setCloudEval] = useState(0.0);
  const [pgnInput, setpgnInput] = useState('');
  const [error, setError] = useState(false);


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
        setOpening((prevOpening) => response.opening ? response.opening.name : prevOpening);
        setTopMoves(response.moves.map(move => ({ san: move.san, uci: move.uci })));
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
        setCloudEval("");
        throw new Error("error getting cloud eval");
      });
  };

  const getSfEvalAsync = (fen) => {
    const requestBody = { fen };
    return axios
      .post(`http://localhost:3000/start-analysing/`, requestBody)
      .then((response) => {
        const id = response.data.id;
        return new Promise((resolve) => setTimeout(() => resolve(id), 5000));
      })
      .then((id) => {
        return axios.post(`http://localhost:3000/get-best-lines/`, { id });
      })
      .then((response2) => {
        console.log(response2);
      })
      .catch((err) => {
        console.log(err);
        setCloudEval("?");
        throw new Error("error getting stockfish eval");
      });
  };

  function getSfEval(fen) {}

  const getCloudEval = useCallback((fen) => {
    const fenParts = fen.split(" ");
    fenParts[3] = "-";
    const fenOutput = fenParts.join(" ");
    
    getCloudEvalAsync(fenOutput)
      .then((response) => {
        const [pv] = response.pvs || [];
        if (pv) {
          const num = pv.cp;
          if (num === 0) {
            setCloudEval(0);
          } else if (!isNaN(num)) {
            setCloudEval(`${num > 0 ? "+" : ""}${Math.ceil((num / 100) * 10) / 10}`);
          } else {
            setCloudEval(game.turn === "w" ? `#${pv.mate}` : `#-${pv.mate}`);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setCloudEval('?');
      });
  },[]);

  function handleMove(sourceSquare, targetSquare) {
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
  
    if (move) {
      setMoveCount((prevMoveCount) => prevMoveCount + 1);
      if (sound) {
        moveSound.play();
      }
      getCloudEval(game.fen());
    
      const uciMove = `${sourceSquare}${targetSquare}`;
      const updatedUci = uci ? `${uci},${uciMove}` : uciMove;
      setUci(updatedUci);
      getOpening(updatedUci);
    }
  
    setGame(gameCopy);
  
    if (gameCopy.in_checkmate()) {
      setMessage("Checkmate");
    } else if (gameCopy.in_check()) {
      setMessage("Check");
    } else {
      setMessage("");
    }
  
    setSelectedSquare("");
    setOptionSquares({});
  }

  function onDrop(sourceSquare, targetSquare) {
    setMessage("");
    handleMove(sourceSquare, targetSquare);
  }
  
  function onSquareClick(square) {
    if (game.get(square) && !selectedSquare) {
      setSelectedSquare(square);
      getMoveOptions(square);
      return;
    }
  
    if (!selectedSquare) return;
  
    handleMove(selectedSquare, square);
  }  
  
  function onMouseOverSquare(square) {
    if (!selectedSquare) {
      getMoveOptions(square);
    }
  }
  
  function onMouseOutSquare() {
    if (!selectedSquare && Object.keys(optionSquares).length !== 0) {
      setOptionSquares({});
    }
  }
  
  // Highlight move options for selected/hovered piece
  function getMoveOptions(square) {
    // Get valid moves
    const moves = game.moves({ square, verbose: true });
    
     // No moves found
    if (moves.length === 0) {
      setOptionSquares({});
      return;
    }
    
    const options = moves.reduce((acc, move) => {
      acc[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle at center, transparent 55%, rgba(0,0,0,.1) 55%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return acc;
    }, {});
  
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
      <Box>
        <Button
          size="large"
          onClick={() => {
            setIsShown((current) => !current);
          }}
        >
          {!isShown && <Typography variant="body1">view top moves</Typography>}
          {isShown && <Typography variant="body1">hide top moves</Typography>}
        </Button>
        <Box mb={2} /> 
        {isShown && (
          <ButtonGroup size="small" aria-label="small button group">
            {moves}
          </ButtonGroup>
        )}
      </Box>
    );
  }

  // make move chosen from top moves list
  function handleMoveClick(chosenMove) {
    const castleMoves = {
      e1h1: { source: "e1", target: "g1" },
      e8h8: { source: "e8", target: "g8" },
      e1a1: { source: "e1", target: "c1" },
      e8a8: { source: "e8", target: "c8" },
    };
  
    if (chosenMove in castleMoves) {
      const { source, target } = castleMoves[chosenMove];
      onDrop(source, target);
    } else {
      const sourceSquare = chosenMove.slice(0, 2);
      const targetSquare = chosenMove.slice(2);
      onDrop(sourceSquare, targetSquare);
    }
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
    setSelectedSquare("");
    setOptionSquares({});
    setCloudEval(0);
    setError(false); 
    setpgnInput('');
  }

  function handleUndo() {
    const gameCopy = { ...game };
    gameCopy.undo();
    setGame(gameCopy);
    setMoveCount(moveCount - 1);
    getCloudEval(game.fen());
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
    const themes = {
      blue: {
        light: { backgroundColor: "rgb(217, 227, 242)" },
        dark: { backgroundColor: "rgb(141, 171, 215)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
        sound: "",
      },
      classic: {
        light: { backgroundColor: "rgb(240, 217, 181)" },
        dark: { backgroundColor: "rgb(181, 136, 99)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(249, 249, 249)" },
        sound: "",
      },
      rose: {
        light: { backgroundColor: "rgb(235, 224, 224)" },
        dark: { backgroundColor: "rgb(148, 107, 107)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(121, 160, 103)" },
        sound: "./sounds/wood.mp3",
      },
      mint: {
        light: { backgroundColor: "rgb(223, 243, 216)" },
        dark: { backgroundColor: "rgb(215, 180, 228)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(224, 170, 190)" },
        sound: "./sounds/glass.mp3",
      },
      neon: {
        light: { backgroundColor: "rgb(220, 242, 132)" },
        dark: { backgroundColor: "rgb(230, 74, 196)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(49, 191, 236)" },
        sound: "./sounds/space.mp3",
      },
    };
  
    setColorTheme(themes[theme]);
    setSound(themes[theme].sound);
    setTheme(theme);
  };


  const handleLoad = () => {
    // Process the inputed text
    try {
      const gameCopy = { ...game };
      gameCopy.load_pgn(pgnInput);
      setGame(gameCopy);
      getCloudEval(game.fen());
      const history = game.history({ verbose: true })
      const uciMoves = history.map(move => move.from + move.to).join(',');
      setUci(uciMoves);
      getOpening(uciMoves);
      setError(false);
    } catch(e){
      console.log(e)
      setError(true);
  
    }
    // Reset the input field
    setpgnInput('');
  };

  const handleInputChange = (event) => {
    setpgnInput(event.target.value);
    setError(false); 
  };


  return (
    <Grid container >
      <Grid item xs={12} sm={6} >
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6">{opening}</Typography>
        </Toolbar>
      </Grid>
      <Grid item xs={12} sm={8} md={8} xl={10}>
          <Typography variant="h8" >{message}</Typography>
        <Box>
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
        </Box>
      </Grid>
      <Grid item >
        <Box
          sx={{
            height: "1.75rem",
            width: "3rem",
            borderColor: "grey",
            borderRadius: 1,
          }}
          border={1.5}
          align="center"
        >
          {cloudEval}
        </Box>
        <p></p>
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
        {displayTopMoves()}
        <Grid
          item
          sx={{
            maxWidth: 200,
            padding: 0.5,
            marginTop: 1,
          }}
        >
          {game.pgn()}
          <Grid item>{displayAddOpening()}</Grid>
        </Grid>
        <Box>
        <TextField
          fullWidth
          placeholder="Load PGN"
          value ={pgnInput}
          onChange={handleInputChange}
          error={error}
          helperText={error ? 'Invalid Input' : ''}
          InputProps={{
            sx: { fontSize: 'default' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={handleLoad}>
                  <AddBoxIcon />
                </IconButton>
              </InputAdornment>),
          }}
        />
        </Box>
        <FormControl
          sx={{ mt: 1.5, minWidth: 120 }}
          size="small"
          margin="dense"
        >
          <InputLabel>colors</InputLabel>
          <Select onChange={handleThemeChange} value={theme} label="Colors">
            <MenuItem value="blue">Blue</MenuItem>
            <MenuItem value="classic">Classic</MenuItem>
            <MenuItem value="rose">Rose</MenuItem>
            <MenuItem value="mint">Mint</MenuItem>
            <MenuItem value="neon">Neon</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default PlayBoard;
