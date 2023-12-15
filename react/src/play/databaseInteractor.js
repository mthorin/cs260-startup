export function addWin(player){
    fetch('/api/user/win', {
        method: 'post',
        body: JSON.stringify({ username: player}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
}

export function addLoss(player){
    fetch('/api/user/loss', {
        method: 'post',
        body: JSON.stringify({ username: player}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
}

export function removeGame(player1, player2){
    fetch('/api/game/end', {
        method: 'post',
        body: JSON.stringify({ player1: player1, player2: player2}),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
}

export async function getGameInfo(player1, player2){
    let gameInfo = [];
    const response = await fetch('/api/game/load/' + player1 + '/' + player2);
    gameInfo = await response.json();
    return gameInfo;
}

export async function updateDatabase(yourTurn, board, yourPieces, oppPieces, player1, player2){
    const currGameInfo = {yourTurn: yourTurn, board: board, currentPieces: yourPieces, 
        oppCurrentPieces: oppPieces};
  
      await fetch('/api/game/update/' + player1 + '/' + player2, {
          method: 'POST',
          body: JSON.stringify(currGameInfo),
          headers: {'Content-type': 'application/json'},
      })
      .catch(err => {
        console.log(err);
     });
}