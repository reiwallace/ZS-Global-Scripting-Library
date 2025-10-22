/** Creates a deck of zero indexed numbers which can be used for deterministic rng
 * @param {Int} size - Size of the deck
 * @param {Boolean} noReset - If the deck shouldn't automatically reset
 */
function deck(size, noReset)
{
    this.size = size;
    this.reset = !noReset;
    this.resetDeck();
}

/** Draws a random card from the deck
 * @returns Int
 */
deck.prototype.drawRandom = function()
{
    if(this.deck.length < 1 && this.reset) this.resetDeck();
    return this.deck.splice(lib.getRandom(0, this.deck.length - 1, true), 1)[0];
}

/** Draws the card from the back of the deck
 * @returns Int
 */
deck.prototype.drawLast = function()
{
    if(this.deck.length < 1 && this.reset) this.resetDeck();
    return this.deck.pop();
}

/** Draws the card on top of the deck
 * @returns Int
 */
deck.prototype.drawFirst = function()
{
    if(this.deck.length < 1 && this.reset) this.resetDeck();
    return this.deck.splice(0, 1)[0];
}

/** Resets the deck to its initial size
 */
deck.prototype.resetDeck = function()
{
    this.deck = [];
    for(i = 0; i < this.size; i++) {
        this.deck.push(i);
    }
}

/** Changes the size of the deck
 * @param {Int} size - New size of the deck
 * @param {Boolean} preventNew - If a new deck shouldn't be generated
 */
deck.prototype.changeSize = function(size, preventNew)
{
    this.size = size;
    if(!preventNew) this.resetDeck();
}

/** Toggles automatic resetting
 * @param {Boolean} reset
 */
deck.prototype.toggleAutoReset = function(reset)
{
    this.reset = reset;
}

/** Returns the current deck
 * @returns 
 */
deck.prototype.getDeck = function()
{
    return this.deck;
}