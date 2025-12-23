import { Engine, Scene } from "excalibur";
import { Player } from "../Actors/player";

export class BaseLevel extends Scene {
  override onInitialize(engine: Engine): void {
    const player = new Player();
    this.add(player);

    this.camera.strategy.lockToActor(player);
    this.camera.zoom = 2;
  }
}