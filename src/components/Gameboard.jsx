// components/GameBoard.jsx
import React from "react";

function GameBoard({ multiplier, crashPoint, roundStarted }) {
  return (
    <div>
      <h2>Multiplier: {multiplier}x</h2>
      {crashPoint ? (
        <h3>💥 Crashed at {crashPoint}x</h3>
      ) : roundStarted ? (
        <p>Game is running...</p>
      ) : (
        <p>Waiting for next round...</p>
      )}
    </div>
  );
}

export default GameBoard;
