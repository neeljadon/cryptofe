import { io } from "socket.io-client";

const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://cryptobe.onrender.com/"
    : "http://localhost:5000";

const socket = io(BACKEND_URL);

export default socket;
