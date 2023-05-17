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
    cellElement.addEventListener('click', cellClick);
  };
  const cellClick = () => {
    changeContents(Player.token);
    console.log(cellDOM);
    cellDOM.innerText = Player.token;
    gameboard.alleys.forEach((alley) => {
      console.log(alley);
      gameboard.checkAlleysForWin(alley);
      console.log(alley.win);
      if (alley.win) {console.log("That's a Bingo!")}
    })
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

  const checkAlleysForWin = (alley) => {
    console.log(alley.a.content, alley.b.content, alley.c.content);
    alley.win = alley.a.content === alley.b.content && alley.b.content === alley.c.content && alley.a.content !== '';
  }

  return { cells, alleys, checkAlleysForWin };
})();

const Player = (() => {
  const token = 'X';
  return {token};
})();

const displayController = (() => {
  const screenContainer = document.querySelector(".container");
  return { screenContainer };
})();

gameboard.cells.forEach((cell) => cell.drawCell());
console.log(gameboard.alleys);
