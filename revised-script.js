const board = () => {
  let layout = ["", "", "", "", "", "", "", "", ""];
  let depth = 0;

  return { layout, depth };
};

const Player = (token, name, type) => {
  return { token, name, type };
};

const game = (() => {
  let playerOne = Player("X", "user", 'player');
  let playerTwo = Player("O", "computer", 'minimax');
  const gameboard = board();
  let currentPlayer = playerOne;

  const seePlayers = () => {
    console.log(playerOne, playerTwo);
  }

  const findEmptyCells = (layout) => {
    const emptyCells = layout.map((cell) => {
      return cell === "" ? true : false;
    });
    return emptyCells;
  };

  const easyComp = () => {
    let playing = true;
    while (playing) {
        const tryThis = Math.floor(Math.random() * 9);
        if (gameboard.layout[tryThis] === '') {
            layTile(gameboard.layout,currentPlayer.token,tryThis);
            playing = !playing;
        }
        if (isSpace(gameboard.layout) === false) {
            break
        }
    }
    screenContainer.refreshScreen();
    if (checkWin(gameboard.layout)) {
      gameOver("Computer Wins!");
    }
    if (!isSpace(gameboard.layout)) {
      gameOver("Nobody Wins!");
    }
}

  const newPlayer = (player) => {
    let thisPlayer = player
    const submitButton = document.getElementById("newPlayerSubmit");
    const playerForm = document.getElementById("newPlayer");
    let newName = "";
    let newToken = "";
    let newType = "";
    playerForm.showModal();
    const nameBox = document.getElementById("nameInput");
    const tokenBox = document.getElementById("tokenInput");
    const typeBox = document.getElementById("player-select");
    if (thisPlayer === 'playerOneButton') {typeBox.disabled = true}
    nameBox.addEventListener("change", () => {
      newName = nameBox.value;
    });
    tokenBox.addEventListener("change", () => {
      newToken = tokenBox.value;
    });
    typeBox.addEventListener("change", () => {
      newType = typeBox.value;
    });
    submitButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (thisPlayer === 'playerOneButton') {playerOne = Player(newToken,newName,'Player')};
        if (thisPlayer === 'playerTwoButton') {playerTwo = Player(newToken,newName,newType)};
        screenContainer.drawBoard();
        playerForm.close();
        thisPlayer = '';
        nameBox.value = '';
        tokenBox.value = '';
        typeBox.value = '';
    });
  };

  const isSpace = (layout) => {
    return layout.some((cell) => {
      return cell === "";
    });
  };

  const userLay = (cell) => {
    if (gameboard.layout[cell] != "") {
      return;
    }
    layTile(gameboard.layout, currentPlayer.token, cell);
    screenContainer.refreshScreen();
    const nextPlayer = currentPlayer === playerOne ? playerTwo : playerOne ;
    currentPlayer = nextPlayer;
    if (checkWin(gameboard.layout)) {
      console.log(`${playerOne.name} wins!`);
      gameOver(`${playerOne.name} wins!`);
      return;
    }
    if (isSpace(gameboard.layout)) {
        if (currentPlayer.type === 'minimax') {
            initialiseMinimax();
            currentPlayer = playerOne;
        } else if (currentPlayer.type === 'easy') {
            easyComp();
            currentPlayer = playerOne;
        } else if (currentPLayer.type === 'medium') {
            mediumComp();
            currentPlayer = playerOne;
        }
    } else if (!isSpace(gameboard.layout)) {
      gameOver("Nobody Wins!");
    }
  };

  const layTile = (layout, tile, cell) => {
    layout[cell] = tile;
  };

  const newGame = () => {
    gameboard.layout = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = playerOne;
  };

  const gameOver = (displayText) => {
    screenContainer.gameOverModal.showModal();
    const resultText = document.getElementById("results");
    resultText.textContent = displayText;
  };

  const getContents = (cell) => {
    return gameboard.layout[cell];
  };

  const checkWin = (layout) => {
    let alleys = [];
    let win = false;
    alleys[0] = Array(layout[0], layout[1], layout[2]);
    alleys[1] = Array(layout[3], layout[4], layout[5]);
    alleys[2] = Array(layout[6], layout[7], layout[8]);
    alleys[3] = Array(layout[0], layout[3], layout[6]);
    alleys[4] = Array(layout[1], layout[4], layout[7]);
    alleys[5] = Array(layout[2], layout[5], layout[8]);
    alleys[6] = Array(layout[0], layout[4], layout[8]);
    alleys[7] = Array(layout[2], layout[4], layout[6]);
    alleys.forEach((alley) => {
      if (
        alley.some((cell) => {
          return cell === "";
        })
      ) {
        return;
      } else if (alley[0] === alley[1] && alley[1] === alley[2]) {
        win = true;
      } else {
        return;
      }
    });
    return win;
  };

  const initialiseMinimax = () => {
    let moveToTake;
    const turnScores = minimax(playerTwo, playerOne, gameboard);
    const resultsMapped = turnScores.filter((result) => result !== false);
    const highestScore = resultsMapped.reduce((prev, current) => {
      return prev > current ? prev : current;
    });
    const bestMoves = turnScores.filter((turn) => turn === highestScore);
    if (bestMoves.length === 1) {
      moveToTake = turnScores.indexOf(highestScore);
    }
    if (bestMoves.length > 1) {
      const randomTurn = Math.floor(Math.random() * bestMoves.length);
      for (let i = 0; i < randomTurn; i++) {
        const moveToChange = turnScores.indexOf(highestScore);
        turnScores[moveToChange] = false;
      }
      moveToTake = turnScores.indexOf(highestScore);
    }
    layTile(gameboard.layout, playerTwo.token, moveToTake);
    screenContainer.refreshScreen();
    if (checkWin(gameboard.layout)) {
      gameOver("Computer Wins!");
    }
    if (!isSpace(gameboard.layout)) {
      gameOver("Nobody Wins!");
    }
  };

  const playMinimax = (cell, playerTwo, playerOne, layoutIn) => {
    const boardToCheck = board();
    boardToCheck.layout = layoutIn.layout.slice();
    layTile(boardToCheck.layout, playerTwo.token, cell);
    // logRound(boardToCheck);
    boardToCheck.depth = layoutIn.depth + 1;
    if (checkWin(boardToCheck.layout)) {
      if (playerTwo.type === 'minimax') {
        // console.log('Computer Win');
        return 100 - boardToCheck.depth;
      } else if (playerOne.type === 'minimax') {
        // console.log('Computer Lose');
        return boardToCheck.depth - 100;
      }
    }
    if (isSpace(boardToCheck.layout) === false) {
      // console.log('Stalemate');
      return 0;
    }
    const results = minimax(playerOne, playerTwo, boardToCheck);
    const resultsMapped = results.filter((result) => result !== false);
    const score = resultsMapped.reduce((prev, current) => {
      if (!playerTwo.type === 'minimax') {
        // console.log('Finding maximum score...')
        return prev > current ? prev : current;
      } else {
        // console.log('Finding minimum score...')
        return prev < current ? prev : current;
      }
    });

    return score;
  };

  const minimax = (playerTwo, playerOne, boardIn) => {
    const availableMoves = findEmptyCells(boardIn.layout);
    const moveCount = availableMoves.filter((cell) => {
      return cell === true;
    });
    if (moveCount.length === 0) {
      return availableMoves;
    }
    for (let i = 0; i < availableMoves.length; i++) {
      if (availableMoves[i]) {
        availableMoves[i] = playMinimax(i, playerTwo, playerOne, boardIn);
      }
    }
    // console.log(availableMoves);
    return availableMoves;
  };

  console.log(gameboard);
  return {
    initialiseMinimax,
    userLay,
    getContents,
    newGame,
    newPlayer,
    seePlayers,
  };
})();

