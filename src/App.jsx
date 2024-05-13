import React, { useEffect, useState } from "react";
import "./App.css";
import Die from "./Die.jsx";
import shortid from "shortid";
import "animate.css";

const App = () => {
  const [tenzie, setTenzie] = useState(false);
  const [roll, setRoll] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [lowestRolls, setLowestRolls] = useState(
    localStorage.getItem("lowestRolls") || Infinity
  );
  const [bestTime, setBestTime] = useState(
    localStorage.getItem("bestTime") || Infinity
  );

  const generateNewDie = () => {
    const num = Math.ceil(Math.random() * 6);
    return {
      value: num,
      isHeld: false,
      id: shortid(),
    };
  };
  const allNewDice = () => {
    let newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  };

  const [dice, setDice] = useState(allNewDice);

  // Start the timer and count the number of rolls when the component mounts
  useEffect(() => {
    setStartTime(new Date());
    setRoll(0);
  }, []);

  useEffect(() => {
    const firstDie = dice[0].value;
    const allHeld = dice.every((die) => die.isHeld && die.value === firstDie);

    if (allHeld) {
      setTenzie(true);
    }
  }, [dice]);

  // Calculate total time when the game is won
  useEffect(() => {
    if (tenzie && startTime) {
      const endTime = new Date();
      const timeDifference = endTime - startTime;
      const secondsElapsed = Math.floor(timeDifference / 1000); // Convert milliseconds to seconds
      setTotalTime(secondsElapsed);

      // Update best time
      if (secondsElapsed < bestTime) {
        setBestTime(secondsElapsed);
        localStorage.setItem("bestTime", secondsElapsed);
      }

      if (roll < lowestRolls) {
        setLowestRolls(roll);
        localStorage.setItem("lowestRolls", roll);
      }
    }
  }, [tenzie, startTime, bestTime, lowestRolls]);

  const rollDice = () => {
    // eslint-disable-next-line
    tenzie
      ? (setDice(allNewDice), setTenzie(false), setRoll(0))
      : (setDice((oldDice) =>
          oldDice.map((die) => (die.isHeld ? die : generateNewDie()))
        ),
        setRoll((roll) => (roll += 1)));
  };

  const holdDice = (id) => {
    console.log(id);
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  };

  const diceElements = dice.map((die, i) => (
    <Die key={i} die={die} handleHoldDice={() => holdDice(die.id)} />
  ));

  // Function to format time as minutes and seconds
  function formatTime(seconds) {
    if (seconds < 60) {
      return `${seconds} seconds`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} min ${remainingSeconds} seconds`;
    }
  }

  return (
    <main>
      <div className="container">
        <div>
          <h1 className="title ">Tenzie</h1>
          {tenzie ? (
            <h1 className="animate__animated animate__rubberBand animate__repeat-2 animate__slow blue">
              Play again!
            </h1>
          ) : (
            <p>
              Roll until all dice are the same. Click each die to freeze it at
              its current value between rolls.
            </p>
          )}
        </div>
        <h4>
          Roll: {roll}
          <span>
            {tenzie && <p>Total time spent playing: {formatTime(totalTime)}</p>}
          </span>
        </h4>
        <div className="dice-container">{diceElements}</div>
        <button onClick={rollDice} className={tenzie ? "win" : null}>
          {tenzie ? "New game" : "Roll"}
        </button>
        <p>Lowest number of rolls to win: {lowestRolls}</p>
        <p>Best time to win: {bestTime} seconds</p>
      </div>
    </main>
  );
};

export default App;
