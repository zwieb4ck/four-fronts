import "./style.css";
import { Scene, Game, WEBGL, GameObjects } from "phaser";

const canvas = document.getElementById("game") as HTMLCanvasElement;

class GameScene extends Scene {
  private text!: GameObjects.Text;
  private button!: GameObjects.Rectangle;
  constructor() {
    super("scene-game");
  }

  create() {
    this.button = this.add.rectangle(1218 / 2, 526 / 2, 250, 50, 0xff0000, 1);
    this.text = this.add.text(1218 / 2, 526 / 2, "Play FourFronts", {
      color: "#FFF",
      fontFamily: "monospace",
      fontSize: "26px",
    });
    this.text.setOrigin(0.5, 0.5);
  }

  update(time: number, delta: number) {}
}

const config = {
  type: WEBGL,
  canvas,
  width: 1218,
  height: 526,
  scene: [GameScene],
  parent: "game-window",
};

new Game(config);
