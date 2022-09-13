const world = document.querySelector("#gameBoard");
const c = world.getContext("2d");

world.width = world.clientWidth;
world.height = world.clientHeight;

let frames = 0;

// defini l'état par defaut des touches
const keys = {
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
};

class Player {
  constructor() {
    this.width = 32; //largeur du joueur
    this.height = 32; //hauteur du joueur
    this.velocity = {
      x: 0, //vitesse de deplassement
      y: 0,
    };
    this.position = {
      x: (world.width - this.width) / 2, //position par defaut
      y: world.height - this.height,
    };
  }

  // le joueur sera un carré blanc
  draw() {
    c.fillStyle = "white";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  // a chaque mise a jour on dessine le joueur
  update() {
    if (keys.ArrowLeft.pressed && this.position.x >= 0) {
      this.velocity.x = -5;
    } else if (
      keys.ArrowRight.pressed &&
      this.position.x <= world.width - this.width
    ) {
      this.velocity.x = 5;
    } else {
      this.velocity.x = 0;
    }
    this.position.x += this.velocity.x;
    this.draw();
  }
}

const player = new Player();
// player.draw();

// boucle animation
const animationLoop = () => {
  requestAnimationFrame(animationLoop);
  c.clearRect(0, 0, world.width, world.height);
  player.update();
  frames++;
};
animationLoop();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      break;
  }
});

addEventListener("keyup", (event) => {
  //   console.log(event);
  switch (event.key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
  }
});
