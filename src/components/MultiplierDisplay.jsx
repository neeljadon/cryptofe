import React, { useEffect, useState } from "react";
import socket from "../socket";

function MultiplierDisplay() {
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashed, setCrashed] = useState(false);

  useEffect(() => {
    socket.on("round:multiplier", ({ multiplier }) => {
      setMultiplier(multiplier);
    });

    socket.on("round:crash", ({ crashPoint }) => {
      setMultiplier(crashPoint);
      setCrashed(true);
      setTimeout(() => {
        setMultiplier(1.0);
        setCrashed(false);
      }, 5000);
    });

    return () => {
      socket.off("round:multiplier");
      socket.off("round:crash");
    };
  }, []);

  return (
    <div
      style={{
        fontSize: "2rem",
        fontWeight: "bold",
        color: crashed ? "red" : "green",
        textAlign: "center",
        margin: "20px 0",
      }}
    >
      {multiplier}x
    </div>
  );
}

export default MultiplierDisplay;
