var Game = {};
Game.fps = 5;

const WORLD_SIZE = 20; //how many rectangles fit in canvas
const SNAKE_INIT_SIZE = 5;
var directions = Object.freeze({"NONE":0, "LEFT":1, "UP":2, "RIGHT":3,"DOWN":4})

var xMapping = new Array(WORLD_SIZE);
var yMapping = new Array(WORLD_SIZE);
var snake = [];
var direction;
var head = {};
var tail = {};
var apple = {};
var drawObject;

var canvasSize = 500; //in pixels
var rectSize = canvasSize/WORLD_SIZE;

$(document).ready(function(){

	//Styling
	var canvas = $("#snake-canvas");
	canvas.attr("width",canvasSize);
	canvas.attr("height",canvasSize);

	//Logic
	var c = canvas[0];
	drawObject = c.getContext("2d");
	init();
	reDraw();

	document.onkeydown = checkKey;

	Game._intervalId = setInterval(Game.run, 1000 / Game.fps);

});

Game.run = function() {
	// console.log("hi");
	update();
  	reDraw();
};

//Arrow key listeners
function checkKey(e) {

    e = e || window.event;

    var keyCode = parseInt(e.keyCode);
    if(keyCode >= 37 && keyCode <=40){
    	var newDirection = keyCode - 36;
    	if(direction == directions.NONE){
    		if(newDirection == directions.LEFT)
    			newDirection = directions.RIGHT;
    		direction = newDirection
    		
    	}else if(Math.abs(newDirection-direction) != 2){
    		direction = newDirection;
    	} 
    }
}

function updateCanvasSize(size){
	canvasSize = size;
	rectSize = size/WORLD_SIZE;
}

function init(){
	snake = [];
	direction = directions.NONE;
	xMapping.fill(false);
	yMapping.fill(false);

	head.x = WORLD_SIZE/2;
	head.y = WORLD_SIZE/2;
	tail.x = head.x - SNAKE_INIT_SIZE+1;
	tail.y = head.x;
	yMapping.fill(true,tail.y,head.y+1);
	xMapping.fill(true,tail.x,head.x+1);

	for (var i = SNAKE_INIT_SIZE-1; i >= 0; i--) {
		snake.push([tail.x+i,tail.y]);
	}
	generateApple();
}

function update(){
	if(direction != directions.NONE){
		var nextX;
		var nextY;
		if(direction == directions.UP || direction == directions.DOWN){
			nextX = head.x;
			if(direction == directions.UP){
				nextY = head.y-1;
			}else{
				nextY = head.y+1;
			}
		}else{
			nextY = head.y;
			if(direction == directions.LEFT){
				nextX = head.x-1;
			}else{
				nextX = head.x+1;
			}
		}
		if(nextX == WORLD_SIZE){
			nextX = 0
		}else if(nextX == -1){
			nextX = WORLD_SIZE -1;
		}
		if(nextY == WORLD_SIZE){
			nextY = 0
		}else if(nextY == -1){
			nextY = WORLD_SIZE -1;
		}

		for (var i = 0; i < snake.length; i++) {
			if (snake[i][0] == nextX && snake[i][1] == nextY){
				init();
				return;
			}
		}
		head.x = nextX;
		head.y = nextY;
		snake.unshift([head.x,head.y]);
		if(head.x == apple.x && head.y == apple.y){
			generateApple();
		}else{
			snake.pop(); //get rid of previous tail
			tail.x = snake[snake.length-1][0];
			tail.y = snake[snake.length-1][1];
		}
	}
}

function reDraw(){
	drawObject.clearRect(0,0,canvasSize,canvasSize);
	drawObject.fillStyle="#FF0000";
	drawObject.fillRect(canvasSize/WORLD_SIZE*apple.x,canvasSize/WORLD_SIZE*apple.y,rectSize,rectSize);
	drawObject.fillStyle="Black";
	for (var i = 0; i < snake.length; i++) {		
		drawObject.fillRect(canvasSize/WORLD_SIZE*snake[i][0],canvasSize/WORLD_SIZE*snake[i][1],rectSize,rectSize);
	}
}

function generateApple(){
	min = 0;
	max = WORLD_SIZE;
	min = Math.ceil(min);
 	max = Math.floor(max);
  	x = Math.floor(Math.random() * (max - min)) + min;
  	y = Math.floor(Math.random() * (max - min)) + min;

	for (var i = 0; i < snake.length; i++) {
		if (snake[i][0] == x && snake[i][1] == y){
			generateApple();
			return;
		}
	}
	apple.x = x;
	apple.y = y;	
}