// board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;
let paused = false; //pour mettre en pause le jeu

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

//viollette
let violetteImg = new Image();
violetteImg.src = "./img/violette.png"; // adapte le chemin
let violetteWidth = 70;
let violetteHeight = 70;
let violette = null; // null = pas visible
let violetteActive = false;
let shieldCount = 0; // nombre d'esquives disponibles (max 2)


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

    persoImg1.onload = function(){
    context.drawImage(persoImg1,perso.x,perso.y,perso.width,perso.height);
    }

    requestAnimationFrame(update);
    setInterval(placeobstacle,1500); // 1000 milliseconds = 1 second
    setInterval(changePersoImg1, 100); // 100 milliseconds
    document.addEventListener("keydown",movePerso)
}

//pause
function togglePause(){
    paused = !paused;
    document.getElementById("stopBtn").textContent = paused ? "▶ Reprendre" : "⏸ Pause";
    if (!paused){
        requestAnimationFrame(update); // relance la boucle
    }
}

//restart
function restartGame(){
    paused = false;
    gameOver = false;
    score = 0;
    shieldCount = 0;
    obstacleArray = [];
    violette = null;
    violetteActive = false;
    perso.y = persoY;
    velocityY = 0;
    document.getElementById("stopBtn").textContent = "⏸ Pause";
    requestAnimationFrame(update);
}

function update(){
   requestAnimationFrame(update);
   if (paused) return; // Arrête le dessin si le jeu est en pause 
   context.clearRect(0,0,board.width,board.height);

   // obstacle
   console.log(obstacleArray.length)
   for (let i = 0; i < obstacleArray.length; i++){
       let obstacle = obstacleArray[i];
       obstacle.x += velocityX;
       context.drawImage(obstacle.img,obstacle.x,obstacle.y,obstacle.width,obstacle.height);
       if (detectCollision(perso,obstacle)){
           if (shieldCount > 0){
               shieldCount--;
               obstacleArray.splice(i, 1);
               i--;
           } else {
               gameOver = true;
               persoImg1.onload = function(){
                   context.drawImage(persoImg1,perso.x,perso.y,perso.width,perso.height);
               }
           }
       }
   }

   if (gameOver) return; // Arrête le dessin si Game Over
    
   // Physique du personnage
   velocityY += gravity;
   perso.y = Math.min(perso.y + velocityY, persoY); // Applique la gravité

   // DESSIN DU PERSO : Utilise currentPersoImg et perso.y
   context.drawImage(currentPersoImg, perso.x, perso.y, perso.width, perso.height);

   // Gestion de la violette
   if (violetteActive && violette){
       violette.x += velocityX;
       context.drawImage(violetteImg, violette.x, violette.y, violette.width, violette.height);

       // Attrapée par le perso
       if (detectCollision(perso, violette)){
           if (shieldCount < 2) shieldCount++;
           violetteActive = false;
           violette = null;
       }

       // Sort de l'écran sans être attrapée
       if (violette && violette.x + violette.width < 0){
           violetteActive = false;
           violette = null;
       }
   }

   // Affichage bouclier
   context.fillStyle = "purple";
   context.font = "18px Arial";
   context.fillText("🌸 Esquives : " + shieldCount, 10, 25);
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

   console.log("in place obstacle")
  
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

   //place violette
   if (!violetteActive && Math.random() < 0.30) {
        let randomY = boardHeight - violetteHeight - Math.floor(Math.random() * 150) - 30; // hauteur aléatoire
        violette = {
            x: boardWidth,
            y: randomY,
            width: violetteWidth,
            height: violetteHeight
        };
        violetteActive = true;
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
