/**
 * Places a speech overlay on the player's screen.
 *
 * @param {IPlayer} player - The player object on whose screen the overlay will be displayed.
 * @param {string} text - The text to display on the player's screen.
 * @param {string} color - The color of the text in hexadecimal format.
 * @param {number} size - The font size of the text.
 * @param {Int} xOffset - Horizontal offset from centre of screen
 * @param {Int} yOffset - Vertical offset from centre of screen
 * @param {Int} timeout - 
 * @param {string} speakID - The ID of the text overlay.
 */
function speak(player, text, color, size, xOffset, yOffset, timeout, speakID) 
{ 
    if(!lib.isPlayer(player)) return;
    var speechOverlay = API.createCustomOverlay(speakID); // Create overlay with id
    var x = 480 + xOffset - Math.floor((text.length) * 2.5) * size; // Calculate centre position
    var y = 246 + yOffset - Math.floor(size * 6.5);
    speechOverlay.addLabel(1, text, x, y, 0, 0, color); // Add label in the middle of the screen with the given color
    speechOverlay.getComponent(1).setScale(size); // Resize the label
    player.showCustomOverlay(speechOverlay); // Place the overlay on the player's screen
    speechOverlay.update(player); // Update the label to be visible
    var speakObject = {
        player: player,
        id: speakID
    };
    if(timeout != 0) startGlobalTimer(303, timeout, false, player.getEntityId(), speakObject);
}

function cancelSpeak(player, speakID)
{ // Remove text from player screen
    player.closeOverlay(speakID); 
}