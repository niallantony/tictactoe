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

    const findEmptyCells = (layout) => {
        const emptyCells = layout.map((cell) => {return cell === '' ? true : false;});
        return emptyCells
    }

    const isSpace = (layout) => {
        return layout.some((cell) => {return cell === ''});
    }

    const userLay = (cell) => {
        layTile(gameboard.layout,playerOne.token,cell);
    }

    const layTile = (layout,tile,cell) => {
        layout[cell] = tile;
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
        const turnScores = minimax(playerTwo, playerOne, gameboard)
        const highestScore = turnScores.reduce((prev,current) => {
            return (prev > current) ? prev : current;
        })
        const moveToTake = turnScores.indexOf(highestScore);
        layTile(gameboard.layout,playerTwo.token,moveToTake);
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
            console.log('Stalemate');
            return 0;
        }
        const results = minimax(playerOne,playerTwo,boardToCheck);
        const resultsMapped = results.filter(result => result != false);
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
    return {initialiseMinimax, userLay, callTable}
})();