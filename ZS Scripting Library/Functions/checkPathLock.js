var paths = {
    path1: [],
    path2: [],
    path3: [],
};

/** Checks if player is able to access provided path
 * @param {IPlayer} player 
 * @param {String} pathName 
 * @returns {Boolean}
 */
function isPathLocked(player, pathName)
{
    if(!lib.isPlayer(player)) return;
    var playerForms = player.getDBCPlayer().getCustomForms();
    // Check each player form for path compatability
    for(var i in playerForms) {
        if(!playerForms[i]) continue;
        var form = playerForms[i].getName();
        // Player locked if trying to access SSJ1 path with FPSSJ+ unlocked
        if(pathName == "SSJ1PATH" && paths.SSJFORMS.indexOf(form) < 0) {
            displayFormWarning(player, form, pathName);
            return true;
        }
        for(var p in paths) {
            // If form exists on another path lock player
            if(p == pathName || p == "SSJFORMS") continue;
            if(paths[p].indexOf(form) >= 0) {
                displayFormWarning(player, form, pathName);
                return true;
            }
        }
    }
    // Return false if player is not locked
    return false;
}

/** Displays an error message to the player saying why they are path locked
 * @param {IPlayer} player 
 * @param {String} form 
 * @param {String} path 
 */
function displayFormWarning(player, form, path) 
{
    var GUI = API.createCustomGui(134, 255, 200, false);
    GUI.setBackgroundTexture("jinryuumodscore:gui/training1gui.png");
    var shadow = GUI.addLabel(1, "Cannot access path " + path + " due to conflict with form " + form, 26, 31, 105, 100);
    shadow.setColor(0);
    shadow.setScale(1.4);
    var label = GUI.addLabel(2, "Cannot access path " + path + " due to conflict with form " + form, 25, 30, 105, 100);
    label.setColor(16711680);
    label.setScale(1.4);
    GUI.addButton(3, "Ok", 77, 110, 100, 20);
    player.showCustomGui(GUI);
}

// Global Script to close popup
function customGuiButton(event)
{
    if(event.getGui().getID() == 134) event.player.closeGui();
}
