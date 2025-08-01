import React, { useEffect, useState } from "react";
import socket from "./socket";
import GameBoard from "./components/Gameboard";
import BetForm from "./components/Betform";
import CashoutButton from "./components/CashoutButton";
import MultiplierDisplay from "./components/MultiplierDisplay";

function App() {
  const [multiplier, setMultiplier] = useState(1);
  const [crashPoint, setCrashPoint] = useState(null);
  const [roundStarted, setRoundStarted] = useState(false);
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    let existingId = localStorage.getItem("playerId");
    if (!existingId) {
      existingId = "player_" + Math.random().toString(36).substring(2, 10);
      localStorage.setItem("playerId", existingId);
    }
    setPlayerId(existingId);
  }, []);

  useEffect(() => {
    if (!playerId) return;

    socket.emit("player:join", { playerId });

    const handleStart = () => {
      setCrashPoint(null);
      setRoundStarted(true);
      setHasCashedOut(false);
      setHasBet(false);
    };

    const handleMultiplier = ({ multiplier }) => {
      setMultiplier(multiplier);
    };

    const handleCrash = ({ crashPoint }) => {
      setCrashPoint(crashPoint);
      setRoundStarted(false);
      setHasBet(false);
      setHasCashedOut(false);
    };

    const handleCashout = ({ playerId: pid, payout, multiplier }) => {
      if (pid === playerId) {
        alert(`✅ Cashed out at ${multiplier}x — ${payout} BTC`);
        setHasCashedOut(true);
      }
    };

    socket.on("round:start", handleStart);
    socket.on("round:multiplier", handleMultiplier);
    socket.on("round:crash", handleCrash);
    socket.on("player:cashout", handleCashout);

    return () => {
      socket.off("round:start", handleStart);
      socket.off("round:multiplier", handleMultiplier);
      socket.off("round:crash", handleCrash);
      socket.off("player:cashout", handleCashout);
    };
  }, [playerId]);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>💥 Crypto Crash Game</h1>

      <MultiplierDisplay />

      <GameBoard
        multiplier={multiplier}
        crashPoint={crashPoint}
        roundStarted={roundStarted}
      />

      <BetForm
        roundStarted={roundStarted}
        hasBet={hasBet}
        setHasBet={setHasBet}
        playerId={playerId}
      />

      <CashoutButton
        roundStarted={roundStarted}
        hasBet={hasBet}
        hasCashedOut={hasCashedOut}
        setHasCashedOut={setHasCashedOut}
        playerId={playerId}
      />
    </div>
  );
}

export default App;
