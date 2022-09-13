const world = document.querySelector("#gameBoard");
const c = world.getContext("2d");

world.width = world.clientWidth;
world.height = world.clientHeight;

let frames = 0;

const keys = {
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
  fired: { pressed: false },
};

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = "./space-invaders.png";
    image.onload = () => {
      this.image = image;
      this.width = 48;
      this.height = 48;
      this.position = {
        x: world.width / 2 - this.width / 2,
        y: world.height - this.height - 10,
      };
    };
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  shoot() {
    missiles.push(
      new Missile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y,
        },
      })
    );
  }

  update() {
    if (this.image) {
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
}

class Alien {
  constructor({ position }) {
    this.velocity = { x: 0, y: 0 };
    const image = new Image();
    image.src = "./alien.png";
    image.onload = () => {
      this.image = image;
      this.width = 32;
      this.height = 32;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    if (this.image) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update({ velocity }) {
    if (this.image) {
      this.position.x += velocity.x;
      this.position.y += velocity.y;
      if (this.position.y + this.height >= world.height) {
        console.log("you loose");
      }
    }
    this.draw();
  }

  shoot(alienMissiles) {
    if (this.position) {
      alienMissiles.push(
        new alienMissile({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          velocity: {
            x: 0,
            y: 3,
          },
        })
      );
    }
  }
}

class Missile {
  constructor({ position }) {
    this.position = position;
    this.velocity = { x: 0, y: -22 };
    this.width = 4;
    this.height = 10;
  }

  draw() {
    c.fillStyle = "black";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.y += this.velocity.y;
    this.draw();
  }
}

class Grid {
  constructor() {
    this.position = { x: 0, y: 0 };

    this.velocity = { x: 1, y: 0 };

    this.invaders = [];

    let rows = Math.floor((world.height / 34) * (1 / 3));
    // console.log(rows);

    const columns = Math.floor((world.width / 34) * (2 / 3));
    // console.log(columns);

    this.height = rows * 34;

    this.width = columns * 34;

    for (let x = 0; x < columns; x++) {
      //   console.log(x);

      for (let y = 0; y < rows; y++) {
        // console.log(y);

        this.invaders.push(
          new Alien({
            position: { x: x * 34, y: y * 34 },
          })
        );
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;

    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= world.width || this.position.x == 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 34;
    }
  }
}

class alienMissile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 5;
    this.height = 10;
  }
  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.fill();
  }
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.draw();
  }
}

const missiles = [];
const alienMissiles = [];
let grids = [new Grid()];
const player = new Player();
let particules = [];

const animationLoop = () => {
  c.clearRect(0, 0, world.width, world.height);
  player.update();
  requestAnimationFrame(animationLoop);

  missiles.forEach((missile, index) => {
    if (missile.position.y + missile.height <= 0) {
      setTimeout(() => {
        missiles.splice(index, 1);
      }, 0);
    } else {
      missile.update();
    }
  });

  grids.forEach((grid) => {
    grid.update();
    if (frames % 50 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        alienMissiles
      );
      //   console.log(alienMissiles);
    }
    grid.invaders.forEach((invader) => {
      invader.update({ velocity: grid.velocity });
    });
  });

  alienMissiles.forEach((alienMissile, index) => {
    if (alienMissile.position.y + alienMissile.height >= world.height) {
      setTimeout(() => {
        alienMissiles.splice(index, 1);
      }, 0);
    } else {
      alienMissile.update();
    }
  });

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
  switch (event.key) {
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case " ":
      player.shoot();
  }
});
