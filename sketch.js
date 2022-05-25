var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  mario_running = loadAnimation("mario2.png","mario3.png","mario4.png");
  mario_collided = loadAnimation("mario1.png");
  
  groundImage = loadImage("ground2.jpg");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  //obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.jpg")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(400,200);
  

  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale = 1.2

 mario = createSprite(50,80,20,50);
 mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  

  mario.scale = 0.5;
  
 
  
  gameOver = createSprite(200,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  
 
  gameOver.scale = 0.3;
  restart.scale = 0.2;
 
  invisibleGround = createSprite(200,160,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  mario.setCollider("circle",0,0,40);
  mario.debug =true;
  
  score = 0;
  
}

function draw() {
  
  background(rgb(43,200,15));
  //displaying score
  text("Score: "+ score, 500,50);
  console.log(mario.y)
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
  ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 100){
     ground.x =200
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& mario.y >= 120) {
      mario.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    mario.velocityY = mario.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(mario)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the mario animation
      mario.changeAnimation("collided", mario_collided);
    
     
     
      ground.velocityX = 0;
      mario.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    

     if(mousePressedOver(restart)) {
      reset();
    }
   }
  
 
  //stop mario from falling down
  mario.collide(invisibleGround);
  
  


  drawSprites();
}

function reset(){
  score = 0;
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  mario.changeAnimation("running", mario_running);
  
  

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,180);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
         
              obstacle.scale =1.5
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale=2
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
     case 5: obstacle.addImage(obstacle5);
             break;
    //  case 6: obstacle.addImage(obstacle6);
     //         break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  
 }
 obstaclesGroup.collide(ground)
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = mario.depth;
   mario.depth = mario.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

