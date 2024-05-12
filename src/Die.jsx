import React from "react";

const Die = ({ die, handleHoldDice }) => {
  return (
    <h2
      onClick={handleHoldDice}
      id="die--num"
      className={die.isHeld ? "die--held" : "die"}
    >
      {die.value}
    </h2>
  );
};

export default Die;
