myStorage = window.localStorage;

var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
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
var select = false;
var selectedObject = -1;
var size = 12;
var color = "#ff0000";
var font = "monospace";
var hasInput = false;
var stackPointer = 0;

function KeyPress(e) {
    var evtobj = window.event ? event : e
    if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
        if (stackPointer >= 0) {
            stackPointer--;
            redraw();
        }
    }
    if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
        if (stackPointer !== allObjects.length) {
            stackPointer++;
            redraw();
        }
    }
}

document.onkeydown = KeyPress;

//buttons functions to be implemented
$('#circle').click(function () {
    paintCircle = true;
    paintPen = false;
    paintRectangle = false;
    paintLine = false;
    paintText = false;
    select = false;
});

$('#rectangle').click(function () {
    paintCircle = false;
    paintPen = false;
    paintRectangle = true;
    paintLine = false;
    paintText = false;
    select = false;
});

$('#line').click(function () {
    paintCircle = false;
    paintPen = false;
    paintRectangle = false;
    paintLine = true;
    paintText = false;
    select = false;
});

$('#text').click(function () {
    paintCircle = false;
    paintPen = false;
    paintRectangle = false;
    paintLine = false;
    paintText = true;
    select = false;
});

$('#pen').click(function () {
    paintCircle = false;
    paintPen = true;
    paintRectangle = false;
    paintLine = false;
    paintText = false;
    select = false;
});

$('#undo').click(function () {
    if (stackPointer > 0) {
        stackPointer--;
        redraw();
    }
});

$('#redo').click(function () {
    if (stackPointer !== allObjects.length) {
        stackPointer++;
        redraw();
    }
});

$('#save').click(function () {
    localStorage.setItem('allObjects', allObjects);
});

$('#select').click(function () {
    paintCircle = false;
    paintPen = false;
    paintRectangle = false;
    paintLine = false;
    paintText = false;
    select = true;
});

$('#color').change(function (e) {
    color = e.target.value;
});

$('#size').change(function (e) {
    size = e.target.value;
});

$('#font').change(function (e) {
    font = $('#font').find("option:selected").val();
});

$('#canvas').mousemove(function (e) {
    if (select) {
        var point = { x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop, dragging: false };
        for (var i = stackPointer - 1; i >= 0; i--) {
            if (contains(allObjects[i], point)) {
                $('#canvas').css('cursor', 'move');
                break;
            } else {
                $('#canvas').css('cursor', 'default');
            }
        }
    } else {
        $('#canvas').css('cursor', 'default');
    }
});

$('#canvas').mousedown(function (e) {
    var point = { x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop, dragging: false };
    if (paintPen || paintRectangle || paintCircle || paintLine) {
        var shape
        if (paintPen) {
            shape = "pen";
        } else if (paintRectangle) {
            shape = "rectangle";
        } else if (paintCircle) {
            shape = "circle";
        } else if (paintLine) {
            shape = "line";
        }
        var object = { type: shape, points: [], color: color, size: size };
        object.points.push(point);
        if (stackPointer === allObjects.length) {
            allObjects.push(object);
        } else {
            allObjects[stackPointer] = object;
        }


        paint = true;

        redraw();
        stackPointer++;
    }
    if (paintText) {
        var object = { type: "text", points: [], color: color, font: size + "px " + font };
        object.points.push(point);
        if (stackPointer === allObjects.length) {
            allObjects.push(object);
        } else {
            allObjects[stackPointer] = object;
        }
        shape = "text";
        if (!hasInput) {
            addInput(e.clientX, e.clientY);
        }
        stackPointer++;
    }
    if (select) {
        for (var i = stackPointer - 1; i >= 0; i--) {
            if (contains(allObjects[i], point)) {
                selectedObject = i;
                break;
            } else {
                selectedObject = -1;
            }
        }
    }
});

$('#canvas').mousemove(function (e) {
    if (paint) {
        if (paintPen) {
            allObjects[allObjects.length - 1].points.push({ x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop, dragging: true })
            redraw();
        } else if (paintRectangle || paintLine || paintCircle) {
            redraw({ x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop, dragging: false });
        }
    } else if (select && selectedObject !== -1) {
        var point = { x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop, dragging: false };
        var dif = difPoints(allObjects[selectedObject].points[0], point);
        allObjects[selectedObject].points[0].x += dif.difx;
        allObjects[selectedObject].points[0].y += dif.dify;;
        allObjects[selectedObject].points[1].x += dif.difx;
        allObjects[selectedObject].points[1].y += dif.dify;
        redraw();
    }
});

$('#canvas').mouseup(function (e) {
    if (paint) {
        if (paintRectangle || paintLine || paintCircle) {
            allObjects[stackPointer - 1].points.push({ x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop, dragging: true })
            redraw();
        }
    }
    paint = false;
    selectedObject = -1;
});

$('#canvas').mouseleave(function (e) {
    if (paint) {
        if (paintRectangle || paintLine || paintCircle) {
            allObjects[stackPointer - 1].points.push({ x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop, dragging: true })
            redraw();
        }
    }
    paint = false;
    selectedObject = -1;
});

$('#eraser').click(function () {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    allObjects = [];
    stackPointer = 0;
    selectedObject = -1;
})


