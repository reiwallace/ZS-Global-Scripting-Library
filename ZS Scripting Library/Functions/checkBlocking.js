/** Returns if a player is either sword blocking or dbc blocking
 * @param {IPlayer} player 
 * @returns Boolean
 */
function checkBlocking(player)
{
    if(!lib.isPlayer(player)) return false;
    return player.blocking() || player.getDBCPlayer().isBlocking();
}