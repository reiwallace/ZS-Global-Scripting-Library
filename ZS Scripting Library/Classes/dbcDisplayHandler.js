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
    lib.startGlobalTimer(301, this.updateFormDelay, false, this.npc.getEntityId(), this);
    if(disableAura) lib.startGlobalTimer(302, this.disableAuraDelay, false, this.npc.getEntityId(), this);
}

/** Timer function for quickTransform to update npc's form
 */
dbcDisplayHandler.prototype.qtUpdateForm = function()
{
    this.setForm(this.tempForm);
    this.npc.playSound(this.ascendSound, 0.3, 1);
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