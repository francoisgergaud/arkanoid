
/**
*represent a coordonate in 2 dimensional plan
*/
Vect2D = function(){
	var x;
	var y;
	
	this.getX = function(){
		 return x;
	};
	
	this.getY = function(){
		 return y;
	};
	
	this.setX = function(xParameter){
		x = xParameter;
	};
	
	this.setY = function(yParameter){
		y = yParameter;
	};
};

/**
* the tray, define by its coordinates and its lenght;
*/
Tray = function(){
	/**
	 * the canvas to draw the tray on
	 */
	var displayCanvas;

	/**
	 * coordinate of the tray
	 */
	var position;
	
	/**
	 * size of the tray
	 */
	var size;
	
	/**
	 * is the ball attached to the tray: i.e.:
	 *waiting for un gamer click to move
	 */
	var isBallAttached;
	
	return{
		/**
		 * set the position of the tray.
		 */
		setPosition: function(xCoordinate, ball, canvasElement){
			xCoordinate -= canvasElement.offsetLeft;
			if(xCoordinate < size.getX()/2){
				xCoordinate = size.getX()/2;
			}else if((canvasElement.width - xCoordinate) < size.getX()/2){
				xCoordinate = canvasElement.width - size.getX()/2
			}
			position.setX(xCoordinate);
			if(isBallAttached){
				ball.getPosition().setX(position.getX());
			}
		},
		/**
		* initialize the tray position and lenght
		*/
		initialize: function(canvas,y, width, height){
			displayCanvas = canvas;
			position = new Vect2D();
			position.setX(canvas.width / 2);
			position.setY(y);
			size = new Vect2D();
			size.setX(width);
			size.setY(height);
			isBallAttached = true;
		},
	
		getPosition: function(){
			return position;
		},
	
		getSize: function(){
			return size;
		},
	
		draw: function(){
			var context = displayCanvas.getContext('2d');      
			context.fillStyle = "rgb(150,29,28)";
			context.fillRect (position.getX() - Math.round(size.getX()/2) , position.getY(),size.getX(),size.getY());
			console.log("draw the tray at position ("+position.getX() +","+position.getY() +")");
		},
	
		/**
		* attach the ball to the tray
		*/
		attachBall: function(){
			isBallAttached = true;
		},
	
		/**
		* unattach the ball to the tray
		*/
		unattachBall: function(){
			isBallAttached = false;
		},
	
		/**
		* return true if the ball is attached to the tray, else false
		*/
		isBallAttached: function(){
			return isBallAttached;
		},

		/**
		 * detect a collision with the tray
		 */
		detectColisionWithTray : function(tempNextPosition, ball){
			var result = false;
			if(ball.getAngle() > 90 && ball.getAngle() < 270 && Math.floor(tempNextPosition.getY()) == position.getY() && Math.abs(tempNextPosition.getX() - position.getX()) <= size.getX()/2){
				result = true;
			}
			return result;
		},

		/**
		 * calcul and actualize the ball position and angle after a colision with the tray
		 */
		calculateRebonbWithTray : function(tempNextPosition, ball){
			var impactX = ball.getPosition().getX() - position.getX();
			var fractAngle = 160 / size.getX();
			if(impactX > 0 ){
				//impact on the left side of the tray
				ball.setAngle(impactX * fractAngle);
			}else if(impactX < 0 ){
				ball.setAngle(360 + (impactX * fractAngle));
			}else{
				ball.setAngle(0);
			}
		}
	};
};

