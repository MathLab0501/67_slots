import './App.css';
import sixImg from './6.png';
import sevenImg from './7.png';
import poissonImg from './Poisson.png';
import {spinReels} from './slotsLogic';
import {useState} from 'react';

function App() {
    const [amount, setAmount] = useState(0);
    const [selectedButton, setSelectedButton] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showBlur, setShowBlur] = useState(true);
    const [Reels, setReels] = useState([1, 1, 1, 1]);

    const handleBetClick = (newAmount) => {
        setAmount(newAmount);
        setSelectedButton(newAmount);
    };

    const handleGameStarted = () => {
        if (selectedButton === null) {
            setShowError(true);
        } else {
            setGameStarted(true);
            setShowBlur(false);
        }
    }

    const handleInstructions = () => {
        setShowBlur(true)
        setShowInstructions(true);
    }

    const handleBackToGame = () => {
        setShowBlur(false)
        setShowInstructions(false);
    }

    const handleReels = () => {
        const result = spinReels();
        setReels(result);
    }

    return (
        <div className="App">
            <div className={`background ${showBlur ? "blur" : ""}`}></div>
            {!gameStarted ? (
                    <div className="login-container">
                        <div className={"Title"}>
                            <img id={"casinoSix"} src={sixImg} alt="6"/>
                            <h1 id={"title"}>Slots</h1>
                            <img id="casinoSeven" src={sevenImg} alt="7"/>
                        </div>
                        <div id={"username-container"}>
                            <img id={"fish1"} src={poissonImg} alt={"Spinning Fish"}/>
                            <h2 className="username-text">Username:</h2>
                            <input id={"username_input"} type="text" placeholder="Username"/>
                            <img id={"fish2"} src={poissonImg} alt={"Spinning Fish"}/>
                        </div>
                        <button id="start" type="submit" onClick={() => handleGameStarted()}>Start</button>
                        <h2 id="welcome"> Select your amount!</h2>

                        {showError && (
                            <div className="error">
                                <p>Please select an amount to play</p>
                            </div>
                        )}
                    </div>
                )
                : (!showInstructions ? (
                            <div className="slots-container">
                                <button id={"instructions"} onClick={() => handleInstructions()}>Instructions</button>
                                <div id={"robot"}>
                                    <div id={"robot-head"}>
                                        <div id="robot-face">
                                            <div className='robot-eye'/>
                                            <div className='robot-eye'/>
                                        </div>
                                        <div id={"robot-mouth"}/>
                                    </div>

                                    <div id={"robot-body"}>
                                        <div id={"robot-l-arm"}>
                                            <div id={"robot-left-arm"}></div>
                                            <div id={"robot-left-hand"}></div>
                                        </div>
                                        <div id={"robot-torso"}>
                                            <div id={"robot-reels"}>
                                                <div className={"reel"}>{Reels[0]}</div>
                                                <div className={"reel"}>{Reels[1]}</div>
                                                <div className={"reel"}>{Reels[2]}</div>
                                                <div className={"reel"}>{Reels[3]}</div>
                                            </div>
                                        </div>
                                        <div id={"robot-r-arm"}>
                                            <div id={"robot-right-arm"}></div>
                                            <div id={"robot-right-hand"}></div>
                                        </div>
                                    </div>
                                </div>
                                <button id={"spin-button"} onClick={handleReels}>Spin</button>
                            </div>)
                        : (<div className="instructions-container">
                            <button id={"back-button"} onClick={() => handleBackToGame()}>←</button>
                            <h1>67 slots</h1>
                            <h2>How to play?</h2>
                            <p>Press the spin button!</p>
                            <h2>How do you win?</h2>
                            <p>By having multiple of the same number in a row starting from the front.</p>
                            <h2>How much do you win?</h2>
                            <p>There is a multiplier of .5 times the winning digit of the starting bet.</p>
                            <p>Having 2 identical numbers in a row will give you a 1x on the bet.</p>
                            <p>Having 3 identical numbers in a row will give you a 2x on the bet.</p>
                            <p>Having 4 identical numbers in a row will give you a 3x on the bet.</p>
                            <h2>Special Event:</h2>
                            <p>Reels containing a 6 followed by a 7 will grant 5x the bet.</p>
                            <p id="instructions-animation-text">It might also trigger an animation.</p>
                        </div>)
                )}
            {!showInstructions ? (
                <div className="amount-buttons">
                    <button className={`amount-button ${selectedButton === 10 ? "selected" : ""}`}
                            onClick={() => handleBetClick(10)}>10
                    </button>
                    <button className={`amount-button ${selectedButton === 25 ? "selected" : ""}`}
                            onClick={() => handleBetClick(25)}>25
                    </button>
                    <button className={`amount-button ${selectedButton === 50 ? "selected" : ""}`}
                            onClick={() => handleBetClick(50)}>50
                    </button>
                    <button className={`amount-button ${selectedButton === 100 ? "selected" : ""}`}
                            onClick={() => handleBetClick(100)}>100
                    </button>
                    <button className={`amount-button ${selectedButton === 200 ? "selected" : ""}`}
                            onClick={() => handleBetClick(200)}>200
                    </button>
                    <button className={`amount-button ${selectedButton === 500 ? "selected" : ""}`}
                            onClick={() => handleBetClick(500)}>500
                    </button>
                </div>) : null}
        </div>
    );
}

export default App;

