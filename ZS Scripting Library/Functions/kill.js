/** Command kills a player
 * @param {(IPlayer | String)} player
 * @returns Boolean - If the player was killed
 */
function kill(player){
    if(typeof player == "string") player = API.getPlayer(player);
    if(!isPlayer(player)) return false;
    API.executeCommand(player.world, "kill " + player.getName());
    return true;
}