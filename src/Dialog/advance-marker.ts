import { Animation, AnimationStrategy, Engine, ScreenElement, vec } from "excalibur";
import { SpriteSheets } from "../Configuration/sprite-sheets";
import { conley, DialogEvents, TypeWriterEvents } from "../Events/eventTypes";

export class AdvanceMarker extends ScreenElement {
  animation: Animation;

  constructor(config: { x: number, y: number }) {
    super({ width: 16, height: 16 })

    const { x, y } = config;
    this.pos = vec(x, y);
    this.animation = Animation.fromSpriteSheet(SpriteSheets.GameFont, [63, 63, 64], 225, AnimationStrategy.Loop);
    this.scale = vec(2, 2);
  }

  onInitialize(engine: Engine): void {
    conley.on(TypeWriterEvents.TypingComplete, (ev) => {
      this.graphics.use(this.animation);
    });

    conley.on(TypeWriterEvents.TypingForceComplete, () => {
      this.graphics.use(this.animation);
    });

    conley.on(DialogEvents.CloseDialog, () => {
      this.graphics.hide();
    });

    conley.on(TypeWriterEvents.DialogAdvancing, () => {
      this.graphics.hide();
    });
  }

  onRemove(engine: Engine): void {
    conley.off(TypeWriterEvents.TypingComplete);

    conley.off(TypeWriterEvents.TypingForceComplete);

    conley.off(DialogEvents.CloseDialog);

    conley.off(TypeWriterEvents.DialogAdvancing);
  }
}