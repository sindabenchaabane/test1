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

function update(){

    if (gameOver){
     // On affiche le message et on arrête l'exécution de cette frame
        context.fillStyle = "red";
        context.font = "40px sans-serif";
        context.fillText("GAME OVER", boardWidth / 3, boardHeight / 2);
        return; 
    }   
    
   requestAnimationFrame(update);
   if (paused) return; // Arrête le dessin si le jeu est en pause 
   context.clearRect(0,0,board.width,board.height);

   // obstacle
   console.log(obstacleArray.length)
   for (let i = 0; i < obstacleArray.length; i++){
       let obstacle = obstacleArray[i];
       obstacle.x += velocityX;
       context.drawImage(obstacle.img,obstacle.x,obstacle.y,obstacle.width,obstacle.height);
       
       //Vérification de la collision
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

    // 2. Animation (Changement d'image)
    // On utilise le modulo (%) pour boucler sur l'index de 0 à 3
    frameCount++;
    if (frameCount % 10 === 0) { // Change d'image toutes les 10 frames
        persoIndex = (persoIndex + 1) % persoArray.length;
        currentPersoImg = persoArray[persoIndex];
    }

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

*/

function update() {
    if (gameOver) {
        // On affiche le message et on arrête l'exécution de cette frame
        context.fillStyle = "red";
        context.font = "40px sans-serif";
        context.fillText("GAME OVER", boardWidth / 3, boardHeight / 2);
        return; 
    }

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Obstacles
    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i];
        obstacle.x += velocityX;
        context.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Vérification de la collision
        if (detectCollision(perso, obstacle)) {
            gameOver = true;
        }
    }

    // Physique du personnage
    velocityY += gravity;
    perso.y = Math.min(perso.y + velocityY, persoY); 

    // Dessin du personnage (on utilise l'image actuelle définie par l'intervalle)
    context.drawImage(currentPersoImg, perso.x, perso.y, perso.width, perso.height);
    
    // Score (optionnel mais recommandé)
    context.fillStyle = "black";
    context.font = "20px sans-serif";
    score++;
    // Augmente la vitesse tous les 500 points
    if (score % 500 == 0) {
    velocityX -= 0.2; // Devient de plus en plus négatif (donc plus rapide vers la gauche)
    }
    context.fillText("Score: " + score, 5, 20);
}

/*
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

*/
function movePerso(e) {
    if (gameOver) {
        // Relance le jeu si on appuie sur une touche après un Game Over
        location.reload(); 
        return;
    }
    
    if ((e.code == "Space" || e.code == "ArrowUp") && perso.y == persoY) {
        velocityY = -10;
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

    // NOUVELLE RÈGLE : On n'anime que si le personnage est AU SOL (pour éviter bug)
    // perso.y == persoY signifie qu'il est sur sa position de base (le sol)
    if (perso.y === persoY) {
        persoIndex++;

        if (persoIndex >= persoArray.length){
            persoIndex = 0;
        }
        currentPersoImg = persoArray[persoIndex];
    } else {
        // Si il est en l'air, on force l'image de saut
        currentPersoImg = persoArray[0]; 
    }
}

function detectCollision(a, b) {
    // On réduit la zone de collision de 10 pixels de chaque côté
    let padding = 10; 
    
    return a.x + padding < b.x + b.width - padding &&   // Le nez du perso touche l'arrière de l'obstacle
           a.x + a.width - padding > b.x + padding &&   // L'arrière du perso touche le nez de l'obstacle
           a.y + padding < b.y + b.height - padding &&  // Le haut du perso touche le bas
           a.y + a.height - padding > b.y + padding;    // Le bas du perso touche le haut
}
