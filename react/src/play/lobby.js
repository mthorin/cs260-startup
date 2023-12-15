const Turn = {
  System: 'system',
  End: 'gameEnd',
  Turn: 'turnTaken',
};

class LobbyManager {
  constructor() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    this.socket.onmessage = async (event) => {
      const move = JSON.parse(await event.data.text());
      if (move.gameOver) {
        this.processGameEnd(move.board, move.winner);
      } else {
        this.getGameInfo();
      }
    };
  }

  async connect(game_id) {
    const linkPacket = {
      type: "link",
      game_id: game_id,
    };
    await new Promise(r => setTimeout(r, 2000));
    this.socket.send(JSON.stringify(linkPacket));
  }

  broadcastTurn(gameOver, board, winner) {
    const move = {
      type: "move",
      gameOver: gameOver,
      board: board,
      winner: winner,
    };
    this.socket.send(JSON.stringify(move));
  }
}

const Lobby = new LobbyManager();
export { Turn, Lobby };