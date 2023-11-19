const express = require('express');
const app = express();
const DB = require('./database.js');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const authCookieName = 'token';

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());
app.use(cookieParser());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.username, req.body.password);
    setAuthCookie(res, user.token);
    res.send({
      id: user._id,
    });
  }
});

// GetAuth
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.username);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetUser
apiRouter.get('/user/:username', async (req, res) => {
  const user = await DB.getUser(req.params.username);
  if (user) {
    const token = req?.cookies.token;
    res.send({ username: user.username, authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  //console.log("Authorizing...");
  authToken = req.cookies[authCookieName];
  //console.log(req.cookies);
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    //console.log("Unauthorized")
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

secureApiRouter.get('/user/wlratio/:username', async (req, res) => {
    const wlratio = await DB.getWinLoss(req.params.username);
    console.log(wlratio);
    res.send(wlratio);
});

secureApiRouter.post('/user/win', async (req, res) => {
  DB.addWin(req.body.username);
  res.send("Win added");
});

secureApiRouter.post('/user/loss', async (req, res) => {
  DB.addLoss(req.body.username);
  res.send("Loss added");
});

secureApiRouter.post('/game/end', async (req, res) => {
  console.log("Game ending between " + req.body.player1 + " and " + req.body.player2 + ".");
  DB.removeGame(req.body.player1, req.body.player2);
  res.send("Game removed");
});

//NewGame
secureApiRouter.post('/game/new', async (req, res) => {
  const user = await DB.getUser(req.body.opponent);
  if (user) {
    const game = await DB.getGameState(req.body.username, req.body.opponent);
    if (game) {
      res.status(404).send({ msg: 'Already playing aginst this Player' });
      return;
    }
    DB.newGame(req.body.username, req.body.opponent);
    console.log("Creating a new game between " + req.body.username + " and " + req.body.opponent + ".");
    res.send('Good');
    return;
  }
  res.status(404).send({ msg: 'Unknown Player' });
});

// GetGames
secureApiRouter.get('/game/list/:username', async (req, res) => {
    const games = await DB.getGames(req.params.username);
    console.log("Loaded games for " + req.params.username);
    await res.send(games);
});

// GetGameState
secureApiRouter.get('/game/load/:username/:opponent', async (req, res) => {
    const gameState = await DB.getGameState(req.params.username, req.params.opponent);
    console.log("Loaded game between " + req.params.username + " and " + req.params.opponent);
    await res.send(gameState);
});

//UpdateGameState
secureApiRouter.post('/game/update/:username/:opponent', async (req, res) => {
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

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
