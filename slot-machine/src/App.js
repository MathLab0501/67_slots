import './App.css';
import sixImg from './6.png';
import sevenImg from './7.png';
import poissonImg from './Poisson.png';
import {spinReels, spinResult} from './slotsLogic';
import {useState} from 'react';
import {fetchWallet, performTransaction} from './api.js';

function App() {
    const [amount, setAmount] = useState(0);
    const [win, setWin] = useState(0);
    const [mult, setMult] = useState(0);
    const [animation, setAnimation] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showBlur, setShowBlur] = useState(true);
    const [Reels, setReels] = useState([1, 1, 1, 1]);
    const [userId, setUserId] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [wallet, setWallet] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [testMode, setTestMode] = useState(false);

    //animation states
    const [isLeftPumping, setIsLeftPumping] = useState(false);
    const [isRightPumping, setIsRightPumping] = useState(false);
    const [show67Text, setShow67Text] = useState(false);

    const handleBetClick = (newAmount) => {
        setAmount(newAmount);
        setSelectedButton(newAmount);
    };

    const handleGameStarted = async () => {
        if (selectedButton === null) {
            setShowError(true);
            setErrorMessage('Please select an amount to play');
            return;
        }

        if (!isLoggedIn) {
            await handleLogin();
            return;
        }

        setGameStarted(true);
        setShowBlur(false);
    };

    const handleInstructions = () => {
        setShowBlur(true)
        setShowInstructions(true);
    }

    const handleBackToGame = () => {
        setShowBlur(false)
        setShowInstructions(false);
    }

    const handleReels = async () => {
        if (isSpinning) return;

        if (isLoggedIn && amount > wallet) {
            setErrorMessage('Insufficient funds!');
            setShowError(true);
            return;
        }

        setIsSpinning(true);
        setShowError(false);

        try {
            const result = spinReels();
            setReels(result);
            const {payout, multiplier, animation} = spinResult(amount, result);
            setWin(payout);
            setMult(multiplier);
            setAnimation(animation);

            if (animation === 'six-seven') {
                await trigger67Animation();
            }

            if (isLoggedIn) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const didWin = payout > 0;
                if (didWin) {
                    await performTransaction(true, userId, payout);
                } else {
                    await performTransaction(false, userId, amount);
                }
                const newBalance = await fetchWallet(userId);
                setWallet(newBalance);
            }
        } catch (error) {
            setErrorMessage('Transaction failed: ' + error.message);
            setShowError(true);
            console.error('Spin error:', error);
        } finally {
            setIsSpinning(false);
        }
    };

    const trigger67Animation = async () => {
        setIsLeftPumping(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsRightPumping(true);
        await new Promise(resolve => setTimeout(resolve, 6000));
        setShow67Text(true);
        await new Promise(resolve => setTimeout(resolve, 2500));
        setIsLeftPumping(false);
        setIsRightPumping(false);
        setShow67Text(false);
    };

    const handleLogin = async () => {
        const usernameInput = document.getElementById('username_input').value;

        if (usernameInput.trim() === '') {
            setErrorMessage('Please enter a username');
            setShowError(true);
            return;
        }

        setIsSpinning(true);
        setShowError(false);

        try {
            const walletBalance = await fetchWallet(usernameInput);
            setWallet(walletBalance);
            setUserId(usernameInput);
            setIsLoggedIn(true);
            setShowError(false);

        } catch (error) {
            setErrorMessage(error.message || 'Failed to fetch wallet. Check user ID.');
            setShowError(true);
            setIsLoggedIn(false);
            console.error('Login error:', error);
        } finally {
            setIsSpinning(false);
        }
    };

    const handleTestLogin = () => {
        setUserId('TEST_USER');
        setWallet(10000);
        setIsLoggedIn(true);
        setGameStarted(true);
        setShowBlur(false);
    };

    return (
        <div className="App">
            {testMode && (
                <div className="test-mode-banner">
                    🧪 TEST MODE - No API calls
                    <button onClick={() => setTestMode(false)} className="switch-mode-btn">
                        Switch to Real Mode
                    </button>
                </div>
            )}
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
                        <button id="test-login" onClick={handleTestLogin}>Test
                        </button>
                        <h2 id="welcome"> Select your amount!</h2>

                        {showError && (
                            <div className="error">
                                <p>{errorMessage || 'Please select an amount to play'}</p>
                            </div>
                        )}
                    </div>
                )
                : (!showInstructions ? (
                            <div className="slots-container">
                                <button id={"instructions"} onClick={() => handleInstructions()}>Instructions</button>
                                {isLoggedIn && (
                                    <div className="wallet-display">
                                        <p>Wallet: {wallet}</p>
                                        <p>Bet: {amount}</p>
                                    </div>
                                )}
                                <div id={"robot"}>
                                    <div id={"robot-head"}>
                                        <div id="robot-face">
                                            <div className='robot-eye'/>
                                            <div className='robot-eye'/>
                                        </div>
                                        <div id={"robot-mouth"}
                                             className={show67Text ? 'mouth-open' : ''}>                                        {show67Text && (
                                            <div id="jackpot-67">67</div>
                                        )}</div>
                                    </div>

                                    <div id={"robot-body"}>
                                        <div id={"robot-l-arm"}
                                             className={`${isLeftPumping ? 'pumping' : ''}`}
                                        >
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
                                        <div id={"robot-r-arm"}
                                             className={`${isRightPumping ? 'pumping' : ''}`}>
                                            <div id={"robot-right-arm"}></div>
                                            <div id={"robot-right-hand"}></div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    id={"spin-button"}
                                    onClick={handleReels}
                                    disabled={isSpinning}
                                >
                                    {isSpinning ? 'SPINNING...' : 'Spin'}
                                </button>
                                <p id={"winShow"}>You won: {win}!</p>
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
                            <p>Having a palindrome result gives 5x the initial bet.</p>
                            <h2>Special Event:</h2>
                            <p>Reels containing a 6 followed by a 7 will grant 6.7x the bet.</p>
                            <p>The result 6-7-6-7 will grant a 10x multiplier on the bet.</p>
                            <p id="instructions-animation-text">It might also trigger an animation.</p>
                        </div>)
                )}
            {!showInstructions ? (
                <div className="amount-buttons">
                    <button className={`amount-button ${selectedButton === 5 ? "selected" : ""}`}
                            onClick={() => handleBetClick(5)}>5
                    </button>
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
                </div>) : null}
        </div>
    );
}

export default App;

