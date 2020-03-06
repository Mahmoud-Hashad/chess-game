let img;
function preload() {
  img = loadImage("graphics.png");
}

const ResultBox = document.getElementById("resultBox");
const ResultMessageH3 = document.getElementById("result");
document.getElementById("clearTheMessage").addEventListener("click", () => {
  ResultBox.style.display = "none";
});
// global config of board
const width = 640,
  height = 640,
  boardSize = 8;

// history
let history = {
  pieces: [],
  count: [],
  player1: [],
  player2: [],
  gameStatus: []
};

let gameOver = false;
let message = "";
// pieces config
let createdPieces = {
  White: [],
  Black: []
};

let PlayingCount = {
  White: 0,
  Black: 0
};

let against = {
  Black: "White",
  White: "Black"
};
let directions = {
  White: -1,
  Black: 1
};

const catagories = {
  King: "King",
  Queen: "Queen",
  Bishop: "Bishop",
  Knight: "Knight",
  Rook: "Rook",
  Pawn: "Pawn"
};

const pieceMoveType = {
  King: "static",
  Queen: "dynamic",
  Bishop: "dynamic",
  Knight: "static",
  Rook: "dynamic",
  Pawn: "static"
};

const moves = {
  King: [
    [0, 1],
    [1, 1],
    [-1, 1],
    [-1, 0],
    [0, -1],
    [-1, -1],
    [1, -1],
    [1, 0]
  ],
  Queen: [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
    [1, 1],
    [-1, -1],
    [-1, 1],
    [1, -1]
  ],
  Bishop: [
    [1, 1],
    [-1, -1],
    [-1, 1],
    [1, -1]
  ],
  Knight: [
    [1, 2],
    [2, 1],
    [2, -1],
    [-2, -1],
    [-2, 1],
    [1, -2],
    [-1, -2],
    [-1, 2]
  ],
  Rook: [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1]
  ],

  Pawn: [[0, 0]]
};

const BlocksColor = {
  normalMove: "#00FFFF",
  attackMove: "red",
  specialMove: "#dc00ff"
};

pieceImage = {
  Black: {
    King: [0, 0],
    Queen: [168 * 1, 0],
    Rook: [168 * 2, 0],
    Bishop: [168 * 3, 0],
    Knight: [168 * 4, 0],
    Pawn: [168.5 * 5, 0]
  },
  White: {
    King: [0, 145],
    Queen: [168 * 1, 145],
    Rook: [168 * 2, 145],
    Bishop: [168 * 3, 145],
    Knight: [168 * 4, 145],
    Pawn: [169 * 5, 145]
  }
};

const groups = {
  Black: "Black",
  White: "White"
};

const playerPieces = {
  Black: [
    [catagories.Rook, 0, 0],
    [catagories.Knight, 1, 0],
    [catagories.Bishop, 2, 0],
    [catagories.Queen, 3, 0],
    [catagories.King, 4, 0],
    [catagories.Bishop, 5, 0],
    [catagories.Knight, 6, 0],
    [catagories.Rook, 7, 0],
    [catagories.Pawn, 0, 1],
    [catagories.Pawn, 1, 1],
    [catagories.Pawn, 2, 1],
    [catagories.Pawn, 3, 1],
    [catagories.Pawn, 4, 1],
    [catagories.Pawn, 5, 1],
    [catagories.Pawn, 6, 1],
    [catagories.Pawn, 7, 1]
  ],
  White: [
    [catagories.Rook, 0, 7],
    [catagories.Knight, 1, 7],
    [catagories.Bishop, 2, 7],
    [catagories.Queen, 3, 7],
    [catagories.King, 4, 7],
    [catagories.Bishop, 5, 7],
    [catagories.Knight, 6, 7],
    [catagories.Rook, 7, 7],
    [catagories.Pawn, 0, 6],
    [catagories.Pawn, 1, 6],
    [catagories.Pawn, 2, 6],
    [catagories.Pawn, 3, 6],
    [catagories.Pawn, 4, 6],
    [catagories.Pawn, 5, 6],
    [catagories.Pawn, 6, 6],
    [catagories.Pawn, 7, 6]
  ]
};
