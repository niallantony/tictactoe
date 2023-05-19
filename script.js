const cell = (position,index) => {
  let content = "";
  let cellDOM;
  const changeContents = (token) => {
    game.gameboard.cells[index].content = token;
    game.gameboard.changeAlleyContent();
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
      if (content != '' && !game.ongoing) {return}
      changeContents(game.currentPlayer.token);
      cellDOM.innerText = game.currentPlayer.token;
      game.logRound(`${game.currentPlayer.name} placed a ${game.currentPlayer.token} in cell ${position}`);    
  }

  return { position, content, cellDOM, index, changeContents, drawCell, cellClick };
};

const board = (() => {
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
    let status = '';
    let belongsTo = '';
    let contents = [a.content, b.content, c.content];
    
    return {win, status , contents, belongsTo, a,b,c};
  }

  const changeAlleyContent = () => {
    alleys.forEach((alley) => {alley.contents = [alley.a.content, alley.b.content, alley.c.content]});
  }

  const checkForSpace = () => {
    let space = false;
    cells.forEach((cell) => {
      if (cell.content === '') {
        space = true;
      }
    });
    return space;
  }

  const resetAlleys = () => {
    alleys.forEach((alley) => {
      alley.belongsTo = '';
      alley.win = false;
    })
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
      alley.status = 'empty'
      return
    };
    if (alley.contents.includes('')) {
      const taken = alley.contents.filter(cell => cell != '');
      if (taken[0] === taken[1]) {
        alley.status = 'ripeToWin';
        if (alley.belongsTo === '') {alley.belongsTo = game.currentPlayer.token};
        console.log(`${alley.a.position} ${alley.b.position} ${alley.c.position} is ripe for the plucking! It belongs to ${alley.belongsTo}.`)
        return
      }
    };
    if (alley.contents.every(function(value, _, contents) {
      return contents[0] === value;
    })) {;
      alley.status = 'won';
      alley.win = true;
      return
    } else {
      alley.status = 'full';
      return
    }
  }
  return { cells, alleys, checkAlleys, changeAlleyContent, checkForSpace, resetAlleys };
});

const Player = (token,name) => {
  return {token,name};
};

// const minimaxComp = () => {

//   const possibleMoves = [];

//   const createGhostBoard = () => {
//     const thisBoard =
//         return {thisBoard};
//   }

//   const currentSetUp = createGhostBoard(gameboard);

//   const getPossibleMoves = (board) =>
//     board.cells.forEach((cell) => {

//     })
  
// }

const Computer = (() => {

  const computerTurn = () => {
    let toClick;
    toClick = game.gameboard.alleys.find(alley => alley.status === 'ripeToWin' && alley.belongsTo === game.currentPlayer.token);
    if (toClick != undefined) {
      clickEmpty(toClick);
      console.log('The game is mine');
      return;
    }
    toClick = game.gameboard.alleys.find(alley => alley.status === 'ripeToWin' && alley.belongsTo != game.currentPlayer.token);
    if (toClick != undefined) {
      clickEmpty(toClick);
      console.log('Defensive Maneuvers');
      return;
    }
    toClick = game.gameboard.cells[4].content === '' ? game.gameboard.cells[4] : undefined ;
    if (toClick != undefined) {
      toClick.cellClick();
      console.log('The central square is mine. You stand no chance')
      return;
    }
    while (toClick === undefined) {
      let stab = Math.floor(Math.random() * 8);
      if (game.gameboard.cells[stab].content === '') {
        game.gameboard.cells[stab].cellClick();
        console.log(`${game.gameboard.cells[stab].position} will suit me just fine`);
        return;
      } else if (game.gameboard.checkForSpace() === false) {
        break
      }
    }
    return;    
  }

  const clickEmpty = (alley) => {
    if (alley.a.content === '') {alley.a.cellClick()}
    if (alley.b.content === '') {alley.b.cellClick()}
    if (alley.c.content === '') {alley.c.cellClick()}
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
  let ongoing = false;
  let turnCounter = 0
  const gameboard = board();

  
  const initialise = () => {
    gameboard.cells.forEach((cell) => cell.drawCell());
    game.playerRound = true;
    game.ongoing = true;
    console.log('Game Started');
    game.currentPlayer = game.playerRound ? playerOne : playerTwo;
  }

  const gameOver = () => {
    console.log('The game has ended.')
    if (game.win) { 
      console.log(`${currentPlayer.name} is the victor`)
    } else {
      console.log('The battle ended in stalemate')
    }
    game.ongoing = false;
    displayController.screenContainer.innerHTML = '';
    gameboard.cells.forEach((cell)=> {cell.changeContents('')});
    gameboard.resetAlleys();
    turnLog.length = 0;
    turnCounter = 0;
    game.win = false;
  }
  
  const turnLog = [];
  
  const logRound = (roundText) => {
    console.log(roundText);
    turnLog.push(roundText)
    turnCounter++;
    checkForWin();
    nextPlayer();
    if (gameboard.checkForSpace() ) {
      if (game.currentPlayer === playerTwo && game.ongoing) {
        Computer.computerTurn();
        turnCounter++;
      } else {return};
    } else {
      game.gameOver();
      game.ongoing = false;
    }
  }
  const getTurn = () => turnCounter;

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
        game.win = true;
        game.gameOver();
      }
    })
  }
  
  return {playerRound, currentPlayer, ongoing, gameboard, initialise, logRound, checkForWin, gameOver, getTurn}
})();

const initialiseButton = document.querySelector('button');
initialiseButton.addEventListener("click",game.initialise,false);
