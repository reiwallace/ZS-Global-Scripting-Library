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