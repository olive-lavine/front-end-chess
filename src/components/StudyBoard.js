import Chessboard from "chessboardjsx";
import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import useSound from "use-sound";
import axios from "axios";

const kBaseUrl = "http://localhost:8080/openings/parent";

const StudyBoard = () => {
  const chess = new Chess();
  const [game, setGame] = useState(chess);
  const [orientation, setOrientation] = useState("white");
  const [message, setMessage] = useState("");
  const [moveCount, setMoveCount] = useState(0);
  const [openings, setOpenings] = useState([]);
  const [openingPgn, setOpeningPgn] = useState("");
  const [openingName, setOpeningName] = useState("");
  const [isShown, setIsShown] = useState(false);
  const [hasChild, setHasChild] = useState(false);
  const [selectedOpeningMoves, setSelectedOpeningMoves] = useState([]);
  const [idHistory, setIdHistory] = useState([]);
  const [openingHistory, setOpeningHistory] = useState({});
  const [colorTheme, setColorTheme] = useState({
    light: { backgroundColor: "rgb(217, 227, 242)" },
    dark: { backgroundColor: "rgb(141, 171, 215)" },
    drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
  });
  const [sound, setSound] = useState("");
  const moveSound = new Audio(sound);

  const getOpeningsAsync = () => {
    return axios
      .get(kBaseUrl)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        throw new Error("error getting starting openings");
      });
  };
  const getNextOpeningsAsync = (parentId) => {
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

  const getStartingOpenings = () => {
    getOpeningsAsync()
      .then((openings) => {
        setOpenings(openings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getNextOpenings = (parentId) => {
    getNextOpeningsAsync(parentId)
      .then((openings) => {
        setOpenings(openings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getStartingOpenings();
  }, []);

  const cpu_moves = () => {
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
    // setTimeout(() => {
    //   moveSound.play();
    // }, 400);
    // moveSound.play();
  };

  // Handles CPU making the correct opening moves
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

  function onDrop({ sourceSquare, targetSquare }) {
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
        moveSound.play();
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
      setGame(gameCopy);
    }
    // } else {
    //   setMessage("xxOut of book, but follow your curiosity...");
    //   setGame(gameCopy);
    //   // if (move) {
    //   //   moveSound.play();
    //   // }
    // }
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
    getStartingOpenings();
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
    getNextOpenings(openingId);
  };

  function handleView() {
    if (selectedOpeningMoves.length > 0) {
      return (
        <section>
          <h2>{openingName}</h2>
          <button
            onClick={() => {
              setIsShown((current) => !current);
            }}
          >
            {!isShown && <section>view line</section>}
            {isShown && <section>hide line</section>}
          </button>
          {isShown && <section>{openingPgn}</section>}
        </section>
      );
    }
  }

  function toggleOpenings() {
    if (selectedOpeningMoves.length > 0) {
      const previousId = idHistory[idHistory.length - 2];
      const currentId = idHistory[idHistory.length - 1];
      return (
        <section>
          <button
            onClick={() => {
              if (previousId) {
                getNextOpenings(previousId);
                setOpeningPgn(openingHistory[previousId].pgn);
                setOpeningName(openingHistory[previousId].name);
                setSelectedOpeningMoves(openingHistory[previousId].moves);
                setHasChild(openingHistory[previousId].hasChild);
              } else {
                // call handle reset instead?
                getStartingOpenings();
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
            previous openings ⇐
          </button>
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
    <main>
      <section>{handleView()}</section>
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
      <button onClick={handleReset}>START OVER</button>
      <button onClick={handleUndo}>⇐</button>
      <button onClick={handleFlip}>FLIP</button>
      <label>
        BOARD COLORS
        <select onChange={handleThemeChange}>
          <option value="blue">Blue</option>
          <option value="rose">Rose</option>
          <option value="mint">Mint</option>
          <option value="neon">Neon</option>
        </select>
      </label>
      <label>
        OPENINGS
        <select onChange={handleOpeningChange}>
          <option value="">--select an opening--</option>
          {openings.map((opening) => (
            <option key={opening.id} value={opening.id}>
              {opening.name}
            </option>
          ))}
        </select>
      </label>
      <section>{toggleOpenings()}</section>
      <section>{game.pgn()}</section>
    </main>
  );
};

export default StudyBoard;
