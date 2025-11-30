/** Converts a pos object to a double array
 * @param {IPos} pos 
 * @returns Double[]
 */
function posToDouble(pos) {
    if(!pos.getClass().toString().equals("class noppes.npcs.scripted.ScriptBlockPos")) return [];
    return [pos.getX(), pos.getY(), pos.getZ()];
}