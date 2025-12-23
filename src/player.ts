import { Actor, vec } from "excalibur";

export class Player extends Actor {
  constructor() {
    super({
      name: 'Player',
      pos: vec(150, 150),
      width: 16,
      height: 16,
    });

  }

  override onInitialize() {

  }
}
