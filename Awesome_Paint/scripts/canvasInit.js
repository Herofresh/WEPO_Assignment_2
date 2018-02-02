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

var color = "#FFFFFF";

//buttons functions to be implemented
$('#eraser').click(function(){
    eraser = true;
    paintCircle = false;
    paintPen = false;
    paintRectangle = false;
    paintLine = false;
    paintText = false;
  
});


$('#circle').click(function(){
    eraser = true;
    paintCircle = true;
    paintPen = false;
    paintRectangle = false;
    paintLine = false;
    paintText = false;
});

$('#rectangle').click(function(){
    eraser = true;
    paintCircle = false;
    paintPen = false;
    paintRectangle = true;
    paintLine = false;
    paintText = false;
});

$('#line').click(function(){
    eraser = true;
    paintCircle = false;
    paintPen = false;
    paintRectangle = false;
    paintLine = true;
    paintText = false;
});

$('#text').click(function(){
    eraser = true;
    paintCircle = false;
    paintPen = false;
    paintRectangle = false;
    paintLine = false;
    paintText = true;
});

$('#pen').click(function(){
    eraser = true;
    paintCircle = false;
    paintPen = true;
    paintRectangle = false;
    paintLine = false;
    paintText = false;
});

$('#canvas').mousedown(function(e){
    if(paintPen)
    {
        var penLine = { type: 'pen',  points : [], oColor: color }
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
    allObjects = null; 
    console.log('allObjects'); 

})

function redraw(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;

    $.each(allObjects, function(value){

    })
              
    for(var i=0; i < clickX.length; i++) {		
      context.beginPath();
      if(clickDrag[i] && i){
        context.moveTo(clickX[i-1], clickY[i-1]);
       }else{
         context.moveTo(clickX[i]-1, clickY[i]);
       }
       context.lineTo(clickX[i], clickY[i]);
       context.closePath();
       context.stroke();
    }
}