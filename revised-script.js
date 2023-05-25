const board = () => {
    let layout = ['','','','','','','','',''];
    let depth = 0;

    return {layout, depth}
}

const Player = (token,name,isComp) => {
    return {token,name,isComp};
}

const game = (() => {
    const playerOne = Player('X','user',false);
    const playerTwo = Player('O','computer',true);
    const gameboard = board();
    let currentPlayer = playerOne;

    const findEmptyCells = (layout) => {
        const emptyCells = layout.map((cell) => {return cell === '' ? true : false;});
        return emptyCells
    }

    const isSpace = (layout) => {
        return layout.some((cell) => {return cell === ''});
    }

    const userLay = (cell) => {
        if (gameboard.layout[cell] != '' || currentPlayer != playerOne) {return};
        layTile(gameboard.layout,playerOne.token,cell);
        screenContainer.refreshScreen();
        currentPlayer = playerTwo;
        if (checkWin(gameboard.layout)) {
            console.log(`${playerOne.name} wins!`)
            gameOver(`${playerOne.name} wins!`);
        }
        if (isSpace(gameboard.layout)) {
            initialiseMinimax();
            currentPlayer = playerOne;
        } else if (!isSpace(gameboard.layout)) {
            gameOver('Nobody Wins!');
        }
    }

    const layTile = (layout,tile,cell) => {
        layout[cell] = tile;
    }

    const newGame = () => {
        gameboard.layout = ['','','','','','','','',''];
        currentPlayer = playerOne;
    }

    const gameOver = (displayText) => {
        screenContainer.gameOverModal.showModal();
        const resultText = document.getElementById('results');
        resultText.textContent = displayText;
    }

    const getContents = (cell) => {
        return gameboard.layout[cell]
    }

    const checkWin = (layout) => {
        let alleys = []
        let win = false;
        alleys[0] = Array (layout[0],layout[1],layout[2])
        alleys[1] = Array (layout[3],layout[4],layout[5])
        alleys[2] = Array (layout[6],layout[7],layout[8])
        alleys[3] = Array (layout[0],layout[3],layout[6])
        alleys[4] = Array (layout[1],layout[4],layout[7])
        alleys[5] = Array (layout[2],layout[5],layout[8])
        alleys[6] = Array (layout[0],layout[4],layout[8])
        alleys[7] = Array (layout[2],layout[4],layout[6])
        alleys.forEach((alley) => {
            if (alley.some((cell) => {return cell === ''})) {
                return
            } else if (alley[0] === alley[1] && alley[1] === alley[2]) {
                win = true
            } else {return};
        })
        return win;
    }

    const initialiseMinimax = () => {
        let moveToTake;
        const turnScores = minimax(playerTwo, playerOne, gameboard)
        const resultsMapped = turnScores.filter(result => result !== false);
        const highestScore = resultsMapped.reduce((prev,current) => {
            return (prev > current) ? prev : current;
        })
        const bestMoves = turnScores.filter(turn => turn === highestScore);
        if (bestMoves.length === 1) {
            moveToTake = turnScores.indexOf(highestScore);
        }
        if (bestMoves.length > 1) {
            const randomTurn = Math.floor(Math.random() * bestMoves.length);
            for (let i = 0; i < randomTurn ; i++) {
                const moveToChange = turnScores.indexOf(highestScore);
                turnScores[moveToChange] = false;
            }
            moveToTake = turnScores.indexOf(highestScore);
        }
        console.log(moveToTake);
        layTile(gameboard.layout,playerTwo.token,moveToTake);
        screenContainer.refreshScreen();
        if (checkWin(gameboard.layout)) {
            console.log('Computer Wins!')
            gameOver('Computer Wins!');
        }
        if (!isSpace(gameboard.layout)) {
            gameOver('Nobody Wins!');
        }
    }

    const playMinimax = (cell, playerTwo, playerOne, layoutIn) => {
        const boardToCheck = board();
        boardToCheck.layout = layoutIn.layout.slice();
        layTile(boardToCheck.layout,playerTwo.token,cell);
        // logRound(boardToCheck);
        boardToCheck.depth = layoutIn.depth + 1;
        if (checkWin(boardToCheck.layout)) {
            if (playerTwo.isComp) {
                // console.log('Computer Win');
                return (100 - boardToCheck.depth);
            } else if (playerOne.isComp) {
                // console.log('Computer Lose');
                return (boardToCheck.depth - 100);
            }
        }
        if (isSpace(boardToCheck.layout) === false) {
            // console.log('Stalemate');
            return 0;
        }
        const results = minimax(playerOne,playerTwo,boardToCheck);
        const resultsMapped = results.filter(result => result !== false);
        const score = resultsMapped.reduce((prev,current) => {
            if (!playerTwo.isComp) {
                // console.log('Finding maximum score...')
              return (prev > current) ? prev : current;
            } else {
                // console.log('Finding minimum score...')
              return (prev < current) ? prev : current;
            }
        })
        
        return (score);
    };

    const minimax = (playerTwo,playerOne,boardIn) => {
        const availableMoves = findEmptyCells(boardIn.layout);
        const moveCount = availableMoves.filter((cell) => {return cell === true});
        if (moveCount.length === 0) {return availableMoves};
        for (let i = 0; i < availableMoves.length ; i++) {
            if (availableMoves[i]) {
                availableMoves[i] = playMinimax(i,playerTwo,playerOne,boardIn);
            }
        }
        // console.log(availableMoves);
        return availableMoves;
    }

    const callTable = () => {
        logRound(gameboard);
    }


    const logRound = (board) => {
        console.log(`${board.layout[0]}  |  ${board.layout[1]}  |  ${board.layout[2]}  \n
___________ \n
${board.layout[3]}  |  ${board.layout[4]}  |  ${board.layout[5]} \n
___________ \n
${board.layout[6]}  |  ${board.layout[7]}  |  ${board.layout[8]} \n`)
    }

    console.log(gameboard);
    return {initialiseMinimax, userLay, callTable, getContents, newGame}
})();

