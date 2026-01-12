import {
  ActorArgs,
  Engine,
  ImageSource,
  Keys,
  NineSlice,
  NineSliceConfig,
  NineSliceStretch,
  Screen,
  ScreenElement,
  vec,
  Vector,
} from "excalibur";
import { conley, DialogEvents, TypeWriterEvents } from "../Events/eventTypes";
import { Resources } from "../resources";
import { DialogPortrait } from "./dialog-portrait";
import { DialogText } from "./dialog-text";
import { DialogPlacement } from "../types";
import { AdvanceMarker } from "./advance-marker";
import { ShowDialogEvent, TypingForceComplete } from "../Events/events";
import { questState } from "../Game/quest-state";

const destinationConfig = {
  drawCenter: true,
  horizontalStretch: NineSliceStretch.TileFit,
  verticalStretch: NineSliceStretch.TileFit,
};

const dialogAnchors: Record<DialogPlacement, Vector> = {
  'bottom': vec(0, 1),
  'top': Vector.Zero,
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

const defaults: Partial<DialogConfig> = {
  margin: 0,
  placement: 'bottom',
  portraitMargin: 8,
  transitionInSpeed: 12,
  frameBottomMargin: 8,
  frameTopMargin: 8,
  frameLeftMargin: 8,
  frameRightMargin: 8,
  frameSource: Resources.DialogFrame,
  frameSourceHeight: 24,
  frameSourceWidth: 24,
}

export class Dialog extends ScreenElement {
  private _config: DialogConfig;
  private _showDialog?: (ev: ShowDialogEvent) => void;
  placement: DialogPlacement;
  frame: NineSlice;
  frameState:
    | "closed"
    | "start_growing"
    | "growing"
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
  advanceMarker: ScreenElement;



  constructor(config: DialogConfig & ActorArgs) {
    const dialogWidth = Dialog.getDialogWidth(config.screen, config.margin ?? 0)

    super({ ...config, });

    this._config = config;
    const cfg = { ...defaults, ...config }
    this.margin = cfg.margin!;
    this.maxFrameHeight = cfg.maxFrameHeight;
    this.placement = cfg.placement!;
    this.portraitMargin = cfg.portraitMargin!;
    this.transitionInSpeed = cfg.transitionInSpeed!;
    this.transitionOutSpeed =
      cfg.transitionOutSpeed ?? this.transitionInSpeed;

    this.anchor = dialogAnchors[this.placement];

    this.frameConfig = {
      source: cfg.frameSource!,
      height: cfg.frameSource!.height,
      width: dialogWidth,
      sourceConfig: {
        bottomMargin: cfg.frameBottomMargin!,
        topMargin: cfg.frameTopMargin!,
        leftMargin: cfg.frameLeftMargin!,
        rightMargin: cfg.frameRightMargin!,
        height: cfg.frameSourceHeight!,
        width: cfg.frameSourceWidth!,
      },
      destinationConfig,
    };
    this.frame = new NineSlice(this.frameConfig);

    this.advanceMarker = new AdvanceMarker({
      x: dialogWidth - (this.margin * 2 + (cfg.frameRightMargin!)),
      y: this.placement === 'bottom'
        ? -24
        : this.maxFrameHeight - 24
    });
  }

  onInitialize(engine: Engine): void {
    this._showDialog = (ev) => {
      this.frameState = "start_growing";
      this.pos = this.getDialogPosition(engine.screen);

      const scenario = questState.getScenario(ev.other?.dialog!);
      if (scenario && scenario.portraitConfig) {
        const portraitConfig = scenario.portraitConfig
        const portraitSize = Math.max(portraitConfig.imageHeight ?? 0, portraitConfig.imageWidth);
        const portraitOffset = portraitSize / 2;
        this.portrait = new DialogPortrait({
          ...scenario.portraitConfig,
          pos: vec(portraitOffset, this.placement === 'bottom' ? -this.maxFrameHeight + portraitOffset : portraitOffset),
        });
        this.addChild(this.portrait);
      }
      else {
        this.portrait = null;
      }

      const textPosX = this.portrait ? this.portrait.normalizedWidth + this.margin * 2 : this.margin;
      const textAreaWidth = this.frame.width - textPosX - (this.margin * 4);
      const textPosition = vec(textPosX, this.placement === 'bottom' ? -this.maxFrameHeight : 0);
      this.text = new DialogText({
        pos: textPosition,
        height: this.maxFrameHeight,
        width: textAreaWidth,
        message: scenario?.message ?? '...',
        ...this._config,
      });

      this.addChild(this.text);
      this.addChild(this.advanceMarker);

      if (scenario?.addFlag)
        questState.add(scenario.addFlag)
    };

    conley.on(DialogEvents.ShowDialog, this._showDialog);
  }

  onRemove(engine: Engine): void {
    conley.off(DialogEvents.ShowDialog, this._showDialog!);
  }


  update(engine: Engine, elapsed: number): void {
    const { input } = engine;

    if (input.keyboard.wasPressed(Keys.Space) && this.frameState === "open") {
      if (this.text?.isAllDone) {
        this.frameState = "shrinking";
        this.text.close();
        this.removeAllChildren();
        conley.emit(DialogEvents.CloseDialog);
      } else {
        this.text?.finish();
        conley.emit(TypeWriterEvents.TypingForceComplete, new TypingForceComplete());
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
          this.frame.setTargetHeight(this.maxFrameHeight, true);
          this.frameState = "open";
          this.portrait?.show();
          this.text?.show();
        }
        this.frame = this.frame.clone();
        this.graphics.use(this.frame);
        break;
      }
      case "shrinking": {
        this.frame.setTargetHeight(this.frame.height - this.transitionOutSpeed, true);
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

    const baseWidth = screen?.canvasWidth / Dialog.getPixelRatio(screen);
    return baseWidth - (margin * 2);
  }

  private getDialogPosition(screen: Screen): Vector {
    switch (this.placement) {
      case 'bottom':
        return vec(this.margin, screen.canvasHeight / Dialog.getPixelRatio(screen));
      case 'top':
        return vec(this.margin, 0);
    }
  }

  private static getPixelRatio(screen?: Screen) {
    return screen?.pixelRatio && screen.pixelRatio > 0
      ? screen.pixelRatio
      : 1;
  }
}
