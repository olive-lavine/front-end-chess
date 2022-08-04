import Chessboard from "chessboardjsx";
import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import axios from "axios";

const kBaseUrl = "http://localhost:8080/opening";

const StudyBoard = () => {
  const chess = new Chess();
  const [game, setGame] = useState(chess);
  const [orientation, setOrientation] = useState("white");
  const [message, setMessage] = useState("");
  const [moveCount, setMoveCount] = useState(0);
  const [openings, setOpenings] = useState([]);
  const [selectedOpening, setSelectedOpening] = useState("");
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
        throw new Error("error getting all boards");
      });
  };

  const getOpenings = () => {
    getOpeningsAsync()
      .then((openings) => {
        // console.log(openings);
        setOpenings(openings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getOpenings();
  }, []);

  // Handles CPU making the correct opening moves
  if (
    orientation === "white" &&
    game.turn() === "b" &&
    moveCount < selectedOpening.length
  ) {
    const gameCopy = { ...game };
    setTimeout(() => {
      gameCopy.move(selectedOpening[moveCount]);
      setGame(gameCopy);
      setMoveCount(moveCount + 1);
    }, 200);
  } else if (
    orientation === "black" &&
    game.turn() === "w" &&
    moveCount < selectedOpening.length
  ) {
    const gameCopy = { ...game };
    setTimeout(() => {
      gameCopy.move(selectedOpening[moveCount]);
      setGame(gameCopy);
      setMoveCount(moveCount + 1);
    }, 200);
  }

  function onDrop({ sourceSquare, targetSquare }) {
    setMessage("");
    const gameCopy = { ...game };
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare });
    if (moveCount < selectedOpening.length - 1) {
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
      }
      if (game.in_check()) {
        setMessage("check");
      }
    } else if (!selectedOpening) {
      setMessage("select an opening!");
      return;
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
  }

  function handleUndo() {
    setMessage("");
    const gameCopy = { ...game };
    gameCopy.undo();
    gameCopy.undo();
    setMoveCount(moveCount - 2);
    setGame(gameCopy);
  }

  function handleFlip() {
    orientation === "white" ? setOrientation("black") : setOrientation("white");
  }

  const handleOpeningChange = (event) => {
    const opening = event.target.value;
    setSelectedOpening(opening.split(" "));
    handleReset();
  };

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
    if (theme === "random") {
      // getTheme();
    }
  }

  return (
    <main>
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
          <option value="random">Random</option>
        </select>
      </label>
      <label>
        OPENINGS
        <select onChange={handleOpeningChange}>
          <option value="">--select an opening--</option>
          {openings.map((opening) => (
            <option key={opening.id} value={opening.sequence}>
              {opening.name}
            </option>
          ))}
        </select>
      </label>
      <section>{game.pgn()}</section>
    </main>
  );
};

export default StudyBoard;
