const cell = (position,index) => {
  let content = "";
  let cellDOM;
  const changeContents = (token) => {
    gameboard.cells[index].content = token;
  };
  const drawCell = () => {
    const cellElement = document.createElement("div");
    cellElement.setAttribute("style", `grid-area:${position}`);
    cellElement.classList.add("cell");
    cellElement.setAttribute("id",position);
    displayController.screenContainer.appendChild(cellElement);
    cellDOM = cellElement;
    console.log(`Drawn: ${position}`);
    cellElement.addEventListener('click', cellClick, false);
  };

  const cellClick = () => {
    if (!game.playerRound) {return}
      changeContents(game.currentPlayer.token);
      cellDOM.innerText = game.currentPlayer.token;
      game.logRound(`${game.currentPlayer.name} placed a ${game.currentPlayer.token} in cell ${position}`);    
  }

  return { position, content, cellDOM, index, changeContents, drawCell, cellClick };
};

const gameboard = (() => {
  const cells = [
    cell("top-left",0),
    cell("top-center",1),
    cell("top-right",2),
    cell("middle-left",3),
    cell("middle-center",4),
    cell("middle-right",5),
    cell("bottom-left",6),
    cell("bottom-center",7),
    cell("bottom-right",8),
  ];

  const alley = (a,b,c) => {
    let win = false;
    return {win, a, b, c};
  }

  const alleys = [
    alley(cells[0],cells[1],cells[2]),
    alley(cells[3],cells[4],cells[5]),
    alley(cells[6],cells[7],cells[8]),
    alley(cells[0],cells[3],cells[6]),
    alley(cells[1],cells[4],cells[7]),
    alley(cells[2],cells[5],cells[8]),
    alley(cells[0],cells[4],cells[8]),
    alley(cells[2],cells[4],cells[6]),
  ]

  const checkAlleys = (alley) => {
    alley.win = alley.a.content === alley.b.content && alley.b.content === alley.c.content && alley.a.content !== '';
  }

  return { cells, alleys, checkAlleys };
})();

const Player = (token,name) => {
  return {token,name};
};



const displayController = (() => {
  const screenContainer = document.querySelector(".container");
  return { screenContainer };
})();


const game = (() => {
  let win = false;
  const playerOne = Player('X','Player One');
  const playerTwo = Player('O','Player Two');
  let playerRound;
  let currentPlayer = playerOne;

  
  const initialise = () => {
    gameboard.cells.forEach((cell) => cell.drawCell());
    game.playerRound = true;
    console.log('Game Started', game.playerRound);
    game.currentPlayer = game.playerRound ? playerOne : playerTwo;
  }
  
  const turnLog = [];
  
  const logRound = (roundText) => {
    console.log(roundText);
    turnLog.push(roundText)
    checkForWin();
    nextPlayer();
    console.log(currentPlayer.name, game.playerRound);
  }

  const nextPlayer = () => {
    game.playerRound = !game.playerRound;
    game.currentPlayer = game.playerRound ? playerTwo : playerOne;
  };
  
  const checkForWin = () => {
    gameboard.alleys.forEach((alley) => {
      gameboard.checkAlleys(alley);
      if (alley.win) {
        console.log("That's a Bingo!");
        console.table(turnLog);
      }
    })
  }
  
  return {win, playerRound, currentPlayer, turnLog, initialise, logRound, checkForWin, nextPlayer}
})();

const initialiseButton = document.querySelector('button');
initialiseButton.addEventListener("click",game.initialise,false);
