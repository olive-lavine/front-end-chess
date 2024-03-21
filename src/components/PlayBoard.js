import { Chessboard } from "react-chessboard";
import axios from "axios";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import Button from "@mui/material/Button";
import Paper from '@mui/material/Paper';
import { Icon, Tooltip, Zoom } from '@mui/material';
import RepeatIcon from '@mui/icons-material/Repeat';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Card from "@mui/material/Card";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Unstable_Grid2";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Box from '@mui/material/Box';
import { useAuth } from "../contexts/AuthContext"
import { useSettingsContext } from '../contexts/SettingsContext';
import RingButtons from "./RingButtons";
import PGN from "./PGN";



const kBaseUrl = "https://explorer.lichess.ovh/masters?play=";
const baseUrl = `${process.env.REACT_APP_BASE_URL}players/`;

const PlayBoard = () => {
  const chessRef = useRef(new Chess());


  const { currentUser } = useAuth()
  const { colorTheme, sound, } = useSettingsContext();
  const moveSound = new Audio(sound);

  const [game, setGame] = useState(chessRef.current);
  const [orientation, setOrientation] = useState("white");
  const [message, setMessage] = useState("");
  const [opening, setOpening] = useState("");
  const [topMoves, setTopMoves] = useState([]);
  const [uci, setUci] = useState("");
  const [moveCount, setMoveCount] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState("");
  const [optionSquares, setOptionSquares] = useState({});
  const [cloudEval, setCloudEval] = useState(0.0);
  const [pgnInput, setpgnInput] = useState('');
  const [error, setError] = useState(false);


  const getOpeningAsync = (uci) => {
    return axios
      .get(`${kBaseUrl}${uci}&moves=6&topGames=0`)
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
            setCloudEval(game.turn === "w" ? `#${pv.mate}` : `#${pv.mate}`);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setCloudEval('?');
      });
  },[]);

  function handleMove(sourceSquare, targetSquare) {
    const gameCopy =  {...game} 

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
      setMessage("CHECKMATE");
    } else if (gameCopy.in_check()) {
      setMessage("CHECK");
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
          <Button size="large" variant= 'outlined' onClick={addCustomOpening}>
            Add to repertoire
          </Button>
      );
    }
  }

  function addCustomOpening() {
    const player = {player_id:currentUser.uid, name: currentUser.displayName}
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
      setMessage("CHECK");
    } else {
      setMessage("");
    }
  }

  function handleFlip() {
    orientation === "white" ? setOrientation("black") : setOrientation("white");
  }

  useEffect(() => {
    if (error) {
      const timerId = setTimeout(() => {
        setError(false);
      }, 3000); 

      return () => {
        clearTimeout(timerId); // Clear the timeout if the component unmounts or pgnInput changes
      };
    }
  }, [error, pgnInput]);


  const handleLoad = (event) => {
    event.preventDefault();
    const gameCopy = {...game};
    const prevpgn = game.pgn();
    const loadSuccess = gameCopy.load_pgn(pgnInput); // Attempt to load the PGN
  
    if (!loadSuccess) {
      setError(true); 
      gameCopy.load_pgn(prevpgn);
    } else {
      setGame(gameCopy);
      getCloudEval(game.fen());
      const history = game.history({ verbose: true });
      const uciMoves = history.map((move) => move.from + move.to).join(',');
      setUci(uciMoves);
      getOpening(uciMoves);
      setError(false)
    }
  
    // Reset the input field
    setpgnInput('');
  };
  

  const handleInputChange = (event) => {
    setpgnInput(event.target.value);
    setError(false); 
  };


return (
  <Grid container spacing={2}>
    <Grid item xs={12} sm={8}>
      <Paper
        elevation={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 2,
          bgcolor: "#DFDBD3"
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "75vh",
          }}
        >
          <Typography variant={opening && opening.length > 45 ? "h5" : "h4"} sx={{ marginBottom: 1, height: "2rem", }}>
            {opening ? opening : "Your move"}
          </Typography>
          <Typography height={'2rem'}>{message}</Typography>
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
      </Paper>
    </Grid>
    <Grid item xs={12} sm={4}>
      <Paper elevation={2} sx={{ padding: 3, bgcolor: "#DFDBD3", height: ' 100%' }}>
        <RingButtons moves={topMoves} handleClick={(move) => handleMoveClick(move)} />
        <Box
          sx={{
            height: "1.75rem",
            width: "3rem",
            borderRadius: 1,
            marginBottom: 1.5,
          }}
          border={1}
          borderColor={"rgb(52, 108, 140)"}
          align="center"
        >
          <Typography color="primary">{cloudEval}</Typography>
        </Box>
        <ButtonGroup
          variant="outlined"
          size="large"
          aria-label="small button group"
        >
        <Tooltip TransitionComponent={Zoom} title="Start Over" arrow>
          <Button onClick={handleReset}>
            <FirstPageIcon ></FirstPageIcon>
          </Button>
        </Tooltip>
        <Tooltip TransitionComponent={Zoom} title="Previous Move" arrow>
          <Button onClick={handleUndo}>
            <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
          </Button>
        </Tooltip>
        <Tooltip TransitionComponent={Zoom} title="Flip Board" arrow>
          <Button onClick={handleFlip}>
            <RepeatIcon ></RepeatIcon>
          </Button>
        </Tooltip>
        </ButtonGroup>
        <Box height={'300px'}>
          <PGN pgn={game.pgn()}></PGN>
        </Box>
        <Box height={'40px'} >{currentUser && displayAddOpening()}
        </Box>
        <TextField
          multiline
          maxRows={8}
          component="form"
          size="small"
          onSubmit={handleLoad}
          color="primary"
          placeholder="Load PGN"
          value={pgnInput}
          onChange={handleInputChange}
          helperText={error ? 'Invalid Input' : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" type="submit">
                  <AddBoxIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
    </Grid>
  </Grid>
);

};

export default PlayBoard;

