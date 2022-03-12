var allVectors = [];
var colors = ["#dc3545","#007bff", "#6f42c1","#e83e8c","#17a2b8","#ffc107","#28a745","#20c997","#6610f2","#fd7e14"]
var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
// ---------- Vector UI ----------
// Adds a new vector DOM element
function addVector(x,y){
    var count = $("#vectorcontainer").children().length;
    var name = convertNumberToName(count);
    var txt1 = 
    '<tr id="vector' + count +'" class="vector" style="background-color:' + colors[count] +';">' +
        '<td class="namecontainer">' +
            '<p class="vectorname"> ' + name +' </p>'+
        '</td>'+
        '<td>' +
            '<input id="x' + count + '" class="form-control w-100" placeholder="x" value="' + x +'">'+
        '</td>'+
        '<td>'+
            '<input id="y'+ count +'" style="display:inline" class="form-control w-100" placeholder="y" value="' + y +'">'+
        '</td>'+
        '<td>'+
            '<button type="button" class="close" aria-label="Close" onclick="removeVector('+ count +')"><span aria-hidden="true">&times;</span></button>'+
        '</td>'+
    '</tr>';
    $("#vectorcontainer").append(txt1);
}
// Removes vector DOM elements
function removeVector(num){
    $("#vector" + num).remove();
}

function removeAllVectors(){
    document.getElementById("vectorcontainer").innerHTML = "";
}

function reAddAllVectors(vectors){
    for (let i = 0; i < vectors.length; i++) 
        addVector(vectors[i].x,vectors[i].y);                                
}

function removeZeroVectors(){
    var allVectors = [];
    var vectors = $("#vectorcontainer").children();
    for (let i = 0; i < vectors.length; i++) 
    {
        //
        var vectorNum = vectors[i].id[6];
        var xinput = document.getElementById("x" + vectorNum);
        var yinput = document.getElementById("y" + vectorNum);
        if((xinput.value == "" || xinput.value == "0") && (yinput.value == "" || yinput.value == "0")){}else
        {
            allVectors.push(new THREE.Vector2(parseFloat(document.getElementById("x" + vectorNum).value) ,parseFloat(document.getElementById("y" + vectorNum).value)));
        }
    }
    removeAllVectors();
    reAddAllVectors(allVectors);
}

function getVector(name){
    //
}

// ---------- Output UI ----------
function removeAllOutputs(){
    document.getElementById("outputcontainer").innerHTML = "";
}

function addOutput(name, value, color){
    var component;
    if(color != null)
        component = 
        '<div class="input-group">'+
            '<span class="input-group-addon vectorname" style="background-color: ' + color + ';">' + name + '</span>'+
            '<input type="text" class="form-control" placeholder="data" value="' + value + '">'+
        '</div>';
    else
        component = 
        '<div class="input-group">'+
            '<span class="input-group-addon vectorname">' + name + '</span>'+
            '<input type="text" class="form-control" placeholder="data" value="' + value + '">'+
        '</div>';

    $("#outputcontainer").append(component);
}
// ---------- a ----------

function GetAllVectors(){
    var allVectors = [];
    var vectors = $("#vectorcontainer").children();
    for (let i = 0; i < vectors.length; i++) 
    {
        //
        var vectorNum = vectors[i].id[6];
        var xinput = document.getElementById("x" + vectorNum);
        var yinput = document.getElementById("y" + vectorNum);
        allVectors.push(new THREE.Vector2(parseFloat(xinput.value) ,parseFloat(yinput.value)));
    }
    removeAllVectors();
    reAddAllVectors(allVectors);
    return allVectors;
}

function calculate(drawPoints, drawVectors){
    allVectors = GetAllVectors();
    if(allVectors.length > 0)
    {
        reDraw(drawPoints,drawVectors);
    }
    writeOutput();
}

function searchOutput()
{
    //Recalculate
    /*calculate(isDrawingPoints, isDrawingVectors);*/
    // Removes previous outputs
    removeAllOutputs();
    // Gets the query from search input
    var query = document.getElementById("searchinput").value;
    //Splits query into names and removes spaces
    var names = query.replace(/ /g,'').split(',');
    // Converts all names into indexes
    var numbers = [];
    for (let i = 0; i < names.length; i++) {
        numbers.push(convertNameToNumber(names[i]));
    }
    //Create new array of Vectors based on query
    var vectors = [];
    for (let i = 0; i < numbers.length; i++) {
        vectors.push(allVectors[numbers[i]])
    }
    
    if(vectors.length > 0)
    {
        //Magnitude
        for (let i = 0; i < vectors.length; i++) {
            addOutput(convertNumberToName([numbers[i]]) + " Magnitude", showDistanceCaluculation(vectors[i]), colors[numbers[i]]);
        }
    }

    if(vectors.length > 1)
    {
        //Dot product
        addOutput("Dot Product", calculateDotProduct(vectors));
        var sum = calculateSum(vectors);
        //Sum 
        addOutput("Sum", sum.x + ", " + sum.y);
        
        var sumMag = "";
        for (let i = 0; i < vectors.length; i++) {
            sumMag += showDistanceCaluculation(vectors[i]) + "+"; 
        }
        //Magnitude Sum
        addOutput("Magnitude Sum", sumMag.slice(0, -1));

        //Sum Magnitude
        addOutput("Resultant Magnitude", showDistanceCaluculation(sum));
    }
    if(vectors.length == 2)
    {
        //Angle
        addOutput("Angle", showAngleCalculation(vectors));

        // Area
        addOutput("Area", caluculateArea(vectors));
    }
    if(vectors.length == 3)
    {
        //
        addOutput("Resolution of B and C in A", resolutionInComponents(vectors));
    }
    
}

