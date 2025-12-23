import { Engine, Scene } from "excalibur";
import { Player } from "./player";

export class MyLevel extends Scene {
  override onInitialize(engine: Engine): void {
    const player = new Player();
    this.add(player);
  }
}