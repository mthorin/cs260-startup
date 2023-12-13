import React from 'react';

import { Unauthenticated } from './unauthenticated.jsx';
import { Authenticated } from './authenticated.jsx';
import { AuthState } from './authState.js';

export function Login({ userName, authState, onAuthChange }) {
    const [quote, setQuote] = React.useState('Loading...');
    const [quoteAuthor, setQuoteAuthor] = React.useState('unknown');

    React.useEffect(() => {
        fetch('https://api.quotable.io/random')
            .then((response) => response.json())
            .then((data) => {
                setQuote(data.content);
                setQuoteAuthor(data.author);
            })
            .catch();
    }, []);

    return (
        <main className='container-fluid bg-secondary text-center'>
        <div>
            {authState !== AuthState.Unknown && <h1>Accept the Challenge</h1>}
            {authState === AuthState.Authenticated && (
            <Authenticated userName={userName} onLogout={() => onAuthChange(userName, AuthState.Unauthenticated)} />
            )}
            {authState === AuthState.Unauthenticated && (
            <Unauthenticated
                userName={userName}
                onLogin={(loginUserName) => {
                onAuthChange(loginUserName, AuthState.Authenticated);
                }}
            />
            )}
        </div>
        <div id="quote" className='quote-box bg-light text-dark'>
          <p className='quote'>{quote}</p>
          <p className='author'>{quoteAuthor}</p>
        </div>
        </main>
    );
}