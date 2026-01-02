import { Camera, CameraEvents, Engine, GameEvent, Scene } from "excalibur";
import { Player } from "../Actors/player";
import { Dialog } from "../Dialog/dialog";

declare module 'excalibur' {
  interface CameraEvents {
    zoomchanged: ZoomChangeEvent
  }
}

class ZoomChangeEvent extends GameEvent<Camera> {
  constructor(self: Camera) {
    super();
    this.target = self;
  }
}

export class BaseLevel extends Scene {
  public dialog!: Dialog;

  override onInitialize(engine: Engine): void {
    const player = new Player();
    this.add(player);

    this.dialog = new Dialog({
      maxFrameHeight: 144
    });

    this.camera.events.on(CameraEvents.zoomchanged)

    this.camera.strategy.lockToActor(player);
    this.camera.zoom = 2;

    this.add(this.dialog);
  }
}