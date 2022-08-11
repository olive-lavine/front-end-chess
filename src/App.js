import Chessboard from "chessboardjsx";
import { useState } from "react";
import axios from "axios";
import { Chess } from "chess.js";
import PlayBoard from "./components/PlayBoard";
import StudyBoard from "./components/StudyBoard";
import "./App.css";

const kBaseUrl = "http://localhost:8080/moveValidation";

export default function App() {
  const [selectedBoard, setSelectedBoard] = useState("");

  const getSelectedBoard = () => {
    if (selectedBoard === "PlayBoard") {
      return <PlayBoard></PlayBoard>;
    } else if (selectedBoard === "StudyBoard") {
      return <StudyBoard></StudyBoard>;
    }
  };

  return (
    <main>
      <h1>Chess Opening Explorer</h1>
      <button
        onClick={() => {
          setSelectedBoard("PlayBoard");
        }}
      >
        play
      </button>
      <button
        onClick={() => {
          setSelectedBoard("StudyBoard");
        }}
      >
        practice
      </button>
      <section>{getSelectedBoard()}</section>
      <section id="footer">
        thanks to chess.js and chessboardjsx for the chess board!
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
