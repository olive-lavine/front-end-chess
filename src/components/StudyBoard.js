import Chessboard from "chessboardjsx";
import { useState } from "react";
import { Chess } from "chess.js";

const exampleLine = [
  "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. cxd5 exd5 5. Bg5 Be7 6. e3 O-O 7. Bd3 Nbd7 8. Nf3 Re8",
];
const opening = ["d4", "d5", "c4", "e6", "Nc3", "Nf6", "cxd5", "exd5"];
let moveCount = 0;

const StudyBoard = () => {
  const chess = new Chess();
  const [game, setGame] = useState(chess);
  const [orientation, setOrientation] = useState("white");
  const [message, setMessage] = useState("");
  const [colorTheme, setColorTheme] = useState({
    light: { backgroundColor: "rgb(217, 227, 242)" },
    dark: { backgroundColor: "rgb(141, 171, 215)" },
    drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
  });

  function onDrop({ sourceSquare, targetSquare }) {
    setMessage("");
    const gameCopy = { ...game };
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare });
    if (moveCount < opening.length - 1) {
      if (!move) {
        return;
      }
      if (move.san !== opening[moveCount]) {
        gameCopy.undo();
        setMessage("Try again... ");
      }
      if (move.san === opening[moveCount]) {
        moveCount += 1;
        setGame(gameCopy);
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
    const gameCopy = { ...game };
    gameCopy.reset();
    setGame(gameCopy);
  }

  function handleUndo() {
    const gameCopy = { ...game };
    gameCopy.undo();
    setGame(gameCopy);
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
      <section>{game.pgn()}</section>
    </main>
  );
};

export default StudyBoard;