Level = function(){
	
	/**
	 * the brick grid: the contained element represent the bricks (0 : empty, 1: brick)
	 */
	var grid;

	/**
	 * the level canvcas (the one to be drawn on)
	 */	
	var displayCanvas;
	
	/**
	 * the original canvcas (to help restoring canvas part when wrick desappear)
	 */	
	var bufferCanvas;
	
	/**
	 * the width of the brick
	 */
	var brickWidth;
	/**
	 * the height of the brick
	 */
	var brickHeight;
	
	/**
	 * the number of brick which may contain the grid
	 */
	var gridWidth;

	var gridHeight;

	var numberOfBrick;

	/**
	 * the brick pixel value
	 */
	var brickRedColorValue=255;
	var brickGreenColorValue=255;
	var brickBlueColorValue=255;
	
	/**
	 * the brick border color value
	 */
	var brickBorderRedColorValue=0;
	var brickBorderGreenColorValue=0;
	var brickBorderBlueColorValue=0;

	/**
	 * the brick border width
	 */
	var brickBorderWidth = 1;
	
	/**
	* create the buffer canvas from the size of the original canvas used for display
	*/
	function createBufferCanvas(displayCanvas){
		var result = document.createElement('canvas');
		result.width = displayCanvas.width;
		result.height = displayCanvas.height;
		result.getContext("2d").fillStyle = "rgb(70,29,234)";
		result.getContext("2d").fillRect (0,0,result.width,result.height );
		return result;
	}
	
	
	return {
		/**
		 * initialize the level
		 */
		initialize: function(htmlCanvasElement,brickWidthparameter, brickHeightParameter, gridWidthParameter, gridHeightParameter){
			//resize the HTML canvas element
			htmlCanvasElement.width = brickWidthparameter*gridWidthParameter;
			// we add 3 grid unit to left some place for the tray
			htmlCanvasElement.height = brickHeightParameter*(gridHeightParameter+2);
			bufferCanvas = createBufferCanvas(htmlCanvasElement);
			displayCanvas= htmlCanvasElement;
			brickWidth = brickWidthparameter;
			brickHeight = brickHeightParameter;
			gridWidth = gridWidthParameter;
			gridHeight = gridHeightParameter;
			this.initializeRandom(bufferCanvas);
		},
	
		/**
		 * initialize a random level canvas (for now, just fill the half upper-part with bricks)
		 */	
		initializeRandom: function(bufferCanvas){
			//draw the bricks
			grid = [];
			numberOfBrick = 0;
			for(var x = 0; x < gridWidth; x++){
				grid[x] = [];
				for(var y =0; y < gridHeight; y++){
					if(y < gridHeight / 2){
						//only fill the upper part with bricks
						grid[x][y] = 1;
						numberOfBrick++;
						context = bufferCanvas.getContext('2d');
						context.beginPath();
						context.rect(x*brickWidth, y*brickHeight, brickWidth, brickHeight);
						context.fillStyle = 'rgb('+brickRedColorValue+','+brickGreenColorValue+','+brickBlueColorValue+')';
						context.fill();
						context.strokeStyle ='rgb('+brickBorderRedColorValue+','+brickBorderGreenColorValue+','+brickBorderBlueColorValue+')';
						context.stroke();
					}else{
						grid[x][y] = 0;
					}
				}	
			}
		},

		getNumberOfBrick : function(){
			return numberOfBrick;
		},

		/**
		 * copy the buffer canvas into the display canvas
		 */
		draw: function(){
			displayCanvas.getContext("2d").drawImage(bufferCanvas,0,0,displayCanvas.width,displayCanvas.height);
		},

		//remove a brick from the canvas
		removeBrick: function(position){
			var xBrick = Math.floor(position.getX()/brickWidth);
			var yBrick = Math.floor(position.getY()/brickHeight);
			grid[xBrick][yBrick] = 0;
			numberOfBrick--;
			var canvasXPosition = (xBrick*brickWidth)+1;
			var canvasYPosition = (yBrick*brickHeight)+1;
			context = bufferCanvas.getContext('2d');
			context.beginPath();
			context.rect(canvasXPosition, canvasYPosition, brickWidth, brickHeight);
			context.fillStyle = "rgb(70,29,234)";
			context.fill();
			context.strokeStyle ="rgb(70,29,234)";
			context.stroke();
		},

		/**
		* detect colision with brick
		*/
		detectColisionWithBrick: function(tempNextPosition){
			var xBrick = Math.floor(tempNextPosition.getX() / brickWidth);
			var yBrick = Math.floor(tempNextPosition.getY() / brickHeight);
			var result = false;
			if(grid[xBrick][yBrick] == 1){
				result = true;
			}
			return result;
		},

		calculateRebondWithBrick: function(tempNextPosition, ball){
			if(tempNextPosition.getX() == ball.getPosition().getX()){
				if(ball.getAngle() <=180){
					ball.setAngle(180 - ball.getAngle());
				}else{
					ball.setAngle(540-ball.getAngle());
				}
			}else if(tempNextPosition.getY() == ball.getPosition().getY()){
				ball.setAngle(360-ball.getAngle());
			}else{
				if(tempNextPosition.getX() % brickWidth != 0){
					if(ball.getAngle() <=180){
						ball.setAngle(180 - ball.getAngle());
					}else{
						ball.setAngle(540-ball.getAngle());
					}
				}else if(tempNextPosition.getY() % brickHeight != 0){
					ball.setAngle(360-ball.getAngle());
				}else{
					ball.setAngle((ball.getAngle()+180)%360);
				}
			}
		},

		/**
		 * detect collision with the border
		 */
		detectColisionWithBorder: function(tempNextPosition){
			var result = false;
			if(tempNextPosition.getX() <= 0  || tempNextPosition.getX() >= gridWidth*brickWidth || tempNextPosition.getY() <= 0){
				result = true;
			}
			return result;
		},

		/**
		 * detect collision with the bottom border
		 */
		detectColisionWithBottomBorder: function(tempNextPosition){
			var result = false;
			if(tempNextPosition.getY() >=  (gridHeight+1)*brickHeight){
				result = true;
			}
			return result;
		},

		/**
		 * calcul and actualize the ball position and angle after a colision with the border
		*/	
		caculateRebondWithBorder: function(tempNextPosition, ball){
			//collision with left border
			if(tempNextPosition.getX() <= 0){
				//180 < angle < 360
				ball.setAngle(360 - ball.getAngle());
			} //collision with right border
			else if(tempNextPosition.getX() >= gridWidth*brickWidth){
				// 0 < angle < 180
				if(ball.getAngle() < 90){
					ball.setAngle(270 + ball.getAngle());
				}else{
					ball.setAngle(360 - ball.getAngle());
				}
			}//collision with top
			else if(tempNextPosition.getY() <= 0){
				// 270 < angle <360 ou 0 < angle < 90
				if(ball.getAngle() < 90){
					ball.setAngle(180 - ball.getAngle());
				}else{
					ball.setAngle(540 - ball.getAngle());
				}
			}
		},

		displayMessage : function(text){
			var ctx = displayCanvas.getContext("2d");
			ctx.font="bold 40px Georgia";
			ctx.fillText(text,10,displayCanvas.height/2);
		}
	};
};

