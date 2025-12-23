import { Actor, Color, Engine, Keys, vec, Vector } from "excalibur";

export class Player extends Actor {
  isMoving: boolean = false;
  destination?: Vector

  constructor() {
    super({
      name: 'Player',
      pos: vec(112, 160),
      width: 16,
      height: 16,
      color: Color.Yellow
    });

  }

  override onInitialize(engine: Engine): void {

  }

  update(engine: Engine, elapsed: number): void {
    if (engine.input.keyboard.isHeld(Keys.ArrowUp)) {
      this.pos.y -= 1;
    }
  }
}
