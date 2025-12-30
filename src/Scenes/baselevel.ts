import { Engine, EventEmitter, Scene } from "excalibur";
import { Player } from "../Actors/player";
import { Dialog } from "../Dialog/dialog";
import { QuickQuestEvents } from "../Events/eventTypes";

export class BaseLevel extends Scene {
  public dialog!: Dialog;

  override onInitialize(engine: Engine): void {
    const globalBus = new EventEmitter<QuickQuestEvents>();
    const player = new Player({ events: globalBus });
    this.add(player);

    this.dialog = new Dialog({ events: globalBus });

    this.camera.strategy.lockToActor(player);
    // this.camera.zoom = 2;

    this.add(this.dialog);
  }
}