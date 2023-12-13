import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login.jsx';
import { Play } from './play/play.jsx';
import { Games } from './games/games.jsx';
import { NewGame } from './newgame/newgame.jsx';
import { AuthState } from './login/authState.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    return (
        <BrowserRouter>
            <div className='body bg-dark text-light'>
            <header className='container-fluid'>
                <nav className='navbar fixed-top navbar-dark'>
                <div className='navbar-brand'>
                    Tic Tac Toe
                </div>
                <menu className='navbar-nav'>
                    <li className='nav-item'>
                    <NavLink className='nav-link' to=''>
                        Login
                    </NavLink>
                    </li>
                    {authState === AuthState.Authenticated && (
                        <li className='nav-item'>
                        <NavLink className='nav-link' to='games'>
                            Games
                        </NavLink>
                        </li>
                    )}
                    {authState === AuthState.Authenticated && (
                        <li className='nav-item'>
                        <NavLink className='nav-link' to='play'>
                            Current Game
                        </NavLink>
                        </li>
                    )}
                    {authState === AuthState.Authenticated && (
                        <li className='nav-item'>
                        <NavLink className='nav-link' to='newgame'>
                            New Game
                        </NavLink>
                        </li>
                    )}
                </menu>
                <div className="player">
                    <span className="player-name">Mystery player</span>
                </div>
                </nav>
            </header>
        
            <Routes>
                <Route
                    path='/'
                    element={
                    <Login
                        userName={userName}
                        authState={authState}
                        onAuthChange={(userName, authState) => {
                        setAuthState(authState);
                        setUserName(userName);
                        }}
                    />
                    }
                    exact
                />
                <Route path='/play' element={<Play />} />
                <Route path='/games' element={<Games />} />
                <Route path='/newgame' element={<NewGame />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        
            <footer className='bg-dark text-white-50'>
                <div className='container-fluid'>
                <span className='text-reset'>Matthew Thorin</span>
                <a className="text-reset" href="https://github.com/mthorin/startup">Github</a>
                </div>
            </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;