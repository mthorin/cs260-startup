import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    return (
        <div className='body bg-dark text-light'>
        <header className='container-fluid'>
            <nav className='navbar fixed-top navbar-dark'>
            <div className='navbar-brand'>
                Tic Tac Toe
            </div>
            <menu className='navbar-nav'>
                <li className='nav-item'>
                <a className='nav-link' href='index.html'>
                    Home
                </a>
                </li>
                <li className='nav-item'>
                <a className='nav-link' href='select.html'>
                    Games
                </a>
                </li>
                <li className='nav-item'>
                <a className='nav-link' href='play.html'>
                    Current Game
                </a>
                </li>
                <li className='nav-item'>
                <a className='nav-link' href='newgame.html'>
                    New Game
                </a>
                </li>
            </menu>
            <div class="player">
                <span class="player-name">Mystery player</span>
            </div>
            </nav>
        </header>
    
        <main>App components go here</main>
    
        <footer className='bg-dark text-white-50'>
            <div className='container-fluid'>
            <span className='text-reset'>Matthew Thorin</span>
            <a className="text-reset" href="https://github.com/mthorin/startup">Github</a>
            </div>
        </footer>
        </div>
    );
}