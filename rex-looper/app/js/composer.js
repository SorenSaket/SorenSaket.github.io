// ---------------- Public Functions ----------------

// Toggles the state of Tone.Transport between paused and started
// TODO Change the icon of the play/pause button
function TogglePlay(){
    if(Tone.Transport.state == "started")
    {
        Tone.Transport.pause();
    }
    else
    {
        Tone.Transport.start();
    }
}
//
function StartStop(){
    if(Tone.Transport.state == "started")
    {
        Stop();
    }
    else
    {
        Tone.Transport.start();
    }
}
//
function Start(){

}
//
function Pause(){
}
// Stops the Tone.Transport by calling Tone.Transport.stop(); and calling player.stop() on all instruments
function Stop(){
    Tone.Transport.stop();
    for (var i = 0; i < instruments.length; i++) {
        instruments[i].player.stop();
        for (let y = 0; y < instruments[i].pads.length; y++) {
            instruments[i].pads[y].selected = false;
            UpdatePadUI(instruments[i].pads[y]);
        }
    }
}
// Sets the Tone.Transport.bpm to an int
function SetBPM(e, val){
    if(val <= 0)
        val = 1;
    e.target.value = val;
    Tone.Transport.bpm.value = parseInt(val);
}
//
function IncreaseBarCount(){
    // Can't be less than 1
    // Update all pad UI
    bars++;
    Tone.Transport.setLoopPoints(0,  (bars + "m").toString());
    for (let i = 0; i < instruments.length; i++) {
        for (let x = 0; x < 4; x++) {
            instruments[i].pads.push(emptyPad(instruments[i]));
            CreatePadUI(instruments[i], instruments[i].pads[instruments[i].pads.length-1]);
        }
    }
}
//
function DecreaseBarCount(){
    if(bars > 1)
    {
        bars--;
        Tone.Transport.setLoopPoints(0,  (bars + "m").toString());
        for (let i = 0; i < instruments.length; i++) {
            for (let x = 0; x < 4; x++) {
                instruments[i].trackDOM.removeChild(instruments[i].trackDOM.childNodes[instruments[i].trackDOM.childNodes.length-1]);
                instruments[i].pads.pop();
            }
        }
    }
}
//
function ToggleFocus(){
    focused = !focused;
    if(focused)
    {
        headDOM.style.height = null;
        effectsDOM.style.height = null;
    }else{
        headDOM.style.height = "0px";
        effectsDOM.style.height = "0px";
    }
}

function SetMasterGain(e){
    Tone.Master.volume.value = Tone.gainToDb(e.toElement.dataset.value);
}

// ---------------- Functional Functions ----------------
// Initialization of Tone.Transport variables
function InitializeTransport(){
    Tone.Transport.loop = true;
    Tone.Transport.setLoopPoints(0,  (bars + "m").toString());
    Tone.Transport.scheduleRepeat(function(){
      PlayAllInstruments();
    }, "4n", "0");
}
//
function PlayAllInstruments(){
    var beat = ConvertToBeats(Tone.Transport.position);
    for (let i = 0; i < instruments.length; i++) {
        if(instruments[i].pads[beat].active)
        {
            PlayInstrument(i);
        }
        instruments[i].pads[beat].selected = true; 
        UpdatePadUI(instruments[i].pads[beat]);
        if(beat > 0){
            instruments[i].pads[beat-1].selected = false; 
            UpdatePadUI(instruments[i].pads[beat-1]);
        }else if(beat == 0){
            instruments[i].pads[bars*4-1].selected = false; 
            UpdatePadUI(instruments[i].pads[bars*4-1]);
        }
    }
}
//
function PlayInstrument(index){
    instruments[index].player.start();
}
// ---------------- Data Manipulation ----------------

// -------- Create --------
// Pushes a new instrument to intruments
function CreateInstrument(buffer){
    // Create empty instrument
    var instrument = emptyInstrument(buffer);
    // Add pads
    for (let i = 0; i < bars*beatsPerBar; i++) {
        instrument.pads.push(emptyPad(instrument));
    }
    // Add "instrument" to global instruments
    instruments.push(instrument);
    // Create the instrument UI
    CreateInstrumentUI(instruments[instruments.length-1]);
}

// -------- Get --------
// Gets an instrument in global instruments by converting the DOMID
function GetInstrument(DOMID){
    return instruments[parseInt(DOMID.split("-")[1])];
}
// Gets an index that matches to an instrument in global instruments by converting the DOMID
function GetInstrumentID(DOMID){
    return parseInt(DOMID.split("-")[1]);
}
// Gets a pad in an instrument in global instruments by converting the DOMID
function GetPad(DOMID){
    var split = DOMID.split("-");
    return instruments[split[1]].pads[split[2]];
}

