// src/utils/player.js
export function getOrCreatePlayerId() {
  let playerId = localStorage.getItem("playerId");

  if (!playerId) {
    playerId = "player_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("playerId", playerId);
  }

  return playerId;
}
