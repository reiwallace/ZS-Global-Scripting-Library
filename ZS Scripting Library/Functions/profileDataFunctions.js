/** Gets player profile containing slot data
 * @param {IPlayer} player
 * @returns IProfile
 */
function getProfileData(player)
{
    return API.getProfileHandler().getProfile(player);
}

/** Gets a player's current slot id
 * @param {IPlayer} playerName
 * @returns Int
 */
function getActiveSlotId(player)
{
    return API.getProfileHandler().getProfile(player).getCurrentSlotId();
}