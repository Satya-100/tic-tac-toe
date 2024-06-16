// script.js
document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const player1NameInput = document.getElementById("player1Name");
    const player2NameInput = document.getElementById("player2Name");
    const boardSizeSelect = document.getElementById("boardSize");
    const gameModeSelect = document.getElementById("gameMode");
    const player1ScoreDisplay = document.getElementById("player1Score");
    const player2ScoreDisplay = document.getElementById("player2Score");
    const resetScoresButton = document.getElementById("resetScores");
    const resetGameButton = document.getElementById("resetGame");
    const turnIndicator = document.getElementById("turnIndicator");

    const modal = document.getElementById("modal");
    const confirmResetButton = document.getElementById("confirmReset");
    const cancelResetButton = document.getElementById("cancelReset");

    let player1Name = localStorage.getItem("player1Name") || "Player 1";
    let player2Name = localStorage.getItem("player2Name") || "Player 2";
    let player1Score = parseInt(localStorage.getItem("player1Score")) || 0;
    let player2Score = parseInt(localStorage.getItem("player2Score")) || 0;
    let currentPlayer = "X";
    let boardSize = parseInt(boardSizeSelect.value);
    let gameBoard = Array(boardSize * boardSize).fill("");
    let gameMode = gameModeSelect.value;

    player1NameInput.value = player1Name;
    player2NameInput.value = player2Name;
    player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
    player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
    turnIndicator.textContent = `Current Turn: ${currentPlayer === "X" ? player1Name : player2Name} (${currentPlayer})`;

    player1NameInput.addEventListener("input", () => {
        player1Name = player1NameInput.value;
        localStorage.setItem("player1Name", player1Name);
        updateLeaderboard();
        updateTurnIndicator();
    });

    player2NameInput.addEventListener("input", () => {
        player2Name = player2NameInput.value;
        localStorage.setItem("player2Name", player2Name);
        updateLeaderboard();
        updateTurnIndicator();
    });

    boardSizeSelect.addEventListener("change", () => {
        boardSize = parseInt(boardSizeSelect.value);
        resetGame();
    });

    gameModeSelect.addEventListener("change", () => {
        gameMode = gameModeSelect.value;
        player2NameInput.disabled = gameMode === "solo";
        resetGame();
    });

    resetScoresButton.addEventListener("click", () => {
        player1Score = 0;
        player2Score = 0;
        localStorage.setItem("player1Score", player1Score);
        localStorage.setItem("player2Score", player2Score);
        updateLeaderboard();
    });

    resetGameButton.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    confirmResetButton.addEventListener("click", () => {
        modal.style.display = "none";
        resetGame();
    });

    cancelResetButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    function handleCellClick(event) {
        const index = event.target.dataset.index;
        if (gameBoard[index] === "" && currentPlayer === "X") {
            makeMove(index);
            if (gameMode === "solo" && !checkWin() && !isBoardFull()) {
                setTimeout(computerMove, 500);
            }
        }
    }

    function makeMove(index) {
        gameBoard[index] = currentPlayer;
        document.querySelector(`.cell[data-index='${index}']`).textContent = currentPlayer;
        if (checkWin()) {
            if (currentPlayer === "X") {
                player1Score++;
                localStorage.setItem("player1Score", player1Score);
            } else {
                player2Score++;
                localStorage.setItem("player2Score", player2Score);
            }
            updateLeaderboard();
            displayResult(`${currentPlayer === "X" ? player1Name : player2Name} wins!`);
            setTimeout(resetGame, 5000);
        } else if (isBoardFull()) {
            displayResult("It's a draw!");
            setTimeout(resetGame, 5000);
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updateTurnIndicator();
        }
    }

    function checkWin() {
        const winPatterns = [];

        for (let i = 0; i < boardSize; i++) {
            winPatterns.push([...Array(boardSize).keys()].map(x => x + i * boardSize));
        }

        for (let i = 0; i < boardSize; i++) {
            winPatterns.push([...Array(boardSize).keys()].map(x => x * boardSize + i));
        }

        winPatterns.push([...Array(boardSize).keys()].map(x => x * (boardSize + 1)));
        winPatterns.push([...Array(boardSize).keys()].map(x => (x + 1) * (boardSize - 1)));

        return winPatterns.some(pattern => pattern.every(index => gameBoard[index] === currentPlayer));
    }

    function isBoardFull() {
        return gameBoard.every(cell => cell !== "");
    }

    function computerMove() {
        let availableMoves = gameBoard.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
        let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        makeMove(randomMove);
    }

    function resetGame() {
        gameBoard = Array(boardSize * boardSize).fill("");
        currentPlayer = "X";
        createBoard();
        updateTurnIndicator();
    }

    function updateLeaderboard() {
        player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
        player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
        if (player1Score > player2Score) {
            player1ScoreDisplay.style.fontWeight = "bold";
            player2ScoreDisplay.style.fontWeight = "normal";
        } else if (player2Score > player1Score) {
            player1ScoreDisplay.style.fontWeight = "normal";
            player2ScoreDisplay.style.fontWeight = "bold";
        } else {
            player1ScoreDisplay.style.fontWeight = "normal";
            player2ScoreDisplay.style.fontWeight = "normal";
        }
    }

    function createBoard() {
        document.querySelectorAll(".cell").forEach(cell => {
            cell.removeEventListener("click", handleCellClick);
        });
        board.innerHTML = "";
        board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        gameBoard.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.index = index;
            cellElement.textContent = cell;
            cellElement.addEventListener("click", handleCellClick);
            board.appendChild(cellElement);
        });
    }

    function displayResult(message) {
        alert(message);
    }

    function updateTurnIndicator() {
        turnIndicator.textContent = `Current Turn: ${currentPlayer === "X" ? player1Name : player2Name} (${currentPlayer})`;
    }

    createBoard();
    updateLeaderboard();
    updateTurnIndicator();
});
