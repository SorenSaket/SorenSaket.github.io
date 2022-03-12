var canvas;
var parent ;
var centerX;
var centerY;
var pxPerUnit = 32;
var isDrawingPoints = false;
var isDrawingVectors = false;


window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
	resizeCanvas(parent.offsetWidth-64,parent.offsetHeight-64);
    centerX = width/2;
    centerY = height/2; 
    reDraw(isDrawingPoints, isDrawingVectors);
}

function setup() {
    //Canvas Setup
    parent = document.getElementById("canvasparent");
    var canvas = createCanvas(parent.offsetWidth-64,parent.offsetHeight-64);
    canvas.parent("canvasparent");

    centerX = width/2;
    centerY = height/2;
    reDraw(false, false);
}

function reDraw(points, vectors){
    isDrawingPoints = points;
    isDrawingVectors = vectors;
    pxPerUnit = calcualteZoom();
    
    background(240);
    drawGrid();
    if(points)
    {
        for (let i = 0; i < allVectors.length; i++) 
            drawPoint(centerX + (allVectors[i].x*pxPerUnit), centerY - (allVectors[i].y*pxPerUnit), colors[i])
        if(allVectors.length > 1)
        {
            var average = calculateAverage();
            drawX(centerX + average.x*pxPerUnit,centerY - average.y*pxPerUnit,"#343a40");
        }
    }
    if(vectors)
    {
        /*if(allVectors.length > 2)
        {
            drawVectorSum();                
        }*/
        for (let i = 0; i < allVectors.length; i++)
            if(allVectors[i].x != 0 ||allVectors[i].y != 0)
                drawVector(centerX,centerY,centerX+allVectors[i].x*pxPerUnit,centerY-allVectors[i].y*pxPerUnit, colors[i]);
        if(allVectors.length > 1)
        {
            var sum = calculateSum(allVectors);
            drawX(centerX + sum.x*pxPerUnit,centerY - sum.y*pxPerUnit,"#343a40");
        }
    }
}

function drawVectorSum()
{
    var x = centerX;
    var y = centerY;
    var x2;
    var y2;
    // Draw Vector sum
    for (let i = 0; i < allVectors.length; i++) {
        x2 = x + (allVectors[i].x*pxPerUnit);
        y2 = y - (allVectors[i].y*pxPerUnit);
        drawVector(x,y, x2, y2, "#343a40"/*colors[i]*/)
        x = x2;
        y = y2;
    }
}

function drawVector(x1,y1,x2,y2, color)
{
    var offset = 8;
    
    // Draw Line
    fill(color);
    stroke(color);
    strokeWeight(3);
    line(x1,y1,x2,y2);

    //Draw arrow
    push();
    noStroke();
    var angle = atan2(y1 - y2, x1 - x2); //gets the angle of the line
    translate(x2, y2); //translates to the destination vertex
    rotate(angle-PI);
    triangle(
        0, 0, 
        -offset, offset/2, 
        -offset, -offset/2);
    pop();
}



// -------- Drawers --------
function drawPoint(x,y,color){
    var size = pxPerUnit/4;
    fill(color);
    noStroke();
    ellipse(x, y, size, size);
}

function drawX(x,y,color){
    var size = pxPerUnit/4;
    fill(color);
    strokeWeight(size/2);
    stroke(color);
    line(x-size/2, y-size/2, x+size/2, y+size/2);
    line(x+size/2, y-size/2, x-size/2, y+size/2);
}

function drawAngle(vector1, vector2){
    print("AAA");
    console.log(vector1.angle() + " _ " + vector2.angle());
    strokeWeight(2);
    stroke(colors[0]);
    fill("#fc9c9c");
    arc(centerX, centerY, 16, 16, vector1.angle(), vector2.angle());
}

function drawGrid(){
    
    //line(0, centerY, windowWidth, centerY);
    //line(centerX, 0, centerX, windowHeight);
    
    //Y Lines |||
    for (let i = 0; i < width/pxPerUnit; i++) 
    {
        if(i == round((width/pxPerUnit)/2))
        {
            stroke(0, 0, 0);
            strokeWeight(2);
            centerX = i*pxPerUnit;
        }
        else
        {
            strokeWeight(1);
            stroke('rgba(0,0,0,0.1)');
        }
        
        line(i*pxPerUnit, 0, i*pxPerUnit, height);
    }

    //X Lines ---
    for (let i = 0; i < height/pxPerUnit; i++) 
    {
        if(i == round((height/pxPerUnit)/2))
        {
            stroke(0, 0, 0);
            strokeWeight(2);
            centerY = i*pxPerUnit;
        }
        else
        {
            strokeWeight(1);
            stroke('rgba(0,0,0,0.1)');
        }
        
        line(0, i*pxPerUnit, width, i*pxPerUnit);
    }
}

function calcualteZoom(){
    return 32;
}