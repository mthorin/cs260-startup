function loadGames() {

  //Update player name
  const playerName = document.querySelector('.player-name');
  playerName.textContent = getPlayerName();

  //Load games from storage
  let games = [];
  const gamesJSON = localStorage.getItem('games');
  if (gamesJSON) {
    games = JSON.parse(gamesJSON);
  }

  const gamesDisplay = document.getElementById('games');

  if (games.length) {
    games.forEach((game) => {
      let opp = "Unknown";
      let yourTurn = false;

      //Extract  values
      for (const [key, value] of Object.entries(game)) {
        if (key  ===  'yourTurn'){
          yourTurn = value;
        } else {
          opp = value;
        }
      }

      const versus = document.createElement('a');
      const turn = document.createElement('a');

      versus.href = "play.html?opp=" + encodeURIComponent(opp);
      versus.className =  "nav-link";
      turn.href = "play.html?opp=" + encodeURIComponent(opp);
      turn.className =  "nav-link";

      versus.textContent = 'Vs. ' + opp;
      if (yourTurn){
        turn.textContent = 'Your Turn';
      } else  {
        turn.textContent = opp + '\'s Turn';
      }

      const gameInfo = document.createElement('div');
      gameInfo.className = "card";
      //gameInfo.setAttribute("onclick", 'launchGame(opp)'');
      gameInfo.appendChild(versus);
      gameInfo.appendChild(turn);

      gamesDisplay.appendChild(gameInfo);
    });
  }

  //New game button
  const newGame = document.createElement('a');
  newGame.textContent = 'New Game';
  newGame.className = "nav-link";
  newGame.href = "play.html?opp=none";
  const newGameButton = document.createElement('div');
  newGameButton.className = "card";
  //newGameButton.setAttribute("onclick", launchNewGame);
  newGameButton.appendChild(newGame);
  gamesDisplay.appendChild(newGameButton);
}

function getPlayerName() {
  return localStorage.getItem('userName') ?? 'Mystery player';
}