// -------- Set --------
// Sets an instrument value by passing an overriding value
function SetInstrument(id, override){}
// Sets a pad value by passing an overriding value
function SetPad(id, override){
    var pad = GetPad(id);
    //override.DOM = pad.DOM;

    if(override != null)
    {
        pad = override;
        UpdatePadUI(pad);
    }
}

// ---------------- UI Manipulation ----------------

// -------- UI Creation --------
//
function CreateInstrumentUI(instrument){
    instrumentContainer.insertAdjacentHTML("beforeend",
    '<div id="instrument-' + (instrument.order) + '" class="instrument">' +
        '<div class="solo"></div>'+
        '<div class="mute"></div>'+
            '<div class="instrument-icon">'+
            '<img class="icon" src="'+ GetIcon(instrument.icon) + '"></img>'+
        '</div>'+
    '</div>');
    instrument.DOM = document.getElementById('instrument-' + (instrument.order));

    instrumentTrackContainer.insertAdjacentHTML("beforeend",'<div id="instrument-track-' + (instrument.order) + '"  class="instrument-track"></div>');
    instrument.trackDOM = document.getElementById('instrument-track-' + (instrument.order));

    for (let i = 0; i < instrument.pads.length; i++) {
        CreatePadUI(instrument, instrument.pads[i]);
    }
}
//
function CreatePadUI(instrument, pad){
    var id = instrument.trackDOM.childElementCount;

    instrument.trackDOM.insertAdjacentHTML("beforeend",
    '<div id="pad-' + (instrument.order ) + '-' + id +'" class="pad"' + ((pad.active) ? (  'style="background-color: ' + GetColorHex(instruments[instrument.order ].color)) +';"'  : " ") + '>' +
        '<div class="pitch"></div>' +
        '<div class="volume"></div>' +
        '<div class="overlay"></div>' +
    '</div>');
    pad.DOM = document.getElementById('pad-' + (instrument.order) + '-' + id);
    pad.overlayDOM = pad.DOM.getElementsByClassName("overlay")[0];
}

// -------- UI Updating --------
//
function UpdateInstrumentUI(instrument){

}
//
function UpdatePadUI(pad){
    if(pad.active)
    {
        if(pad.instrument.player.mute || (soloedInstrument != -1 && soloedInstrument != pad.instrument.order))
            pad.DOM.style.backgroundColor = disabledColor;
        else
            pad.DOM.style.backgroundColor = pad.instrument.color;
    }
    else
    {
        pad.DOM.style.backgroundColor = ""
    }

    if(pad.selected)
        pad.overlayDOM.style.backgroundColor = "rgba(255, 255, 255, " + 0.16 + ")"; 
    else
        pad.overlayDOM.style.backgroundColor = "transparent";
}
//
function UpdateInstrumentColor(instrument, colorHex){
    instrument.color = colorHex;
    var indexes = [];
    for (let i = 0; i < instrument.pads.length; i++) {
        if(instrument.pads[i].active)
            indexes.push(i);
    }
    for (let i = 0; i < indexes.length; i++) {
        setTimeout(() => {
            UpdatePadUI(instrument.pads[indexes[i]]);
        }, i*8);
    }
}


// ---------------- Helper Functions ----------------
// Returns an empty instrument with "buffer"(Tone.Buufer) as player. Set the standard values in here
function emptyInstrument(buffer){
    var instrument = {
        DOM: null,
        trackDOM: null,
        order: instruments.length,
        player: new Tone.Player(buffer),
        solo: new Tone.Solo(),
        panVol: new Tone.PanVol(),
        color: GetColorHex("blue"),
        icon: icons[Math.floor(Math.random()*icons.length)],
        effects: [],
        pads: []
    }
    instrument.player.chain(instrument.panVol, instrument.solo, Tone.Master);
    return instrument;
}
// Returns an empty pad with "instrument" as parent.  Set the standard values in here
function emptyPad(instrument){
    return{
        instrument: instrument,
        DOM: null,
        overlayDOM: null,
        active: false,
        selected: false,
        volume: 1,
        pitch: 0,
        pan: 0
    }
}
// Converts Bars:Beats:Sixteenths to Beats. Ignoring Sixteenths
function ConvertToBeats(val){
    var split = val.split(":");
    return (parseInt(split[0])*4) + parseInt(split[1]);
}
