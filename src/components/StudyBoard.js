// import Chessboard from "chessboardjsx";
import { Chessboard } from "react-chessboard";
import { useState, useEffect, useCallback, useMemo } from "react";
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

const kBaseUrl = "http://localhost:8080/openings/parent";
const baseUrl = "http://localhost:8080/players";

const StudyBoard = ({ player }) => {
  const chess = new Chess();
  const [game, setGame] = useState(chess);
  const [orientation, setOrientation] = useState("white");
  const [message, setMessage] = useState("");
  const [moveCount, setMoveCount] = useState(0);
  const [openings, setOpenings] = useState([]);
  const [customOpenings, setCustomOpenings] = useState([]);
  const [openingPgn, setOpeningPgn] = useState("");
  const [openingName, setOpeningName] = useState("");
  const [isShown, setIsShown] = useState(false);
  const [hasChild, setHasChild] = useState(false);
  const [selectedOpeningMoves, setSelectedOpeningMoves] = useState([]);
  const [idHistory, setIdHistory] = useState([]);
  const [openingHistory, setOpeningHistory] = useState({});
  const [customSelected, setCustomSelected] = useState(false);
  const [colorTheme, setColorTheme] = useState({
    light: { backgroundColor: "rgb(217, 227, 242)" },
    dark: { backgroundColor: "rgb(141, 171, 215)" },
    drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
  });
  const [sound, setSound] = useState("");
  const moveSound = useMemo(() => new Audio(sound), [sound]);
  const [selectedSquare, setSelectedSquare] = useState('');

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
        const openingList = [];
        for (const opening of response) {
          openingList.push({
            id: opening.id,
            name: opening.name,
            pgn: opening.pgn,
            parentId: null,
            hasChild: false,
          });
          setCustomOpenings(openingList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getOpenings("");
  }, [getOpenings]);

  useEffect(() => {
    getCustomOpenings(player.player_id);
  }, [getCustomOpenings, player.player_id]);

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
        setMessage("Out of book, but follow your curiosity...");
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
    if (
      orientation === "white" &&
      game.turn() === "b" &&
      moveCount < selectedOpeningMoves.length
    ) {
      cpu_moves();
    } else if (
      orientation === "black" &&
      game.turn() === "w" &&
      moveCount < selectedOpeningMoves.length
    ) {
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
          setMessage("Out of book, but follow your curiosity...");
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
      setMessage("Out of book, but follow your curiosity...");
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
          setMessage("Out of book, but follow your curiosity...");
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
    setSelectedOpeningMoves([]);
    setOpeningName("");
    setOpeningPgn("");
    setOpeningHistory({});
    setIdHistory([]);
    getOpenings("");
    setCustomSelected(false);
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

    // find selected opening
    let opening = "";
    const historyCopy = { ...openingHistory };
    for (let i = 0; i < openings.length; i++) {
      if (openings[i].id === openingId) {
        opening = openings[i];
        setOpeningPgn(opening.pgn);
        setHasChild(opening.hasChild);
        setOpeningName(opening.name);
        historyCopy[openingId] = {
          hasChild: opening.hasChild,
          name: opening.name,
          pgn: opening.pgn,
        };
      }
    }
    // transform pgn to list of moves
    let openingMoves = [];
    opening = opening.pgn.split(" ");
    for (let i = 0; i < opening.length; i++) {
      if (i % 3 !== 0) {
        openingMoves.push(opening[i]);
      }
    }
    setSelectedOpeningMoves(openingMoves);
    historyCopy[openingId].moves = openingMoves;
    setOpeningHistory(historyCopy);
    getOpenings(openingId);
  };

  const handleCustomOpeningChange = (event) => {
    setMessage("");
    setCustomSelected(true);
    const openingId = parseInt(event.target.value);

    // find selected opening
    let opening = "";
    for (let i = 0; i < customOpenings.length; i++) {
      if (customOpenings[i].id === openingId) {
        opening = customOpenings[i];
        setOpeningPgn(opening.pgn);
        setHasChild(opening.hasChild);
        setOpeningName(opening.name);
      }
    }
    // transform pgn to list of moves
    let openingMoves = [];
    opening = opening.pgn.split(" ");
    for (let i = 0; i < opening.length; i++) {
      if (i % 3 !== 0) {
        openingMoves.push(opening[i]);
      }
    }
    setSelectedOpeningMoves(openingMoves);
  };

  function handleView() {
    if (selectedOpeningMoves.length > 0) {
      return (
        <section>
          <Button
            sx={{ ml: 1 }}
            size="large"
            onClick={() => {
              setIsShown((current) => !current);
            }}
          >
            {!isShown && <section>view line</section>}
            {isShown && <section>hide line</section>}
          </Button>
          {isShown && (
            <Grid
              item
              sx={{
                maxWidth: 250,
                padding: 0.5,
                ml: 2,
                fontSize: "large",
              }}
            >
              {openingPgn}
            </Grid>
          )}
        </section>
      );
    }
  }

  function toggleOpenings() {
    if (selectedOpeningMoves.length > 0 && !customSelected) {
      const previousId = idHistory[idHistory.length - 2];
      const currentId = idHistory[idHistory.length - 1];
      return (
        <section>
          <Button
            size="large"
            sx={{ ml: 1, mt: 2 }}
            onClick={() => {
              if (previousId) {
                getOpenings(previousId);
                setOpeningPgn(openingHistory[previousId].pgn);
                setOpeningName(openingHistory[previousId].name);
                setSelectedOpeningMoves(openingHistory[previousId].moves);
                setHasChild(openingHistory[previousId].hasChild);
              } else {
                getOpenings("");
                setOpeningPgn("");
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
            }}
          >
            previous openings
          </Button>
        </section>
      );
    }
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
        light: { backgroundColor: "rgb(220, 242, 132)" },
        dark: { backgroundColor: "rgb(230, 74, 196)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(49, 191, 236)" },
      });
      setSound("./sounds/space.mp3");
    }
  }

  return (
    <Grid container>
      <Grid item xs={6}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6">{openingName}</Typography>
        </Toolbar>
      </Grid>
      <Grid item>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          onSquareClick={onSquareClick}
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
        <FormControl
          sx={{ mt: 1.5, ml: 2, minWidth: 120 }}
          size="small"
          margin="dense"
        >
          <InputLabel>openings</InputLabel>
          <Select onChange={handleOpeningChange} value="">
            {openings.map((opening) => (
              <MenuItem key={opening.id} value={opening.id}>
                {opening.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{ mt: 1.5, ml: 2, minWidth: 120 }}
          size="small"
          margin="dense"
        >
          <InputLabel>repertoire</InputLabel>
          <Select onChange={handleCustomOpeningChange} value="">
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
          variant="outlined"
          orientation="vertical"
          size="large"
          aria-label="small button group"
          sx={{ ml: 2 }}
        >
          <Button onClick={handleReset}>start over</Button>
          <Button onClick={handleUndo}>⇐</Button>
          <Button onClick={handleFlip}>flip</Button>
        </ButtonGroup>

        <section>{toggleOpenings()}</section>
        <p></p>
        {handleView()}
        <p></p>
        {!isShown && (
          <Grid
            item
            sx={{
              maxWidth: 200,
              padding: 0.5,
              ml: 2,
            }}
          >
            {game.pgn()}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default StudyBoard;
