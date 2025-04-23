import React from "react";
import GameBoard from "./component/GameBoard";
import "./styles/GameBoard.css";
const App = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center", color: "#fff" }}>Strategic Maze Runner</h1>
      <GameBoard />
    </div>
  );
};

export default App;
