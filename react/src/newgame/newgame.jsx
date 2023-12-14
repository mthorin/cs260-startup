import React from 'react';

import Button from 'react-bootstrap/Button';
import {MessageDialog} from './messageDialog';
import { useNavigate } from 'react-router-dom';

export function NewGame() {
  const [userName, setUserName] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);
  const navigate = useNavigate();

  async function createNewGame() {
    const response = await fetch('/api/game/new', {
      method: 'post',
      body: JSON.stringify({ username: localStorage.getItem('userName'), opponent: userName }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      navigate('/play?opp=' + userName);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <main className='container-fluid bg-secondary text-center'>
      <h2>Enter your opponent's username</h2>
      <div>
        <div className='input-group mb-3'>
          <span className='input-group-text'>👤</span>
          <input
            className='form-control'
            type='text'
            onChange={(e) => setUserName(e.target.value)}
            placeholder='username'
          />
        </div>
        <Button variant='primary' onClick={() => createNewGame()}>
          Create Game
        </Button>
      </div>

      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </main>
  );
}