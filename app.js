const GameBoard = (function () {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => gameboard;

  const resetBoard = () => {
    gameboard = ["", "", "", "", "", "", "", "", ""];
  };

  const setMark = (index, mark) => {
    if (gameboard[index] === "") gameboard[index] = mark;
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

const GameController = (function () {})();

const DisplayController = (function () {})();
