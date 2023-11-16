const express = require('express');
const app = express();
const DB = require('./database.js');

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// GetGames
apiRouter.get('/login/:username', async (req, res) => {
    const games = await DB.getGames(req.params.username);
    console.log("Loaded games for " + req.params.username);
    await res.send(games);
});

// GetGameState
apiRouter.get('/game/load/:username/:opponent', async (req, res) => {
    const gameState = await DB.getGameState(req.params.username, req.params.opponent);
    console.log("Loaded game between " + req.params.username + " and " + req.params.opponent);
    await res.send(gameState);
});

//UpdateGameState
apiRouter.post('/game/update/:username/:opponent', async (req, res) => {
    try{
      await DB.updateGameState(req.params.username, req.params.opponent, req.body);
      console.log("Game between " + req.params.username + " and " + req.params.opponent + " saved.")
      res.send("Updated successfully");
    } catch {
      console.log("Save failed.")
      res.send("Update unsuccessful");
    }
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});