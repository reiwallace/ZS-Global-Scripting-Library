/** Command kills a player
 * @param {IPlayer} player 
 * @returns Boolean - If the player was killed
 */
function kill(player){
    if(!isPlayer(player)) return false;
    API.executeCommand(player.world, "kill " + player.getName());
    return true;
}