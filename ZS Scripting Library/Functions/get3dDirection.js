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