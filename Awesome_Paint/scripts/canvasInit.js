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

$('#color').change(function(e) {
    color = e.target.value;
    console.log(color);
});

$('#size').change(function(e){
    size = e.target.value;
    console.log(size);
});
$('#canvas').mousedown(function(e){
    if(paintPen || paintRectangle || paintCircle || paintLine || paintText)
    {
        var shape
        if(paintPen) {
            shape = "pen";
        } else if(paintRectangle) {
            shape = "rectangle";
        } else if(paintCircle) {
            shape = "circle";
        } else if(paintLine) {
            shape = "line";
        } else if(paintText) {
            shape = "text";
        }
        var object = { type: shape,  points : [], color : color, size : size }
        var point = { x : e.pageX - this.offsetLeft , y : e.pageY - this.offsetTop, dragging : false }
        object.points.push(point);
        allObjects.push(object);
    }
          
    paint = true;

    redraw();
});

$('#canvas').mousemove(function(e){
    if(paint){
        if(paintPen)
        {
            allObjects[allObjects.length - 1].points.push( { x : e.pageX - this.offsetLeft , y : e.pageY - this.offsetTop, dragging : true } )
            redraw();
        } else if(paintRectangle || paintCircle) {
            redraw({ x : e.pageX - this.offsetLeft , y : e.pageY - this.offsetTop, dragging : false });
        }
    }
});

$('#canvas').mouseup(function(e){
    if(paint){
        if(paintRectangle || paintCircle) {
            allObjects[allObjects.length - 1].points.push( { x : e.pageX - this.offsetLeft , y : e.pageY - this.offsetTop, dragging : true } )
            redraw();
        }
    }
    paint = false;
});

$('#canvas').mouseleave(function(e){
    if(paint){
        if(paintRectangle || paintCircle) {
            allObjects[allObjects.length - 1].points.push( { x : e.pageX - this.offsetLeft , y : e.pageY - this.offsetTop, dragging : true } )
            redraw();
        }
    }
    paint = false;
});


$('#eraser').click(function(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); 
    allObjects = []; 
    console.log('allObjects'); 

})


function redraw( currentpoint ){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    $.each(allObjects, function(i, value){
        if(value.type === 'pen')
        {
            context.strokeStyle = value.color;
            context.lineJoin = "round";
            context.lineWidth = value.size;
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
        if(value.type === 'rectangle')
        {
            if((value.points.length < 2 && currentpoint) || (value.points.length === 2))
            {
                var dif
                if( value.points.length < 2 && currentpoint )
                {
                    dif = difPoints(value.points[0], currentpoint)
                }
                if( value.points.length === 2)
                {
                    dif = difPoints(value.points[0], value.points[1])
                }
                context.beginPath();
                context.rect(value.points[0].x, value.points[0].y , dif.difx, dif.dify);
                context.fillStyle = value.color;
                context.fill();
            }
        }

             if(value.type === 'circle')
        {
            if((value.points.length < 2 && currentpoint) || (value.points.length === 2))
            {
                var dif
                if( value.points.length < 2 && currentpoint )
                {
                    dif = difPoints(value.points[0], currentpoint)
                }
                if( value.points.length === 2)
                {
                    dif = difPoints(value.points[0], value.points[1])
                }
                context.beginPath();
                context.arc(value.points[0].x, value.points[0].y , dif.difx, dif.dify, 2*Math.PI);
                context.fillStyle = value.color;
                context.fill();
            }
        }
    });
    console.log(allObjects);
}

function difPoints ( point1, point2){
    var xdif = (point2.x - point1.x);
    var ydif = (point2.y - point1.y);
    return {difx : xdif , dify : ydif};
}