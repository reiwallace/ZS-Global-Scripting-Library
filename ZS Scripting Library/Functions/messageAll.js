/**
 * Broadcasts a message to all players on the server.
 * @param {String} message - The message to send.
 */
function messageAll(message) {
    var players = API.getIWorld(0).getAllServerPlayers();
    for (var i = 0; i < players.length; i++) {
        if(!players[i]) continue;
        players[i].sendMessage(message);
    }
}