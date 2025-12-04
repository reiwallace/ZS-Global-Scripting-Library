/** Converts a pos object to a double array
 * @param {IPos} pos 
 * @returns Double[]
 */
function posToDouble(pos) {
    try { if(!pos.getClass().toString().equals("class noppes.npcs.scripted.ScriptBlockPos")) return []; } 
    catch (error) { return []; }
    
    return [pos.getX(), pos.getY(), pos.getZ()];
}