function botMove(player) {
  //player.unActivate();
  let totalPieces = createdPieces[player.group].length;
  // get random peice;
  let botMoved = false;
  while (!botMoved) {
    let botPieceIndex = floor(random(0, totalPieces));
    let botPiece = createdPieces[player.group][botPieceIndex];
    let availableMoves = [...botPiece.normalMoves, ...botPiece.attackMoves];
    if (botPiece.pawnSpecialMovie)
      availableMoves.push(...botPiece.pawnSpecialMovie);
    if (botPiece.castlingPositions)
      availableMoves.push(...botPiece.castlingPositions);
    if (availableMoves.length > 0) {
      let botMoveIndex = floor(random(0, availableMoves.length));
      let botMovePosition = availableMoves[botMoveIndex];
      botMoved = true;
      botPiece.move(...botMovePosition);
    }
  }
}
