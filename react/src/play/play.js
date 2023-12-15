
  function toggleBorder(el, on) {
    if (on){
      el.style.border = "1px solid white";
    } else {
      el.style.border = "";
    }
  }

  function processGameEnd(board, winner) {
    this.yourTurn = false;

    if (winner === this.oppName){
      this.printError(this.oppName + " Wins!");
    } else {
      this.printError("You Win!");
    }

    if (board){
      for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
          for (let k = 0; k < 3; k++){
            if (board[i][j][k] === 1){
              board[i][j][k] = 2;
            } else if (board[i][j][k] === 2){
              board[i][j][k] = 1;
            }
          }
        }
      }
      this.board = board;
      this.updateBoard();
    }
  }
