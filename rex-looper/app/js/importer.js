// -------- Drag --------

function dropHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'file') {
                var file = ev.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);
                GetAudio(file);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);

        }
    }
    // Pass event to removeDragData for cleanup
    removeDragData(ev)
}

function dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

function removeDragData(ev) {
    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to remove the drag data
        ev.dataTransfer.items.clear();
    } else {
        // Use DataTransfer interface to remove the drag data
        ev.dataTransfer.clearData();
    }
}

function GetAudio(file){
    var buffer = new Tone.Buffer(URL.createObjectURL(file), function(){
        CreateInstrument(buffer);
        vis(buffer);
    });
}


function vis(buffer){

    var data = buffer.toArray(0),

    canvas = document.getElementById('clip-canvas'),
    width = canvas.width,
    height = canvas.height,
    ctx = canvas.getContext('2d'),
    step = Math.ceil(data.length / width),
    amp = 100;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 4;
    ctx.lineCap="round";
    ctx.lineJoin="round";
    ctx.strokeStyle = 'rgba(32, 201, 151)';
    ctx.beginPath();
    ctx.moveTo(0, height/2 + data[0]);
    for (var i = 0; i < width; i++) {
        ctx.lineTo(i, height/2 + data[step*i] * amp);
    }
    ctx.closePath();
    ctx.stroke();
}