let width = 800;
let height = 500;
let jumpstartingpoint = 0;

let yoshi = {
  x: 0,
  y: height - 100,
  jump: "no",
  sprite: 0,
  height: 60, 
  width: 51,
  health: 100,
  tongueOut: false
};

let ghost = {
  x: width - 200,
  y: height - 100,
  sprite: 0,
  direction: 'left',
  height: 59,
  width: 59,
  health: 100,
};

let walkAnimation = [
  [4, 0],
  [4, 0],
  [35, 0],
  [35, 0],
  [70, 0],
  [70, 0],
  [100, 0],
  [100, 0],
  [128, 0],
]
let jumpAnimation = [
  [155, 50],
  [155, 50],
  [182, 50],
  [182, 50],
  [220, 50],
  [220, 50],
]
let ghostAnimationRight = [
  [0, 0],
  [0, 0],
  [77, 0],
  [77, 0],
]

let ghostAnimationLeft = [
  [0, 58],
  [0, 58],
  [77, 58],
  [77, 58],
 
]

let yoshiTongueAnimation = [
  [0, 247, 37],
  [0, 247, 37],
  [0, 247, 37],
  [0, 247, 37],  
  [38, 247, 55],
  [38, 247, 55],
  [38, 247, 55],
  [38, 247, 55],
  [94,247,65],
  [94,247,65],
  [94,247,65],
  [94,247,65],
  [159,247,87],
  [159,247,87],
  [159,247,87],
  [159,247,87],
  [159,247,87],
  [94,247,65],
  [94,247,65],
  [94,247,65],
  [94,247,65],
  [94,247,65],
  [38, 247, 55],
  [38, 247, 55],
  [38, 247, 55],
  [38, 247, 55],
]




let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');



let grassBlock = new Image();
let yoshiImg = new Image();
let ghostImg = new Image();

function init() {
  grassBlock.src = 'GrassBlockSkybase.png';
  yoshiImg.src = 'yoshi.gif';
  ghostImg.src = 'ghost.png';  
  window.requestAnimationFrame(draw);
}



function drawYoshi() {
  let spriteHeight = 38;
  let spriteWidth = 32;
  if (yoshi.tongueOut) {
    animation = yoshiTongueAnimation;    
    spriteWidth = yoshiTongueAnimation[yoshi.sprite][2];
    yoshi.sprite = yoshi.sprite + 1;    
    if (yoshi.sprite == yoshiTongueAnimation.length) {
      yoshi.tongueOut = false;
    }
  } else if (yoshi.jump === "up") {
    yoshi.y = yoshi.y - 5;
    if ((jumpstartingpoint - yoshi.y) > 100) {
      yoshi.jump = "down";
    }
    animation = jumpAnimation;
    if (yoshi.y % 30 == 0) {
      yoshi.sprite = (yoshi.sprite + 1) % jumpAnimation.length;
    }
  } else if (yoshi.jump === "down") {
    yoshi.y = yoshi.y + 5;
    let distance = height - yoshi.y;
    if (distance < 100) {
      yoshi.jump = "no";
    }
    animation = jumpAnimation;
    if (yoshi.y % 30 == 0) {
      yoshi.sprite = (yoshi.sprite + 1) % jumpAnimation.length;
    }
  } else {
    animation = walkAnimation;
  }
  if (animation[yoshi.sprite] == undefined) {
    yoshi.sprite = 0;
  }
  ctx.drawImage(
    yoshiImg,
    animation[yoshi.sprite][0], animation[yoshi.sprite][1],
    spriteWidth, spriteHeight,
    yoshi.x, yoshi.y,
    Math.floor(spriteWidth * 1.59375), yoshi.height);
}


function drawGhost(){  
  if (ghost.direction == 'left') {
    animation = ghostAnimationLeft;
  } else {
    animation = ghostAnimationRight;
  }
  ctx.drawImage(ghostImg, 
    animation[ghost.sprite][0], animation[ghost.sprite][1],        
    76, 59,
    ghost.x, ghost.y, ghost.width, ghost.height);  
}





