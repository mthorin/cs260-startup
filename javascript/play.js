const Tim = {
  yourTurn: true,
  board: [
    [[0,0,2],
     [0,0,0],
     [1,0,0]],
    [[0,0,0],
     [0,0,0],
     [0,0,0]],
    [[0,0,0],
     [0,0,0],
     [0,0,0]]],
  currentPieces: [0,1,1,1,1,1],
  oppCurrentPieces: [0,1,1,1,1,1]
}

const Hannah = {
  yourTurn: false,
  board: [
    [[1,0,0],
     [0,0,0],
     [0,0,2]],
    [[0,0,0],
     [1,2,1],
     [2,0,0]],
    [[2,1,2],
     [2,1,0],
     [0,1,0]]],
  currentPieces: [0,0,0,0,0,0],
  oppCurrentPieces: [0,0,0,0,0,0]
}

const Billy = {
  yourTurn: true,
  board: [
    [[0,0,0],
     [0,2,0],
     [0,0,0]],
    [[0,0,0],
     [0,0,0],
     [0,0,0]],
    [[0,0,0],
     [0,0,0],
     [0,0,0]]],
  currentPieces: [1,1,1,1,1,1],
  oppCurrentPieces: [0,1,1,1,1,1]
}


class Game {
  yourTurn;
  selectedPiece;
  board;
  currentPieces;
  oppCurrentPieces;
  oppName;

  constructor() {
    this.yourTurn = true;
    this.selectedPiece = 0;
    this.board = [
      [[0,0,0],
       [0,0,0],
       [0,0,0]],
      [[0,0,0],
       [0,0,0],
       [0,0,0]],
      [[0,0,0],
       [0,0,0],
       [0,0,0]]
     ];
    this.currentPieces = [1,1,1,1,1,1];
    this.oppCurrentPieces = [1,1,1,1,1,1];

    const playerNameEl = document.querySelector('.player-name');
    playerNameEl.textContent = this.getPlayerName();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.oppName = urlParams.get('opp');

    const playersEl = document.querySelector('.players');
    playersEl.textContent = this.getPlayerName() + " vs. " +  this.oppName;

    this.getGameInfo(this.oppName);
  }

  getPlayerName() {
    return localStorage.getItem('userName') ?? 'Mystery player';
  }

  getGameInfo(oppName){
    if (oppName === "Tim") {
      const gameInfo = Tim;
      this.setGame(gameInfo);
    } else if (oppName === "Billy") {
      const gameInfo = Billy;
      this.setGame(gameInfo);
    } else if (oppName === "Hannah") {
      const gameInfo = Hannah;
      this.setGame(gameInfo);
    }
  }

  setGame(gameInfo) {
    //Load info from object or database
  }

  printError(message){
    const display = document.querySelector('.turn-info');
    display.textContent = message;
  }

  resetError() {
    const display = document.querySelector('.turn-info');
    display.textContent = "Your Turn";
  }

  pressPiece(piece)  {
    if (this.yourTurn && this.currentPieces[this.encodePiece(piece.id) - 1]){
      this.resetError();
      if (this.selectedPiece === 0){
        this.selectedPiece = this.encodePiece(piece.id);
        this.toggleBorder(piece, true);
      } else if (this.selectedPiece < 7) {
        const previousID = this.decodePiece(this.selectedPiece);
        this.selectedPiece = this.encodePiece(piece.id);
        this.toggleBorder(document.getElementById(previousID), false);
        this.toggleBorder(piece, true);
      } else {
        const previousID = this.decodeBoard(this.selectedPiece);
        this.selectedPiece = 0;
        this.toggleBorder(document.getElementById(previousID), false);
        this.printError("Can't return pieces");
      }
    }
  }

  pressBoard(boardPos)  {
    if (this.yourTurn){
      this.resetError();
      const x = this.getX(boardPos.id);
      const y = this.getY(boardPos.id);

      const occupant = this.checkForPiece(x,y);

      if (this.selectedPiece === 0){
        if (occupant[0] > 0 && occupant[1] === 1){
          this.selectedPiece = this.encodeBoardById(boardPos.id);
          this.toggleBorder(boardPos, true);
        }
      } else if (this.selectedPiece < 7) {
        const previousID = this.decodePiece(this.selectedPiece);
        this.toggleBorder(document.getElementById(previousID), false);
        if (occupant[0] === 0){
          this.movePieceToBoard(this.selectedPiece, x, y);
        } else if (occupant[0] === 1 && this.selectedPiece < 4){
          this.movePieceToBoard(this.selectedPiece, x,  y);
        } else if (occupant[0] === 2 && this.selectedPiece === 1){
          this.movePieceToBoard(this.selectedPiece, x,  y);
        } else {
          this.selectedPiece = 0;
          this.printError("Invalid Move");
        }
        this.selectedPiece = 0;
      } else {
        const x_sel = this.getX(this.decodeBoard(this.selectedPiece));
        const y_sel = this.getY(this.decodeBoard(this.selectedPiece));
        const selectedOccupant = this.checkForPiece(x_sel, y_sel);
        const previousID = this.decodeBoard(this.selectedPiece);
        this.toggleBorder(document.getElementById(previousID), false);

        if (selectedOccupant[0] > occupant[0]){
          this.moveBoardToBoard(x_sel, y_sel, x, y);
        } else {
          this.printError("Invalid Move");
        }
        this.selectedPiece = 0;
      }
    }
  }

