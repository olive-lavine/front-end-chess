import Chessboard from "chessboardjsx";
import { useState } from "react";
import axios from "axios";
import { Chess } from "chess.js";
import PlayBoard from "./components/PlayBoard";
import StudyBoard from "./components/StudyBoard";

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
  return (
    <main>
      <h1>Chess Opening Explorer</h1>
      <section>
        <StudyBoard />
      </section>
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
