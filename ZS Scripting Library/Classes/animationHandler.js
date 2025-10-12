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
 * @param {IAnimation / String} animation - IAnimation object or String name of animation
 */
animationHandler.prototype.setAnimation = function(animationName) 
{
    if(!animationName) return;
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