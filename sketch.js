//Create variables here
var dog,happyDog;
var dogImage, happyDogImage;
var database;
var foodS,foodStock;
var changeState;
var readState;
var bedroomImage,gardenImage,washroomImage;
var lastFed,fedTime,currentTime,feed;
var sadDog;

function preload()
{
  //load images here
  dogImage = loadImage("Dog.png");
  happyDogImage = loadImage("Happy.png");
  bedroom = loadImage("Bed Room.png");
  garden = loadImage("Garden.png");
  washroom = loadImage("Wash Room.png");
  sadDog = loadImage("Lazy.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);
  foodObject = new Food();
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  fedTime = database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  dog = createSprite(250,300,150,150);
  dog.addImage(dogImage);
  dog.scale=0.15;
  
  feed = createButton("Feed Dog");
  feed.position(700,95);
  feed.mousePressed(function feedDog(){
    dog.addImage(happyDogImage);
    text("testing",100,100);
    foodObject.updateFoodStock(foodObject.getFoodStock()-1);
    database.ref('/').update({
    Food:foodObject.getFoodStock(),
    feedTime:hour(),
    gameState:"hungry"
  })
  });
  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoodS);

 
}


function draw() { 
  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObject.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObject.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObject.washroom();
  }else{
    update("Hungry");
    foodObject.display();
  }
  /*background(46,139,87);
  foodObject.display();
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed:"+lastFed%12+"pm",350,30)
  }
  else if(lastFed===0){
    text("Last Feed:12 AM",350,30)
  }
  else{
    text("Last Feed:"+lastFed+"AM",350,30);
  }*/
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }
 
  drawSprites();
}
 /* if(keyWentDown(UP_ARROW)) {
    writeStock(foodS);
    dog.addImage(happyDogImage);
  }
  drawSprites(); 
  //add styles here

}*/

function readStock(data) {
  foodS=data.val();
  foodObject.updateFoodStock(foodS);
}

/*function feedDog(){
  dog.addImage(happyDogImage);
  text("testing",100,100);
  foodObject.updateFoodStock(foodObject.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObject.getFoodStock(),
    feedTime:hour(),
    gameState:"hungry"
  })
}*/

function addFoodS() {
  text("testing2",280,280);
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}
