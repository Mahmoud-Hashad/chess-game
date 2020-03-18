let chessBoard = new Board(width, height, boardSize);
let focusedPiece = null;

let player1, player2;
function setup() {
  frameRate(10);
  createCanvas(width, height);
  player1 = new Player(groups.White);
  player2 = new Player(groups.Black);
  player1.startTurn();
  saveGame();
}

function draw() {
  chessBoard.draw();

  createdPieces[groups.White].forEach(e => e.draw());
  createdPieces[groups.Black].forEach(e => e.draw());

  if (focusedPiece) focusedPiece.showMoves();
  if (gameOver) {
    ResultBox.style.display = "block";
    ResultMessageH3.innerText = message;
  }
  noLoop();
}

function mouseClicked() {
  if (
    mouseX >= 0 &&
    mouseX <= height &&
    mouseY >= 0 &&
    mouseY <= width &&
    !gameOver
  ) {
    let x = floor(mouseX / (height / boardSize));
    let y = floor(mouseY / (width / boardSize));
    if (focusedPiece && focusedPiece.move(x, y)) {
      focusedPiece = null;

      loop();

      if (player1.active == true) {
        player2.startTurn();
        player1.endTurn();
        if (!gameOver) botMove(player2);
        player1.startTurn();
        player2.endTurn();
      }

      saveGame();
      setTimeout(() => {
        loop();
      }, 500);
      return;
    }
    for (let i = 0; i < createdPieces[groups.Black].length; i++) {
      if (
        createdPieces[groups.Black][i].position[0] == x &&
        createdPieces[groups.Black][i].position[1] == y
      ) {
        focusedPiece = createdPieces[groups.Black][i];
        loop();
        return;
      }
    }
    for (let i = 0; i < createdPieces[groups.White].length; i++) {
      if (
        createdPieces[groups.White][i].position[0] == x &&
        createdPieces[groups.White][i].position[1] == y
      ) {
        focusedPiece = createdPieces[groups.White][i];
        loop();
        return;
      }
    }

    focusedPiece = null;
    loop();
  }
}

function keyPressed(e) {
  if (e.ctrlKey) {
    if (key == "z" || key == "Z") {
      stepBack();
      loop();
    }
  }
}

function stepBack() {
  let l = history.gameStatus.length;
  if (l <= 1) return;

  history.pieces.pop();
  history.count.pop();
  history.player1.pop();
  history.player2.pop();
  history.gameStatus.pop();

  l -= 2;

  createdPieces = JSON.parse(history.pieces[l]);
  PlayingCount = JSON.parse(history.count[l]);
  player1 = JSON.parse(history.player1[l]);
  player2 = JSON.parse(history.player2[l]);
  gameOver = JSON.parse(history.gameStatus[l]);

  for (let i = 0; i < createdPieces.White.length; i++)
    createdPieces.White[i].__proto__ = Piece.prototype;

  for (let i = 0; i < createdPieces.Black.length; i++)
    createdPieces.Black[i].__proto__ = Piece.prototype;

  player1.__proto__ = Player.prototype;
  player2.__proto__ = Player.prototype;
  if (player1.active == true) {
    PlayingCount.White--;
    player1.startTurn();
    player2.endTurn();
  } else {
    PlayingCount.Black--;
    player2.startTurn();
    player1.endTurn();
  }
}

function saveGame() {
  history.pieces.push(JSON.stringify(createdPieces));
  history.count.push(JSON.stringify(PlayingCount));
  history.player1.push(JSON.stringify(player1));
  history.player2.push(JSON.stringify(player2));
  history.gameStatus.push(JSON.stringify(gameOver));
}
