import { ActorArgs, Engine, GraphicsGroup, ImageSource, Keys, NineSlice, NineSliceConfig, NineSliceStretch, Rectangle, ScreenElement, vec } from "excalibur";
import { conley, DialogEvents } from "../Events/eventTypes";
import { Resources } from "../resources";
import { TypeWriter, TypeWriterConfig } from "./typewriter";
import { DialogPortrait } from "./dialog-portrait";

/*
top: y = 0
middle: y = screen.height /2 - dialog.height /2
bottom: y = screen.height - dialogHeight
*/
export type DialogPlacement = 'bottom' | 'top' | 'center'
const destinationConfig = {
  drawCenter: true,
  horizontalStretch: NineSliceStretch.TileFit,
  verticalStretch: NineSliceStretch.TileFit
}

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
  portraitMargin?: number;
  margin: number;
}

export class Dialog extends ScreenElement {
  uiGroup: GraphicsGroup;
  placement: DialogPlacement;
  frame: NineSlice;
  frameState: 'closed' | 'start_growing' | 'growing' | 'done_opening' | 'open' | 'shrinking' = 'closed';
  frameConfig: NineSliceConfig;
  text: TypeWriter | null = null;
  portrait?: DialogPortrait | null = null;
  portraitMargin: number;
  maxFrameHeight: number;
  growthRate: number = 12;
  transitionInSpeed: number;
  transitionOutSpeed: number;
  textSpeed: number
  margin: number;

  constructor(config: DialogConfig & ActorArgs) {
    super({ ...config });

    this.margin = config.margin ?? 0;
    this.maxFrameHeight = config.maxFrameHeight;
    this.placement = config.placement ?? 'bottom';
    this.portraitMargin = config.portraitMargin ?? 8;
    this.transitionInSpeed = config.transitionInSpeed ?? 12;
    this.transitionOutSpeed = config.transitionOutSpeed ?? this.transitionInSpeed;
    this.textSpeed = config.textSpeed ?? 25;

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
        width: config.frameSourceWidth ?? 24
      },
      destinationConfig
    };
    this.frame = new NineSlice(this.frameConfig);
    this.uiGroup = new GraphicsGroup({ members: [this.frame] });
  }

  onInitialize(engine: Engine): void {
    conley.on(DialogEvents.ShowDialog, (ev) => {
      const { camera } = this.scene!;
      const portraitSize = 64 / camera.zoom;
      const portraitOffset = portraitSize / 2;
      this.frameState = 'start_growing';
      this.pos = vec(this.margin, engine.canvas.height / camera.zoom);
      console.info('dialog', this.pos);
      this.portrait = new DialogPortrait({
        portraitGraphic: new Rectangle({
          width: portraitSize,
          height: portraitSize,
          color: ev.other?.graphics.color
        }), position: vec(portraitOffset, portraitOffset)
      });
      this.addChild(this.portrait);
    });

    if (this.scene)
      this.growthRate = 12 / this.scene.camera.zoom;
  }

  update(engine: Engine, elapsed: number): void {
    const { input, canvas } = engine;
    if (input.keyboard.wasPressed(Keys.Space) && this.frameState === 'open') {
      if (this.text?.isDone) {
        this.frameState = 'shrinking';
        this.removeChild(this.portrait!);
        this.uiGroup.members = this.uiGroup.members.filter((m) => m !== this.text);
        conley.emit(DialogEvents.CloseDialog);
      }
      else {
        this.text?.finish();
      }
    }

    const { camera } = this.scene!;
    switch (this.frameState) {
      case 'start_growing': {
        this.frameState = 'growing';
        this.frame.setTargetWidth((canvas.width / camera.zoom) - this.margin, true);
        this.frame = this.frame.clone();
        this.graphics.use(this.frame);
        break;
      }
      case 'growing': {
        this.frame.setTargetHeight(this.frame.height + this.transitionInSpeed, true);
        this.pos.y -= this.transitionInSpeed
        if (this.frame.height >= (this.maxFrameHeight / camera.zoom)) {
          this.frameState = 'done_opening';
          this.frame.setTargetHeight(this.maxFrameHeight / camera.zoom, true);
        }
        this.frame = this.frame.clone();
        this.graphics.use(this.uiGroup);
        break;
      }
      case 'done_opening': {
        this.frameState = 'open';
        this.portrait?.show();
        const typeWriterConfig = this.buildTypeWriterConfig("This is some sample text. You are in the throne room\n        \nLine break", camera.zoom);
        this.text = new TypeWriter(typeWriterConfig);

        this.uiGroup.members.push(this.text);
        this.frame = this.frame.clone();
        this.graphics.use(this.uiGroup);
        break;
      }
      case "shrinking":
        {
          this.frame.setTargetHeight(this.frame.height - this.transitionOutSpeed, true);
          this.pos.y += this.transitionOutSpeed
          if (this.frame.height == 24) {
            this.frameState = 'closed';
            this.frame.setTargetHeight(24);
            this.uiGroup.members = [this.frame];
            this.graphics.hide();
            break;
          }
          this.frame = this.frame.clone();
          this.graphics.use(this.uiGroup);
          break;
        }
    }
  }

  buildTypeWriterConfig(text: string, zoomLevel: number): TypeWriterConfig {
    return {
      text,
      typeDelay: 18,
      textConfig: {
        align: 'left',
        vAlign: 'top',
        height: 160 / zoomLevel,
        lineHeight: 24 / zoomLevel,
        width: 584 / zoomLevel,
        x: this.portrait ? 120 / zoomLevel : 24 / zoomLevel,
        y: 24 / zoomLevel,
        fontSize: 16 / zoomLevel,
        font: 'RetroText'
      }
    }
  }
}