  moveBoardToBoard(old_x, old_y, x, y) {

    this.endTurn();
  }

  movePieceToBoard(index, x, y) {
    switch(index){
      case 1:
        this.board[x][y][0] = 1;
        this.currentPieces[0] = 0;
        document.getElementById(this.decodeBoardByPos(x, y)).style.padding = "";
        break;
      case 2:
        this.board[x][y][1] = 1;
        this.currentPieces[1] = 0;
        document.getElementById(this.decodeBoardByPos(x, y)).style.padding = "25px";
        break;
      case 3:
        this.board[x][y][1] = 1;
        this.currentPieces[2] = 0;
        document.getElementById(this.decodeBoardByPos(x, y)).style.padding = "25px";
        break;
      case 4:
        this.board[x][y][2] = 1;
        this.currentPieces[3] = 0;
        document.getElementById(this.decodeBoardByPos(x, y)).style.padding = "37px";
        break;
      case 5:
        this.board[x][y][2] = 1;
        this.currentPieces[4] = 0;
        document.getElementById(this.decodeBoardByPos(x, y)).style.padding = "37px";
        break;
      case 6:
        this.board[x][y][2] = 1;
        this.currentPieces[5] = 0;
        document.getElementById(this.decodeBoardByPos(x, y)).style.padding = "37px";
        break;
    }
    document.getElementById(this.decodePiece(index)).src = "empty.png";
    document.getElementById(this.decodeBoardByPos(x, y)).src  = "redcircle.png";

    this.endTurn();
  }

  endTurn(){
    this.yourTurn = false;
    this.printError(this.oppName + "'s turn");
  }

  toggleBorder(el, on) {
    if (on){
      el.style.border = "1px solid white";
    } else {
      el.style.border = "";
    }
  }

  decodeBoardByPos(x, y){
    switch(x){
      case 0:
        switch(y){
          case 0:
            return "1,1";
          case 1:
            return "1,2";
          case 2:
            return "1,3";
        }
      case 1:
        switch(y){
          case 0:
            return "2,1";
          case 1:
            return "2,2";
          case 2:
            return "2,3";
        }
      case 2:
        switch(y){
          case 0:
            return "3,1";
          case 1:
            return "3,2";
          case 2:
            return "3,3";
        }
    }
  }

  encodeBoardById(x, y){
    switch(id){
      case "1,1":
        return 7;
      case "1,2":
        return 8;
      case "1,3":
        return 9;
      case "2,1":
        return 10;
      case "2,2":
        return 11;
      case "2,3":
        return 12;
      case "3,1":
        return 13;
      case "3,2":
        return 14;
      case "3,3":
        return 15;
    }
  }

  decodeBoard(index){
    switch(index){
      case 7:
        return "1,1";
      case 8:
        return "1,2";
      case 9:
        return "1,3";
      case 10:
        return "2,1";
      case 11:
        return "2,2";
      case 12:
        return "2,3";
      case 13:
        return "3,1";
      case 14:
        return "3,2";
      case 15:
        return "3,3";
    }
  }

  checkForPiece(x, y) {
    if (this.board[x][y][0] === 1){
      return [3,1];
    } else if (this.board[x][y][0] === 2){
      return [3,2];
    } else if (this.board[x][y][1] === 1){
      return [2,1];
    } else if (this.board[x][y][1] === 2){
      return [2,2];
    } else if (this.board[x][y][2] === 1){
      return [1,1];
    } else if (this.board[x][y][2] === 2){
      return [1,2];
    } else {
      return [0,0];
    }
  }

  getX(id) {
    switch(id){
      case "1,1":
        return 0;
      case "1,2":
        return 0;
      case "1,3":
        return 0;
      case "2,1":
        return 1;
      case "2,2":
        return 1;
      case "2,3":
        return 1;
      case "3,1":
        return 2;
      case "3,2":
        return 2;
      case "3,3":
        return 2;
    }
  }

  getY(id) {
    switch(id){
      case "1,1":
        return 0;
      case "1,2":
        return 1;
      case "1,3":
        return 2;
      case "2,1":
        return 0;
      case "2,2":
        return 1;
      case "2,3":
        return 2;
      case "3,1":
        return 0;
      case "3,2":
        return 1;
      case "3,3":
        return 2;
    }
  }

  encodePiece(id) {
    switch(id){
      case "right-big-1":
        return 1;
      case "right-med-1":
        return 2;
      case "right-med-2":
        return 3;
      case "right-sml-1":
        return 4;
      case "right-sml-2":
        return 5;
      case "right-sml-3":
        return 6;
    }
  }

  decodePiece(index) {
    switch(index){
      case 1:
        return "right-big-1";
      case 2:
        return "right-med-1";
      case 3:
        return "right-med-2";
      case 4:
        return "right-sml-1";
      case 5:
        return "right-sml-2";
      case 6:
        return "right-sml-3";
    }
  }
}

const game = new Game();
