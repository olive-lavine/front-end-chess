import Chessboard from "chessboardjsx";
import { useState } from "react";
import axios from "axios";
import { Chess } from "chess.js";

const defaultBoard = {
  a1: "wR",
  a2: "wP",
  a7: "bP",
  a8: "bR",
  b1: "wN",
  b2: "wP",
  b7: "bP",
  b8: "bN",
  c1: "wB",
  c2: "wP",
  c7: "bP",
  c8: "bB",
  d1: "wQ",
  d2: "wP",
  d7: "bP",
  d8: "bQ",
  e1: "wK",
  e2: "wP",
  e7: "bP",
  e8: "bK",
  f1: "wB",
  f2: "wP",
  f7: "bP",
  f8: "bB",
  g1: "wN",
  g2: "wP",
  g7: "bP",
  g8: "bN",
  h1: "wR",
  h2: "wP",
  h7: "bP",
  h8: "bR",
};

const exampleLine = [];

const kBaseUrl = "http://localhost:8080/moveValidation";

export default function App() {
  const pgn = [
    "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O",
    "d3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4",
    "Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6",
    "Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8",
    "23.Bd7+ Kf8 24.Bxe7# 1-0",
  ];
  const chess = new Chess();
  const [game, setGame] = useState(chess);
  const [orientation, setOrientation] = useState("white");
  const [colorTheme, setColorTheme] = useState({
    light: { backgroundColor: "rgb(235, 224, 224)" },
    dark: { backgroundColor: "rgb(148, 107, 107)" },
    drop: { boxShadow: "inset 0 0 1px 4px rgb(121, 160, 103)" },
  });
  // game.load_pgn(pgn.join("\n"));
  game.history(["e4", "e5", "f4", "exf4"]);

  function onDrop({ sourceSquare, targetSquare }) {
    // move["boardData"] = game;
    // postBoard(move);
    const gameCopy = { ...game };
    gameCopy.move({ from: sourceSquare, to: targetSquare });
    setGame(gameCopy);
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
    if (theme === "blue") {
      setColorTheme({
        light: { backgroundColor: "rgb(217, 227, 242)" },
        dark: { backgroundColor: "rgb(141, 171, 215)" },
        drop: { boxShadow: "inset 0 0 1px 4px rgb(218, 197, 165)" },
      });
    }
    if (theme === "random") {
      // getTheme();
    }
  }

  return (
    <main>
      <header>Chess Opening Explorer</header>
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
      <button onClick={handleReset}>START OVER</button>
      <button onClick={handleUndo}>⇐</button>
      <button onClick={handleFlip}>FLIP</button>
      <label>
        BOARD COLORS
        <select onChange={handleThemeChange}>
          <option value="rose">Rose</option>
          <option value="mint">Mint</option>
          <option value="blue">Blue</option>
          <option value="random">Random</option>
        </select>
      </label>
      <section>{game.pgn()}</section>
    </main>
  );
}

// const postBoardAsync = (moveData) => {
//   return axios
//     .post(kBaseUrl, moveData)
//     .then((response) => {
//       console.log(response.data);
//       return response.data;
//     })
//     .catch((err) => {
//       console.log(err);
//       throw new Error("error posting board");
//     });
// };

// const postBoard = (moveData) => {
//   postBoardAsync(moveData)
//     .then((newBoard) => {
//       console.log(newBoard);
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };

// const getItAsync = () => {
//   return axios
//     .get(kBaseUrl)
//     .then((response) => {
//       console.log(response.data);
//       return response.data;
//     })
//     .catch((err) => {
//       console.log(err);
//       throw new Error("error getting");
//     });
// };

// const getIt = () => {
//   getItAsync()
//     .then((updatedBoard) => {
//       setGame(updatedBoard);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

//
// const getThemeAsync = () => {
//   return axios
//     .get(kBaseUrl)
//     .then((response) => {
//       console.log(response.data);
//       return response.data;
//     })
//     .catch((err) => {
//       console.log(err);
//       throw new Error("error getting");
//     });
// };

// const getTheme = () => {
//   getThemeAsync()
//     .then((randomColors) => {
//       setGame(randomColors);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
