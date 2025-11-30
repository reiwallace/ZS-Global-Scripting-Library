//ZS Scripting Library! Functions used by a TON of npcs!
// PLEASE UPDATE ALL SCRIPTS ON GITHUB IF YOU MAKE ANY CHANGES
// IF YOU REMOVE ANY GLOBAL SCRIPT PLEASE MARK IT AS 'INACTIVE' ON THE GITHUB
// AUTHOR: Riken/Mighty/Noxie

//our object storing every single function
var libraryObject = {
    debugMessage: sendDebugMessage,
    checkReset: checkReset,
    checkResetParty: checkResetParty,
    speak: speak,
    cancelSpeak: cancelSpeak,
    getRandom: getRandom,
    getAngleToEntity: getAngleToEntity,
    get3dDirection: get3dDirection,
    isPlayer: isPlayer,
    isValidPlayer: isValidPlayer,
    getDbcLevel: getDbcLevel,
    checkBlocking: checkBlocking,
    giveZSword: giveZSword,
    removeZSword: removeZSword,
    hasZSword: hasZSword,
    findZSword: findZSword,
    holdingZSword: holdingZSword,
    getProfileData: getProfileData,
    getActiveSlotId: getActiveSlotId,
    isInRange: isInRange,
    kill: kill,
    posToDouble: posToDouble,
    messageAll: messageAll,
    animationHandler: animationHandler,
    dbcDisplayHandler: dbcDisplayHandler,
    progressBar: progressBar,
    deck: deck
}
API.addGlobalObject("lib", libraryObject);

// GLOBAL FUNCTIONS --------------------------------------------------------------------------------------------------

/** Sends a message to a player
 * @param {IPlayer} playerName 
 * @param {String} text 
 */
function sendDebugMessage(playerName, text) {
    API.getPlayer(playerName).sendMessage(text);
}

/** Checks if npc target is dead
 * @param {ICustomNpc} npc 
 * @returns {Boolean}
 */
function checkReset(npc){
    var temptarget = npc.getTempData("npctarget");
    var target = npc.getAttackTarget();
    var doReset = Boolean(
        temptarget != null && 
        target == null && 
        temptarget.getHealth() == 0
    );
    if(doReset) {
        npc.getTimers().clear();
        npc.reset();
    }
    npc.setTempData("npctarget", npc.getAttackTarget());
    return doReset;
}

/** Checks if npc target and no other players nearby are alive
 * @param {ICustomNpc} npc 
 * @returns {Boolean}
 */
function checkResetParty(npc)
{
    var temptarget = npc.getTempData("npctarget");
    var target = npc.getAttackTarget();
    var doReset = Boolean(
        temptarget != null && 
        target == null && temptarget.getHealth() == 0 && 
        npc.world.getClosestVulnerablePlayer(npc.getPosition(), 50.0) == null
    );
    if (doReset) {
        npc.getTimers().clear();
        npc.reset();
    }
    npc.setTempData("npctarget", npc.getAttackTarget());
    return doReset;
}

/** Returns if entity is a player
 * @param {IEntity} entity 
 * @returns {Boolean}
 */
function isPlayer(entity) {
  return entity && entity.getType() == 1;
}

/**
 * Checks if the given player is valid.
 *
 * A player is considered valid if:
 * - The player object is not null.
 * - The player's type is 1.
 * - The player has a non-null DBCPlayer instance.
 * - The player's mode is 0.
 * - The player is not a DBC Fusion Spectator.
 *
 * @param {IPlayer} player - The player to validate.
 * @returns {boolean} True if the player is valid, otherwise false.
 */
function isValidPlayer(player) {
    return (player && player.getType() == 1 && player.getDBCPlayer() && player.getMode() == 0 && !player.getDBCPlayer().isDBCFusionSpectator());
}

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

    if(timeout == 0) return;
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

/** Removes speak overlay
 * @param {IPlayer} player to remove the overlay from
 * @param {integer} speakID of the overlay to remove
 */
function cancelSpeak(player, speakID)
{ // Remove text from player screen
    player.closeOverlay(speakID); 
}

/** Gets the angle from one entity to another
 * @param {IEntity} entity1 - Initial entity to get angle from 
 * @param {IEntity} entity2 - Second entity to get angle to
 */
