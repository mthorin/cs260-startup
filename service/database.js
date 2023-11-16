const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('./dbConfig.json');
//const uri = "mongodb+srv://${config.userName}:${config.password}@${config.hostname}/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
/**
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
*/
const client = new MongoClient(uri);

const db = client.db('startup');
const gameCollection = db.collection('games');

(async function testConnection() {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
})().catch((ex) => {
  console.log(`Unable to connect to database with ${uri} because ${ex.message}`);
  process.exit(1);
});

async function getGames(username) {
  //Comment put later
  username = 'user';
  //
  const query = { $or: [{ player1: username }, { player2: username }] };
  const cursor = gameCollection.find(query);
  const games = await cursor.toArray();

  const gameInfo = [];
  games.forEach((i) => {
    let opp = "Unknown";
    let yourTurn = false;
    if (i.turn === username){
      yourTurn = true;
    }
    if (i.player1 === username){
      opp = i.player2;
    } else {
      opp = i.player1;
    }
    gameInfo.push({opp: opp, yourTurn: yourTurn});
  });
  
  return gameInfo;
}

async function getGameState(username, opponent) {
  const query = { player1: { $in: [username, opponent] }, player2: { $in: [username, opponent] } };
  const cursor = gameCollection.find(query);
  let games = await cursor.toArray();

  console.log(games);

  //Comment out later
  if (games.length === 0){
    const newQuery = { player1: { $in: ['user', opponent] }, player2: { $in: ['user', opponent] } };
    const newCursor = gameCollection.find(newQuery);
    games = await newCursor.toArray();

    console.log(games);
    if (games[0].player1 === 'user'){
      games[0].player1 = username;
    }
    if (games[0].player2 === 'user'){
      games[0].player2 = username;
    }
    if (games[0].turn === 'user'){
      games[0].turn = username;
    }
    delete games[0]._id;
    await gameCollection.insertOne(games[0]);
  }
  //

  const game = games[0];
  let yourTurn = false;
  const board = game.board;
  let currentPieces = [];
  let oppCurrentPieces = [];
  if (game.turn === username ){
    yourTurn = true;
  }
  if (game.player1 === username){
    currentPieces = game.player1Pieces;
    oppCurrentPieces = game.player2Pieces;
  } else {
    currentPieces = game.player2Pieces;
    oppCurrentPieces = game.player1Pieces;
  }

  const gameState = {yourTurn: yourTurn, board: board, currentPieces: currentPieces, oppCurrentPieces, oppCurrentPieces};

  return gameState;
}

async function updateGameState(username, opponent, gameState) {
  const query = { player1: { $in: [username, opponent] }, player2: { $in: [username, opponent] } };
  const cursor = gameCollection.find(query);
  const games = await cursor.toArray();
  game = games[0];

  game.board = gameState.board;
  game.turn = opponent;
  if (game.player1 === username){
    game.player1Pieces = gameState.currentPieces;
    game.player2Pieces = gameState.oppCurrentPieces;
  } else {
    game.player2Pieces = gameState.currentPieces;
    game.player1Pieces = gameState.oppCurrentPieces;
  }

  await gameCollection.findOneAndReplace(query, game);
}

module.exports = { getGames, getGameState, updateGameState };