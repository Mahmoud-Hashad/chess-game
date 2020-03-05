class Player {
  constructor(type) {
    this.group = groups[type];
    this.against = this.group == groups.White ? groups.Black : groups.White;
    this.active = false;
    this.underAttack = false;
    this.attackPiece = null;
    this.Rooks = [];
    for (let i = 0; i < playerPieces[this.group].length; i++) {
      new Piece(
        playerPieces[this.group][i][0],
        playerPieces[this.group][i][1],
        playerPieces[this.group][i][2],
        this.group
      );
      if (playerPieces[this.group][i][0] == catagories.King)
        this.KingPiece =
          createdPieces[this.group][createdPieces[this.group].length - 1];

      if (playerPieces[this.group][i][0] == catagories.Rook)
        this.Rooks.push(
          createdPieces[this.group][createdPieces[this.group].length - 1]
        );
    }
  }

  unActivate() {
    for (let i = 0; i < createdPieces[groups[this.group]].length; i++)
      createdPieces[groups[this.group]][i].active = false;
    this.active = false;
  }
  getPath(p1, p2) {
    let t1 = [...p1];
    let t2 = [...p2];
    let result = [];
    while (true) {
      if (t1[0] > t2[0]) t2[0]++;
      if (t1[0] < t2[0]) t2[0]--;
      if (t1[1] > t2[1]) t2[1]++;
      if (t1[1] < t2[1]) t2[1]--;

      if (t1[0] == t2[0] && t1[1] == t2[1]) break;

      result.push([...t2]);
    }

    return result;
  }

  activate() {
    this.Rooks = [];
    for (let i = 0; i < createdPieces[this.group].length; i++) {
      createdPieces[this.group][i].active = true;

      if (createdPieces[this.group][i].category == catagories.King)
        this.KingPiece = createdPieces[this.group][i];

      if (createdPieces[this.group][i].category == catagories.Rook)
        this.Rooks.push(createdPieces[this.group][i]);
    }

    this.active = true;
  }
  updatePiecesPositions() {
    for (let i = 0; i < createdPieces[this.group].length; i++) {
      let t = createdPieces[this.group][i];
      t.calcMoves();

      let tempPosition = [...t.position];
      let tempNormalMoves = [...t.normalMoves];

      let tempAttackMoves = [...t.attackMoves];
      for (let j = 0; j < tempNormalMoves.length; j++) {
        t.position = [...tempNormalMoves[j]];
        this.checkMate();

        if (this.underAttack) {
          tempNormalMoves.splice(j, 1);
          j--;
        }
      }

      for (let j = 0; j < tempAttackMoves.length; j++) {
        t.position = [...tempAttackMoves[j]];
        this.checkMate(t.position);

        if (this.underAttack) {
          tempAttackMoves.splice(j, 1);
          j--;
        }
      }
      if (t.category == catagories.Pawn && t.pawnSpecialMovie) {
        t.position = [...t.pawnSpecialMovie];

        this.checkMate();
        if (this.underAttack) {
          t.pawnSpecialMovie = null;
        }
      }

      if (t == this.KingPiece && t.castlingPositions) {
        for (let m = 0; m < t.castlingPositions.length; m++) {
          t.position = [...t.castlingPositions[m]];
          this.checkMate();
          console.log("i came here");
          let valid = false;
          for (let n = 0; n < tempNormalMoves.length; n++) {
            console.log("and here");
            console.log(tempNormalMoves[n]);

            if (
              (tempNormalMoves[n][1] == t.castlingPositions[m][1] &&
                tempNormalMoves[n][0] == t.castlingPositions[m][0] - 1) ||
              (tempNormalMoves[n][1] == t.castlingPositions[m][1] &&
                tempNormalMoves[n][0] == t.castlingPositions[m][0] + 1)
            ) {
              valid = true;
              break;
            }
          }
          if (this.underAttack || !valid) {
            t.castlingPositions.splice(m, 1);
            t.castlingRooks.splice(m, 1);
            m--;
          }
        }
      }
      t.normalMoves = [...tempNormalMoves];
      t.attackMoves = [...tempAttackMoves];
      t.position = [...tempPosition];
    }
  }

  castling() {
    this.KingPiece.castlingPositions = [];
    this.KingPiece.castlingRooks = [];

    if (this.KingPiece.moveCount != 0) return;
    if (this.underAttack) return;

    for (let i = 0; i < this.Rooks.length; i++) {
      if (this.Rooks[i].moveCount != 0) continue;

      let castlingBath = this.getPath(
        this.KingPiece.position,
        this.Rooks[i].position
      );

      let cleanPath = true;
      for (let j = 0; j < castlingBath.length; j++) {
        for (let k = 0; k < createdPieces[this.group].length; k++) {
          if (
            createdPieces[this.group][k].position[0] == castlingBath[j][0] &&
            createdPieces[this.group][k].position[1] == castlingBath[j][1]
          ) {
            cleanPath = false;
            break;
          }
        }
        for (let k = 0; k < createdPieces[this.against].length; k++) {
          if (
            createdPieces[this.against][k].position[0] == castlingBath[j][0] &&
            createdPieces[this.against][k].position[1] == castlingBath[j][1]
          ) {
            cleanPath = false;
            break;
          }
        }
      }

      if (!cleanPath) continue;
      this.KingPiece.castlingPositions.push(
        castlingBath[castlingBath.length % 2]
      );
      this.KingPiece.castlingRooks.push(this.Rooks[i]);
    }
  }

  startTurn() {
    PlayingCount[this.group]++;
    this.activate();
    this.castling();
    this.updatePiecesPositions();
    this.checkMate();
    this.gameOver();
  }
  endTurn() {
    this.unActivate();
  }

  checkMate(ignoredPosition) {
    for (let i = 0; i < createdPieces[this.against].length; i++)
      createdPieces[this.against][i].calcMoves();

    for (let i = 0; i < createdPieces[groups[this.against]].length; i++) {
      if (
        ignoredPosition &&
        createdPieces[groups[this.against]][i].position[0] ==
          ignoredPosition[0] &&
        createdPieces[groups[this.against]][i].position[1] == ignoredPosition[1]
      )
        continue;
      for (
        let k = 0;
        k < createdPieces[groups[this.against]][i].attackMoves.length;
        k++
      ) {
        if (
          createdPieces[groups[this.against]][i].attackMoves[k][0] ==
            this.KingPiece.position[0] &&
          createdPieces[groups[this.against]][i].attackMoves[k][1] ==
            this.KingPiece.position[1]
        ) {
          this.underAttack = true;
          this.attackPiece = createdPieces[groups[this.against]][i];

          return;
        }
      }
    }
    this.underAttack = false;
    this.attackPiece = null;
  }
  gameOver() {
    let noProtect = true;
    for (let i = 0; i < createdPieces[this.group].length; i++) {
      if (
        createdPieces[this.group][i].normalMoves.length ||
        createdPieces[this.group][i].attackMoves.length
      ) {
        noProtect = false;
      }
    }
    if (noProtect) {
      gameOver = true;
      message = this.underAttack
        ? `Congratulations ${against[this.group]} Player Wins`
        : "Unfortunately Draw";
    }
  }
}
