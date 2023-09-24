# Advanced TicTacToe Online

## Description deliverable

### Elevator pitch

Have you everwished TicTacToe was a more compelling competitive experience? Advanced TicTacToe online provides a more advanced version of TicTacToe, with compelling gameplay and online multiplayer functionality. Every turn is saved to the  online  server, so  players can leave and comeback to take their turn when convinient.

### Design

![Mock](Mock-tictactoe.png)

### Key features

- Secure login over HTTPS
- Ability to select color of pieces
- Ability to leave and come back later to finish the game
- Updates opponents moves in real time
- Option to forfeit
- Win Lose record saved by the  server

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Uses correct HTML structure for application. Three HTML pages. One for login, one for selecting game, one for gameplay.
- **CSS** - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
- **JavaScript** - Provides login, game display, changing color, display other users moves.
- **Service** - Backend service with endpoints for:
  - login
  - retrieving opponent moves
  - submitting moves
  - retrieving win lose record
- **DB** - Store users, win loss record, and moves in database.
- **Login** - Register and login users. Credentials securely stored in database. Can't play unless authenticated.
- **WebSocket** - As each user plays, their moves are updated to other player.
- **React** - Application ported to use the React web framework.
