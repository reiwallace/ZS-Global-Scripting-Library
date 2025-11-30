/**
 * Broadcasts a message to all players on the server.
 * @param {IWorld} world - The world object.
 * @param {string} message - The message to send.
 */
function messageAll(world, message) {
    var players = world.getAllServerPlayers();
    for (var i = 0; i < players.length; i++) {
        if(!players[i]) continue;
        players[i].sendMessage(message);
    }
}