function writeOutput(){
    var query = "A";
    
    for (let i = 1; i < allVectors.length; i++) {
        query += "," + convertNumberToName(i);
    }
    document.getElementById("searchinput").value = query;
    searchOutput();
}


// ---------- Calculations ----------
// Calculate the average position of vectors as points
function calculateAverage(){
    var average = new THREE.Vector2();
    for (let i = 0; i < allVectors.length; i++) {
        average.x += allVectors[i].x;
        average.y += allVectors[i].y;
    }
    average.x = average.x/allVectors.length;
    average.y = average.y/allVectors.length;
    return average;
}
// Calculate the sum of all vectors
function calculateSum(vectors){
    var sum = new THREE.Vector2();
    for (let i = 0; i < vectors.length; i++) {
        sum.x += vectors[i].x;
        sum.y += vectors[i].y;
    }
    return sum;
}
// Calculate the difference/negative sum of all vectors
function calculateDifference(){
    var difference = new THREE.Vector2();
    for (let i = 0; i < allVectors.length; i++) {
        difference.x -= allVectors[i].x;
        difference.y -= allVectors[i].y;
    }
    return difference;
}
// Calculate the distance between 0, 0 and vector i
function calculateDistance(i){
    var distance = new THREE.Vector2();
    var zero = new THREE.Vector2(0,0);
    distance = zero.distanceTo(allVectors[i]);
    return distance;
}
// Calculate the dot product of all vectors
function calculateDotProduct(vectors){
    var dot;
    var xdot;
    var ydot;
    for (let i = 0; i < vectors.length; i++) {
        if(i == 0)
        {
            xdot = vectors[i].x;
            ydot = vectors[i].y;
        }
        else
        {
            xdot = xdot* vectors[i].x;
            ydot = ydot* vectors[i].y;
        }
    }

    return xdot + ydot;
}

function caluculateArea(vectors)
{
    return Math.abs(vectors[1].x * vectors[0].y -  vectors[0].x  * vectors[1].y)/2;
}

// Calculate the angle of vector[0] and vector[1]
function showAngleCalculation(vectors){
    var dotp = calculateDotProduct(vectors);
    return "acos(" +  dotp + "/(" + showDistanceCaluculation(vectors[0])+"*"+showDistanceCaluculation(vectors[1]) + ")";
}
function calculateAngle(vectors){
    var dotp = calculateDotProduct(vectors);
    return toDegrees(Math.acos((dotp)/(vectors[0].length()*vectors[1].length())));
}
//
function resolutionInComponents(vectors){
    var s = (vectors[0].y - vectors[2].y * (vectors[0].x / vectors[2].x))/(vectors[1].y - ((vectors[2].y * vectors[1].x)/(vectors[2].x)));
    var t = (vectors[0].x - vectors[1].x * (vectors[0].y - vectors[2].y * (vectors[0].x / vectors[2].x))/(vectors[1].y - ((vectors[2].y * vectors[1].x)/(vectors[2].x))))/vectors[2].x
    var s1 = (vectors[0].y - vectors[2].y * (vectors[0].x / vectors[2].x));
    var s2 = (vectors[1].y - ((vectors[2].y * vectors[1].x)/(vectors[2].x)));
    var t1 = (vectors[0].x - vectors[1].x * ((vectors[0].y - vectors[2].y * (vectors[0].x / vectors[2].x))/(vectors[1].y - ((vectors[2].y * vectors[1].x)/(vectors[2].x)))));
    var t2 = vectors[2].x;
    var fracS = new Fraction(s);
    var fracT = new Fraction(t);
    return "s: " + fracS.n + "/" + fracS.d + " t: " + fracT.n + "/" + fracT.d;
}

//
function calculateAngleRad(){
    var dotp = calculateDotProduct();
    return  Math.acos((dotp)/(calculateDistance(0)*calculateDistance(1)));
}
//
function showDistanceCaluculation(vector){
    var distance = pow(vector.x,2) +pow(vector.y,2) 
    return "sqrt(" + distance + ")";
}
// ---------- Utilities ----------
// Converts a number to alphabetic. 0 = A, 1 = B, 26 = AA, 27 = AB
function convertNumberToName(num){
    var numbers = [0];

    // for each number add to array
    for (let i = 0; i < num; i++) 
    {
        // Check if I can add one
        var canadd = canAdd(numbers);
        if(canadd != -1)
        {
            numbers[canadd] += 1;
            for (let index = canadd+1; index < numbers.length; index++) {
                numbers[index] = 0;
            }
        }
        else if (canadd == -1)
        {
            numbers.push(0);
            for (let y = 0; y < numbers.length; y++) {
                numbers[y] = 0;
            }
        }
    }

    return convertArrayToLetters(numbers);
}

function convertNameToNumber(name){
    var string = "";

    for (let i = 0; i < name.length; i++) {
        string += convertLetterToNumber(name[i]);
    }
    return string;
}

function convertLetterToNumber(letter){
    return alphabet.indexOf(letter);
}

// Helper function for the function above. 
function canAdd(array){
    for (let i = 0; i < array.length; i++) {
        if(array[array.length-(1+i)] < 25)
        {
            return array.length-(1+i);
        }
    }
    return -1;
}
// Another helper function for converting number to name
function convertArrayToLetters(array){
    var name = "";
    // Convert numbers to letters
    for (let i = 0; i < array.length; i++) {
        name += alphabet[array[i]];
    }
    return name;
}
// 
function toDegrees (angle) {
    return angle * (180 / Math.PI);
}