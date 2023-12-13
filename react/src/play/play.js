class Game {
  yourTurn;
  selectedPiece;
  board;
  currentPieces;
  oppCurrentPieces;
  oppName;
  socket;

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
    
    this.initialSetUp();
    
  }

  async initialSetUp(){
    this.configureWebSocket();
    await this.getGameInfo();
    this.linkToOpponent();
  }

  getPlayerName() {
    return localStorage.getItem('userName') ?? 'Mystery player';
  }

  async getGameInfo(){
    let gameInfo = [];
    try {
      const response = await fetch('/api/game/load/' + this.getPlayerName() + '/' + this.oppName);
      gameInfo = await response.json();
    } catch {}

    this.setGame(gameInfo);
  }

  checkForWin() {
    let player1Win = false;
    let player2Win = false;
    for (let i = 0; i < 3; i++) {
      //Rows
      let lastNum = 0;
      let renzoku = 0;
      for (let j = 0; j < 3; j++) {
        const piece = this.checkForPiece(i, j);
        if (piece[1] === lastNum){
          renzoku++;
        } else {
          renzoku = 0;
        }
        lastNum = piece[1];
      }
      if (renzoku === 2 && lastNum === 1){
        player1Win = true;
      }
      if (renzoku === 2 && lastNum === 2){
        player2Win = true;
      }
      //Columns
      lastNum = 0;
      renzoku = 0;
      for (let j = 0; j < 3; j++) {
        const piece = this.checkForPiece(j, i);
        if (piece[1] === lastNum){
          renzoku++;
        } else {
          renzoku = 0;
        }
        lastNum = piece[1];
      }
      if (renzoku === 2 && lastNum === 1){
        player1Win = true;
      }
      if (renzoku === 2 && lastNum === 2){
        player2Win = true;
      }
    }

    //Diagonal 1
    let lastNum = 0;
    let renzoku = 0;
    for (let i = 0; i < 3; i++) {
      const piece = this.checkForPiece(i, i);
      if (piece[1] === lastNum){
        renzoku++;
      } else {
        renzoku = 0;
      }
      lastNum = piece[1];
    }
    if (renzoku === 2 && lastNum === 1){
      player1Win = true;
    }
    if (renzoku === 2 && lastNum === 2){
      player2Win = true;
    }

    //Diagonal 2
    lastNum = 0;
    renzoku = 0;
    for (let i = 0; i < 3; i++) {
      const piece = this.checkForPiece(i, 2 - i);
      if (piece[1] === lastNum){
        renzoku++;
      } else {
        renzoku = 0;
      }
      lastNum = piece[1];
    }
    if (renzoku === 2 && lastNum === 1){
      player1Win = true;
    }
    if (renzoku === 2 && lastNum === 2){
      player2Win = true;
    }

    if(player1Win && !player2Win){
      this.winFor(1);
      return 1;
    } else if (player2Win && !player1Win){
      this.winFor(2);
      return 2;
    }
    return 0;
  }

  forfeit(){
    if (this.yourTurn){
      this.yourTurn = false;
      this.winFor(2);
      this.sendMove(true, null, this.oppName);
    }
  }

  winFor(playerNum){
    //HIDE forfeit button
    this.removeGame();
    if (playerNum === 1){
      this.printError("You Win!");
      this.addWin(this.getPlayerName());
      this.addLoss(this.oppName)
    } else {
      this.printError(this.oppName + " Wins!");
      this.addWin(this.oppName);
      this.addLoss(this.getPlayerName());
    }
  }

  addLoss(player){
    fetch('/api/user/loss', {
      method: 'post',
      body: JSON.stringify({ username: player}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  }

  addWin(player){
    fetch('/api/user/win', {
      method: 'post',
      body: JSON.stringify({ username: player}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  }

  removeGame(){
    fetch('/api/game/end', {
      method: 'post',
      body: JSON.stringify({ player1: this.getPlayerName(), player2: this.oppName}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  }

  updatePieces(){
    for(let i = 0; i < 6; i++){
      if(this.currentPieces[i] === 0){
        document.getElementById(this.decodePiece(i + 1)).src = "empty.png";
      }
    }

    for(let i = 0; i < 6; i++){
      if(this.oppCurrentPieces[i] === 0){
        document.getElementById(this.decodeOppPiece(i)).src = "empty.png";
      }
    }
  }

  updateBoard(){
    for(let x = 0; x < 3; x++) {
      for(let y = 0; y < 3; y++) {
        let piece = this.checkForPiece(x,y);
        switch(piece[0]){
          case 1:
            document.getElementById(this.decodeBoardByPos(x, y)).style.padding = "37px";
            break;
          case 2:
            document.getElementById(this.decodeBoardByPos(x, y)).style.padding = "25px";
            break;
          case 3:
            document.getElementById(this.decodeBoardByPos(x, y)).style.padding = "";
            break;
        }
        switch(piece[1]){
          case 0:
            document.getElementById(this.decodeBoardByPos(x, y)).src  = "empty.png";
            break;
          case 1:
            document.getElementById(this.decodeBoardByPos(x, y)).src  = "redcircle.png";
            break;
          case 2:
            document.getElementById(this.decodeBoardByPos(x, y)).src  = "bluecircle.png";
            break;
        }
      }
    }
  }

  setGame(gameInfo) {
    this.game_id = gameInfo.game_id;
    this.yourTurn = gameInfo.yourTurn;
    this.board = gameInfo.board;
    this.currentPieces = gameInfo.currentPieces;
    this.oppCurrentPieces = gameInfo.oppCurrentPieces;

    this.updateBoard();
    this.updatePieces();
    this.updateWinLoss();

    if(!this.yourTurn){
      this.printError(this.oppName + "'s Turn");
    } else {
      this.resetError();
    }
  }

  async updateWinLoss(){
    const wlratio = await this.getWinLoss(this.getPlayerName());
    const oppwlratio = await this.getWinLoss(this.oppName);

    const wlratioEl = document.querySelector('.wlratio');
    wlratioEl.textContent = wlratio[0] + "-" + wlratio[1] + "    " + oppwlratio[0] + "-" + oppwlratio[1];
  }

  async getWinLoss(username){
    let wlratio = [];
    try {
      const response = await fetch('/api/user/wlratio/' + username);
      wlratio = await response.json();
    } catch (e) {
      console.log(e);
      wlratio = [0,0];
    }
    return wlratio;
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
          this.moveBoardToBoard(x_sel, y_sel, selectedOccupant, x, y, occupant);
        } else {
          this.printError("Invalid Move");
        }
        this.selectedPiece = 0;
      }
    }
  }

  moveBoardToBoard(old_x, old_y, old_info, x, y, info) {
    document.getElementById(this.decodeBoardByPos(x, y)).src  = "redcircle.png";
    switch(old_info[0]){
      case 1:
        this.board[old_x][old_y][2] = 0;
        this.board[x][y][2] = 1;
        document.getElementById(this.decodeBoardByPos(x, y)).style.padding = "37px";
        break;
      case 2:
        this.board[old_x][old_y][1] = 0;
        this.board[x][y][1] = 1;
        document.getElementById(this.decodeBoardByPos(x, y)).style.padding = "25px";
        break;
      case 3:
        this.board[old_x][old_y][0] = 0;
        this.board[x][y][0] = 1;
        document.getElementById(this.decodeBoardByPos(x, y)).style.padding = "";
        break;
    }

    const new_top = this.checkForPiece(old_x, old_y);
    switch(new_top[0]){
      case 1:
        document.getElementById(this.decodeBoardByPos(old_x, old_y)).style.padding = "37px";
        break;
      case 2:
        document.getElementById(this.decodeBoardByPos(old_x, old_y)).style.padding = "25px";
        break;
      case 3:
        document.getElementById(this.decodeBoardByPos(old_x, old_y)).style.padding = "";
        break;
    }
    switch(new_top[1]){
      case 0:
        document.getElementById(this.decodeBoardByPos(old_x, old_y)).src  = "empty.png";
        break;
      case 1:
        document.getElementById(this.decodeBoardByPos(old_x, old_y)).src  = "redcircle.png";
        break;
      case 2:
        document.getElementById(this.decodeBoardByPos(old_x, old_y)).src  = "bluecircle.png";
        break;
    }
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

  async endTurn(){
    this.yourTurn = false;
    await this.updateDatabase();
    this.printError(this.oppName + "'s turn");
    const over = this.checkForWin();
    if (over === 1){
      this.sendMove(true, this.board, this.getPlayerName());
    } else if (over === 2){
      this.sendMove(true, this.board, this.oppName);
    } else {
      this.sendMove(false, null, null);
    }
  }

  async updateDatabase(){
    const currGameInfo = {yourTurn: this.yourTurn, board: this.board, currentPieces: this.currentPieces, 
      oppCurrentPieces: this.oppCurrentPieces};

    await fetch('/api/game/update/' + this.getPlayerName() + '/' + this.oppName, {
        method: 'POST',
        body: JSON.stringify(currGameInfo),
        headers: {'Content-type': 'application/json'},
    })
    .catch(err => {
      console.log(err);
   });
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

  encodeBoardById(id){
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

  decodeOppPiece(index) {
    switch(index){
      case 0:
        return "left-big-1";
      case 1:
        return "left-med-1";
      case 2:
        return "left-med-2";
      case 3:
        return "left-sml-1";
      case 4:
        return "left-sml-2";
      case 5:
        return "left-sml-3";
    }
  }

  //Websocket
  configureWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    this.socket.onmessage = async (event) => {
      const move = JSON.parse(await event.data.text());
      if (move.gameOver) {
        this.processGameEnd(move.board, move.winner);
      } else {
        this.getGameInfo();
      }
    };
  }

  async linkToOpponent(){
    const linkPacket = {
      type: "link",
      game_id: this.game_id,
    };
    await new Promise(r => setTimeout(r, 2000));
    this.socket.send(JSON.stringify(linkPacket));
  }

  processGameEnd(board, winner) {
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

  sendMove(gameOver, board, winner) {
    const move = {
      type: "move",
      gameOver: gameOver,
      board: board,
      winner: winner,
    };
    this.socket.send(JSON.stringify(move));
  }
}

const game = new Game();
