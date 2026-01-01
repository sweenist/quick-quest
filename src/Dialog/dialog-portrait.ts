import { Actor, Graphic, Vector } from "excalibur";
import { conley, DialogEvents } from "../Events/eventTypes";

interface DialogPortraitConfig {
  portraitGraphic: Graphic,
  position: Vector
}

export class DialogPortrait extends Actor {
  portraitGraphic: Graphic;

  constructor(config: DialogPortraitConfig) {
    super();
    this.portraitGraphic = config.portraitGraphic;
    this.pos = config.position;
    this.anchor = Vector.Zero;
  }

  onInitialize(engine: ex.Engine): void {
    conley.on(DialogEvents.CloseDialog, (ev) => {
      this.graphics.hide();
    });
  }

  show() {
    this.graphics.use(this.portraitGraphic);
  }
}