class Piece {
  constructor(category, x, y, group) {
    // x and y position
    this.position = [x, y];
    this.group = group;
    // configuration
    this.category = category;
    this.imagePos = pieceImage[group][category];
    this.growRate = width / boardSize;
    this.moveType = pieceMoveType[category];
    this.movesArea = moves[category];
    this.attackMoves = [];
    this.normalMoves = [];
    this.moveCount = 0;
    this.LastMoveTurn = 0;
    this.active = false;
    this.pawnSpecialMovie = null;
    createdPieces[group].push(this);
  }

  pawnSpecialMovies() {
    this.normalMoves.splice(0, this.normalMoves.length);
    this.attackMoves.splice(0, this.attackMoves.length);
    this.pawnSpecialMovie = null;
    let temp = [...createdPieces[groups.White], ...createdPieces.Black];
    let flag = true;

    let x = 0 + this.position[0];
    let y = directions[this.group] + this.position[1];

    for (let k = 0; k < temp.length; k++)
      if (temp[k].position[0] == x && temp[k].position[1] == y) flag = false;

    flag && this.normalMoves.push([x, y]);

    if (this.moveCount == 0 && this.normalMoves.length) {
      x = 0 + this.position[0];
      y = 2 * directions[this.group] + this.position[1];
      let flag = true;
      for (let k = 0; k < temp.length; k++)
        if (temp[k].position[0] == x && temp[k].position[1] == y) flag = false;

      flag && this.normalMoves.push([x, y]);
    }
    x = 1 + this.position[0];
    y = directions[this.group] + this.position[1];
    for (let k = 0; k < temp.length; k++)
      if (
        temp[k].position[0] == x &&
        temp[k].position[1] == y &&
        temp[k].group != this.group
      )
        this.attackMoves.push([x, y]);

    x = -1 + this.position[0];
    y = directions[this.group] + this.position[1];
    for (let k = 0; k < temp.length; k++)
      if (
        temp[k].position[0] == x &&
        temp[k].position[1] == y &&
        temp[k].group != this.group
      )
        this.attackMoves.push([x, y]);

    if (this.position[1] == 3 || this.position[1] == 4) {
      x = -1 + this.position[0];
      y = this.position[1];

      for (let k = 0; k < temp.length && x > 0; k++) {
        if (
          temp[k].category == catagories.Pawn &&
          temp[k].group != this.group &&
          temp[k].position[0] == x &&
          temp[k].position[1] == y &&
          temp[k].moveCount == 1 &&
          temp[k].LastMoveTurn == PlayingCount[against[this.group]]
        )
          this.pawnSpecialMovie = [x, y + directions[this.group]];
      }
      x = 1 + this.position[0];
      y = this.position[1];

      for (let k = 0; k < temp.length && x < boardSize; k++) {
        if (
          temp[k].category == catagories.Pawn &&
          temp[k].group != this.group &&
          temp[k].position[0] == x &&
          temp[k].position[1] == y &&
          temp[k].moveCount == 1 &&
          temp[k].LastMoveTurn == PlayingCount[against[this.group]]
        )
          this.pawnSpecialMovie = [x, y + directions[this.group]];
      }
    }
  }

  upgrade() {
    let n = prompt(
      "Write Number Of Your Choice(default : queen):\n 1-Rook\n 2-Bishop\n 3-Knight\n 4-Queen"
    );
    switch (n.trim()) {
      case "1":
        this.category = catagories.Rook;
        break;
      case "2":
        this.category = catagories.Bishop;
        break;
      case "3":
        this.category = catagories.Knight;
        break;
      default:
        this.category = catagories.Queen;
        break;
    }

    this.imagePos = pieceImage[this.group][this.category];
    this.moveType = pieceMoveType[this.category];
    this.movesArea = moves[this.category];
  }

  calcAvailableStaticMoves() {
    if (this.category == catagories.Pawn) {
      this.pawnSpecialMovies();
      return;
    }

    this.normalMoves.splice(0, this.normalMoves.length);
    this.attackMoves.splice(0, this.attackMoves.length);
    let temp = [...createdPieces[groups.White], ...createdPieces.Black];
    for (let i = 0; i < this.movesArea.length; i++) {
      let x = this.movesArea[i][0] + this.position[0];
      let y = this.movesArea[i][1] + this.position[1];
      if (x < 0 || y < 0 || x >= boardSize || y >= boardSize) continue;
      let deadEnd = false;
      for (let k = 0; k < temp.length; k++) {
        if (temp[k].position[0] == x && temp[k].position[1] == y) {
          deadEnd = true;
          if (temp[k].group != this.group) this.attackMoves.push([x, y]);
        }
      }
      if (deadEnd) continue;
      this.normalMoves.push([x, y]);
    }
  }

  calcAvailableDynamicMoves() {
    this.normalMoves.splice(0, this.normalMoves.length);
    this.attackMoves.splice(0, this.attackMoves.length);
    let temp = [...createdPieces[groups.White], ...createdPieces.Black];
    for (let i = 0; i < this.movesArea.length; i++) {
      let x = this.position[0];
      let y = this.position[1];

      for (let j = 0; j < 8; j++) {
        x += this.movesArea[i][0];
        y += this.movesArea[i][1];
        if (x < 0 || y < 0 || x >= boardSize || y >= boardSize) continue;
        let deadEnd = false;
        for (let k = 0; k < temp.length; k++) {
          if (temp[k].position[0] == x && temp[k].position[1] == y) {
            deadEnd = true;
            if (temp[k].group != this.group) this.attackMoves.push([x, y]);
          }
        }
        if (deadEnd) break;

        this.normalMoves.push([x, y]);
      }
    }
  }

