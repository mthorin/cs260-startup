import React from 'react';

import './play.css';
import { Players } from './players.jsx';
import { Board } from './board.jsx';

export function Play() {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  return (
    <main className="container-fluid bg-secondary text-center">
      <Players opp={urlParams.get('opp')}/>
      <Board opp={urlParams.get('opp')}/>
    </main>
  );
}