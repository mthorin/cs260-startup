import React from 'react';

import Button from 'react-bootstrap/Button';
import { addWin, addLoss, removeGame, getGameInfo, updateDatabase } from './databaseInteractor.js'
import { Turn, Lobby } from './lobby.js'

export function Board(props) {
    const [gameID, setGameID] = React.useState(0);
    const [message, setMessage] = React.useState('Your Turn');
    const [yourTurn, setTurn] = React.useState(true);
    const [selectedPiece, setSelectedPiece] = React.useState(0);
    const [yourPieces, setYourPieces] = React.useState([1,1,1,1,1,1]);
    const [oppPieces, setOppPieces] = React.useState([1,1,1,1,1,1]);
    const [board, setBoard] = React.useState([
        [[0,0,0],
         [0,0,0],
         [0,0,0]],
        [[0,0,0],
         [0,0,0],
         [0,0,0]],
        [[0,0,0],
         [0,0,0],
         [0,0,0]]
       ]);
    const [boardColor, setBoardColor] = React.useState([
        ['/empty.png','/empty.png','/empty.png'],
        ['/empty.png','/empty.png','/empty.png'],
        ['/empty.png','/empty.png','/empty.png']]);
    const [boardSize, setBoardSize] = React.useState([
        [{padding: '0px'},{padding: '0px'},{padding: '0px'}],
        [{padding: '0px'},{padding: '0px'},{padding: '0px'}],
        [{padding: '0px'},{padding: '0px'},{padding: '0px'}]]);

    const highlight = {border: '1px solid white', padding: '0px'};

    function checkForPiece(x, y) {
        if (board[x][y][0] === 1){
            return [3,1];
        } else if (board[x][y][0] === 2){
            return [3,2];
        } else if (board[x][y][1] === 1){
            return [2,1];
        } else if (board[x][y][1] === 2){
            return [2,2];
        } else if (board[x][y][2] === 1){
            return [1,1];
        } else if (board[x][y][2] === 2){
            return [1,2];
        } else {
            return [0,0];
        }
    }

    function updateBoard(){
        let newBoardColor = boardColor.slice();
        let newSize = boardSize.slice();
        for(let x = 0; x < 3; x++) {
            for(let y = 0; y < 3; y++) {
                let piece = checkForPiece(x,y);
                switch(piece[0]){
                    case 1:
                        newSize[x][y] = {padding: '37px'};
                        break;
                    case 2:
                        newSize[x][y] = {padding: '25px'};
                        break;
                    case 3:
                        newSize[x][y] = {padding: '0px'};
                        break;
                }
                switch(piece[1]){
                    case 0:
                       newBoardColor[x][y] = '/empty.png';
                        break;
                    case 1:
                        newBoardColor[x][y]  = '/redcircle.png';
                        break;
                    case 2:
                        newBoardColor[x][y]  = '/bluecircle.png';
                        break;
                }
            }
        }
        setBoardSize(newSize);
        setBoardColor(newBoardColor);
    }

    React.useEffect(() => {
        getGameInfo(localStorage.getItem('userName'), props.opp)
        .then((gameInfo) => {
            setGameID(gameInfo.game_id);
            setTurn(gameInfo.yourTurn);
            setBoard(gameInfo.board);
            setYourPieces(gameInfo.currentPieces);
            setOppPieces(gameInfo.oppCurrentPieces);
        })
    }, []);

    React.useEffect(() => {
        updateBoard();
        if(!yourTurn){
            setMessage(props.opp + "'s Turn");
        }
    }, [board]);

    React.useEffect(() => {
        Lobby.connect(gameID);
    }, [gameID]);

    function winFor(player){
        removeGame(localStorage.getItem('userName'), props.opp);
        if (player === 1){
            setMessage("You Win!");
            addWin(localStorage.getItem('userName'));
            addLoss(props.opp)
        } else {
            setMessage(props.opp + " Wins!");
            addWin(props.opp);
            addLoss(localStorage.getItem('userName'));
        }
    }

    function forfeit(){
        if (yourTurn){
            setTurn(false);
            winFor(2);
            Lobby.broadcastTurn(true, null, props.opp);
          }
    }

    function checkForWin() {
        let player1Win = false;
        let player2Win = false;
        for (let i = 0; i < 3; i++) {
          //Rows
          let lastNum = 0;
          let renzoku = 0;
          for (let j = 0; j < 3; j++) {
            const piece = checkForPiece(i, j);
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
            const piece = checkForPiece(j, i);
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
          const piece = checkForPiece(i, i);
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
          const piece = checkForPiece(i, 2 - i);
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
          winFor(1);
          return 1;
        } else if (player2Win && !player1Win){
          winFor(2);
          return 2;
        }
        return 0;
    }

    async function endYourTurn(){
        setTurn(false);
        await updateDatabase(yourTurn, board, yourPieces, oppPieces, localStorage.getItem('userName'), props.opp);
        setMessage(props.opp + "'s turn");
        const over = checkForWin();
        if (over === 1){
            Lobby.broadcastTurn(true, board, localStorage.getItem('userName'));
        } else if (over === 2){
            Lobby.broadcastTurn(true, board, props.opp);
        } else {
            Lobby.broadcastTurn(false, null, null);
        }
      }

    function moveBoardToBoard(old_x, old_y, old_info, x, y) {
        let newBoard = board.slice()
        switch(old_info[0]){
          case 1:
            newBoard[old_x][old_y][2] = 0;
            newBoard[x][y][2] = 1;
            break;
          case 2:
            newBoard[old_x][old_y][1] = 0;
            newBoard[x][y][1] = 1;
            break;
          case 3:
            newBoard[old_x][old_y][0] = 0;
            newBoard[x][y][0] = 1;
            break;
        }
        setBoard(newBoard);
        endYourTurn();
    }

    function movePieceToBoard(index, x, y) {
        let newBoard = board.slice()
        let newPieces = yourPieces.slice()

        switch(index){
          case 1:
            newBoard[x][y][0] = 1;
            newPieces[0] = 0;
            break;
          case 2:
            newBoard[x][y][1] = 1;
            newPieces[1] = 0;
            break;
          case 3:
            newBoard[x][y][1] = 1;
            newPieces[2] = 0;
            break;
          case 4:
            newBoard[x][y][2] = 1;
            newPieces[3] = 0;
            break;
          case 5:
            newBoard[x][y][2] = 1;
            newPieces[4] = 0;
            break;
          case 6:
            newBoard[x][y][2] = 1;
            newPieces[5] = 0;
            break;
        }

        setYourPieces(newPieces);
        setBoard(newBoard);
        endYourTurn();
    }

    function pressBoard(x, y)  {
        if (yourTurn){
            setMessage("Your Turn");
            const occupant = checkForPiece(x, y);
        
            if (selectedPiece === 0){
                if (occupant[0] > 0 && occupant[1] === 1){
                    setSelectedPiece(7 + y + (x * 3));
                }
            } else if (selectedPiece < 7) {
                if (occupant[0] === 0){
                    movePieceToBoard(selectedPiece, x, y);
                } else if (occupant[0] === 1 && selectedPiece < 4){
                    movePieceToBoard(selectedPiece, x,  y);
                } else if (occupant[0] === 2 && selectedPiece === 1){
                    movePieceToBoard(selectedPiece, x,  y);
                } else {
                    setSelectedPiece(0);
                    setMessage("Invalid Move");
                }
                setSelectedPiece(0);
            } else {
                const x_sel = Math.floor((selectedPiece - 7)/3);
                const y_sel = (selectedPiece - 7) % 3;
                const selectedOccupant = checkForPiece(x_sel, y_sel);
        
                if (selectedOccupant[0] > occupant[0]){
                    moveBoardToBoard(x_sel, y_sel, selectedOccupant, x, y);
                } else {
                    setMessage("Invalid Move");
                }
                setSelectedPiece(0);
            }
        }
    }

    function pressPiece(piece)  {
        if (yourTurn && yourPieces[piece]){
            setMessage("Your Turn");
            if (selectedPiece === 0){
                setSelectedPiece(piece + 1);
            } else if (selectedPiece < 7) {
                setSelectedPiece(piece + 1);
            } else {
                setSelectedPiece(0);
                setMessage("Can't return pieces");
            }
        }
    }

    return (
        <>
            <img src={oppPieces[0] ? '/bluecircle.png' : '/empty.png'} width="100"></img>
            <img id="1,1" className="board" src={ boardColor[0][0] } width="100" style={selectedPiece === 7 ? highlight : boardSize[0][0]} role="button" onClick={() => pressBoard(0,0)}></img>
            <img id="1,2" className="board" src={ boardColor[0][1] } width="100" style={selectedPiece === 8 ? highlight : boardSize[0][1]} role="button" onClick={() => pressBoard(0,1)}></img>
            <img id="1,3" className="board" src={ boardColor[0][2] } width="100" style={selectedPiece === 9 ? highlight : boardSize[0][2]} role="button" onClick={() => pressBoard(0,2)}></img>
            <img src={yourPieces[0] ? '/redcircle.png' : '/empty.png'} width="100" style={selectedPiece === 1 ? highlight : {}} role="button" onClick={() => pressPiece(0)}></img>
            <br></br>

            <img src={oppPieces[1] ? '/bluecircle.png' : '/empty.png'} width="50"></img>
            <img src={oppPieces[2] ? '/bluecircle.png' : '/empty.png'} width="50"></img>
            <img id="2,1" className="board" src={ boardColor[1][0] } width="100" style={selectedPiece === 10 ? highlight : boardSize[1][0]} role="button" onClick={() => pressBoard(1,0)}></img>
            <img id="2,2" className="board" src={ boardColor[1][1] } width="100" style={selectedPiece === 11 ? highlight : boardSize[1][1]} role="button" onClick={() => pressBoard(1,1)}></img>
            <img id="2,3" className="board" src={ boardColor[1][2] } width="100" style={selectedPiece === 12 ? highlight : boardSize[1][2]} role="button" onClick={() => pressBoard(1,2)}></img>
            <img src={yourPieces[1] ? '/redcircle.png' : '/empty.png'} width="50" style={selectedPiece === 2 ? highlight : {}} role="button" onClick={() => pressPiece(1)}></img>
            <img src={yourPieces[2] ? '/redcircle.png' : '/empty.png'} width="50" style={selectedPiece === 3 ? highlight : {}} role="button" onClick={() => pressPiece(2)}></img>
            <br></br>

            <img src={oppPieces[3] ? '/bluecircle.png' : '/empty.png'} width="25"></img>
            <img src={oppPieces[4] ? '/bluecircle.png' : '/empty.png'} width="25"></img>
            <img src={oppPieces[5] ? '/bluecircle.png' : '/empty.png'} width="25"></img>
            <img id="3,1" className="board" src={ boardColor[2][0] } width="100" style={selectedPiece === 13 ? highlight : boardSize[2][0]} role="button" onClick={() => pressBoard(2,0)}></img>
            <img id="3,2" className="board" src={ boardColor[2][1] } width="100" style={selectedPiece === 14 ? highlight : boardSize[2][1]} role="button" onClick={() => pressBoard(2,1)}></img>
            <img id="3,3" className="board" src={ boardColor[2][2] } width="100" style={selectedPiece === 15 ? highlight : boardSize[2][2]} role="button" onClick={() => pressBoard(2,2)}></img>
            <img src={yourPieces[3] ? '/redcircle.png' : '/empty.png'} width="25" style={selectedPiece === 4 ? highlight : {}} role="button" onClick={() => pressPiece(3)}></img>
            <img src={yourPieces[4] ? '/redcircle.png' : '/empty.png'} width="25" style={selectedPiece === 5 ? highlight : {}} role="button" onClick={() => pressPiece(4)}></img>
            <img src={yourPieces[5] ? '/redcircle.png' : '/empty.png'} width="25" style={selectedPiece === 6 ? highlight : {}} role="button" onClick={() => pressPiece(5)}></img>
            <br></br>
            <br></br>
            <p className="turn-info">{ message }</p>
            <Button variant='secondary' onClick={() => forfeit()}>
                Forfeit
            </Button>
        </>
    );
}