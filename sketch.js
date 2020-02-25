let chessBoard = new Board(width, height, boardSize);
let focusedPiece = null;

let player1, player2;
function setup() {
  frameRate(10);
  createCanvas(width, height);
  player1 = new Player(groups.White);
  player2 = new Player(groups.Black);
  player1.startTurn();
}

function draw() {
  clear();
  background("red");
  noStroke();
  chessBoard.draw();

  createdPieces[groups.White].forEach(e => e.draw());
  createdPieces[groups.Black].forEach(e => e.draw());

  if (focusedPiece) focusedPiece.showMoves();
}

function mouseClicked() {
  if (mouseX >= 0 && mouseX <= height && mouseY >= 0 && mouseY <= width) {
    let x = floor(mouseX / (height / boardSize));
    let y = floor(mouseY / (width / boardSize));
    console.log(x, y);
    if (focusedPiece && focusedPiece.move(x, y)) {
      if (player1.active == true) {
        player2.startTurn();
        player1.endTurn();
      } else {
        player1.startTurn();
        player2.endTurn();
      }
      focusedPiece = null;
      return;
    }
    for (let i = 0; i < createdPieces[groups.Black].length; i++) {
      if (
        createdPieces[groups.Black][i].position[0] == x &&
        createdPieces[groups.Black][i].position[1] == y
      ) {
        focusedPiece = createdPieces[groups.Black][i];
        return;
      }
    }
    for (let i = 0; i < createdPieces[groups.White].length; i++) {
      if (
        createdPieces[groups.White][i].position[0] == x &&
        createdPieces[groups.White][i].position[1] == y
      ) {
        focusedPiece = createdPieces[groups.White][i];
        return;
      }
    }

    focusedPiece = null;
  }
}