function drawGrass() {
  let x = 0;
  while (x < width) {
    ctx.drawImage(grassBlock, x, height - 50, 50, 50);
    x = x + 50;
  }
}

function drawHealthBar(character) {
  ctx.fillStyle = 'red';
  ctx.fillRect(character.x, character.y - 14, character.width, 12);
  ctx.fillStyle = 'yellow';
  let healthBar = Math.floor(character.width * character.health * 0.01)
  ctx.fillRect(character.x, character.y - 14, healthBar, 12);
  
			  
}


function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
        return false;
    }
    return true;
}

function isGhostTouchingYoshi() {
  return rectIntersect(
    yoshi.x, yoshi.y, yoshi.width, yoshi.height,
    ghost.x, ghost.y, ghost.width, ghost.height,
  );
}


function draw() {
  //clear everything
  ctx.clearRect(0, 0, width, height);
  //draw sky
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, width, 450);
  //draw grass
  drawGrass();
  //draw characters

  if (isGhostTouchingYoshi()) {
	  ghost.health = ghost.health - 0.25;
    yoshi.health = yoshi.health - 0.25;
  }

  if (yoshi.health < 0 || ghost.health < 0) {
	  alert("Game Over. Good Game");
	  return;
  }



  drawYoshi();
  drawGhost();
  //draw healhtbars
  drawHealthBar(yoshi);  
  drawHealthBar(ghost);
  
  window.requestAnimationFrame(draw);
}

window.addEventListener("keydown", function (e) {
  //====================
  //	THE W KEY
  //====================

  if (e.keyCode == 87) {
    jumpstartingpoint = yoshi.y;
    yoshi.jump = "up";
  }

  //====================
  //	THE UP KEY 
  //====================

  if (e.keyCode == 38) {
    ghost.y = ghost.y - 10;
    ghost.sprite = (ghost.sprite + 1) % ghostAnimationLeft.length;
    if (ghost.y < 0) {
    ghost.y = 0;
  }
  }
  // ====================
  // 	THE DOWN KEY 
  // ====================
  if (e.keyCode == 40) {
    ghost.y = ghost.y + 10;
    ghost.sprite = (ghost.sprite + 1) % ghostAnimationLeft.length;
    if (ghost.y > height - ghost.height) {
    ghost.y = height - ghost.height;
  }
  }

  //====================
  //	THE A KEY
  //====================
  if (e.keyCode == 65) {
    yoshi.x = yoshi.x - 10;
    if (yoshi.x < 0) {
      yoshi.x = 0;
    } 
    yoshi.sprite = (yoshi.sprite + 1) % walkAnimation.length;
  }

  //====================
  //	THE LEFT KEY
  //====================

  if (e.keyCode == 37) {  
    ghost.x = ghost.x - 10;
    ghost.direction = 'left';
    ghost.sprite = (ghost.sprite + 1) % ghostAnimationLeft.length;
    if (ghost.x < 0) {
    ghost.x = 0;
    } 
  }

  //====================
  //	THE D KEY
  //====================
  if (e.keyCode == 68) {
    yoshi.x = yoshi.x + 10; 
	
	
	if (yoshi.x > width - yoshi.width){
		yoshi.x =  width - yoshi.width;
	}

      
  
    yoshi.sprite = (yoshi.sprite + 1) % walkAnimation.length;
  }
  //====================
  //	THE RIGHT KEY 
  //====================
  if (e.keyCode == 39) {
    ghost.x = ghost.x + 10;
    ghost.direction = 'right';
    ghost.sprite = (ghost.sprite + 1) % ghostAnimationLeft.length;
    if (ghost.x > width - ghost.width) {
    ghost.x = width - ghost.width;
    }
  }

  //====================
  // Space = Tongue (Yoshi Super Power)
  //====================
  if (e.keyCode == 32) {
     yoshi.tongueOut = true; 
     yoshi.sprite = 0;

  }  

  //====================
  //	OTHER KEYS MUST GO HERE
  //====================

  
}, true);
