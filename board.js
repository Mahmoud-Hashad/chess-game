class Board {
  constructor() {
    this.width = width;
    this.height = height;
    this.squaresByLine = boardSize;
  }

  draw() {
    let squareWidth = floor(this.width / this.squaresByLine);
    let squareheight = floor(this.height / this.squaresByLine);
    let color = true;
    for (let i = 0; i < this.squaresByLine; i++) {
      for (let j = 0; j < this.squaresByLine; j++) {
        noStroke();
        if (i % 2 == 0) color ? fill("#CC6633") : fill("#ffb070");
        else color ? fill("#ffb070") : fill("#CC6633");
        color = !color;
        rect(j * squareWidth, i * squareheight, squareWidth, squareheight);
      }
    }
  }
}
