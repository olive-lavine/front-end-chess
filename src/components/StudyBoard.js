import { Chessboard } from "react-chessboard";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Chess } from "chess.js";
import axios from "axios";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Grid from "@mui/material/Grid";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import { useAuth } from "../contexts/AuthContext"
import { useSettingsContext } from '../contexts/SettingsContext';


const baseUrl = `${process.env.REACT_APP_BASE_URL}players`;
const kBaseUrl = `${process.env.REACT_APP_BASE_URL}openings/parent`;



const StudyBoard = () => {
  const chessRef = useRef(new Chess());

  const { currentUser } = useAuth()
  const { colorTheme, sound, } = useSettingsContext();

  const [game, setGame] = useState(chessRef.current);
  const [orientation, setOrientation] = useState("white");
  const [message, setMessage] = useState("");
  const [moveCount, setMoveCount] = useState(0);
  const [openings, setOpenings] = useState([]);
  const [customOpenings, setCustomOpenings] = useState([]);
  const [openingName, setOpeningName] = useState("");
  const [isShown, setIsShown] = useState(false);
  const [hasChild, setHasChild] = useState(false);
  const [selectedOpeningMoves, setSelectedOpeningMoves] = useState([]);
  const [idHistory, setIdHistory] = useState([]);
  const [selectedCustomId, setSelectedCustomId] = useState("");
  const [openingHistory, setOpeningHistory] = useState({});
  const [customSelected, setCustomSelected] = useState(false);
  const moveSound = useMemo(() => new Audio(sound), [sound]);
  const [selectedSquare, setSelectedSquare] = useState('');
  const [hint, setHint] = useState({});
  const [totalReset, setTotalReset] = useState(true);
  const [selectedValue, setSelectedValue] = useState('');


  const getOpeningsAsync = (parentId) => {
    return axios
      .get(`${kBaseUrl}/${parentId}`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        throw new Error("error getting next openings");
      });
  };

  const getOpenings = useCallback((parentId) => {
    getOpeningsAsync(parentId)
      .then((openings) => {
        setOpenings(openings);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getCustomOpeningsAsync = (playerId) => {
    return axios
      .get(`${baseUrl}/${playerId}/custom`)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        throw new Error("error getting custom openings");
      });
  };

  const getCustomOpenings = useCallback((playerId) => {
    getCustomOpeningsAsync(playerId)
      .then((response) => {
        const openingList = response.map((opening) => ({
          id: opening.id,
          name: opening.name,
          pgn: opening.pgn,
          parentId: null,
          hasChild: false,
        }));
        setCustomOpenings(openingList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  

  useEffect(() => {
    getOpenings("");
  }, [getOpenings]);

  useEffect(() => {
    getCustomOpenings(currentUser.uid);
  }, [getCustomOpenings, currentUser.uid]);

  function deleteCustomOpening() {
    return axios
      .delete(`${baseUrl}/custom/${selectedCustomId}`)
      .then((response) => {
        // Update the frontend state to remove the deleted custom opening
        const updatedOpenings = customOpenings.filter((opening) => opening.id !== selectedCustomId);
        setCustomOpenings(updatedOpenings);
        setTotalReset(true);
        handleReset();
        // Update backend
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        throw new Error("error deleting opening");
      });
  }

  const cpu_moves = useCallback(() => {
    const gameCopy = { ...game };
    setTimeout(() => {
      gameCopy.move(selectedOpeningMoves[moveCount]);
      setGame(gameCopy);
      const newMoveCount = moveCount + 1;
      setMoveCount(newMoveCount);
      if (newMoveCount === selectedOpeningMoves.length && hasChild) {
        setMessage("Choose continuation");
      } else if (newMoveCount === selectedOpeningMoves.length && !hasChild) {
        setMessage("Out of book..");
      }
    }, 200);
    setTimeout(() => {
      if (sound) {
        moveSound.play();
      }
    }, 800);
  }, [game, moveSound, moveCount, hasChild, selectedOpeningMoves, sound]);

  // Handles CPU making the correct opening moves
  useEffect(() => {
    const isCPUTurn = (orientation === "white" && game.turn() === "b") || (orientation === "black" && game.turn() === "w");
  
    if (isCPUTurn && moveCount < selectedOpeningMoves.length) {
      cpu_moves();
    }
  }, [moveCount, game, orientation, selectedOpeningMoves, cpu_moves]);
  

  function onDrop(sourceSquare, targetSquare) {
    if (selectedOpeningMoves.length === 0) {
      setMessage("select an opening!");
      return;
    }
    setMessage("");
    if (moveCount < selectedOpeningMoves.length) {
      const gameCopy = { ...game };
      const move = gameCopy.move({ from: sourceSquare, to: targetSquare });
      if (!move) {
        return;
      }
      if (move.san !== selectedOpeningMoves[moveCount]) {
        gameCopy.undo();
        setMessage("Try again... ");
      }
      if (move.san === selectedOpeningMoves[moveCount]) {
        setGame(gameCopy);
        if (sound) {
          moveSound.play();
        }
        const newMoveCount = moveCount + 1;
        setMoveCount(newMoveCount);
        if (newMoveCount === selectedOpeningMoves.length && hasChild) {
          setMessage("Choose continuation");
        } else if (newMoveCount === selectedOpeningMoves.length && !hasChild) {
          setMessage("Out of book...");
        }
      }
      if (game.in_check()) {
        setMessage("check");
      }
    } else if (moveCount >= selectedOpeningMoves.length && hasChild) {
      setMessage("Choose continuation");
    } else if (moveCount >= selectedOpeningMoves.length && !hasChild) {
      const gameCopy = { ...game };
      gameCopy.move({ from: sourceSquare, to: targetSquare });
      setMessage("Out of book...");
      if (sound) {
        moveSound.play();
      }
      setGame(gameCopy);
      setMoveCount(moveCount + 1);
    }
  }
  

  // when user clicks on a piece 
  function onSquareClick(square) {
    if (game.get(square) && !selectedSquare) {
      setSelectedSquare(square);
      return;
    }
    if (selectedOpeningMoves.length === 0) {
      setMessage("select an opening!");
      return;
    }
    setMessage("");
    if (moveCount < selectedOpeningMoves.length) {
      const gameCopy = { ...game };
      const move = gameCopy.move({ from: selectedSquare, to: square });
      if (!move) {
        setSelectedSquare(square);
        return;
      }
      if (move.san !== selectedOpeningMoves[moveCount]) {
        gameCopy.undo();
        setMessage("Try again... ");
      }
      if (move.san === selectedOpeningMoves[moveCount]) {
        setGame(gameCopy);
        if (sound) {
          moveSound.play();
        }
        const newMoveCount = moveCount + 1;
        setMoveCount(newMoveCount);
        if (newMoveCount === selectedOpeningMoves.length && hasChild) {
          setMessage("Choose continuation");
        } else if (newMoveCount === selectedOpeningMoves.length && !hasChild) {
          setMessage("Out of book...");
        }
      }
      if (game.in_check()) {
        setMessage("check");
      }
    } else if (moveCount >= selectedOpeningMoves.length && hasChild) {
      setMessage("Choose continuation");
    } else if (moveCount >= selectedOpeningMoves.length && !hasChild) {
      const gameCopy = { ...game };
      gameCopy.move({ from: selectedSquare, to: square });
      setMessage("Out of book, but follow your curiosity...");
      if (sound) {
        moveSound.play();
      }
      setGame(gameCopy);
      setMoveCount(moveCount + 1);
    }

    setSelectedSquare('');
  }

  function handleReset() {
    const gameCopy = { ...game };
    gameCopy.reset();
    setGame(gameCopy);
    setMoveCount(0);
    setMessage("");
    // setSelectedOpeningMoves([]);
    // setOpeningName("");
    setHint({})
    // if(totalReset){
      setOpeningHistory({});
      setIdHistory([]);
      getOpenings("");
      setCustomSelected(false);
    // }
  }

  function handleUndo() {
    setMessage("");
    const gameCopy = { ...game };
    gameCopy.undo();
    if (moveCount <= selectedOpeningMoves.length && moveCount > 0) {
      gameCopy.undo();
      setMoveCount(moveCount - 2);
    } else if (moveCount > 0) {
      setMoveCount(moveCount - 1);
    }
    setGame(gameCopy);
  }

  function handleFlip() {
    orientation === "white" ? setOrientation("black") : setOrientation("white");
  }

  const handleOpeningChange = (event) => {
    setMessage("");
    setCustomSelected(false);
    const openingId = parseInt(event.target.value);
    const updatedIdHistory = [...idHistory, openingId];
    setIdHistory(updatedIdHistory);
  
    // Find the selected opening
    const selectedOpening = openings.find((opening) => opening.id === openingId);
    if (selectedOpening) {
      setHasChild(selectedOpening.hasChild);
      setOpeningName(selectedOpening.name);
  
      const historyCopy = { ...openingHistory };
      historyCopy[openingId] = {
        hasChild: selectedOpening.hasChild,
        name: selectedOpening.name,
        pgn: selectedOpening.pgn,
        moves: [],
      };
      setOpeningHistory(historyCopy);
  
      // Transform PGN to list of moves
      const openingMoves = selectedOpening.pgn.split(" ").filter((_, index) => index % 3 !== 0);
      setSelectedOpeningMoves(openingMoves);
      historyCopy[openingId].moves = openingMoves;
    }
  
    getOpenings(openingId);
  };
  

  const handleCustomOpeningChange = (event) => {
    setTotalReset(false);
    handleReset();
    setTotalReset(true);
    setCustomSelected(true);
    setSelectedValue(event.target.value);

  
    const openingId = parseInt(event.target.value);
    setSelectedCustomId(openingId);
  
    // Find the selected custom opening
    const selectedOpening = customOpenings.find((opening) => opening.id === openingId);
    if (selectedOpening) {
      setHasChild(selectedOpening.hasChild);
      setOpeningName(selectedOpening.name);
  
      // Transform PGN to list of moves
      const openingMoves = selectedOpening.pgn.split(" ").filter((_, index) => index % 3 !== 0);
      setSelectedOpeningMoves(openingMoves);
    }
  };
  

  function displayDeleteOpening() {
    if (customSelected) {
      return (
        <Box>
          <Button sx={{ ml: 2 }} size="small" onClick={deleteCustomOpening}>
            <Typography variant="body1">Delete opening</Typography>
          </Button>
        </Box>
        
      );
    }
  }

  function handleView() {
    if (selectedOpeningMoves.length > 0 && moveCount < selectedOpeningMoves.length) {
      return (
        <Box mt={1}>
          <Button
            sx={{ ml: 2 }}
            size="small"
            onClick={() => {
              setIsShown((current) => !current);
            }}
          >
            {!isShown && (
              <Typography variant="body1">View next move</Typography>
            )}
            {isShown && <Typography variant="body1">Hide next move</Typography>}
          </Button>
        </Box>
      );
    } else {
      return <Box mt={1}></Box>;
    }
  }

  // highlight next square in selected opening if user wants hints displayed
  useEffect(() => {
    if (isShown && moveCount < selectedOpeningMoves.length) {
      const tracker = new Chess();
      tracker.load_pgn(game.pgn());
      const move = tracker.move(selectedOpeningMoves[moveCount]);
      if (move) {
        if ((orientation === 'white' && moveCount % 2 === 0) || (orientation === 'black' && moveCount % 2 !== 0)) {
            const hints = {
              [move.from]: { backgroundColor: "rgb(250, 238, 220)", boxShadow: "inset 0 0 1px 4px rgb(245, 213, 164)" },
              [move.to]: { backgroundColor: "rgb(250, 238, 220)", boxShadow: "inset 0 0 1px 4px rgb(245, 213, 164)" },
            };
            setHint(hints);
          }
      } 
    } else {
      setHint({});
    }
  }, [isShown, moveCount, game, selectedOpeningMoves, orientation]);



  function toggleOpenings() {
    if (selectedOpeningMoves.length > 0 && !customSelected) {
      const previousId = idHistory[idHistory.length - 2];
      const currentId = idHistory[idHistory.length - 1];
  
      const handlePreviousOpenings = () => {
        if (previousId) {
          getOpenings(previousId);
          setOpeningName(openingHistory[previousId].name);
          setSelectedOpeningMoves(openingHistory[previousId].moves);
          setHasChild(openingHistory[previousId].hasChild);
        } else {
          getOpenings("");
          setOpeningName("");
          setSelectedOpeningMoves("");
        }
        // remove opening from history
        const idHistoryCopy = [...idHistory];
        idHistoryCopy.pop();
        setIdHistory(idHistoryCopy);
        const historyCopy = { ...openingHistory };
        delete historyCopy[currentId];
        setOpeningHistory(historyCopy);
        handleUndo();
      };
  
      return (
        <Box mt={2}>
          <Button
            size="large"
            sx={{ ml: .25 }}
            onClick={handlePreviousOpenings}
          >
            Previous Openings
          </Button>
        </Box>
      );
    }
  }

  return (
    <Grid container pt={17}>
      <Grid item xs={6}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6">{openingName}</Typography>
        </Toolbar>
      </Grid>
      <Grid item xs={10} sm={8}>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
          boardOrientation={orientation}
          customDarkSquareStyle={colorTheme.dark}
          customLightSquareStyle={colorTheme.light}
          customDropSquareStyle={colorTheme.drop}
          customSquareStyles={hint}
        />
        <FormControl sx={{ mt: 1.5, minWidth: 120 }} size="small" margin="dense">
          <InputLabel>Openings</InputLabel>
          <Select onChange={handleOpeningChange} value="" label="openings">
            {openings.map((opening) => (
              <MenuItem key={opening.id} value={opening.id}>
                {opening.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ mt: 1.5, ml: 2, minWidth: 120 }} size="small" margin="dense">
          <InputLabel>Repertoire</InputLabel>
          <Select value={selectedValue} onChange={handleCustomOpeningChange} label="repertoire">
            {customOpenings.map((opening) => (
              <MenuItem key={opening.id} value={opening.id}>
                {opening.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h5">{message}</Typography>
        </Toolbar>
      </Grid>
      <Grid item>
        <ButtonGroup
          color="primary"
          variant="outlined"
          orientation="vertical"
          size="large"
          aria-label="small button group"
          sx={{ ml: 2 }}
        >
          <Button onClick={handleReset} >Start Over</Button>
          <Button onClick={handleUndo}>⇐</Button>
          <Button onClick={handleFlip}>Flip</Button>
        </ButtonGroup>
        <Grid item>{toggleOpenings()}</Grid>
        <Box mb={2} />
        {handleView()}
        <Box mb={2} />
        <Grid item sx={{ maxWidth: 200, padding: 0.5, ml: 2 }}>
          <Typography>{game.pgn()}</Typography>
        </Grid>
        <Grid item>{displayDeleteOpening()}</Grid>
      </Grid>
    </Grid>
  );
  
};

export default StudyBoard;