function getAngleToEntity(entity1, entity2) 
{
    if(!entity1 || !entity2) return;
    var dx = entity1.getX() - entity2.getX();
    var dz = entity1.getZ() - entity2.getZ();
    var theta = Math.atan2(dx, -dz);
    theta *= 180 / Math.PI
    if (theta < 0) theta += 360;
    return theta;
}

/** Returns direction from 1 position to a second in 3d space
 * @param {Double[]} pos1 - Initial position
 * @param {Double[]} pos2 - Target Position
 * @returns {Double[]} - Direction contained in an array
 */
function get3dDirection(pos1, pos2)
{
    if(pos1.getClass().toString().equals("class noppes.npcs.scripted.ScriptBlockPos")) pos1 = lib.posToDouble(pos1);
    if(pos2.getClass().toString().equals("class noppes.npcs.scripted.ScriptBlockPos")) pos2 = lib.posToDouble(pos2);
    var direction = { 
        x: pos2[0] - pos1[0],
        y: pos2[1] - pos1[1],
        z: pos2[2] - pos1[2]
    }
    var length = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2) + Math.pow(direction.z, 2)) //we calculate the length of the direction
    var direction = [(direction.x / length), (direction.y / length), (direction.z / length)] //and then we normalize it and store it in the direction variable
    return direction;
}

/** Returns a random number between two values
* @param {int} min - the minimum number to generate a value from
* @param {int} max - the minimum number to generate a value from 
* @param {Boolean} getInt - Only returns integer values if true
* @returns {Double} - Random number
*/
function getRandom(min, max, getInt)
{  
    if(getInt) return Math.floor(Math.random() * (max - min + 1)) + min;
    else return Math.random() * (max - min) + min;
}

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

/** Returns if a player is either sword blocking or dbc blocking
 * @param {IPlayer} player 
 * @returns Boolean
 */
function checkBlocking(player)
{
    if(!lib.isPlayer(player)) return false;
    return player.blocking() || player.getDBCPlayer().isBlocking();
}

// ZSWORD FUNCTIONS CONFIG
var zSwordLinkedId = 0;
var zSwordQuestId = 0;
var zSwordRewardSlot = 0;

/** Give Z Sword from quest rewards
 * @param {IPlayer} player 
 */
function giveZSword(player) 
{
    if(hasZSword(player)) return;
    player.giveItem(API.getQuests().get(zSwordQuestId).getRewards().getSlot(zSwordRewardSlot), 1);
}

/** Find and attempt to remove Z Sword from player's inventory
 * @param {IPlayer} player 
 * @returns If Z Sword was removed
 */
function removeZSword(player)
{
    var zSword = findZSword(player);
    if(zSword) {
        player.removeItem(zSword, 1, true, true);
        return true;
    }
    return false;
}

/** Returns if Z Sword is present in player's inventory
 * @param {IPlayer} player 
 * @returns Boolean
 */
function hasZSword(player)
{
    return Boolean(findZSword(player));
}

/** Searches player inventory for the Z Sword
 * @param {IPlayer} player 
 * @returns ILinkedItem
 */
function findZSword(player)
{
    var inv = player.getInventory();
    for (var item in inv) {
        item = inv[item]
        if(item && item.getClass().toString().equals("class noppes.npcs.scripted.item.ScriptLinkedItem")) {
            if(item.getLinkedItem().getId() != zSwordLinkedId) return;
            return item;
        }
    }
}

/** Returns if player is holding a Z Sword
 * @param {IPlayer} player 
 * @returns Boolean
 */
function holdingZSword(player)
{
    var heldItem = player.getHeldItem();
    if(heldItem && heldItem.getClass().toString().equals("class noppes.npcs.scripted.item.ScriptLinkedItem")) {
        if(heldItem.getLinkedItem().getId() != zSwordLinkedId) return false;
        return true;
    }
    return false;
}

/** Gets player profile containing slot data
 * @param {IPlayer} player
 * @returns IProfile
 */
function getProfileData(player)
{
    if(!lib.isPlayer(player)) return;
    return API.getProfileHandler().getProfile(player);
}

/** Gets a player's current slot id
 * @param {IPlayer} playerName
 * @returns Int
 */