const screenContainer = (() => {
  const screenContainer = document.querySelector(".container");
  const gameOverModal = document.getElementById("gameOver");
  const changePlayerOne = document.getElementById("playerOneButton");
  const changePlayerTwo = document.getElementById("playerTwoButton");
  changePlayerOne.addEventListener("click", (event) => {game.newPlayer(event.target.id)},false);
  changePlayerTwo.addEventListener("click", (event) => {game.newPlayer(event.target.id)},false);
  const cellElements = [];
  const cellOrder = [
    "top-left",
    "top-center",
    "top-right",
    "middle-left",
    "middle-center",
    "middle-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ];

  const refreshScreen = () => {
    for (let i = 0; i < cellElements.length; i++) {
      cellElements[i].textContent = game.getContents(i);
    }
  };

  const userClick = (cell) => {
    const index = cellOrder.indexOf(cell);
    game.userLay(index);
  };

  const drawBoard = () => {
    screenContainer.innerHTML = "";
    cellElements.length = 0;
    game.newGame();
    drawCell("top-left");
    drawCell("top-center");
    drawCell("top-right");
    drawCell("middle-left");
    drawCell("middle-center");
    drawCell("middle-right");
    drawCell("bottom-left");
    drawCell("bottom-center");
    drawCell("bottom-right");
    gameOverModal.close();
  };

  const drawCell = (position) => {
    const cellElement = document.createElement("button");
    cellElement.setAttribute("style", `grid-area:${position}`);
    cellElement.classList.add("cell");
    cellElement.setAttribute("id", position);
    screenContainer.appendChild(cellElement);
    cellElement.addEventListener("click", (event) => {
      userClick(event.target.id);
    });
    cellElements.push(cellElement);
  };
  const newGameButton = document.getElementById("newGameButton");
  newGameButton.addEventListener("click", drawBoard);
  const initialiseButton = document.getElementById("initialise");
  initialiseButton.addEventListener("click", drawBoard, false);

  return { drawBoard, refreshScreen, gameOverModal };
})();
