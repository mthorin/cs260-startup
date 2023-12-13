module.exports = class GameConnections{
    game_id;
    client1;
    client2;

    constructor(game_id, client) {
        this.game_id = game_id;
        this.client1 = client;
        this.client2 = null;
    }

    addClient(client){
        if (this.client2){
            return -1;
        } else {
            if (client.id !== this.client1.id){
                this.client2 = client;
                return 1;
            }
        }
    }

    removeClient(client){
        if (this.client2){
            if (this.client1.id === client.id){
                this.client1 = this.client2;
                this.client2 = null;
                return 1;
            } else if (this.client2.id === client.id){
                this.client2 = null;
                return 1;
            }
        } else {
            if (this.client1.id === client.id){
                this.client1 = null;
                return 0;
            }
        }
    }

    getClients(){
        if (this.client2){
            return [this.client1, this.client2];
        } else {
            return [this.client1];
        }
    }

    getGameID(){
        return this.game_id;
    }
}