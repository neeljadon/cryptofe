import React, { useState, useEffect } from "react";
import socket from "../socket";

function BetForm({ roundStarted, hasBet, setHasBet, playerId }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleAck = ({ success, error }) => {
      if (success) {
        setHasBet(true);
        setError("");
      } else {
        setError(error || "Bet failed.");
      }
    };

    socket.on("player:bet:ack", handleAck);

    return () => {
      socket.off("player:bet:ack", handleAck);
    };
  }, [setHasBet]);

  const placeBet = () => {
    if (!amount || hasBet || !roundStarted) return;

    const bet = {
      playerId,
      currency: "BTC",
      cryptoAmount: parseFloat(amount),
      price: 60000,
      usdValue: parseFloat(amount) * 60000,
    };

    socket.emit("player:bet", bet);
    console.log("🔼 player:bet", bet);
    setAmount("");
  };

  return (
    <div>
      <h3>💰 Place Your Bet</h3>
      <input
        type="number"
        value={amount}
        placeholder="Enter BTC"
        onChange={(e) => setAmount(e.target.value)}
        disabled={hasBet || !roundStarted}
      />
      <button onClick={placeBet} disabled={!amount || hasBet || !roundStarted}>
        Place Bet
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default BetForm;
