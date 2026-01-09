/** Checks if player is able to access provided path
 * @param {IPlayer} player 
 * @param {String} pathName 
 * @returns {Boolean}
 */
function isPathLocked(player, pathName)
{
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
        label.setColor(16777215);
        label.setScale(1.4);
        GUI.addButton(3, "Ok", 77, 110, 100, 20);
        player.showCustomGui(GUI);
    }
    
    if(!lib.isPlayer(player)) return;
    var playerForms = player.getDBCPlayer().getCustomForms();
    var race = player.getDBCPlayer().getRaceName();
    if(race == "Half-Saiyan") race = "Saiyan";
    if(!(pathName in libPaths[race])) {
        displayFormWarning(player, "incorrect race", pathName);
        return true;
    }
    
    var isStrict = libPaths.STRICTPATHS.indexOf(pathName) >= 0;

    // Check each player form for path compatability
    for(var i in playerForms) {
        if(!playerForms[i]) continue;
        var form = playerForms[i].getName();
        if(
            libPaths.GLOBALSTRICT.indexOf(form) < 0 && 
            libPaths[race][pathName].indexOf(form) < 0 && 
            (
                isStrict || 
                (libPaths[race][race].indexOf(form) < 0 && 
                libPaths.GLOBALNONSTRICT.indexOf(form) < 0)
            )) {
                displayFormWarning(player, form, pathName);
                return true;
        }
    }

    // Return false if player is not locked
    return false;
}