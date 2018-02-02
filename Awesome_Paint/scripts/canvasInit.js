var canvas = document.getElementById('canvas');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

context = canvas.getContext("2d");

var allObjects = new Array();

var paint;

var paintPen = true;
var paintCircle = false;
var paintRectangle = false;
var paintLine = false;
var paintText = false;
var eraser = false;
var size = 5;

var color = "#ff0000";

//buttons functions to be implemented
$('#circle').click(function(){
    eraser = true;
    paintCircle = true;
    paintPen = false;
    paintRectangle = false;
    paintLine = false;
    paintText = false;
    size = false;
});

$('#rectangle').click(function(){
    eraser = true;
    paintCircle = false;
    paintPen = false;
    paintRectangle = true;
    paintLine = false;
    paintText = false;
    size = false;
});

$('#line').click(function(){
    eraser = true;
    paintCircle = false;
    paintPen = false;
    paintRectangle = false;
    paintLine = true;
    paintText = false;
    size = false;
});

$('#text').click(function(){
    eraser = true;
    paintCircle = false;
    paintPen = false;
    paintRectangle = false;
    paintLine = false;
    paintText = true;
    size = false;
});

$('#pen').click(function(){
    eraser = true;
    paintCircle = false;
    paintPen = true;
    paintRectangle = false;
    paintLine = false;
    paintText = false;
    size = false;
});

$('#color').change(function(e) {
    color = e.target.value;
    console.log(color);
});

$('#canvas').mousedown(function(e){
    if(paintPen)
    {
        var penLine = { type: 'pen',  points : [], color : color }
        var point = { x : e.pageX - this.offsetLeft , y : e.pageY - this.offsetTop, dragging : false }
        penLine.points.push(point);
        allObjects.push(penLine);
    }
          
    paint = true;

    redraw();
});

$('#canvas').mousemove(function(e){
    if(paint){
        if(paintPen)
        {
            allObjects[allObjects.length - 1].points.push( { x : e.pageX - this.offsetLeft , y : e.pageY - this.offsetTop, dragging : true } )
        }
        redraw();
    }
});

$('#canvas').mouseup(function(e){
    paint = false;
});

$('#canvas').mouseleave(function(e){
    paint = false;
});

function DrawCircle(clickX,clickY){
    var rad = dist(clickX,clickY);

}

$('#eraser').click(function(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
    allObjects = []; 
    console.log('allObjects'); 

})

$('#size').click(function(){
    size = 10+context.lineWidth;
     

})

function redraw(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    console.log(allObjects);
<<<<<<< HEAD
    
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = size;
=======
>>>>>>> 29282c05505e65dfd6defa616cdbc6d468e2cf26

    $.each(allObjects, function(i, value){
        if(value.type === 'pen')
        {
            context.strokeStyle = value.color;
            context.lineJoin = "round";
            context.lineWidth = 5;
            for(var i=0; i < value.points.length; i++) {		
                context.beginPath();
                if(value.points[i].dragging && i){
                  context.moveTo(value.points[i-1].x, value.points[i-1].y);
                 }else{
                   context.moveTo(value.points[i].x-1, value.points[i].y);
                 }
                 context.lineTo(value.points[i].x, value.points[i].y);
                 context.closePath();
                 context.stroke();
            }
        }
    });

}