const GameBoard = (function () {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => gameboard;

  const resetBoard = () => {
    gameboard = ["", "", "", "", "", "", "", "", ""];
  };

  const setMark = (index, mark) => {
    if (gameboard[index] === "") {
      gameboard[index] = mark;
      return true;
    }
  };

  const checkWin = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let pattern of winningCombinations) {
      const [a, b, c] = pattern;
      if (gameboard[a] && gameboard[a] === gameboard[b] && gameboard[a] === gameboard[c]) {
        DisplayController.highlightWinner(winningCombinations, gameboard);
        return gameboard[a];
      }
    }

    if (gameboard.every((cell) => cell !== "")) {
      return "Tie!";
    }

    return null;
  };

  return { getBoard, resetBoard, setMark, checkWin };
})();

function Player(name, mark) {
  return { name, mark };
}

const GameController = (function () {
  let players = [];
  let currentPlayerIndex = 0;
  let currentPlayer;
  let gameActive = true;

  const startGame = (playerOne, playerTwo) => {
    GameBoard.resetBoard();
    players = [Player(playerOne, "X"), Player(playerTwo, "O")];
    gameActive = true;
    currentPlayerIndex = 0;
    DisplayController.currentPlayerIndicator(players[0].name);
  };

  const playRound = (index) => {
    if (!gameActive) return;

    currentPlayer = players[currentPlayerIndex];
    if (GameBoard.setMark(index, currentPlayer.mark)) {
      DisplayController.renderBoard();
      const winner = GameBoard.checkWin();
      if (winner === "Tie!") {
        DisplayController.displayMessage(null, "Tie!");
        gameActive = false;
      } else if (winner) {
        DisplayController.displayMessage(currentPlayer.name, GameBoard.checkWin());
        gameActive = false;
      } else currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }
    currentPlayerIndex === 1 ? DisplayController.currentPlayerIndicator(players[1].name) : DisplayController.currentPlayerIndicator(players[0].name);
  };

  return { startGame, playRound };
})();

const DisplayController = (function () {
  const board = document.querySelector(".board");
  const cells = document.querySelectorAll(".cell");
  const startBtn = document.querySelector(".start");
  const dialogBox = document.querySelector(".playerNames");
  const showMessage = document.querySelector(".message");
  const messageDialog = document.querySelector(".gameMessageDialog");
  const playAgain = document.querySelector(".playAgain");
  const resetBtn = document.querySelector(".reset");
  const changeName = document.querySelector(".changeName");
  let currentPLayerStatus = document.querySelector(".currentPlayer");

  const renderBoard = () => {
    const board = GameBoard.getBoard();
    cells.forEach((cell, index) => (cell.textContent = board[index]));
  };

  const displayMessage = (name, message) => {
    messageDialog.showModal();
    if (message === "X" || message === "O") {
      showMessage.textContent = `${name} (${message}) is the winner!`;
    } else showMessage.textContent = `It's a Tie!`;
  };

  const currentPlayerIndicator = (currentPlayer) => (currentPLayerStatus.textContent = `Current Player: ${currentPlayer}`);

  const highlightWinner = (winningCombinations, gameboard) => {
    for (let pattern of winningCombinations) {
      const [a, b, c] = pattern;
      if (gameboard[a] && gameboard[a] === gameboard[b] && gameboard[a] === gameboard[c]) {
        cells[a].classList.add("highlightWinner");
        cells[b].classList.add("highlightWinner");
        cells[c].classList.add("highlightWinner");
      }
    }
  };

  cells.forEach((cell, index) =>
    cell.addEventListener("click", () => {
      GameController.playRound(index);
    })
  );

  const startGame = () => {
    document.querySelector(".board").classList.remove("hidden");
    GameBoard.resetBoard();
    renderBoard();

    let player1 = document.querySelector("#player1").value || "Player1";
    let player2 = document.querySelector("#player2").value || "Player2";
    GameController.startGame(player1, player2);
    cells.forEach((cell) => cell.classList.remove("highlightWinner"));
  };

  startBtn.addEventListener("click", (e) => {
    e.preventDefault();
    startGame();
    dialogBox.close();
  });

  playAgain.addEventListener("click", () => {
    startGame();
    messageDialog.close();
  });

  resetBtn.addEventListener("click", () => {
    startGame();
  });

  changeName.addEventListener("click", () => {
    dialogBox.showModal();
    startGame();
  });

  window.onload = () => dialogBox.showModal();

  // window.addEventListener("beforeunload", (event) => {
  //   event.preventDefault();
  //   const confirmed = confirm("Are you sure you want to reload?");
  //   if (!confirmed) {
  //     return;
  //   }
  //   window.location.reload();
  // });

  return { renderBoard, displayMessage, currentPlayerIndicator, highlightWinner };
})();
