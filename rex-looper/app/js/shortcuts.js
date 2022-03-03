window.onkeydown = function(e) {
    //If not currently editing an input
    if(document.activeElement.nodeName != "INPUT"){
        //Play Instruments
        if(isInt(e.key))
            if(e.key <= instruments.length-1)
                PlayInstrument(e.key);

        //Play/Pause
        if(e.code == "Space"){
            e.preventDefault();
            StartStop();
        }
    }

    //Focus Composer
    if(e.code == "Tab"){
        e.preventDefault();
        ToggleFocus();
    }
}
