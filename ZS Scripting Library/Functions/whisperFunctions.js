/** Mimics a whisper message
 * @param {IPlayer} player 
 * @param {String} from - Sending name
 * @param {String} message 
 */
function whisper(player, from, message) {
    if(typeof player == "string") player = API.getPlayer(player);
    if(!lib.isPlayer(player)) return;
    player.sendMessage("\u00A76[" + from + "§r\u00A76 -> \u00A7cme\u00A76]§r " + message);
}

/** Mimics a whisper message and sends to every player currently online
 * @param {String} from - Sending name
 * @param {String} message 
 */
function whisperAll(from, message) {
    var players = API.getIWorld(0).getAllServerPlayers();
    for (var i = 0; i < players.length; i++) {
        if(!players[i]) continue;
        lib.whisper(players[i], from, message);
    }
}