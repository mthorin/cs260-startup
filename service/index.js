const express = require('express');
const app = express();


const Games = [
    { opp: "Tim", yourTurn: true },
    { opp: "Hannah", yourTurn: false },
    { opp: "Billy", yourTurn: true}
  ];

const Tim = {
  yourTurn: true,
  board: [
    [[1,0,0],
     [0,0,0],
     [2,0,0]],
    [[0,0,0],
     [0,0,0],
     [0,0,0]],
    [[0,0,0],
     [0,0,0],
     [0,0,0]]],
  currentPieces: [0,1,1,1,1,1],
  oppCurrentPieces: [0,1,1,1,1,1]
}

const Hannah = {
  yourTurn: false,
  board: [
    [[1,0,2],
     [0,0,1],
     [0,0,2]],
    [[0,1,2],
     [0,2,1],
     [0,1,0]],
    [[0,2,0],
     [0,0,1],
     [2,0,0]]],
  currentPieces: [0,0,0,0,0,0],
  oppCurrentPieces: [0,0,0,0,0,0]
}

const Billy = {
  yourTurn: true,
  board: [
    [[0,0,0],
     [0,0,0],
     [0,0,0]],
    [[0,0,0],
     [2,0,0],
     [0,0,0]],
    [[0,0,0],
     [0,0,0],
     [0,0,0]]],
  currentPieces: [1,1,1,1,1,1],
  oppCurrentPieces: [0,1,1,1,1,1]
}

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
apiRouter.get('/login/:username', (req, res) => {
    //TODO: interact with database
    res.send(Games);
});

// GetGameState
apiRouter.get('/game/load/:username/:opponent', (req, res) => {
    //TODO: interact with database
    if (req.params.opponent === "Tim") {
        res.send(Tim);
    } else if (req.params.opponent === "Billy") {
        res.send(Billy);
    } else if (req.params.opponent === "Hannah") {
        res.send(Hannah);
    }
});

//UpdateGameState
apiRouter.post('/game/update/:username/:opponent', (req, res) => {
    //TODO: interact with database
    console.log("Game between " + req.params.username + " and " + req.params.opponent + " saved.")
    res.send("Updated successfully");
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});