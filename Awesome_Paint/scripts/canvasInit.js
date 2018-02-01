var canvas = document.getElementById('canvas');

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

context = canvas.getContext("2d");

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

//buttons functions to be implemented
var circle = document.getElementById('circle');
circle.addEventListener('click',function(){

});

var rectangle = document.getElementById('rectangle');
rectangle.addEventListener('click',function(){
  console.log('to be implemented');

});

var line = document.getElementById('line');
line.addEventListener('click',function(){
  console.log('to be implemented');

});

var text = document.getElementById('text');
text.addEventListener('click',function(){
  console.log('to be implemented');

});

var pen = document.getElementById('pen');
pen.addEventListener('click',function(){
  console.log('to be implemented');

});

//Record the position of the mouse in an array. 
function addClick(x, y, dragging)
{
//adds one or more elements to the end of an array and returns the new length of the array.
  clickX.push(x); 
  clickY.push(y);
  clickDrag.push(dragging);
}

$('#canvas').mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;
          
    paint = true;
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    redraw();
});

$('#canvas').mousemove(function(e){
    if(paint){
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw();
    }
});

$('#canvas').mouseup(function(e){
    paint = false;
});

$('#canvas').mouseleave(function(e){
    paint = false;
});

function DrawCircle(clickX,clickY,canvas){
    var rad = dist(clickX,clickY);

}

function redraw(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;
              
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