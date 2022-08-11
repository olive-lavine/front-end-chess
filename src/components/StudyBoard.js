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
  const [openingView, setOpeningView] = useState("");
  const [openingName, setOpeningName] = useState("");
  const [isShown, setIsShown] = useState(false);
  const [hasChild, setHasChild] = useState(false);
  const [selectedOpening, setSelectedOpening] = useState("");
  const [openingHistory, setOpeningHistory] = useState([]);
  const [colorTheme, setColorTheme] = useState({
    light: { backgroundColor: "rgb(217, 227, 242)" },
    dark: { backgroundColor: "rgb(141, 171, 215)" },
    drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
  });

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
      gameCopy.move(selectedOpening[moveCount]);
      setGame(gameCopy);
      setMoveCount(moveCount + 1);
    }, 200);

    if (moveCount === selectedOpening.length && hasChild) {
      setMessage("Choose continuation");
    }
  };

  // Handles CPU making the correct opening moves
  if (
    orientation === "white" &&
    game.turn() === "b" &&
    moveCount < selectedOpening.length
  ) {
    cpu_moves();
  } else if (
    orientation === "black" &&
    game.turn() === "w" &&
    moveCount < selectedOpening.length
  ) {
    cpu_moves();
    // if (moveCount === selectedOpening.length && hasChild) {
    //   setMessage("Choose continuation");
    // }
  }

  function onDrop({ sourceSquare, targetSquare }) {
    if (!selectedOpening) {
      setMessage("select an opening!");
      return;
    }
    setMessage("");
    const gameCopy = { ...game };
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare });
    if (moveCount < selectedOpening.length) {
      if (!move) {
        return;
      }
      if (move.san !== selectedOpening[moveCount]) {
        gameCopy.undo();
        setMessage("Try again... ");
      }
      if (move.san === selectedOpening[moveCount]) {
        setGame(gameCopy);
        setMoveCount(moveCount + 1);
        if (moveCount === selectedOpening.length - 1 && hasChild) {
          setMessage("Choose continuation");
        }
      }
      if (game.in_check()) {
        setMessage("check");
      }
    } else {
      setMessage("Out of book, but follow your curiosity...");
      setGame(gameCopy);
    }
  }

  function handleReset() {
    setMessage("");
    const gameCopy = { ...game };
    gameCopy.reset();
    setGame(gameCopy);
    setMoveCount(0);
    getStartingOpenings();
    setSelectedOpening("");
  }

  function handleUndo() {
    setMessage("");
    const gameCopy = { ...game };
    gameCopy.undo();
    gameCopy.undo();
    if (moveCount > 0) {
      setMoveCount(moveCount - 2);
    }
    setGame(gameCopy);
  }

  function handleFlip() {
    orientation === "white" ? setOrientation("black") : setOrientation("white");
  }

  const handleOpeningChange = (event) => {
    setMessage("");
    let openingId = parseInt(event.target.value);
    const updatedHistory = [...openingHistory, openingId];
    setOpeningHistory(updatedHistory);

    // find selected opening
    let opening = "";
    for (let i = 0; i < openings.length; i++) {
      if (openings[i].id === openingId) {
        opening = openings[i];
        setOpeningView(opening.pgn);
        setHasChild(opening.hasChild);
        setOpeningName(opening.name);
      }
    }
    let openingMoves = [];
    opening = opening.pgn.split(" ");
    for (let i = 0; i < opening.length; i++) {
      if (i % 3 !== 0) {
        openingMoves.push(opening[i]);
      }
    }
    setSelectedOpening(openingMoves);
    getNextOpenings(openingId);
  };

  function handleView() {
    if (selectedOpening) {
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
          {isShown && <section>{openingView}</section>}
        </section>
      );
    }
  }

  function toggleOpenings() {
    if (selectedOpening) {
      console.log(openingHistory);

      const previous = openingHistory[openingHistory.length - 1];
      return (
        <section>
          <button
            onClick={() => {
              getNextOpenings(previous);
              const historyCopy = [...openingHistory];
              setOpeningHistory(historyCopy);
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
    }
    if (theme === "rose") {
      setColorTheme({
        light: { backgroundColor: "rgb(235, 224, 224)" },
        dark: { backgroundColor: "rgb(148, 107, 107)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(121, 160, 103)" },
      });
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