function getActiveSlotId(player)
{
    if(!lib.isPlayer(player)) return;
    return API.getProfileHandler().getProfile(player).getCurrentSlotId();
}

/** Returns if anchor position is in range of target position
 * @param {IPos} anchorPos 
 * @param {IPos} targetPos 
 * @param {Double} range 
 * @returns Boolean
 */
function isInRange(anchorPos, targetPos, range) {
  if(
    !anchorPos.getClass().toString().equals("class noppes.npcs.scripted.ScriptBlockPos") || 
    !targetPos.getClass().toString().equals("class noppes.npcs.scripted.ScriptBlockPos")
    ) return false;
  return anchorPos.distanceTo(targetPos) <= range;
}

/** Command kills a player
 * @param {IPlayer} player 
 * @returns Boolean - If the player was killed
 */
function kill(player){
    if(!isPlayer(player)) return false;
    API.executeCommand(player.world, "kill " + player.getName());
    return true;
}

/** Converts a pos object to a double array
 * @param {IPos} pos 
 * @returns Double[]
 */
function posToDouble(pos) {
    if(!pos.getClass().toString().equals("class noppes.npcs.scripted.ScriptBlockPos")) return [];
    return [pos.getX(), pos.getY(), pos.getZ()];
}

/**
 * Broadcasts a message to all players on the server.
 * @param {IWorld} world - The world object.
 * @param {string} message - The message to send.
 */
function messageAll(world, message) {
    var players = world.getAllServerPlayers();
    for (var i = 0; i < players.length; i++) {
        if(!players[i]) continue;
        players[i].sendMessage(message);
    }
}

// GLOBAL CLASSES ------------------------------------------------------------------------------------------------

// Animation Handler class --------------------------------------------------------------------------

/**
 * @constructor
 * @param {IEntity} entity - Entity managed by animation handler
 */
function animationHandler(entity)
{
    if(!entity || (entity.getType() != 1 && entity.getType() != 2)) return;
    this.entity = entity;
    this.entityAnimData = entity.getAnimationData();
}

/** Set entity animation
 * @param {IAnimation} animation - IAnimation object or String name of animation
 */
animationHandler.prototype.setAnimation = function(animation) 
{
    if(!animation) return;
    if(typeof animation == "string") animation = API.getAnimations().get(animation);
    this.entityAnimData.setEnabled(true);
    this.entityAnimData.setAnimation(animation);
    this.entityAnimData.updateClient();
}

/** Removes animation, setting player back to their default animation
 */
animationHandler.prototype.removeAnimation = function()
{
    this.entityAnimData.setEnabled(false);
    this.entityAnimData.setAnimation(null);
    this.entityAnimData.updateClient();
}

animationHandler.prototype.getAnimData = function() { return this.entityAnimData; }

// ---------------------------------------------------------------------------

// Npc form handler class --------------------------------------------------------------------------

/**
 * @constructor
 * @param {ICustomNpc} npc - Npc to manage dbcDisplay of 
 * @param {Boolean} enabled - If aura enabled by default
 */
function dbcDisplayHandler(npc, enabled)
{
    if(!npc) return;
    this.transformConfig();
    this.npc = npc;
    this.npcDisplay = DBCAPI.getDBCDisplay(npc);
    this.npcDisplay.setEnabled(enabled);
    this.npc.updateClient();
}

/** Config for quick transformation
 */
dbcDisplayHandler.prototype.transformConfig = function()
{
    this.updateFormDelay = 10; // Number of ticks from starting aura to updating form
    this.disableAuraDelay = 20; // Number of ticks from starting aura to disabling aura (generally around 10 after updating form looks good)
    this.ascendSound = "npcdbc:transformationSounds.GodAscend";
} 

/** Transforms npc using default slow transformation
 * @param {IForm} form 
 */
dbcDisplayHandler.prototype.slowTransform = function(form)
{
    if(!form) return;
    this.npcDisplay.setEnabled(true);
    this.npcDisplay.transform(form);
    this.npc.updateClient();
}

/** Performs a quick transformation similar to player double tapping transformation button
 * @param {IForm} form 
 * @param {Boolean} disableAura - If aura is disabled after transforming 
 */
