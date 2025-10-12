/** Starts a timer on the global script npc
 * @param {int} timerId - Id of the timer to start
 * @param {int} duration - Duration of the timer in ticks 
 * @param {Boolean} timerRepeats - If timer repeats
 * @param {Object} object - Class object required by timer
 */
function startGlobalTimer(timerId, duration, timerRepeats, object)
{
    var world = API.getIWorld(0);
    var timers = world.getTempData("libTimers");

    // Calculates end time of timer
    var dataId =  timerId + "" + (API.getServerTime() + duration + 1);

    // If this timer is already being used push the new object into the same array
    if(world.hasTempData(dataId)) world.setTempData(dataId, world.getTempData(dataId).push(object));
    // If the timer doesn't exist create a new array containing only the one object
    else world.setTempData(dataId, new Array(object));
    timers.forceStart(timerId, duration, timerRepeats);
}