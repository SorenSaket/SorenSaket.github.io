// ---------------- Const Variables ----------------
// Music
const beatsPerBar = 4;

// Colors
const colors = {
    blue:   "#007bff",
    indigo: "#6610f2",
    purple: "#6f42c1",
    pink:   "#e83e8c",
    red:    "#dc3545",
    orange: "#fd7e14",
    yellow: "#ffc107",
    green:  "#28a745",
    teal:   "#20c997",
    cyan:   "#17a2b8",
    white:   "#adb5bd"
}
const disabledColor = "#6c757d";
// Icons
const iconPath = "assets/icons/intruments/"
const icons = ["banjo", "bell", "bell2", "cymbal", "drum", "guitar", "hi-hat", "keyboard", "microphone", "note", "pads", "triangle", "wave-saw", "wave-square", "wave-triangle", "wave", "xylophone"]


// ---------------- Global Variables ----------------
var instruments = [];
var soloedInstrument = -1;
var bars = 1;
var selectedIntrument = 0;

var instrumentContainer;
var instrumentTrackContainer;
var headDOM;
var effectsDOM;
var modalContainer;

var currentEditingPad = null;

var lastMousePosX;
var lastMousePosY;

var currentMousePosX;
var currentMousePosY;

var padEditTimer;

var focused = false;


$( document ).ready(function() {
    GetAllStaticComponents();

    $("#instrument-container").on("click",".instrument .instrument-icon", function(e) {
        UpdateInstrumentColor(GetInstrument(e.target.parentElement.id), GetColorHex(pickRandomProperty(colors)));
        PlayInstrument(e.target.parentElement.id.split("-")[1]);
    });

    // Mute
    $("#instrument-container").on("click",".instrument .mute", function(e) {

        var instrument = GetInstrument(e.target.parentElement.id)
        instrument.player.mute = !instrument.player.mute;
        if(instrument.player.mute)
        {
            e.target.classList.add("active");
        }
        else
        {
            e.target.classList.remove("active");
        }
        UpdateInstrumentColor(instrument, instrument.color);
    });
    // Solo
    $("#instrument-container").on("click",".instrument .solo", function(e) {
        var instrumentID = GetInstrumentID(e.target.parentElement.id);
        //Unsolo
        if(soloedInstrument == instrumentID)
        {
            instruments[instrumentID].solo.solo = false;
            soloedInstrument = -1;
            e.target.classList.remove("active");
        }else{
            // Remove the solo active from the instrument
            // TODO Restructure later to updateinstrumentUI
            if(soloedInstrument != -1)
            {
                instruments[soloedInstrument].DOM.getElementsByClassName("solo")[0].classList.remove("active");
                instruments[soloedInstrument].solo.solo = false;
            }

            instruments[instrumentID].solo.solo = true;
            soloedInstrument = instrumentID;
            e.target.classList.add("active");
        }

        // Update Colors Of all Instruments
        for (var i = 0; i < instruments.length; i++) {
            UpdateInstrumentColor(instruments[i], instruments[i].color);
        }
    });


    $( "#instrument-track-container" ).on('click', " .container-content .instrument-track .pad", function(e) {
        if(currentEditingPad == null)
        {
            var pad = GetPad(e.target.id);
            pad.active = !pad.active;
            SetPad(e.target.id, pad);
        }
    });
    /*
    $( "#instrument-track-container" ).on('mousedown', " .container-content .instrument-track .pad", function(e) {
        padEditTimer = setTimeout(() => {
            lastMousePosX = e.clientX;
            lastMousePosY = e.clientY;
            currentEditingPad = GetPad(e.target.id);
        }, 1000);
    }).on('mouseup', function(){
        currentEditingPad = null;
    }).on('mouseup mouseleave', function() {
        clearTimeout(padEditTimer);
    });*/

    $("*").on('mousemove', function(e){
        if(currentEditingPad != null)
        {
            console.log(e.clientX - lastMousePosX)
        }
    });


    $( "#instrument-track-container" ).on('mouseover', " .container-content .instrument-track .pad", function(e) {
        if(currentEditingPad == null)
        {
            if(e.buttons == 1 ){
                var pad = GetPad(e.target.id);
                pad.active = !pad.active;
                SetPad(e.target.id, pad);
            }
        }

    });



    $( document ).on("mouseup", function() {

    });
    document.getElementById("file-input").addEventListener('change', function(e)
    {
        var files = document.getElementById("file-input").files;
        for (let i = 0; i < files.length; i++) {
            GetAudio(files[i]);
        }
    });

    InitializeTransport();
    LoadEffects();
    Knobify(document);

    Sortable.create(document.getElementById("effect-picker-container"), {
        animation: 100,
        ghostClass: "ghost",
        handle: ".handle"
    });
});

window.setInterval(function(){
    document.getElementById("transport-progress").style.width = (Tone.Transport.progress * 100) + "%";
}, 100);

function GetAllStaticComponents(){
    headDOM = document.getElementById("head");
    effectsDOM = document.getElementById("effects");

    instrumentContainer = document.getElementById("instrument-container");
    instrumentTrackContainer = document.getElementById("instrument-track-container").getElementsByClassName("container-content")[0];
    modalContainer = document.getElementById("modal-overlay");
}

function ShowModal(modalID) {
    var modals = modalContainer.getElementsByClassName("modal");
    
    for (let i = 0; i < modals.length; i++) {
        modals[i].style.display = "none";
    }
    modalContainer.style.display = "flex";
    document.getElementById(modalID).style.display = "flex";
}
function CloseModals()
{
    modalContainer.style.display = "none";
}


// -------- Get Helpers --------

function GetColorHex(colorName){
    return colors[colorName];
}
function GetIcon(iconName){
    return iconPath + iconName + ".svg";
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}
function GetRandomBool(){
    var randomNumber = Math.random() >= 0.5
    return randomNumber;
}
function isInt(value) {
    return !isNaN(value) &&
           parseInt(Number(value)) == value &&
           !isNaN(parseInt(value, 10));
}
function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