dbcDisplayHandler.prototype.quickTransform = function(form, disableAura)
{
    if(!form) return;
    // Enable aura
    this.npcDisplay.toggleAura(true);
    this.npc.updateClient();
    this.tempForm = form;
    
    // Start timers
    var actMan = API.getActionManager();
    var actionData = {
        handlerObj : this,
        disableAura : disableAura
    };
    function qtUpdateForm(action) {
        var actionData = action.getData("actionData");
        var handler = actionData.handlerObj;
        handler.setForm(handler.tempForm);
        handler.npc.playSound(handler.ascendSound, 0.3, 1);
        action.markDone();
    }
    function qtDisableAura(action) {
        var actionData = action.getData("actionData");
        actionData.handlerObj.toggleAura("false");
        action.markDone();
    }
    actMan.scheduleParallel(this.updateFormDelay, qtUpdateForm).setData("actionData", actionData);
    if(disableAura) actMan.scheduleParallel(this.disableAuraDelay, qtDisableAura).setData("actionData", actionData);
    actMan.start();
}

/**
 * @param {IForm} form - IForm to set npc to
 */
dbcDisplayHandler.prototype.setForm = function(form)
{
    if(!form) return;
    if(typeof form == "string") form = DBCAPI.getForm(form);
    this.npcDisplay.setForm(form);
    this.npc.updateClient();
}

/** Sets npc aur
 * @param {IAura} aura
 * @param {Boolean} active - If aura is active once applied
 */
dbcDisplayHandler.prototype.setAura = function(aura, active)
{
    if(!aura) return;
    this.npcDisplay.setAura(aura);
    this.npcDisplay.toggleAura(active);
    this.npc.updateClient();
}

/** Changes visibility of aura
 * @param {Boolean} enabled - Aura visibility
 */
dbcDisplayHandler.prototype.toggleAura = function(enabled)
{
    this.npcDisplay.toggleAura(enabled);
    this.npc.updateClient();
}

/** Disables dbcDisplay
 */
dbcDisplayHandler.prototype.disable = function()
{
    this.npcDisplay.setEnabled(false);
    this.npc.updateClient();
}

/** Enables dbcDisplay
 */
dbcDisplayHandler.prototype.enable = function()
{
    this.npcDisplay.setEnabled(true);
    this.npc.updateClient();
}

dbcDisplayHandler.prototype.getNpcDisplay = function() { return this.npcDisplay; }

// ---------------------------------------------------------------------------

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

// deck Class ----------------------------------------------------------------

/** Creates a deck of zero indexed numbers which can be used for deterministic rng
 * @param {Int} size - Size of the deck
 * @param {Boolean} noReset - If the deck shouldn't automatically reset
 */
function deck(size, noReset)
{
    this.size = size;
    this.reset = !noReset;
    this.resetDeck();
}

/** Draws a random card from the deck
 * @returns Int
 */
deck.prototype.drawRandom = function()
{
    if(this.deck.length < 1 && this.reset) this.resetDeck();
    return this.deck.splice(lib.getRandom(0, this.deck.length - 1, true), 1)[0];
}

/** Draws the card from the back of the deck
 * @returns Int
 */
deck.prototype.drawLast = function()
{
    if(this.deck.length < 1 && this.reset) this.resetDeck();
    return this.deck.pop();
}

/** Draws the card on top of the deck
 * @returns Int
 */
deck.prototype.drawFirst = function()
{
    if(this.deck.length < 1 && this.reset) this.resetDeck();
    return this.deck.splice(0, 1)[0];
}

/** Resets the deck to its initial size
 */
deck.prototype.resetDeck = function()
{
    this.deck = [];
    for(i = 0; i < this.size; i++) {
        this.deck.push(i);
    }
}

/** Changes the size of the deck
 * @param {Int} size - New size of the deck
 * @param {Boolean} preventNew - If a new deck shouldn't be generated
 */
deck.prototype.changeSize = function(size, preventNew)
{
    this.size = size;
    if(!preventNew) this.resetDeck();
}

/** Toggles automatic resetting
 * @param {Boolean} reset
 */
deck.prototype.toggleAutoReset = function(reset)
{
    this.reset = reset;
}

/** Returns the current deck
 * @returns 
 */
deck.prototype.getDeck = function()
{
    return this.deck;
}

// ---------------------------------------------------------------------------