  draw() {
    image(
      img,
      this.position[0] * this.growRate,
      this.position[1] * this.growRate,
      this.growRate + 10,
      this.growRate + 10,
      this.imagePos[0],
      this.imagePos[1],
      this.growRate * 2,
      this.growRate * 2
    );
  }
  calcMoves() {
    if (this.moveType == "static") this.calcAvailableStaticMoves();
    else this.calcAvailableDynamicMoves();
  }
  showMoves() {
    if (!this.active) return;
    //this.calcMoves();

    let blueBlocks = this.normalMoves;
    let redBlocks = this.attackMoves;

    for (let i = 0; i < blueBlocks.length; i++) {
      let nextMoveColor = color(BlocksColor.normalMove);
      nextMoveColor.setAlpha(100);
      fill(nextMoveColor);
      let x = blueBlocks[i][0];
      let y = blueBlocks[i][1];
      rect(x * this.growRate, y * this.growRate, this.growRate, this.growRate);
    }

    for (let i = 0; i < redBlocks.length; i++) {
      let nextAttackColor = color(BlocksColor.attackMove);
      nextAttackColor.setAlpha(100);
      fill(nextAttackColor);
      let x = redBlocks[i][0];
      let y = redBlocks[i][1];

      rect(x * this.growRate, y * this.growRate, this.growRate, this.growRate);
    }

    if (this.pawnSpecialMovie) {
      let nextAttackColor = color(BlocksColor.specialMove);
      nextAttackColor.setAlpha(100);
      fill(nextAttackColor);
      let x = this.pawnSpecialMovie[0];
      let y = this.pawnSpecialMovie[1];

      rect(x * this.growRate, y * this.growRate, this.growRate, this.growRate);
    }

    if (this.castlingPositions) {
      for (let i = 0; i < this.castlingPositions.length; i++) {
        let nextAttackColor = color(BlocksColor.specialMove);
        nextAttackColor.setAlpha(100);
        fill(nextAttackColor);
        let x = this.castlingPositions[i][0];
        let y = this.castlingPositions[i][1];

        rect(
          x * this.growRate,
          y * this.growRate,
          this.growRate,
          this.growRate
        );
      }
    }
  }

  move(x, y) {
    if (!this.active) return;
    // check for normal moves
    let blueBlocks = this.normalMoves;
    let redBlocks = this.attackMoves;
    let purpleBlocks = this.pawnSpecialMovies;

    for (let i = 0; i < blueBlocks.length; i++) {
      if (x == blueBlocks[i][0] && y == blueBlocks[i][1]) {
        this.position[0] = x;
        this.position[1] = y;
        this.moveCount++;
        this.LastMoveTurn = PlayingCount[this.group];
        if (
          (this.category == catagories.Pawn && y == 0) ||
          (this.category == catagories.Pawn && y == boardSize - 1)
        )
          this.upgrade();
        this.calcMoves();
        return true;
      }
    }

    // attack moves
    let oppositeGroup =
      this.group == groups.White ? groups.Black : groups.White;
    for (let i = 0; i < redBlocks.length; i++) {
      if (x == redBlocks[i][0] && y == redBlocks[i][1]) {
        for (let j = 0; j < createdPieces[oppositeGroup].length; j++) {
          if (
            x == createdPieces[oppositeGroup][j].position[0] &&
            y == createdPieces[oppositeGroup][j].position[1]
          ) {
            createdPieces[oppositeGroup].splice(j, 1);
            this.position[0] = x;
            this.position[1] = y;
            this.moveCount++;
            this.LastMoveTurn = PlayingCount[this.group];
            if (
              (this.category == catagories.Pawn && y == 0) ||
              (this.category == catagories.Pawn && y == boardSize - 1)
            )
              this.upgrade();
            this.calcMoves();
            return true;
          }
        }
      }
    }

    if (this.category == catagories.Pawn && this.pawnSpecialMovie) {
      if (x == this.pawnSpecialMovie[0] && y == this.pawnSpecialMovie[1]) {
        for (let j = 0; j < createdPieces[oppositeGroup].length; j++) {
          if (
            this.pawnSpecialMovie[0] ==
              createdPieces[oppositeGroup][j].position[0] &&
            this.pawnSpecialMovie[1] - directions[this.group] ==
              createdPieces[oppositeGroup][j].position[1]
          ) {
            createdPieces[oppositeGroup].splice(j, 1);
            this.position[0] = x;
            this.position[1] = y;
            this.moveCount++;
            this.LastMoveTurn = PlayingCount[this.group];
            if (y == 0 || y == boardSize - 1) this.upgrade();
            this.calcMoves();
            return true;
          }
        }
      }
    }

    if (this.category == catagories.King && this.castlingPositions) {
      for (let i = 0; i < this.castlingPositions.length; i++) {
        if (
          x == this.castlingPositions[i][0] &&
          y == this.castlingPositions[i][1]
        ) {
          this.castlingRooks[i].position[1] = y;
          if (x > this.position[0]) {
            this.castlingRooks[i].position[0] = x - 1;
          } else {
            this.castlingRooks[i].position[0] = x + 1;
          }

          this.position[0] = x;
          this.position[1] = y;
          this.castlingRooks[i].moveCount++;
          this.moveCount++;
          return true;
        }
      }
    }
  }
}
