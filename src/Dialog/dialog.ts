import {
  ActorArgs,
  Engine,
  ImageSource,
  Keys,
  NineSlice,
  NineSliceConfig,
  NineSliceStretch,
  Rectangle,
  ScreenElement,
  vec,
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
    super({ ...config });
    this._config = config;
    this.margin = config.margin ?? 0;
    this.maxFrameHeight = config.maxFrameHeight;
    this.placement = config.placement ?? "bottom";
    this.portraitMargin = config.portraitMargin ?? 8;
    this.transitionInSpeed = config.transitionInSpeed ?? 12;
    this.transitionOutSpeed =
      config.transitionOutSpeed ?? this.transitionInSpeed;

    this.frameConfig = {
      source: config.frameSource ?? Resources.DialogFrame,
      height: 24,
      width: 24,
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
      this.pos = vec(this.margin, engine.screen.height - this.frame.height / 2);
      this.portrait = new DialogPortrait({
        portraitGraphic: new Rectangle({
          width: portraitSize,
          height: portraitSize,
          color: ev.other?.graphics.color,
        }),
        position: vec(portraitOffset, portraitOffset),
      });
      const textPosX = this.portrait ? this.portrait.width + this.margin * 2 : this.margin;
      const textAreaWidth = engine.screen.width - textPosX - (this.margin * 4);
      const textPosition = vec(textPosX, 0);
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
    console.info('width', engine.canvas.width, engine.screen.canvasWidth, engine.screen.width)
    // this.scale = vec(this.scene?.camera.zoom ?? 1, 1)
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
        this.frame.setTargetWidth((engine.screen.width * this.globalScale.x) - this.margin * 2, true);
        this.frame = this.frame.clone();
        this.graphics.use(this.frame);
        break;
      }
      case "growing": {
        this.frame.setTargetHeight(
          this.frame.height + this.transitionInSpeed,
          true
        );
        this.pos.y -= this.transitionInSpeed;
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

        this.frame = this.frame.clone();
        this.graphics.use(this.frame);
        break;
      }
      case "shrinking": {
        this.frame.setTargetHeight(
          this.frame.height - this.transitionOutSpeed,
          true
        );
        this.pos.y += this.transitionOutSpeed;
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
}
