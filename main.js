//let enemyArray = [];

class Position{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Velocity{
    constructor(dx, dy){
        this.dx = dx;
        this.dy = dy;
    }
}

class Entity{
    constructor(position){
        this.position = position;
    }

    draw(){}

    tick(){}

    remove(){}
}

class Keys{
    constructor(){
        this.up = false;
        this.down = false;
        this.shoot = false;
    }
}

class Player extends Entity{
    constructor(position){
        super(position)
        this.width = 25;
        this.height = 55;
        this.color = "black";
        this.score = 0;
        const image = new Image();
        image.src = "spaceship.png"
        this.image = image;
        this.up = false;
        this.down = false;
        this.velocity = new Velocity(400, 400)
        this.player1Points = 0;
        this.player2Points = 0;
    
    }

    draw(){
        context.fillStyle = this.color;
        context.fillRect(
          this.position.x - this.width / 2,
          this.position.y - this.height / 2,
          this.width,
          this.height
        );
        context.drawImage(
            this.image,
            this.position.x,
            this.position.y,
          );
    }

    resetAndScore(){
        if(this.position.y < 10){
            this.position.y = 750
            this.score++
        }
    }
    
    
    move(game) {
        if (this.up) {
          this.position.y -= 400 * game.deltaTime;
        } else if (this.down) {
          this.position.y += 400 * game.deltaTime;
        }
        if (this.position.y < this.height / 2) {
          this.position.y = this.height / 2;
        } else if (this.position.y > height - this.height / 2) {
          this.position.y = height - this.height / 2;
        }
        if (game.player1.position.y == 0) {
            this.player1.resetAndScore(750)
          game.player1Points++;
        } else if (game.player2.position.y == 0) {
            this.player2.resetAndScore(750)
          game.player2Points++;
        }
      }
}

class Enemy extends Entity{
    constructor(position, velocity, color){
        super(position, velocity);
        this.position = position;
        this.velocity = velocity;
        this.radius = 10;
        this.color = color;
      }
      draw(game) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(
          this.position.x,
          this.position.y,
          this.radius,
          0,
          Math.PI * 2
        );
        context.fill();
      }

      move(game) {
        this.position.x += this.velocity.dx * game.deltaTime;
    
        if (enemyPlayerCollision(this, game.player1)) {
          game.player1.position.y = canvas.height;
        }
        if (enemyPlayerCollision(this, game.player2)) {
          game.player2.position.y = canvas.height;
        }
    }

    remove(game, i) {
        if (this.position.x < 0 || this.position.x > canvas.width)
        game.entities.splice(i, 1);
    }
}



class Game{
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.lastTime = Date.now()
        this.deltaTime = 0;
        this.entities = [];
        this.player1 = new Player(new Position(width * 0.33, 750));
        this.player2 = new Player(new Position(width * 0.66, 750))
        this.entities.push(this.player1);
        this.entities.push(this.player2);
        this.player1Points = 0;
        this.player2Points = 0;
    }
    start(){
        tick()
    }

    drawMidLine(){
        context.fillstyle = "pink";
        context.fillRect(width / 2, height / 2, 20, height / 2)
        context.fill();
    }

    drawPoints() {
        context.fillStyle = "pink";
        context.font = "60px Fantasy";
        context.textAlign = "center";
        context.fillText(this.player1Points, width / 2 - 100, 50);
    
        context.fillStyle = "pink";
        context.font = "60px Fantasy";
        context.textAlign = "center";
        context.fillText(this.player2Points, width / 2 + 100, 50);
      }

      /*calculatePoints() {
        if (this.player1.position.y >= height - 50) {
          this.player1.position.y = 
          this.player1Points++;
        }
        if (this.player2.position.y <= this.player2.height / 2) {
          this.player2.position.y = canvas.height;
          this.player2Points++;
        }
    }*/
}

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
let frameCount = 0;
let randomDirection = generatesRandomNumberBetween(1,0);
const game = new Game();

function handlePlayer1KeyDown(event) {
    if (event.repeat) return;
  
    if (event.key == "w") {
      game.player1.up = true;
        } else if (event.key == "s") {
        game.player1.down = true;
    }
}
  
function handlePlayer2KeyDown(event) {
    if (event.repeat) return;
  
    if (event.key == "o") {
      game.player2.up = true;
        } else if (event.key == "l") {
        game.player2.down = true;
    }
}
  
function handlePlayer1KeyUp(event) {
    if (event.key == "w") {
      game.player1.up = false;
        } else if (event.key == "s") {
        game.player1.down = false;
    }
}
  
function handlePlayer2KeyUp(event) {
    if (event.key == "o") {
      game.player2.up = false;
        } else if (event.key == "l") {
      game.player2.down = false;
    }
}
  
function handlePlayer1Attack(event) {
    if (event.key === "a" && attackReady1 === true) {
      if (event.repeat) return;
      attackReady1 = false;
  
      game.entities.push(
        new Enemy(
        new Position(game.player1.position.x - game.player1.width / 2 + 80,
        game.player1.position.y - game.player1.height / 2 + 40),
        new Velocity(1200, 0),"blue"));
    }
}
setInterval(() => {
    attackReady1 = true;
}, 3000);

function handlePlayer2Attack(event) {
    if (event.key == "p" && attackReady2 === true) {
      if (event.repeat) return;
      attackReady2 = false;
  
      game.entities.push(
        new Enemy(
        new Position(
         game.player2.position.x - game.player2.width / 2 - 40,
        game.player2.position.y - game.player2.height / 2 + 40),
        new Velocity(-1200, 0),
        "red"));
    }
}

setInterval(() => {
    attackReady2 = true;
}, 3000);



function enemyPlayerCollision(enemy, player) {
    let cdx = Math.abs(enemy.position.x  - player.position.x);
    let cdy = Math.abs(enemy.position.y - player.position.y);
  
    if (cdx > player.width / 2 + enemy.radius) {
      return false;
    }
  
    if (cdy > player.height / 2 + enemy.radius) {
      return false;
    }
  
    if (cdx <= player.width / 2) {
      return true;
    }
    if (cdy <= player.height / 2) {
      return true;
    }
  
    let distSquared =
      (cdx - player.width / 2) ** 2 + (cdy - player.height / 2) ** 2;
    return distSquared <= enemy.radius ** 2;
  }

  function generatesRandomNumberBetween(max, min) {
    return Math.floor(Math.random() * max) + min
  }

  function tick(){
    let currentTime = Date.now();
    game.deltaTime = (currentTime - game.lastTime) / 1000;
    game.lastTime = currentTime;

    frameCount++;

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    if (frameCount == 100) {
        game.entities.push(
        new Enemy(new Position(0, generatesRandomNumberBetween(600,10)),new Velocity(200, 0), "white"));
        game.entities.push(
        new Enemy(new Position(800, generatesRandomNumberBetween(600, 10)),new Velocity(-200, 0),"white"));

        frameCount = 0;
    }

    for (let i = 0; i < game.entities.length; i++) {
        let entity = game.entities[i];
        entity.draw(game);
        entity.move(game);
        entity.remove(game, i);
    }

    game.drawPoints()
    game.drawMidLine()
    //game.calculatePoint();

    requestAnimationFrame(tick)
}

window.addEventListener("keypress", handlePlayer1KeyDown);
window.addEventListener("keypress", handlePlayer2KeyDown);
window.addEventListener("keyup", handlePlayer1KeyUp);
window.addEventListener("keyup", handlePlayer2KeyUp);
window.addEventListener("keydown", handlePlayer1Attack);
window.addEventListener("keydown", handlePlayer2Attack);

  game.start()