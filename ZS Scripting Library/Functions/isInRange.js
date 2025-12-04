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