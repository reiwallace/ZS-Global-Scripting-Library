/** Returns a random number between two values
* @param {int} min - the minimum number to generate a value from
* @param {int} max - the minimum number to generate a value from 
* @param {Boolean} getInt - Only returns integer values if true
*/
function getRandom(min, max, getInt)
{  
    if(getInt) return Math.floor(Math.random() * (max - min + 1)) + min;
    else return Math.random() * (max - min) + min;
}