/**
* the representation of the ball, with its position and move vectore
*/
Ball = function(){
	
	/**
	 * the coordinate of the ball
	 */
	var position;
	
	/**
	 * the angle of the ball from the normal (in degree)
	 */
	var angle;
	
	/**
	 * the ball speed
	 */
	var speed;
	
	/**
	 * the radius of the ball
	 */
	
	var size;
	/**
	 * instantiate ther ball vector and position
	 */

	/**
	 * the display canvas to draw the ball on
	 */
	var displayCanvas;

	return{

		initialize : function(canvas, x, y, radius, angleParameter, speedParameter){
			position=new Vect2D();
			position.setX(x);
			position.setY(y);
			size = radius;
			angle=angleParameter;		
			speed = speedParameter;
			displayCanvas = canvas;
		},
	
		/**
		* return the ball 2D vector
		*/
		getAngle: function(){
			return angle;
		},
	
		/**
		* return the ball position
		*/
		getPosition: function(){
			return position;
		},
		
		/**
		* draw the ball on the canvas
		*/
		draw: function(){
			var context = displayCanvas.getContext('2d');
			context.beginPath();
			context.arc(position.getX(), position.getY(), size, 0, 2 * Math.PI);
			context.fillStyle = 'rgb(29,150,28)';
			context.fill();
			console.log("draw the ball at position: ("+position.getX() +","+position.getY() +")");
		},
	
		/**
		 * return the ball speed
		 */
		getSpeed: function(){
			return speed;
		},

		/**
		 * set the angle
		 */
		setAngle: function(angleParameter){
			angle = angleParameter;
		},
		
		/**
		 * set the ball position
		 */
		setPosition: function(x, y){
			position.setX(x);
			position.setY(y);
		}
	};
};

