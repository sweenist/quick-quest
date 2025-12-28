import { Actor, Color, Engine, Keys, vec, Vector } from "excalibur";
import { moveToTarget } from "../Utils/moveUtils";

export class Player extends Actor {
  isMoving: boolean = false;
  destination: Vector

  constructor() {
    super({
      name: 'Player',
      pos: vec(112, 160),
      width: 16,
      height: 16,
      color: Color.Yellow
    });
    this.destination = this.pos.clone();
  }

  override onInitialize(engine: Engine): void {

  }

  update(engine: Engine, elapsed: number): void {

    const distance = moveToTarget(this.pos, this.destination, 1);
    if (distance < 1) this.tryMove(engine);
  }

  tryMove(engine: Engine) {
    const { input } = engine
    const MOVE_DELTA = 16 as const;
    let nextX = this.destination.x;
    let nextY = this.destination.y;

    if (input.keyboard.isHeld(Keys.ArrowUp)) {
      console.info("Go up")
      nextY -= MOVE_DELTA;
    }
    else if (input.keyboard.isHeld(Keys.ArrowDown)) {
      console.info("Go down")
      nextY += MOVE_DELTA;
    }
    else if (input.keyboard.isHeld(Keys.ArrowLeft)) {
      console.info("Go left")

      nextX -= MOVE_DELTA;
    }
    else if (input.keyboard.isHeld(Keys.ArrowRight)) {
      nextX += MOVE_DELTA;
    }

    const newDestination = vec(nextX, nextY);

    this.destination = newDestination;
  }
}
