import './App.css';
//import {setAmount} from './slotsLogic';
import { useState } from 'react';

function App() {
  const [amount, setAmount] = useState(0);
  const [selectedButton, setSelectedButton] = useState(null);
  const [wallet, setWallet] = useState(1000); // Hard coded 1000 for now, change to user wallet later
  const [gameStarted, setGameStarted] = useState(false);
  const [showError, setShowError] = useState(false);
  console.log(amount);

  const handleBetClick = (newAmount) => {
    setAmount(newAmount);
    setSelectedButton(newAmount);
  };
  const handleAllIn = () => {
    setAmount(wallet);
    setSelectedButton('all-in');  // Special marker for all-in
  };

  const handleGameStarted = () => {
    if (selectedButton === null) {
      setShowError(true);
    } else {
      setGameStarted(true);
      }
  }

  return (
      <div className="App">
        {!gameStarted ? (
        <div className="login-container">
          <input type="text" placeholder="Username" />
          <h2 id="welcome"> Select your amount!</h2>
          <div className="amount-buttons">
            <button className={`amount-button ${selectedButton === 10 ? "selected" : ""}`} onClick={() => handleBetClick(10)}>10</button>
            <button className={`amount-button ${selectedButton === 25 ? "selected" : ""}`} onClick={() => handleBetClick(25)}>25</button>
            <button className={`amount-button ${selectedButton === 50 ? "selected" : ""}`} onClick={() => handleBetClick(50)}>50</button>
            <button className={`amount-button ${selectedButton === 100 ? "selected" : ""}`} onClick={() => handleBetClick(100)}>100</button>
            <button className={`amount-button ${selectedButton === 200 ? "selected" : ""}`} onClick={() => handleBetClick(200)}>200</button>
            <button className={`amount-button ${selectedButton === 500 ? "selected" : ""}`} onClick={() => handleBetClick(500)}>500</button>
            <button className={`amount-button ${selectedButton === "all-in" ? "selected" : ""}`} onClick={() => handleAllIn()}>ALL-IN</button>
          </div>
          <h3>Current Bet: ${amount}</h3>

          {showError && (
              <div className="error">
                <p>Please select an amount to play</p>
              </div>
          )}
          <button id="start" type="submit" onClick={() => handleGameStarted()}>Start</button>
        </div>
        )
      :
            (
        <div className="slots-container">
          <div className="amount-buttons">
            <button className={`amount-button ${selectedButton === 10 ? "selected" : ""}`} onClick={() => handleBetClick(10)}>10</button>
            <button className={`amount-button ${selectedButton === 25 ? "selected" : ""}`} onClick={() => handleBetClick(25)}>25</button>
            <button className={`amount-button ${selectedButton === 50 ? "selected" : ""}`} onClick={() => handleBetClick(50)}>50</button>
            <button className={`amount-button ${selectedButton === 100 ? "selected" : ""}`} onClick={() => handleBetClick(100)}>100</button>
            <button className={`amount-button ${selectedButton === 200 ? "selected" : ""}`} onClick={() => handleBetClick(200)}>200</button>
            <button className={`amount-button ${selectedButton === 500 ? "selected" : ""}`} onClick={() => handleBetClick(500)}>500</button>
            <button className={`amount-button ${selectedButton === "all-in" ? "selected" : ""}`} onClick={() => handleAllIn()}>ALL-IN</button>
          </div>
        </div>
          )}
      </div>
  );
  }

export default App;

