// The currently selected knob
var currentKnob = null;
var knobRadius = 29;
var knobCircumference = (2 * Math.PI * knobRadius) * 0.75;
var clampedVal;
//
document.onmouseup = function(e){
    if(currentKnob != null){
        currentKnob = null;
        document.exitPointerLock();
        document.removeEventListener("mousemove", UpdateKnob, false);
    }
}
//
function Knobify(ParentDOM){
    var tempKnobs = ParentDOM.getElementsByClassName("knob");

    for (var i = 0; i < tempKnobs.length; i++) {
        tempKnobs[i].dataset.defaultvalue = tempKnobs[i].dataset.value;
        tempKnobs[i].innerHTML = knobUI;
        var knob = GetKnob(tempKnobs[i]);
        UpdateKnobUI(knob, knob.defaultKnobValue);
    }
}
//
function knobUI(){
    return
    '<svg width="64px" height="64px" >'+
        '<path                   d="M10,13 A29,29 0 1 1 10,51" fill="transparent" stroke="#6C757D" stroke-width="6" stroke-linecap="round"></path>'+
        '<path class="knob-fill" d="M10,13 A29,29 0 1 1 10,51" fill="transparent" stroke="#20c997" stroke-width="6" stroke-linecap="round" stroke-dasharray="182.212374 182.212374"></path>'+
        '<g>'+
            '<circle cx="32" cy="32" r="23" fill="transparent" stroke="#343A40" stroke-width="6"></circle>'+
            '<line class="knob-center" x1="32" y1="28" x2="32" y2="18" stroke="#F8F9FA" stroke-width="6" stroke-linecap="round" />'+
        '</g>'+
    '</svg>';
}
//
function UpdateKnob(e){
    currentMousePosX += e.movementX;
    currentMousePosY += e.movementY;

    var val = ((lastMousePosY - currentMousePosY)/512);
    clampedVal = Math.min(Math.max(currentKnob.min, val + currentKnob.knobValue), currentKnob.max);
    currentKnob.DOM.dataset.value = clampedVal;
    eval(currentKnob.callback);

    UpdateKnobUI(currentKnob, clampedVal);
}
//
function UpdateKnobUI(knob, value){
    // Remap the value to a normal range
    value = mapRange(value, knob.min, knob.max, 0,1);

    var centerTop = knob.defaultKnobValue + ((knob.max - knob.min)/40);
    var centerBottom = knob.defaultKnobValue - ((knob.max - knob.min)/40);
    var rot = value * 270 - 45;
    var dashoffset;


    /*if(currentKnob.DOM.dataset.top)
    {
        dashoffset = knobCircumference * (1 - clampedRangedVal);

        currentKnob.fillDOM.style.strokeDashoffset  = dashoffset - 100;

    }
    else
    {*/
        dashoffset = knobCircumference * (1 - value);

        /*
        if(clampedRangedVal < centerTop && clampedRangedVal > centerBottom)
            currentKnob.fillDOM.style.strokeDashoffset  = 182.212374;
        else*/
        if(value == 0)
            knob.fillDOM.style.strokeDashoffset  = 182.212374;
        else
            knob.fillDOM.style.strokeDashoffset  = dashoffset + 41.908846;
    //}

    var att = document.createAttribute("transform");       // Create a "class" attribute
    att.value = 'rotate(' + rot + ' 32 32)';
    knob.centerDOM.setAttributeNode(att);
}
//
function SelectKnob(e){
    if(e.button == 0) // Left mouse click
    {
        lastMousePosX = currentMousePosX =  e.clientX;
        lastMousePosY = currentMousePosY = e.clientY;
        // create new knob object from e    vent target
        currentKnob = GetKnob(e.target);
        // Locks cursor
        e.target.requestPointerLock();
        // Callback on value change
        document.addEventListener("mousemove", UpdateKnob, false);
    }
    else if(e.button == 1) // Middle mouse click
    {
        var knob = GetKnob(e.target);
        knob.knobValue = knob.defaultKnobValue;
        knob.DOM.dataset.value = knob.knobValue;
        eval(knob.callback);
        UpdateKnobUI(knob, knob.knobValue);
    }
}
//
function GetKnob(knobElement){
    return {
        DOM: knobElement,
        defaultKnobValue: parseFloat(knobElement.dataset.defaultvalue),
        knobValue: parseFloat(knobElement.dataset.value),
        min: parseFloat(knobElement.dataset.min),
        max: parseFloat(knobElement.dataset.max),
        callback: knobElement.dataset.callback,
        fillDOM: knobElement.getElementsByClassName("knob-fill")[0],
        centerDOM: knobElement.getElementsByClassName("knob-center")[0]
    }
}
