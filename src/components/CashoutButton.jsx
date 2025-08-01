import React, { useEffect, useState } from "react";
import socket from "../socket";

function CashoutButton({ roundStarted, hasBet, hasCashedOut, setHasCashedOut, playerId }) {
  const [cashoutResult, setCashoutResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleSuccess = (data) => {
      if (data.playerId === playerId) {
        console.log("✅ Cashout success:", data);
        setCashoutResult(data);
        setError("");
      }
    };

    const handleFailed = (data) => {
      if (data.playerId === playerId) {
        console.error("❌ Cashout failed:", data.message);
        setHasCashedOut(false);
        setError(data.message || "Cashout failed.");
      }
    };

    socket.on("player:cashout:success", handleSuccess);
    socket.on("player:cashout:failed", handleFailed);

    return () => {
      socket.off("player:cashout:success", handleSuccess);
      socket.off("player:cashout:failed", handleFailed);
    };
  }, [playerId, setHasCashedOut]);

  const handleCashout = () => {
    if ( hasCashedOut) return;

    socket.emit("player:cashout", { playerId });
    setHasCashedOut(true);
    console.log("🔼 player:cashout", { playerId });
  };

  const disabled = hasCashedOut;

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <button
        onClick={handleCashout}
        disabled={disabled}
        style={{
          backgroundColor: disabled ? "#aaa" : "#ff4747",
          color: "white",
          padding: "12px 24px",
          fontSize: "18px",
          fontWeight: "bold",
          borderRadius: "10px",
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        💸 Cash Out
      </button>

      {cashoutResult && (
        <div style={{ marginTop: "15px", color: "green", fontSize: "16px", fontWeight: "500" }}>
          ✅ Cashed out at <strong>x{cashoutResult.multiplier}</strong> — You got{" "}
          <strong>{cashoutResult.payout}</strong> crypto (~$
          {cashoutResult.usdValue.toFixed(2)})
        </div>
      )}

      {error && <div style={{ marginTop: "10px", color: "red" }}>{error}</div>}
    </div>
  );
}

export default CashoutButton;
