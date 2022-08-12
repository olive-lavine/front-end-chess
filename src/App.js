import { useState, useEffect } from "react";
import PlayBoard from "./components/PlayBoard";
import StudyBoard from "./components/StudyBoard";
import About from "./components/About";
import Container from "@mui/material/Container";
import "./App.css";

export default function App() {
  const [selectedPage, setSelectedPage] = useState("");
  const getSelectedPage = () => {
    if (selectedPage === "PlayBoard") {
      return <PlayBoard></PlayBoard>;
    } else if (selectedPage === "StudyBoard") {
      return <StudyBoard></StudyBoard>;
    } else if (selectedPage === "About") {
      return <About></About>;
    }
  };

  return (
    <main>
      <section class="nav justify-content-end">
        <h1>Opening Knights</h1>
        <button
          onClick={() => {
            setSelectedPage("PlayBoard");
          }}
        >
          play
        </button>
        <button
          onClick={() => {
            setSelectedPage("StudyBoard");
          }}
        >
          practice
        </button>{" "}
        <button
          onClick={() => {
            setSelectedPage("About");
          }}
        >
          about
        </button>
      </section>

      <section>{getSelectedPage()}</section>
    </main>
  );
}
