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