/**
* representation of the ball
*/
Game = function(displayCanvas){

	/**
	* the ball
	*/
	var ball;
	
	/**
	* the tray
	**/
	var tray;
	
	/**
	* the level containing the bricks
	*/
	var level;
	
	/**
	* define uf the player loose the party
	*/
	var loose = false;
	
	/**
	* define uf the player win the party
	*/
	var win = false;

	/**
	 * timer used in the main loop
	 */
	var timer;

	/**
	 * initialize the environment
	 * move the ball and refresh the canvas
	 */
	initialize = function(displayCanvas, refreshPeriod){
		setMouseListenerOnCanvas(displayCanvas);
		timer=setInterval(function(){mainLoop();},refreshPeriod);
	}
	
	/**
	 * move the ball to its next atomic position.
	 */
	animate = function(){
		//var approximationError =0;
		var cumulDistance = 0;
		var fromX;
		var fromY;
		var distanceX;
		var distanceY;
		var tempNextPosition;
		var approximationError = 0;
		while(cumulDistance < ball.getSpeed()){
			//the temp next position for detecting colision
			fromX = ball.getPosition().getX();
			fromY = ball.getPosition().getY();
			distanceX = Math.sin(ball.getAngle()* Math.PI / 180)* ball.getSpeed();
			distanceY = Math.cos(ball.getAngle()* Math.PI / 180)* ball.getSpeed();
			tempNextPosition = new Vect2D();
			if(Math.abs(distanceX) > Math.abs(distanceY)){
				if(distanceX > 0){
					tempNextPosition.setX(fromX+1);		
				}else{
					tempNextPosition.setX(fromX-1);	
				}
				approximationError += Math.abs(distanceY) / Math.abs(distanceX);
				approximationError %= 1;
				if(distanceY > 0){
					tempNextPosition.setY(Math.round(fromY-approximationError));		
				}else{
					tempNextPosition.setY(Math.round(fromY+approximationError));	
				}
			}else{
				if(distanceY > 0){
					tempNextPosition.setY(fromY-1);		
				}else{
					tempNextPosition.setY(fromY+1);	
				}
				approximationError += Math.abs(distanceX) / Math.abs(distanceY);
				approximationError %= 1;
				if(distanceX > 0){
					tempNextPosition.setX(Math.round(fromX+approximationError));		
				}else{
					tempNextPosition.setX(Math.round(fromX-approximationError));	
				}
			}
			//the real next position of the ball to calculate	
			if(tray.detectColisionWithTray(tempNextPosition, ball)){
				tray.calculateRebonbWithTray(tempNextPosition,ball);
			}else if(level.detectColisionWithBorder(tempNextPosition)){
				level.caculateRebondWithBorder(tempNextPosition, ball);		
			}else if(level.detectColisionWithBrick(tempNextPosition)){
				level.calculateRebondWithBrick(tempNextPosition, ball);
				level.removeBrick(tempNextPosition);
			}else{
				cumulDistance++;
				ball.setPosition(tempNextPosition.getX(), tempNextPosition.getY());
			}
			checkLoose(tempNextPosition, level);
			checkWin(level);
			if(loose || win){
				break;
			}
		}
	};


	

	/**
	 * move the ball to its next displayPosition
	 */
	mainLoop = function(){
		if(tray.isBallAttached() == false){
			animate();
		}
		if (loose) {
			clearInterval(timer);
			level.displayMessage('you loose');
		}else if(win){
			clearInterval(timer);
			level.displayMessage('you win!');
		}else{
			paint();
		}
		
	};

	/**
	 * verify if the use has lost
	 */
	checkLoose = function(tempNextPosition, level){
		if(level.detectColisionWithBottomBorder(tempNextPosition)){
			loose = true;
		}
	};

	/**
	 * verify if the user won
	 */
	checkWin = function(level){
		if(level.getNumberOfBrick() == 0){
			win = true;
		}
	};

	/**
	 * display the canvasForCalcul in the canvas for display, and add
	 * the ball and the tray by using their position
	 */
	paint = function(){
		//draw the environment
		level.draw();
		//draw the tray
		tray.draw();
		//draw the ball
		ball.draw();
	};

	

	/**
	 * listen to the mouse move on the canvas 
	 */
	setMouseListenerOnCanvas = function(displayCanvas){
		displayCanvas.onmousemove = function(event){
			//modify the position of the tray according to the mouse position
			tray.setPosition(event.clientX, ball, displayCanvas);			
		}
		displayCanvas.onclick = function(event){
			//modify the position of the tray according to the mouse position
			tray.unattachBall();			
		}
	};

	revive = function(){
		loose = false;
		tray = new Tray();
		tray.initialize(displayCanvas, gridHeight*gridOffsetHeight, trayWidth,trayHeight);
		ball = new Ball();
		ball.initialize(displayCanvas,tray.getPosition().getX()+(tray.getSize()/2),tray.getPosition().getY(), ballRadius, ballAngle, ballSpeed);
		initialize(displayCanvas,refreshTimeMs);
	};

	var gridHeight = 10;
	var gridWidth = 10;
	var gridOffsetHeight = 24;
	var gridOffsetWidth = 40;
	var refreshTimeMs = 50;
	var trayWidth = 40;
	var trayHeight = 5;
	var ballRadius = 3;
	var ballAngle = 45;
	var ballSpeed = 5;
	level = new Level();
	level.initialize(displayCanvas,gridOffsetWidth,gridOffsetHeight, gridWidth, gridHeight);
	tray = new Tray();
	tray.initialize(displayCanvas, gridHeight*gridOffsetHeight, trayWidth,trayHeight);
	ball = new Ball();
	ball.initialize(displayCanvas,tray.getPosition().getX()+(tray.getSize()/2),tray.getPosition().getY(), ballRadius, ballAngle, ballSpeed);
	initialize(displayCanvas,refreshTimeMs);
	
}

