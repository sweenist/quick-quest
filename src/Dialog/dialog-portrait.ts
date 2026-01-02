import { Graphic, ScreenElement, Vector } from "excalibur";
import { conley, DialogEvents } from "../Events/eventTypes";

interface DialogPortraitConfig {
  portraitGraphic: Graphic,
  position: Vector
}

export class DialogPortrait extends ScreenElement {
  portraitGraphic: Graphic;

  constructor(config: DialogPortraitConfig) {
    super();
    this.portraitGraphic = config.portraitGraphic;
    this.pos = config.position;
    this.anchor = Vector.Zero;
    // TODO: figure out collider stuff
    this.graphics.use(this.portraitGraphic);
    this.graphics.hide();
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