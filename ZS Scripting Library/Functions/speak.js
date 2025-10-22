/**
 * Places a speech overlay on the player's screen.
 *
 * @param {IPlayer} player - The player object on whose screen the overlay will be displayed.
 * @param {string} text - The text to display on the player's screen.
 * @param {string} speakID - The ID of the text overlay.
 * @param {Int} timeout - Duration to display overlay for.
 * @param {string} [color] - The color of the text in hexadecimal format.
 * @param {Boolean} [hasShadow] - If the text should have a black shadow
 * @param {number} [size] - The font size of the text.
 * @param {Boolean} [noCenter] - If the overlay should be centered
 * @param {Int} [xOffset] - Horizontal offset from centre of screen
 * @param {Int} [yOffset] - Vertical offset from centre of screen
 */
function speak(player, text, speakID, timeout, color, hasShadow, size, noCenter, xOffset, yOffset) 
{ 
    function closeOverlay(action) {
        var data = action.getData("speakData");
        if(!data) {
            action.markDone();
            return;
        };
        data.player.closeOverlay(data.id); 
        action.markDone();
    }

    if(!lib.isPlayer(player)) return;
    var speechOverlay = API.createCustomOverlay(speakID); // Create overlay with id
    var size = typeof size == "number" ? size : 1
    var x = (noCenter ? 0 : 480 - (Math.floor((text.length) * 2.5) * size)) + (typeof xOffset == "number" ? yOffset : 0); // Calculate centre position
    var y = (noCenter ? 0 : 246 - (Math.floor(size * 6.5))) + (typeof yOffset == "number" ? yOffset : 0);
    if(hasShadow) speechOverlay.addLabel(1, text, x + size/2, y + size/2, 0, 0, 0);
    speechOverlay.addLabel(2, text, x, y, 0, 0, (typeof color == "number" ? color : 16777215)); // Add label in the middle of the screen with the given color
    if(hasShadow) speechOverlay.getComponent(1).setScale(size);
    speechOverlay.getComponent(2).setScale(size); // Resize the label
    player.showCustomOverlay(speechOverlay); // Place the overlay on the player's screen
    speechOverlay.update(player); // Update the label to be visible
    var speakObject = {
        player: player,
        id: speakID
    };
    var actionManager = API.getActionManager();
    var timeout = typeof timeout == "number" ? timeout : 1200; 
    var taskName = "speak" + speakID + player.getName();
    if(actionManager.hasAny(taskName)) actionManager.cancelAny(taskName);
    actionManager.scheduleParallel(taskName, 5, timeout, closeOverlay).setData("speakData", speakObject);
    actionManager.start();
}

/** Removes overlay from player's screen
 * @param {IPlayer} player 
 * @param {Int} speakID 
 */
function cancelSpeak(player, speakID)
{ 
    player.closeOverlay(speakID); 
}