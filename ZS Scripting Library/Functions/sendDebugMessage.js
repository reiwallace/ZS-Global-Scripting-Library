/** Sends a message to a player
 * @param {IPlayer} playerName 
 * @param {String} text 
 */
function sendDebugMessage(playerName, text) {
    API.getPlayer(playerName).sendMessage(text);
}