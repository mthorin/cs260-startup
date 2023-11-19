const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const config = require('./dbConfig.json');
//const uri = "mongodb+srv://${config.userName}:${config.password}@${config.hostname}/?retryWrites=true&w=majority";
const uri = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(uri);

const db = client.db('startup');
const gameCollection = db.collection('games');
const userCollection = db.collection('users');

(async function testConnection() {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
})().catch((ex) => {
  console.log(`Unable to connect to database with ${uri} because ${ex.message}`);
  process.exit(1);
});

function getUser(username) {
  return userCollection.findOne({ username: username });
}

async function getWinLoss(username) {
  const user = await userCollection.findOne({ username: username });
  return [user.win, user.loss];
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
    win: 0,
    loss: 0,
    //color: "red",
  };
  await userCollection.insertOne(user);

  return user;
}

async function getGames(username) {
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
  const game = await gameCollection.findOne(query);

  if (!game){
    return game;
  }

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
    game.board = switchBoardNumbers(game.board);
  }

  const gameState = {
    game_id: game._id,
    yourTurn: yourTurn, 
    board: board, 
    currentPieces: currentPieces, 
    oppCurrentPieces, oppCurrentPieces,
  };

  return gameState;
}

async function updateGameState(username, opponent, gameState) {
  const query = { player1: { $in: [username, opponent] }, player2: { $in: [username, opponent] } };
  const game = await gameCollection.findOne(query);

  game.board = gameState.board;
  game.turn = opponent;
  if (game.player1 === username){
    game.player1Pieces = gameState.currentPieces;
    game.player2Pieces = gameState.oppCurrentPieces;
  } else {
    game.player2Pieces = gameState.currentPieces;
    game.player1Pieces = gameState.oppCurrentPieces;
    game.board = switchBoardNumbers(game.board);
  }

  await gameCollection.findOneAndReplace(query, game);
}

function switchBoardNumbers(board) {
  for (let i = 0; i < 3; i++){
    for (let j = 0; j < 3; j++){
      for (let k = 0; k < 3; k++){
        if (board[i][j][k] === 1){
          board[i][j][k] = 2;
        } else if (board[i][j][k] === 2){
          board[i][j][k] = 1;
        }
      }
    }
  }
  return board;
}

async function newGame(username, opponent) {
  const game = {
    player1: username,
    player2: opponent,
    turn: username,
    board: [
      [[0,0,0],
       [0,0,0],
       [0,0,0]],
      [[0,0,0],
       [0,0,0],
       [0,0,0]],
      [[0,0,0],
       [0,0,0],
       [0,0,0]]],
    player1Pieces: [1,1,1,1,1,1],
    player2Pieces: [1,1,1,1,1,1]
  };

  await gameCollection.insertOne(game);
}

async function addWin(username) {
  let user = await userCollection.findOne({ username: username });
  user.win++;
  await userCollection.findOneAndReplace({ username: username }, user);
}

async function addLoss(username) {
  let user = await userCollection.findOne({ username: username });
  user.loss++;
  await userCollection.findOneAndReplace({ username: username }, user);
}

async function removeGame(username, opponent){
  await gameCollection.deleteOne({ player1: { $in: [username, opponent] }, player2: { $in: [username, opponent] } });
}

module.exports = { 
  getGames, 
  getGameState, 
  updateGameState, 
  getUser, 
  getUserByToken, 
  createUser, 
  newGame, 
  addWin, 
  addLoss, 
  removeGame,
  getWinLoss,
};