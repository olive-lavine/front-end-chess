import { Chessboard } from "react-chessboard";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Chess } from "chess.js";
import axios from "axios";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import RepeatIcon from "@mui/icons-material/Repeat";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip, Zoom } from "@mui/material";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import Paper from "@mui/material/Paper";
import { useAuth } from "../contexts/AuthContext";
import { useSettingsContext } from "../contexts/SettingsContext";
import PGN from "./PGN";

const baseUrl = `${process.env.REACT_APP_BASE_URL}players`;
const kBaseUrl = `${process.env.REACT_APP_BASE_URL}openings/parent`;

const StudyBoard = () => {
  const chessRef = useRef(new Chess());

  const { currentUser } = useAuth();
  const { colorTheme, sound, hintColor } = useSettingsContext();

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
  const [selectedSquare, setSelectedSquare] = useState("");
  const [hint, setHint] = useState({});
  const [totalReset, setTotalReset] = useState(true);
  const [selectedValue, setSelectedValue] = useState("");

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
        const updatedOpenings = customOpenings.filter(
          (opening) => opening.id !== selectedCustomId
        );
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
    const isCPUTurn =
      (orientation === "white" && game.turn() === "b") ||
      (orientation === "black" && game.turn() === "w");

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

    setSelectedSquare("");
  }

  function handleReset() {
    const gameCopy = { ...game };
    gameCopy.reset();
    setGame(gameCopy);
    setMoveCount(0);
    setMessage("");
    setSelectedOpeningMoves([]);
    setOpeningName("");
    setHint({});
    setSelectedValue("");
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

    // Find the selected opening
    const selectedOpening = openings.find(
      (opening) => opening.id === openingId
    );
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
      const openingMoves = selectedOpening.pgn
        .split(" ")
        .filter((_, index) => index % 3 !== 0);
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
    const selectedOpening = customOpenings.find(
      (opening) => opening.id === openingId
    );
    if (selectedOpening) {
      setHasChild(selectedOpening.hasChild);
      setOpeningName(selectedOpening.name);

      // Transform PGN to list of moves
      const openingMoves = selectedOpening.pgn
        .split(" ")
        .filter((_, index) => index % 3 !== 0);
      setSelectedOpeningMoves(openingMoves);
    }
  };

  function displayDeleteOpening() {
    if (customSelected) {
      return (
        <IconButton
          size="small"
          variant="outlined"
          onClick={deleteCustomOpening}
        >
          <DeleteIcon></DeleteIcon>
        </IconButton>
      );
    } else {
      return (
        <IconButton
          size="small"
          variant="outlined"
          disabled={true}
          disableFocusRipple={true}
        >
          <DeleteIcon></DeleteIcon>
        </IconButton>
      );
    }
  }

  function handleView() {
    if (
      selectedOpeningMoves.length > 0 &&
      moveCount < selectedOpeningMoves.length
    ) {
      return (
        <IconButton
          size="small"
          disableRipple="true"
          onClick={() => {
            setIsShown((current) => !current);
          }}
        >
          {!isShown ? (
            <Tooltip TransitionComponent={Zoom} title="Show Hints" arrow>
              <VisibilityOutlinedIcon />
            </Tooltip>
          ) : (
            <VisibilityOffOutlinedIcon />
          )}
        </IconButton>
      );
    } else {
      return (
        <IconButton
          size="small"
          variant="outlined"
          disabled={true}
          disableFocusRipple={true}
        >
          <VisibilityOutlinedIcon />
        </IconButton>
      );
    }
  }

  // highlight next square in selected opening if user wants hints displayed
  useEffect(() => {
    if (isShown && moveCount < selectedOpeningMoves.length) {
      const tracker = new Chess();
      tracker.load_pgn(game.pgn());
      const move = tracker.move(selectedOpeningMoves[moveCount]);
      if (move) {
        if (
          (orientation === "white" && moveCount % 2 === 0) ||
          (orientation === "black" && moveCount % 2 !== 0)
        ) {
          const hints = {
            [move.from]: {
              backgroundColor: hintColor,
            },
            [move.to]: {
              backgroundColor: hintColor,
            },
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
        <Tooltip TransitionComponent={Zoom} title="Previous Openings" arrow>
          <IconButton onClick={handlePreviousOpenings} variant="outlined">
            <KeyboardDoubleArrowLeftOutlinedIcon></KeyboardDoubleArrowLeftOutlinedIcon>
          </IconButton>
        </Tooltip>
      );
    } else {
      return (
        <IconButton
          disabled={true}
          disableFocusRipple={true}
          variant="outlined"
        >
          <KeyboardDoubleArrowLeftOutlinedIcon></KeyboardDoubleArrowLeftOutlinedIcon>
        </IconButton>
      );
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={7.5}>
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "75vh",
            paddingLeft: 2,
            paddingRight: 2,
            paddingBottom: 2,
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
            <Typography
              variant={openingName && openingName.length > 39 ? "h5" : "h4"}
              sx={{ marginTop: 1, marginBottom: 1, height: "2rem" }}
            >
              {openingName ? openingName : "Choose an opening!"}
            </Typography>
            <Typography height={"2rem"}>{message}</Typography>
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
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Stack spacing={2}>
          <Paper sx={{ padding: 2 }}>
            <Stack spacing={1}>
              <Stack direction="row">
                <FormControl fullWidth size="small" margin="dense">
                  <InputLabel>Openings</InputLabel>
                  <Select
                    onChange={handleOpeningChange}
                    value=""
                    label="openings"
                  >
                    {openings.map((opening) => (
                      <MenuItem key={opening.id} value={opening.id}>
                        {opening.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {toggleOpenings()}
              </Stack>

              <Stack direction="row">
                <FormControl fullWidth size="small" margin="dense">
                  <InputLabel>Repertoire</InputLabel>
                  <Select
                    value={selectedValue}
                    onChange={handleCustomOpeningChange}
                    label="repertoire"
                  >
                    {customOpenings.map((opening) => (
                      <MenuItem key={opening.id} value={opening.id}>
                        {opening.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {displayDeleteOpening()}
              </Stack>

              {handleView()}

              <Box display="flex" justifyContent="center">
                <ButtonGroup
                  variant="contained"
                  size="large"
                  aria-label="small button group"
                >
                  <Tooltip TransitionComponent={Zoom} title="Start Over" arrow>
                    <Button onClick={handleReset}>
                      <FirstPageIcon></FirstPageIcon>
                    </Button>
                  </Tooltip>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="Previous Move"
                    arrow
                  >
                    <Button onClick={handleUndo}>
                      <ArrowBackIosNewIcon></ArrowBackIosNewIcon>
                    </Button>
                  </Tooltip>
                  <Tooltip TransitionComponent={Zoom} title="Flip Board" arrow>
                    <Button onClick={handleFlip}>
                      <RepeatIcon></RepeatIcon>
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </Box>
            </Stack>
          </Paper>

          <Paper sx={{ height: "210px", padding: 2 }}>
            <Typography textAlign={"center"}>Moves</Typography>
            <PGN pgn={game.pgn()} />
          </Paper>
        </Stack>
      </Grid>
    </Grid>
    // </Grid>
  );
};

export default StudyBoard;
