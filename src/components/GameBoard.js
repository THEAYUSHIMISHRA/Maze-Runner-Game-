import React, { useState, useEffect } from "react";
import "./GameBoard.css";

const GRID_SIZE = 10; // 10x10 Grid
const CELL_SIZE = 50; // Size of each cell in pixels

// Initialize walls (random placement for now)
const generateWalls = () => {
  const walls = new Set();
  while (walls.size < 15) { // Limit number of walls
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (!(x === 0 && y === 0) && !(x === GRID_SIZE - 1 && y === GRID_SIZE - 1)) {
      walls.add(`${x},${y}`);
    }
  }
  return walls;
  return balls;
};

// Minimax AI to place walls strategically
const minimaxWallPlacement = (playerPos, exitPos, walls) => {
  let bestWall = null;
  let bestScore = -Infinity;

  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!walls.has(`${x},${y}`) && !(x === playerPos.x && y === playerPos.y) && !(x === exitPos.x && y === exitPos.y)) {
        const tempWalls = new Set(walls);
        tempWalls.add(`${x},${y}`);
        
        let score = evaluatePosition(playerPos, exitPos, tempWalls);
        
        if (score > bestScore) {
          bestScore = score;
          bestWall = { x, y };
        }
      }
    }
  }

  return bestWall;
};

// Evaluation function: Higher score = better block for AI
const evaluatePosition = (playerPos, exitPos, walls) => {
  return Math.abs(playerPos.x - exitPos.x) + Math.abs(playerPos.y - exitPos.y) + walls.size;
};

const GameBoard = () => {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 }); // Player starts at (0,0)
  const [walls, setWalls] = useState(generateWalls());
  const exitPos = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 }; // Exit at bottom-right corner

  // Handle player movement
  const handleKeyPress = (event) => {
    setPlayerPos((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      if (event.key === "ArrowUp" && prev.y > 0 && !walls.has(`${prev.x},${prev.y - 1}`)) newY--;
      if (event.key === "ArrowDown" && prev.y < GRID_SIZE - 1 && !walls.has(`${prev.x},${prev.y + 1}`)) newY++;
      if (event.key === "ArrowLeft" && prev.x > 0 && !walls.has(`${prev.x - 1},${prev.y}`)) newX--;
      if (event.key === "ArrowRight" && prev.x < GRID_SIZE - 1 && !walls.has(`${prev.x + 1},${prev.y}`)) newX++;

      return { x: newX, y: newY };
    });
  };

  // AI places a wall every 3 moves
  useEffect(() => {
    if ((playerPos.x + playerPos.y) % 3 === 0) {
      const aiWall = minimaxWallPlacement(playerPos, exitPos, walls);
      if (aiWall) {
        setWalls((prevWalls) => new Set([...prevWalls, `${aiWall.x},${aiWall.y}`]));
      }
    }
  }, [playerPos]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="game-container">
      <div className="grid">
        {[...Array(GRID_SIZE)].map((_, row) => (
          <div key={row} className="row">
            {[...Array(GRID_SIZE)].map((_, col) => {
              let cellClass = "cell";
              if (playerPos.x === col && playerPos.y === row) cellClass += " player";
              if (exitPos.x === col && exitPos.y === row) cellClass += " exit";
              if (walls.has(`${col},${row}`)) cellClass += " wall";
              return <div key={col} className={cellClass}></div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
