const cell = (position,index) => {
  let content = "";
  let cellDOM;
  const changeContents = (token) => {
    gameboard.cells[index].content = token;
    gameboard.changeAlleyContent();
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
    // if (!game.playerRound && content = !'') {return}
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
    let ripeToWin = false;
    let belongsTo = '';
    let contents = [a.content, b.content, c.content];
    
    return {win, ripeToWin , contents, belongsTo, a,b,c};
  }

  const changeAlleyContent = () => {
    alleys.forEach((alley) => {alley.contents = [alley.a.content, alley.b.content, alley.c.content]});
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

  //checks the alley contents to see if it is all empty, almost a win or a win.
  const checkAlleys = (alley) => {
    if (alley.contents.every((value) => {return value === ''? true : false})) {
      return
    };
    if (alley.contents.includes('')) {
      const taken = alley.contents.filter(cell => cell != '');
      if (taken[0] === taken[1]) {
        alley.ripeToWin = true;
        if (alley.belongsTo === '') {alley.belongsTo = game.currentPlayer.token};
        console.log(`${alley.a.position} ${alley.b.position} ${alley.c.position} is ripe for the plucking! It belongs to ${alley.belongsTo}.`)
      }
    };
    if (alley.contents.every(function(value, _, contents) {
      return contents[0] === value;
    })) {;
      alley.win = true;
    }
  }
  return { cells, alleys, checkAlleys, changeAlleyContent };
})();

const Player = (token,name) => {
  return {token,name};
};

const Computer = (() => {
  const tryForWin = () => {
    gameboard.alleys.forEach((alley) => {
      if (alley.ripeToWin === true && alley.belongsTo === game.currentPlayer.token) {
      clickEmpty(alley);
      console.log("I'm sorry Dave...");
      }
    })
  }
  const defensiveManeuvers = () => {
    gameboard.alleys.forEach((alley) => {
      if (alley.ripeToWin === true && alley.belongsTo != game.currentPlayer.token) {
      clickEmpty(alley);
      console.log('Beep... Disaster Averted');
      }})  
  }
  const takeTheMiddleGround = () => {
    if (gameboard.cells[4].content === '') {
      gameboard.cells[4].cellClick();
      console.log('The central square is mine. You stand no chance')
    }
  }
  const takeAStab = () => {
    let havingAGo = true;
    while (havingAGo) {
      let stab = Math.floor(Math.random() * 8);
      if (gameboard.cells[stab].content === '') {
        gameboard.cells[stab].cellClick();
        console.log(`${gameboard.cells[stab].position} will suit me just fine`);
        havingAGo = false;
      }
    }
  }
  const clickEmpty = (alley) => {
    if (alley.a.content === '') {alley.a.cellClick()}
    if (alley.b.content === '') {alley.b.cellClick()}
    if (alley.c.content === '') {alley.b.cellClick()}
  }
  const computerTurn = () => {
    if (game.playerRound) {return};
    tryForWin();
    if (game.playerRound) {return};
    console.log('No winning moves...');
    defensiveManeuvers();
    if (game.playerRound) {return};
    console.log("But I'm not in any danger...");
    takeTheMiddleGround();
    if (game.playerRound) {return};
    console.log("Well I'll just have to take one of these...")
    takeAStab();
  }
  return {computerTurn}
})();


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
    if (game.currentPlayer === playerTwo) {
      Computer.computerTurn();
    } else {return};
  }

  const nextPlayer = () => {
    game.playerRound = !game.playerRound;
    game.currentPlayer = game.playerRound ? playerOne : playerTwo;
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
