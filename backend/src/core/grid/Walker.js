const PseudoRandom  = require("../../utils/PseudoRandom")

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
  
   class Vector2 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    static get up() {
      return new Vector2(1, 0);
    }
  
    static get right() {
      return new Vector2(0, 1);
    }
  
    static get down() {
      return new Vector2(-1, 0);
    }
  
    static get left() {
      return new Vector2(0, -1);
    }
  }
  class Walker {
    constructor(position, direction, directionChange) {
      this.position = position;
      this.direction = direction;
      this.directionChange = directionChange;
    }
  }
  class RandomWalkGenerator {
    get currentlyFilled() {
      return this.tilesFilled / (this.height * this.width);
    }
  
    constructor(height, width, seed, fillPercentage) {
      this.prng = new PseudoRandom(seed);
      this.grid = [];
      this.height = height;
      this.width = width;
      this.maxWalker = 4;
      this.fillPercentage = fillPercentage || 40; // req
      this.directionChange = 0.3;
      this.tilesFilled = 0;
      this.walker = [];
  
      this.aborted = false;
      this.startPoint = new Vector2(
        Math.floor(this.width / 2),
        Math.floor(this.height / 2)
      );
      this.init();
    }
  
    init() {
      for (let x = 0; x < this.width; x++) {
        this.grid[x] = new Array(this.height).fill(null);
      }
    //   console.log(this.grid);
      this.walker.push(this.createWalker(this.startPoint, Vector2.up));
      this.walker.push(this.createWalker(this.startPoint, Vector2.right));
      this.walker.push(this.createWalker(this.startPoint, Vector2.down));
      this.walker.push(this.createWalker(this.startPoint, Vector2.left));
      this.grid[this.startPoint.x][this.startPoint.y] = true;
      this.tilesFilled++;
      this.runWalker();
    }
  
    createWalker(position, dir) {
      return new Walker(
        position,
        dir || this.getRandomDirection(),
        this.directionChange
      );
    }
  
    getRandomDirection() {
      const randomVal = Math.floor(this.prng.generate() * 4);
      const directions = [Vector2.up, Vector2.right, Vector2.down, Vector2.left];
      return directions[randomVal];
    }
  
    runWalker() {
      let fallout = 0;
      while (!this.aborted) {
        this.walkerLogic();
        if (fallout >= this.height * this.width) {
          this.aborted = true;
          break;
        }
        fallout++;
      }
    }
  
    walkerLogic() {
      try {
        if (this.currentlyFilled > this.fillPercentage / 100) {
          this.aborted = true;
            this.createWalls();
            this.deleteNulls();
        }
        for (let i = 0; i < this.walker.length; i++) {
          const walker = this.walker[i];
          this.changeDirectionOfWalker(walker);
          this.moveWalker(walker);
        }
      } catch (e) {
        console.error(e);
        this.aborted = true;
      }
    }
  
    changeDirectionOfWalker(walker) {
      if (walker.directionChange / 100 < this.prng.generate()) {
        walker.direction = this.getRandomDirection();
      }
    }
  
    moveWalker(walker) {
      walker.position.x = clamp(
        walker.position.x - walker.direction.x,
        1,
        this.width - 2
      );
      walker.position.y = clamp(
        walker.position.y - walker.direction.y,
        1,
        this.height - 2
      );
      if (this.grid[walker.position.x][walker.position.y] !== true) {
        this.grid[walker.position.x][walker.position.y] = true;
        this.tilesFilled++;
      }
    }
  
       createWalls() {
        const vectorsToChange = [];
        for (let x = 0; x < this.grid.length; x++) {
          for (let y = 0; y < this.grid[x].length; y++) {
            if (this.grid[x] && this.grid[x][y] === true) {
              if (this.grid[x + 1][y] === null) {
                vectorsToChange.push(new Vector2(x + 1, y));
              }
              if (this.grid[x - 1][y] === null) {
                vectorsToChange.push(new Vector2(x - 1, y));
              }
              if (this.grid[x][y + 1] === null) {
                vectorsToChange.push(new Vector2(x, y + 1));
              }
              if (this.grid[x][y - 1] === null) {
                vectorsToChange.push(new Vector2(x, y - 1));
              }
            }
          }
        }
        vectorsToChange.forEach((vector) => {

            if (this.grid[vector.x] && this.grid[vector.x][vector.y])
        {    this.grid[vector.x][vector.y] = true
        }
    }
        );
      }
  
      deleteNulls() {
        for(let x = 0; x < this.grid.length; x++) {
          for (let y = 0; y < this.grid[x].length; y++) {
            if (this.grid[x][y] === null) {
              delete this.grid[x][y];
            }
          }
        }
      }
  }

  module.exports = RandomWalkGenerator;