function redraw(currentpoint) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    console.log(allObjects);
    $.each(allObjects, function (i, value) {
        if (i < stackPointer) {
            if (value.type === 'pen') {
                context.strokeStyle = value.color;
                context.lineJoin = "round";
                context.lineWidth = value.size;
                for (var i = 0; i < value.points.length; i++) {
                    context.beginPath();
                    if (value.points[i].dragging && i) {
                        context.moveTo(value.points[i - 1].x, value.points[i - 1].y);
                    } else {
                        context.moveTo(value.points[i].x, value.points[i].y);
                    }
                    context.lineTo(value.points[i].x, value.points[i].y);
                    context.closePath();
                    context.stroke();
                }
            }
            if (value.type === 'rectangle') {
                if ((value.points.length < 2 && currentpoint) || (value.points.length === 2)) {
                    var dif;
                    if (value.points.length < 2 && currentpoint) {
                        dif = difPoints(value.points[0], currentpoint);
                    }
                    if (value.points.length === 2) {
                        dif = difPoints(value.points[0], value.points[1]);
                    }
                    context.beginPath();
                    context.rect(value.points[0].x, value.points[0].y, dif.difx, dif.dify);
                    context.fillStyle = value.color;
                    context.fill();
                    context.closePath();
                }
            }
            if (value.type === 'circle') {
                if ((value.points.length < 2 && currentpoint) || (value.points.length === 2)) {
                    var dif
                    if (value.points.length < 2 && currentpoint) {
                        dif = radius(value.points[0], currentpoint)
                    }
                    if (value.points.length === 2) {
                        dif = radius(value.points[0], value.points[1])
                    }
                    context.beginPath();
                    context.arc(value.points[0].x, value.points[0].y, dif, 0, 2 * Math.PI, false);
                    context.fillStyle = value.color;
                    context.fill();
                    context.closePath();
                }
            }
            if (value.type === 'line') {
                context.strokeStyle = value.color;
                context.lineJoin = "round";
                context.lineWidth = value.size;
                if ((value.points.length < 2 && currentpoint) || (value.points.length === 2)) {
                    context.beginPath();
                    context.moveTo(value.points[0].x, value.points[0].y);
                    if (value.points.length < 2 && currentpoint) {
                        context.lineTo(currentpoint.x, currentpoint.y);
                    }
                    if (value.points.length === 2) {
                        context.lineTo(value.points[1].x, value.points[1].y);
                    }
                    context.closePath();
                    context.stroke();
                }
            }
            if (value.type === 'text') {
                drawText(value);
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
}

function difPoints(point1, point2) {
    var xdif = (point2.x - point1.x);
    var ydif = (point2.y - point1.y);
    return { difx: xdif, dify: ydif };
}

function radius(point1, point2) {
    var dif = difPoints(point1, point2);
    return Math.sqrt(Math.pow(dif.difx, 2) + Math.pow(dif.dify, 2))
}

function addInput(x, y) {

    var input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (x - 4) + 'px';
    input.style.top = (y - 4) + 'px';

    input.onkeydown = handleEnter;

    document.body.appendChild(input);

    input.focus();

    hasInput = true;
}

function handleEnter(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
        allObjects[allObjects.length - 1].text = this.value;
        drawText(allObjects[stackPointer - 1]);
        document.body.removeChild(this);
        hasInput = false;
    }
}

function drawText(textObject) {
    context.textBaseline = 'top';
    context.textAlign = 'left';
    context.font = textObject.font;
    context.fillStyle = textObject.color;
    context.fillText(textObject.text, textObject.points[0].x, textObject.points[0].y);
}

function contains(object, point) {
    if (object.type === 'rectangle') {
        var dif = difPoints(object.points[0], object.points[1]);
        return object.points[0].x <= point.x && point.x <= object.points[0].x + dif.difx && object.points[0].y <= point.y && point.y <= object.points[0].y + dif.dify;
    } else if (object.type === 'circle') {
        var r = radius(object.points[0], object.points[1]);
        return Math.sqrt((point.x - object.points[0].x) * (point.x - object.points[0].x) + (point.y - object.points[0].y) * (point.y - object.points[0].y)) < r;
    }
}

function saveData() {
    var inputVal = $('#filename').val();
    console.log(inputVal);
    myStorage.setItem(inputVal, JSON.stringify(allObjects));
    var allCurrentFiles = myStorage.getItem('allFiles');
    if (allCurrentFiles !== null) {
        myStorage.setItem('allFiles', myStorage.getItem('allFiles') + ";" + inputVal);
    } else {
        myStorage.setItem('allFiles', inputVal);
    }
}

function loadData() {
    var allCurrentFiles = myStorage.getItem("allFiles");
    console.log(allCurrentFiles);
    if (allCurrentFiles !== null) {
        var split = allCurrentFiles.split(";");
        $.each(split, function (i, v) {
            var choice = document.createElement('option');
            choice.text = i + ": " + v;
            choice.value = v;
            $('#savedFilesPicker').append(choice);
        })
    } else {
        var choice = document.createElement('option');
        choice.text = "No Files";
        $('#savedFilesPicker').append(choice);
    }
}

function load() {
    allObjects = JSON.parse(myStorage.getItem($('#savedFilesPicker').find("option:selected").val()));
    stackPointer = allObjects.length;
    redraw();
}