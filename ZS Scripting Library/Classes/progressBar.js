// progressBar class ---------------------------------------------------------

progressBar.prototype.config = function() {
    // COMPONENT IDS
    this.BORDER_ID = 1;
    this.BAR_ID = 2;
    this.TICK_INITIAL_ID = 3;
    this.TEXT_ID = 50;
    this.SHADOW_ID = 51;
    
    // POSITIONING
    this.x = 480;
    this.y = 30;

    // COLOUR CONFIG
    this.BORDER_COLOUR = 1; // Border colour - takes a decimal colour (https://www.mathsisfun.com/hexadecimal-decimal-colors.html)
    this.BAR_COLOUR = 16777215; // Bar colour - takes a decimal colour (https://www.mathsisfun.com/hexadecimal-decimal-colors.html)
    this.BAR_WIDTH = 300; // Width of bar in pixels
    this.BAR_HEIGHT = 7; // Height of bar in whatever the game feels like

    // TICK CONFIG
    this.TICK_COLOUR = 0; // Tick colour - takes a decimal colour (https://www.mathsisfun.com/hexadecimal-decimal-colors.html)
    this.TICK_THICKNESS = 1;

    // TEXT CONFIG
    this.TEXT = "Progress: "; // Text displayed for the bar
    this.PROGRESS_WITH_TEXT = false;
    this.TEXT_POSITION = -1; // Set to -1 to position above bar +1 for below
    this.TEXT_COLOUR = 16777215; // Text colour
    this.TEXT_SIZE = 1;
    this.SHADOW_COLOUR = 0; // Colour of shadow behind text

    // BAR TIMEOUT
    this.DO_TIMEOUT = true; // Enables bar timeout
    this.TIMEOUT = 1200; // Bar disappears from the player after a minute
}

/** progressBar constructor
 * @constructor
 * @param {Int} maxValue - Max value of bar
 * @param {Int} initialValue - Initial value of bar
 * @param {Double[]} breakPoints - An ARRAY of decimal values to place ticks at 
 * @param {IPlayer} player - Player to display bar to - can be left null
 */
function progressBar(maxValue, initialValue, overlayId, player) 
{
    if(maxValue == null || initialValue == null) return;
    this.config();
    this.overlayId = overlayId;
    this.maxValue = maxValue;
    this.breakPoints = [];
    this.setValue(initialValue, player);
}

/** Builds the bar from existing config
 */
progressBar.prototype.buildBar = function()
{
    // Create overlay with id
    this.barOverlay = API.createCustomOverlay(this.overlayId);;

    // Build bar border
    var border = this.barOverlay.addLine(this.BORDER_ID, this.x - this.BAR_WIDTH/2, this.y, this.x + this.BAR_WIDTH/2, this.y);
    border.setThickness(this.BAR_HEIGHT);
    border.setColor(this.BORDER_COLOUR);

    // Build bar itself
    var barX1 = this.x - this.BAR_WIDTH/2 + 1;
    var barX2 = barX1 + (this.BAR_WIDTH - 2) * this.currentValue / this.maxValue;
    var bar = this.barOverlay.addLine(this.BAR_ID, barX1, this.y - 1, barX2, this.y - 1);
    bar.setThickness(this.BAR_HEIGHT - 2);
    bar.setColor(this.BAR_COLOUR);

    // Add ticks
    for(var i = 0; i < this.breakPoints.length; i++) {
        var tick = this.barOverlay.addLine(this.TICK_INITIAL_ID + i, barX1 + (this.BAR_WIDTH * this.breakPoints[i]), this.y - 1, barX1 + (this.BAR_WIDTH * this.breakPoints[i]), this.y - this.BAR_HEIGHT + 1);
        tick.setColor(this.TICK_COLOUR);
        tick.setThickness(this.TICK_THICKNESS);
    }

    // Add bar text
    var text = this.PROGRESS_WITH_TEXT ? this.TEXT + this.currentValue : this.TEXT;
    var lx = this.x - Math.floor((text.length) * 2.5) * this.TEXT_SIZE; // Calculate centre position
    var ly = this.y - Math.floor(this.TEXT_SIZE * 6.5) + 12 * this.TEXT_POSITION;
    var textLabel = this.barOverlay.addLabel(this.TEXT_ID, text, lx, ly, 0, 0, this.SHADOW_COLOUR); // Add label in the middle of the screen with the given color
    textLabel.setScale(this.TEXT_SIZE);
    var shadowLabel = this.barOverlay.addLabel(this.SHADOW_ID, text, lx - 1, ly - 1, 0, 0, this.TEXT_COLOUR); // Add label in the middle of the screen with the given color
    shadowLabel.setScale(this.TEXT_SIZE); 
}

/** Creates the bar and sets it to a given value
 * @param {Int} value - Value to set bar to 
 * @param {IPlayer} player - Player to display bar to - can be left null
 */
progressBar.prototype.setValue = function(value, player)
{
    this.currentValue = value;
    this.buildBar();
    this.displayBar(player);
}

/** Adds bar to a player's UI
 * @param {IPlayer} player - Player to display bar to
 */
progressBar.prototype.displayBar = function(player)
{
    function hideBar(action) {
        var data = action.getData("overlayData");
        if(!lib.isPlayer(data.player)) {
            action.markDone();
            return;
        }
        data.player.closeOverlay(data.progressBar.overlayId); 
        action.markDone();
    }
    if(!lib.isPlayer(player)) return;
    player.showCustomOverlay(this.barOverlay);
    this.barOverlay.update(player);
    var actionManager = API.getActionManager();
    if(this.DO_TIMEOUT) {
        var actionManager = API.getActionManager();
        var taskName = "progressBar" + this.overlayId + player.getName();
        if(actionManager.hasAny(taskName)) actionManager.cancelAny(taskName);
        actionManager.scheduleParallel(taskName, 5, this.TIMEOUT, hideBar).setData("overlayData", {player: player, progressBar: this});
        actionManager.start();
    }
}

/** Removes bar from a player's UI
 * @param {IPlayer} player - Player to remove bar from
 */
progressBar.prototype.removeBar = function(player)
{
    if(lib.isPlayer(player)) player.closeOverlay(this.overlayId); 
}

/** Add breakpoints to the progress bar
 * @param {Double[]} breakPoints - An ARRAY of decimal values to place ticks at 
 * Requires redisplaying the bar to players
 */
progressBar.prototype.setBreakPoints = function(breakPoints)
{
    this.breakPoints = breakPoints;
    this.buildBar();
}

/** Removes all breakpoints from the progress bar
 * Requires redisplaying the bar to players
 */
progressBar.prototype.removeBreakPoints = function()
{
    this.breakPoints = [];
    this.buildBar();
}

/** Sets duration of timeout in ticks
 * @param {Int} timeout 
 */
progressBar.prototype.setTimeout = function(timeout)
{
    this.TIMEOUT = timeout;
}

/** Enables/Disables timeout
 * @param {Boolean} timeout
 */
progressBar.prototype.toggleTimeout = function(timeout)
{
    this.DO_TIMEOUT = timeout;
}

// ---------------------------------------------------------------------------