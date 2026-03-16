// board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;


//Personnage
let persoWidth = 88;
let persoHeight = 94;
let persoX = 50;
let persoY = boardHeight - persoHeight;
let persoImg1 = new Image();
let persoImg2 = new Image () ;
let persoImg3= new Image () ;
let persoImg4 = new Image () ;
persoImg1.src = "./img+/1.png";
persoImg2.src = "./img+/2.png";
persoImg3.src = "./img+/3.png";
persoImg4.src = "./img+/4.png";
let persoArray = [persoImg1, persoImg2, persoImg3, persoImg4]
let persoIndex = 0 ;
let currentPersoImg = persoArray[persoIndex]
let perso = {
   x : persoX,
   y : persoY,
   width : persoWidth,
   height : persoHeight
};




// Obstacle


let obstacleArray = []
let chateauHeight = 40;
let chateauWidth = 40;
let swordWidth = 40;
let swordHeight = 40;
let pontWidth = 40;
let pontHeight= 40;


let chateauX = boardWidth;
let chateauY = boardHeight - chateauHeight;
let swordX = boardWidth;
let swordY = boardHeight - swordHeight;
let pontX = boardWidth;
let pontY = boardHeight - pontHeight;




let chateauImg = new Image();
chateauImg.src = "./img/chateau1.png";
let swordImg = new Image();
swordImg.src = "./img/sword.png"
let pontImg = new Image ();
pontImg.src = "./img/pont.png";


//physics
let velocityX = -8 // obstacle moving left speed
let velocityY = 0;
let gravity = .4;
let gameOver = false;
let score = 0;




window.onload = function(){
   board = this.document.getElementById("board");
   board.height = boardHeight;
   board.width = boardWidth;
   context = board.getContext("2d");//used for drawing on the board


   // TODO HERE add setInterval function calling function to change persoImg
   setInterval(changePersoImg1, 100); // 100 milliseconds


   document.addEventListener("keydown",movePerso)
   // TODO add event listener

   this.requestAnimationFrame(update);
   setInterval(placeobstacle,70); // 1000 milliseconds = 1 second

// draw initial perso
//context.fillStyle = "green";
//context.fillRect(perso.x,perso.y,perso.width,perso.height);

persoImg1.onload = function(){
context.drawImage(persoImg1,perso.x,perso.y,perso.width,perso.height);
}

requestAnimationFrame(update);
setInterval(placeobstacle,100); // 1000 milliseconds = 1 second
}

let frameCount = 0;

function update() {
    if (gameOver) return; // On arrête tout si c'est fini

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height); // Efface l'écran une seule fois

    // 1. Physique (Gravité)
    velocityY += gravity;
    perso.y = Math.min(perso.y + velocityY, persoY); 

    // 2. Animation (Changement d'image)
    // On utilise le modulo (%) pour boucler sur l'index de 0 à 3
    frameCount++;
    if (frameCount % 10 === 0) { // Change d'image toutes les 10 frames
        persoIndex = (persoIndex + 1) % persoArray.length;
        currentPersoImg = persoArray[persoIndex];
    }

    // 3. DESSIN DU PERSONNAGE
    // IMPORTANT : On utilise currentPersoImg et perso.y
    context.drawImage(currentPersoImg, perso.x, perso.y, perso.width, perso.height);

    // 4. Obstacles
    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i];
        obstacle.x += velocityX;
        context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (detectCollision(perso, obstacle)) {
            gameOver = true;
        }
    }
}


function movePerso(e){
   console.log('executing the miovePerso function outside for loop')
   if (gameOver){
       return;
   }
   if((e.code == "Space" || e.code == "ArrowUp") && perso.y == persoY){
       //jump
       console.log('executing the miovePerso function')
       velocityY = -10
   }
}


function placeobstacle(){
   //place obstacle
  
   let placeobstacleChance = Math.random();//0-0.9999


   if (placeobstacleChance > .90) { //10% you get pont
       let obstacle = {
       img : pontImg,
       x : pontX,
       y : pontY,
       width : pontWidth,
       height :pontHeight}
       obstacleArray.push(obstacle)
   }
   else if (placeobstacleChance > .70){ //30% you get sword
       let obstacle = {
       img : swordImg,
       x : swordX,
       y : swordY,
       width : swordWidth,
       height : swordHeight}
       obstacleArray.push(obstacle);


   }
   else if(placeobstacleChance >.50){ //50% you get chateau
       let obstacle = {
       img : chateauImg,
       x : chateauX,
       y : chateauY,
       width : chateauWidth,
       height : chateauHeight}
       obstacleArray.push(obstacle);
       }
   if (obstacleArray.length > 5){
       obstacleArray.shift(); // removes the first element for the Array 
  
   }


   }


function changePersoImg1(){
    if (gameOver){ 
         return;
    }
    persoIndex++;

    if (persoIndex >= persoArray.length){

        persoIndex = 0;
    }
    currentPersoImg = persoArray[persoIndex];

}

function detectCollision(a,b){
   return a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y;


}
