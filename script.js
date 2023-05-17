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
    displayController.screenContainer.appendChild(cellElement);
    cellDOM = cellElement;
    console.log("done");
  };

  return { position, contents, cellDOM, changeContents, drawCell };
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

const displayController = (() => {
  const screenContainer = document.querySelector(".container");
  return { screenContainer };
})();

gameboard.cells.forEach((cell) => cell.drawCell());
