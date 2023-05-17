const cell = (position) => {
  let contents = "";
  let cellDOM;
  const changeContents = (token) => {
    contents = token;
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
  }

  return { position, contents, cellDOM, changeContents, drawCell, cellClick };
};

const gameboard = (() => {
  const cells = [
    cell("top-left"),
    cell("top-center"),
    cell("top-right"),
    cell("middle-left"),
    cell("middle-center"),
    cell("middle-right"),
    cell("bottom-left"),
    cell("bottom-center"),
    cell("bottom-right"),
  ];

  return { cells };
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
