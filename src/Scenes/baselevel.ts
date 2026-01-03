import { Engine, Scene } from "excalibur";
import { Player } from "../Actors/player";
import { Dialog } from "../Dialog/dialog";

export class BaseLevel extends Scene {
  public dialog!: Dialog;

  override onInitialize(engine: Engine): void {
    const player = new Player();
    this.add(player);

    this.dialog = new Dialog({
      maxFrameHeight: 144,
      margin: 12,
      screen: engine.screen,
      placement: 'bottom'
    });

    this.camera.strategy.lockToActor(player);
    this.camera.zoom = 2;

    this.add(this.dialog);
  }
}