const screenContainer = (() => {
    const screenContainer = document.querySelector('.container');
    const gameOverModal = document.getElementById('gameOver');
    const cellElements = [];
    const cellOrder = ['top-left',
    'top-center',
    'top-right',
    'middle-left',
    'middle-center',
    'middle-right',
    'bottom-left',
    'bottom-center',
    'bottom-right']
    
    const refreshScreen = () => {
        for (let i = 0; i < cellElements.length ; i++) {
            cellElements[i].textContent = game.getContents(i);
        }
    }
    
    const userClick = (cell) => {  
        const index = cellOrder.indexOf(cell)
        game.userLay(index);
    }
    
    const drawBoard = () => {
        screenContainer.innerHTML = '';
        cellElements.length = 0;
        game.newGame();
        drawCell('top-left');
        drawCell('top-center');
        drawCell('top-right');
        drawCell('middle-left');
        drawCell('middle-center');
        drawCell('middle-right');
        drawCell('bottom-left');
        drawCell('bottom-center');
        drawCell('bottom-right');
        gameOverModal.close();
    }
    
    const drawCell = (position) => {
        const cellElement = document.createElement("button");
        cellElement.setAttribute("style", `grid-area:${position}`);
        cellElement.classList.add("cell");
        cellElement.setAttribute("id",position);
        screenContainer.appendChild(cellElement);
        cellElement.addEventListener('click',(event) => {userClick(event.target.id)});
        console.log(`Drawn: ${position}`);
        cellElements.push(cellElement);
    };
    const newGameButton = document.getElementById('newGameButton');
    newGameButton.addEventListener('click',drawBoard);
    const initialiseButton = document.querySelector('button');
    initialiseButton.addEventListener("click",drawBoard,false);
    
    return {drawBoard, refreshScreen, gameOverModal}
    
})();
