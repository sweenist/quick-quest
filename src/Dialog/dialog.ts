import {
  ActorArgs,
  Engine,
  ImageSource,
  Keys,
  NineSlice,
  NineSliceConfig,
  NineSliceStretch,
  Rectangle,
  Screen,
  ScreenElement,
  vec,
  Vector,
} from "excalibur";
import { conley, DialogEvents } from "../Events/eventTypes";
import { Resources } from "../resources";
import { DialogPortrait } from "./dialog-portrait";
import { DialogText, DialogTextConfig } from "./dialog-text";

/*
top: y = 0
middle: y = screen.height /2 - dialog.height /2
bottom: y = screen.height - dialogHeight
*/
export type DialogPlacement = "bottom" | "top" | "center";
const destinationConfig = {
  drawCenter: true,
  horizontalStretch: NineSliceStretch.TileFit,
  verticalStretch: NineSliceStretch.TileFit,
};

interface DialogConfig {
  maxFrameHeight: number;
  screen: Screen;
  placement?: DialogPlacement;
  frameSource?: ImageSource;
  frameSourceHeight?: number;
  frameSourceWidth?: number;
  frameBottomMargin?: number;
  frameTopMargin?: number;
  frameLeftMargin?: number;
  frameRightMargin?: number;
  transitionInSpeed?: number;
  transitionOutSpeed?: number;
  textSpeed?: number;
  textSize?: number;
  textLineHeight?: number;
  portraitMargin?: number;
  margin?: number;
}

export class Dialog extends ScreenElement {
  private _config: DialogConfig;
  placement: DialogPlacement;
  frame: NineSlice;
  frameState:
    | "closed"
    | "start_growing"
    | "growing"
    | "done_opening"
    | "open"
    | "shrinking" = "closed";
  frameConfig: NineSliceConfig;
  text: DialogText | null = null;
  portrait?: DialogPortrait | null = null;
  portraitMargin: number;
  maxFrameHeight: number;
  growthRate: number = 12;
  transitionInSpeed: number;
  transitionOutSpeed: number;
  margin: number;

  constructor(config: DialogConfig & DialogTextConfig & ActorArgs) {
    const dialogWidth = Dialog.getDialogWidth(config.screen, config.margin ?? 0)
    super({ ...config, });
    this._config = config;
    this.margin = config.margin ?? 0;
    this.maxFrameHeight = config.maxFrameHeight;
    this.placement = config.placement ?? "bottom";
    this.portraitMargin = config.portraitMargin ?? 8;
    this.transitionInSpeed = config.transitionInSpeed ?? 12;
    this.transitionOutSpeed =
      config.transitionOutSpeed ?? this.transitionInSpeed;

    this.anchor = this.placement === 'bottom' ? vec(0, 1) : this.anchor;

    this.frameConfig = {
      source: config.frameSource ?? Resources.DialogFrame,
      height: 24,
      width: dialogWidth,
      sourceConfig: {
        bottomMargin: config.frameBottomMargin ?? 8,
        topMargin: config.frameTopMargin ?? 8,
        leftMargin: config.frameLeftMargin ?? 8,
        rightMargin: config.frameRightMargin ?? 8,
        height: config.frameSourceHeight ?? 24,
        width: config.frameSourceWidth ?? 24,
      },
      destinationConfig,
    };
    this.frame = new NineSlice(this.frameConfig);
  }

  onInitialize(engine: Engine): void {
    conley.on(DialogEvents.ShowDialog, (ev) => {

      const portraitSize = 64;
      const portraitOffset = portraitSize / 2;
      this.frameState = "start_growing";
      this.pos = this.getDialogPosition(engine.screen);
      console.info(this.pos)
      this.portrait = new DialogPortrait({
        portraitGraphic: new Rectangle({
          width: portraitSize,
          height: portraitSize,
          color: ev.other?.graphics.color,
        }),
        position: vec(portraitOffset, this.placement === 'bottom' ? -this.maxFrameHeight + portraitOffset : portraitOffset),
      });
      const textPosX = this.portrait ? this.portrait.width + this.margin * 2 : this.margin;
      const textAreaWidth = this.frame.width - textPosX - (this.margin * 4);
      const textPosition = vec(textPosX, this.placement === 'bottom' ? -this.maxFrameHeight : 0);
      this.text = new DialogText({
        pos: textPosition,
        height: this.maxFrameHeight,
        width: textAreaWidth,
        message: "This is some sample text. You are in the throne room\n        \nLine break",
        ...this._config,
      });

      this.addChild(this.portrait);
      this.addChild(this.text);
    });
  }

  update(engine: Engine, elapsed: number): void {
    const { input } = engine;

    if (input.keyboard.wasPressed(Keys.Space) && this.frameState === "open") {
      if (this.text?.isDone) {
        this.frameState = "shrinking";
        this.text.close();
        this.removeChild(this.portrait!);
        this.removeChild(this.text);
        conley.emit(DialogEvents.CloseDialog);
      } else {
        this.text?.finish();
      }
    }

    switch (this.frameState) {
      case "start_growing": {
        this.frameState = "growing";
        this.graphics.use(this.frame);
        break;
      }
      case "growing": {
        this.frame.setTargetHeight(
          this.frame.height + this.transitionInSpeed,
          true
        );
        if (this.frame.height >= this.maxFrameHeight) {
          this.frameState = "done_opening";
          this.frame.setTargetHeight(this.maxFrameHeight, true);
        }
        this.frame = this.frame.clone();
        this.graphics.use(this.frame);
        break;
      }
      case "done_opening": {
        this.frameState = "open";
        this.portrait?.show();
        this.text?.show();
        break;
      }
      case "shrinking": {
        this.frame.setTargetHeight(
          this.frame.height - this.transitionOutSpeed,
          true
        );
        // this.pos.y += this.transitionOutSpeed;
        if (this.frame.height === 24) {
          this.frameState = "closed";
          this.frame.setTargetHeight(24);
          this.graphics.hide();
          break;
        }
        this.frame = this.frame.clone();
        this.graphics.use(this.frame);
        break;
      }
    }
  }

  private static getDialogWidth(screen: Screen, margin: number) {
    const pixelRatio = screen?.pixelRatio === 0 ? 1 : screen.pixelRatio;
    const baseWidth = screen?.canvasWidth / pixelRatio
    return baseWidth - (margin * 2);
  }

  private getDialogPosition(screen: Screen): Vector {
    switch (this.placement) {
      case 'bottom':
        return vec(this.margin, screen.canvasHeight / screen.pixelRatio);
      case 'top':
        return vec(this.margin, 0);
      case 'center':
        return vec(this.margin, screen.halfCanvasHeight / screen.pixelRatio);
    }
  }
}
