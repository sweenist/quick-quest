import { ActorArgs, ScreenElement, Sprite, SpriteSheet, Vector } from "excalibur";
import { conley, DialogEvents } from "../Events/eventTypes";
import { DialogPlacement } from "../types";
import { PortraitConfig } from "../Actors/verbal-actor";


export class DialogPortrait extends ScreenElement {
  portraitGraphic: SpriteSheet;
  sprite: Sprite;
  placement: DialogPlacement;

  constructor(config: PortraitConfig & ActorArgs) {
    super({ width: config.imageWidth, height: config.imageHeight ?? config.imageWidth, scale: config.scale });
    this.portraitGraphic = config.image;
    this.pos = config.pos ?? Vector.Zero;
    this.anchor = Vector.Zero;
    this.sprite = this.portraitGraphic.sprites[config.frame as number]
    this.placement = config.placement ?? 'bottom';
  }

  get normalizedWidth() {
    return this.width / this.scale.x;
  }

  onInitialize(engine: ex.Engine): void {
    conley.on(DialogEvents.CloseDialog, (ev) => {
      this.graphics.hide();
    });
  }

  show() {
    this.graphics.use(this.sprite);
  }
}