/** Returns if entity is a player
 * @param {IEntity} entity 
 * @returns {Boolean}
 */
function isPlayer(entity) {
  return entity && entity.getType() == 1;
}

/**
 * Checks if the given player is valid.
 *
 * A player is considered valid if:
 * - The player object is not null.
 * - The player's type is 1.
 * - The player has a non-null DBCPlayer instance.
 * - The player's mode is 0.
 * - The player is not a DBC Fusion Spectator.
 *
 * @param {IPlayer} player - The player to validate.
 * @returns {boolean} True if the player is valid, otherwise false.
 */
function isValidPlayer(player) {
    return (player && player.getType() == 1 && player.getDBCPlayer() && player.getMode() == 0 && !player.getDBCPlayer().isDBCFusionSpectator());
}