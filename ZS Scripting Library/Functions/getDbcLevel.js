/** Returns player's dbc level
 * @param {IPlayer} player 
 * @returns {Int} - player's dbc level
 */
function getDbcLevel(player)
{
    if(!lib.isPlayer(player)) return 0;
    var stats = player.getDBCPlayer().getAllAttributes();
    var totalStats = -55;
    for (var i = 0; i < stats.length; i++) totalStats += stats[i];
    return Math.floor(totalStats / 5);
}