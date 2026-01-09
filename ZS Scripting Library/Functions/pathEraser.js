/** Checks if player has valid quest ID then nukes all path forms
 * @param {IPlayer} player 
 */
function pathEraser(player) 
{
    if(!lib.isPlayer(player)) return;
    // Check if any valid quest ids are present, return if not
    for(var i in libEraserIds) {
        if(i == "PASSFLAG") return;
        if(player.hasActiveQuest(libEraserIds[i])) {
            player.finishQuest(libEraserIds[i]);
            player.stopQuest(libEraserIds[i]);
            break;
        }
    }

    // Cycles through player forms on each path and removes any found
    var dbcPlayer = player.getDBCPlayer();
    var playerForms = dbcPlayer.getCustomForms();
    // Check each player form for path compatability
    for(var i in playerForms) {
        if(!playerForms[i]) continue;
        var form = playerForms[i].getName();
        dbcPlayer.removeCustomForm(form);
    }
    API.executeCommand(player.getWorld(), "dbcskill take OldKaiUnlock " + player.getName());
}