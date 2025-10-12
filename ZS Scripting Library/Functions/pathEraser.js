/** Checks if player has valid quest ID then nukes all path forms
 * @param {IPlayer} player 
 */
function pathEraser(player) 
{
    // EDIT WITH VALID QUEST AND ID
    var validQuestIds = {
        quest1: 7,
        quest2: 8,
        quest3: 9,
        PASSFLAG: false // DO NOT EDIT
    }

    if(!lib.isPlayer(player)) return;
    // Check if any valid quest ids are present, return if not
    for(var i in validQuestIds) {
        if(i == "PASSFLAG") return;
        if(player.hasActiveQuest(validQuestIds[i])) {
            player.finishQuest(validQuestIds[i]);
            player.stopQuest(validQuestIds[i]);
            break;
        }
    }
    lib.debugMessage("Noxiiie", "PASS");
    // Cycles through player forms on each path and removes any found
    var dbcPlayer = player.getDBCPlayer();
    var playerForms = dbcPlayer.getCustomForms();
    // Check each player form for path compatability
    for(var i in playerForms) {
        if(!playerForms[i]) continue;
        var form = playerForms[i].getName();
        for(var p in paths) {
            if(paths[p].indexOf(form) < 0) continue;
            dbcPlayer.removeCustomForm(form);
        }
    }
}