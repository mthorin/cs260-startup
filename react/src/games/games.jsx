import React from 'react';

import './games.css';
import { useNavigate } from 'react-router-dom';

export function Games() {
  const [games, setGames] = React.useState([]);
  const navigate = useNavigate();

  function launchGame(opp) {
    navigate('/play?opp=' + opp);
  }

  React.useEffect(() => {
    fetch('/api/game/list/' + localStorage.getItem('userName'))
      .then((response) => response.json())
      .then((games) => {
        setGames(games)
        localStorage.setItem('games', games);
      })
      .catch((e) => {
        console.log(e);
        const gamesJSON = localStorage.getItem('games');
        if (gamesJSON) {
          setGames(JSON.parse(gamesJSON));
        }
      });
  }, []);

  const gameList = [];
  if (games.length) {
    for (const [i, gameData] of games.entries()) {
      gameList.push(
        <div key={i} className="card" onClick={() => launchGame(gameData.opp)}>
          <a>Vs. {gameData.opp}</a>
          <a>{ gameData.yourTurn ? "Your Turn" : gameData.opp + "'s Turn" }</a>
        </div>
      );
    }
  } else {
    gameList.push(
      <a key="0">No games yet!</a>
    );
  }

  return (
    <main className='container-fluid bg-secondary'>
      <div className="games" id="games"> { gameList } </div>
    </main>
  );
}