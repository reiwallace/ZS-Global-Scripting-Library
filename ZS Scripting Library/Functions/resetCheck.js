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