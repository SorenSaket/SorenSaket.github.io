var effectsData;

function LoadEffects(){
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", "effects.json", true);
    xhr.responseType = "json";
    xhr.onload = function() 
    {
        effectsData = xhr.response;
    }
    xhr.send();
}

function AddEffect(instrument, effect)
{
    var cEffect = emptyEffect(instrument,effect);

    CreateEffectUI
}

function CreateEffectUI(instrument, effect)
{
    var effectUI = 
    '<div id="effect-' + instrument.order + '-' + instrument.effects.length + '" class="effect">'+
        '<div class="head">'+
            '<p>' + effect.effectType +'</p>'+
            '<div class="disable-button"></div>'+
        '</div>'+
        '<div class="controls">'+
            
        '</div>'+
    '</div>'
}
/* 
'<div class="control">'
                '<div class="knob" data-value="0" data-min="-1" data-max="1" onmousedown="SelectKnob(event)"></div>
                '<p>Pan</p>'
            '</div>'
*/

function emptyEffect(instrument, effect){
    var tempEffect = {
        DOM: null,
        toneEffect: ConvertToEffect(effect.effectType),
        color: GetColorHex(effect.color),
        inputs: []
    }
    /*for (let i = 0; i < effect.inputs.length; i++) {
        const element = array[i];
    }*/

    tempEffect.player.connect(instrument);
    instrument.effects.push(tempEffect);
    return tempEffect;
}

// Convert string to a tone effect
function ConvertToEffect(effectName){
    switch (effectName) {
        case "BitCrusher":
            return new Tone.BitCrusher();
        case "Reverb":
            return new Tone.Reverb();
        case "Freeverb":
            return new Tone.Reverb();  
        default:
            break;
    }
}