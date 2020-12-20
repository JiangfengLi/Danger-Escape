import React from "react";
import PlayerScreen from "./components/playerscreen";

export default function App() {
  return (
    <div className="zone-container center">
      <PlayerScreen skin="m1" className="d-flex h-600 align-items-center justify-content-center"/>
    </div>
  );
}
