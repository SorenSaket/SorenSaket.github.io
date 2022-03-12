var photo = new UnsplashPhoto();
var appID = "f0898b6de1ed24effa9319d88b974a97359d60e13d2e36c92d90ec90ab2a836a";
var quoteWidth;
var quoteHeight;

var fonts = null;
var loadedFonts = [];

document.addEventListener("DOMContentLoaded", function(event) {
    SetText();
    GetRandomQuote();
    GetPhoto();
    GetFonts();
    

    document.getElementById("file-input").addEventListener('change', function(e)
    {
        var files = document.getElementById("file-input").files;
        if(files.length > 0)
            UpdateImageUI(URL.createObjectURL(files[0]), null);
    });
});

window.onmouseup = function(event){
    if(event.target.parentElement.id != "font-select-dropdown")
    {
        document.getElementById("font-select-dropdown").style.display = "none";
    }
}

window.onresize = function(event) {
    SetSize();
};

function GetPhoto()
{
    
    photo.all().of(["landscape"]).fetch();
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", photo.url + "?client_id=" + appID); 
    xhr.responseType = "blob";
    xhr.onload = function() 
    {
        var imageUrl = URL.createObjectURL(xhr.response);
        UpdateImageUI(imageUrl, imageUrl);
        SetSize();
    }
    xhr.send();
}

function UpdateImageUI(url, author){
    if(author != null)
        document.getElementById('credits-link').setAttribute("href", "https://unsplash.com");
    else
        document.getElementById('credits-link').setAttribute("href", author);
    document.getElementById('quote').style.backgroundImage = 'url(' + url + ')';
}

function SetText(){
    document.getElementById('quote-text').innerHTML = document.getElementById('quote-input').innerHTML;
    document.getElementById('quote-author').innerHTML = document.getElementById('author-input').value;
}

function SetSize()
{
    var xRaw = document.getElementById('x-input').value;
    var yRaw = document.getElementById('y-input').value;
    
    quoteWidth = Number(xRaw.replace(/[^0-9\.]+/g,""));
    quoteHeight = Number(yRaw.replace(/[^0-9\.]+/g,""));

    var quote = document.getElementById('quote');
    quote.style.width = document.getElementById('x-input').value = quoteWidth + "px";
    quote.style.height = document.getElementById('y-input').value = quoteHeight + "px";
    
    // Center the quote
    var margin = Math.max((quote.parentElement.offsetHeight - quote.offsetHeight)/2, 64) + "px";
    quote.style.marginTop = margin;
    quote.style.marginBottom = margin;
    //quote.style.backgroundSize = quoteWidth + "px " + quoteHeight + "px";
}

function SetOverlay()
{
    document.getElementById("quote-overlay").style.backgroundColor = "rgba(0,0,0," + (1- document.getElementById("overlay-input").value)  + ")";
}

function GetRandomQuote()
{
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", "quotes.json", true);
    xhr.responseType = "json";
    xhr.onload = function() 
    {
        var data = xhr.response;
        var a = data[Math.floor(Math.random()*data.length)];
        document.getElementById("quote-input").innerHTML = a.quote;
        document.getElementById("author-input").value = a.author;
        SetText();
    }
    xhr.send();
}

function Download()
{
    html2canvas(document.getElementById("quote"), {
        allowTaint: true,
        /*width: quoteWidth,
        height: quoteHeight*/
    }).then(function(canvas) {
        
        canvas.crossOrigin = "anonymous"
        var  uri = canvas.toDataURL();
        var filename = 'Your Amazing Quote.png'
        var link = document.createElement('a');

        if (typeof link.download === 'string') {

            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);

        } else {
            window.open(uri);
        }
    });
}

function GetFonts(){
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", "fonts.json", true);
    xhr.responseType = "json";
    xhr.onload = function() 
    {
        fonts = xhr.response;
        console.log(fonts);
        SetFonts(12);
        /*LoadFont(fonts.items[59].family, 400, fonts.items[59].files["regular"]);
        document.getElementById("quote-text").style.fontFamily = fonts.items[59].family;
        document.getElementById("quote-text").style.fontWeight = 400;*/
    }
    xhr.send();
}

function SetFonts(numberOfFonts){
    var select = document.getElementById("font-select-dropdown");

    for (let i = 0; i < numberOfFonts; i++) {
        LoadFont(fonts.items[i].family, "regular", fonts.items[i].files["regular"]);
        LoadFont(fonts.items[i].family, 700, fonts.items[i].files[700]);
        select.innerHTML += '<li onclick="SelectFont(' + i +')"><a style=" font-family:' + fonts.items[i].family + ';">'+ fonts.items[i].family + '</a></li>'
    }
}

function LoadFont(name, weight, url){
    var font = document.createElement('style');
    font.appendChild(document.createTextNode("\
    @font-face {\
        font-family: " + name + ";\
        font-weight: " + weight + ";\
        src: url('" + url + "') format('truetype');\
    }\
    "));
    document.head.appendChild(font);
    loadedFonts.push({
        family: name,
        weight: weight
    });
}

function OpenFontSelect(){
    
    document.getElementById("font-select-dropdown").style.display = "block";
}

function SelectFont(i)
{
    document.getElementById("font-select-dropdown").style.display = "none";
    document.getElementById("font-select-input").style.fontFamily = fonts.items[i].family;
    document.getElementById("font-select-input").innerHTML = fonts.items[i].family;
    document.getElementById("quote-text").style.fontFamily = fonts.items[i].family;
    document.getElementById("quote-author").style.fontFamily = fonts.items[i].family;
}

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
                if(file.type.match(/image.*/))
                    UpdateImageUI(URL.createObjectURL(file), null);
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

