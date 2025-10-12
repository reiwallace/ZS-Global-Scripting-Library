// Timers pull object and compare to server time
function timer(event) {
    var id = event.id;
    var npc = event.npc;
    // Get object array for specific timer and cycle through array
    var object = npc.getTempData(id);
    // ADD TIMER FUNCTIONALITY
    if(!object) return;
    switch(timerId) {
        case(dbcDisplayHandler_UPDATE_FORM):
            // Handle updating quick transform
            if(!object instanceof lib.dbcDisplayHandler) return;
            object.qtUpdateForm();
            break;

        case(dbcDisplayHandler_DISABLE_AURA):
            // Handle ending quick transform
            if(!object instanceof lib.dbcDisplayHandler) return;
            object.toggleAura(false);
            break;

        case(speak_OVERLAY_TIMEOUT):
            if(object.player) object.player.closeOverlay(object.id);
            break;
    }
    world.removeTempData(id);
}