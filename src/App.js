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

const exampleBoard = {
  a1: "wR",
  a2: "wP",
  a7: "bP",
  a8: "bR",
  b1: "wN",
  b2: "wP",
};

const kBaseUrl = "http://localhost:8080/moveValidation";

export default function App() {
  const chess = new Chess();
  const [game, setGame] = useState(chess);
  const [orientation, setOrientation] = useState("white");

  function onDrop({ sourceSquare, targetSquare }) {
    // move["boardData"] = game;
    // postBoard(move);
    const gameCopy = { ...game };
    gameCopy.move({ from: sourceSquare, to: targetSquare });
    setGame(gameCopy);
  }

  const postBoardAsync = (moveData) => {
    return axios
      .post(kBaseUrl, moveData)
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        throw new Error("error posting board");
      });
  };

  const postBoard = (moveData) => {
    postBoardAsync(moveData)
      .then((newBoard) => {
        console.log(newBoard);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

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

  return (
    <main>
      <header>Chess Opening Explorer</header>
      <section>
        <Chessboard
          position={game.fen()}
          onDrop={onDrop}
          orientation={orientation}
        />
      </section>
      <button onClick={handleReset}>START OVER</button>
      <button onClick={handleUndo}>⇐</button>
      <button onClick={handleFlip}>FLIP</button>
      <section>{game.pgn()}</section>
    </main>
  );
}

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
