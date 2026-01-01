import { Actor, Camera, Engine, GraphicsGroup, Keys, NineSlice, NineSliceConfig, NineSliceStretch, Rectangle, vec, Vector } from "excalibur";
import { conley, DialogEvents } from "../Events/eventTypes";
import { Resources } from "../resources";
import { TypeWriter, TypeWriterConfig } from "./typewriter";
import { DialogPortrait } from "./dialog-portrait";

const MAX_FRAME_HEIGHT = 160;

export class Dialog extends Actor {
  dialogDiv: HTMLDivElement;
  uiGroup: GraphicsGroup;
  frame: NineSlice;
  frameState: 'closed' | 'start_growing' | 'growing' | 'done_opening' | 'open' | 'shrinking' = 'closed';
  frameConfig: NineSliceConfig;
  text: TypeWriter | null = null;
  portrait?: DialogPortrait | null = null;
  growthRate: number = 12;

  constructor() {
    super();

    this.pos = vec(100, 100);
    this.anchor = Vector.Zero;
    this.dialogDiv = document.querySelector<HTMLDivElement>('#dialog-frame')!;

    this.frameConfig = {
      source: Resources.DialogFrame,
      height: 24,
      width: 24,
      sourceConfig: {
        bottomMargin: 8,
        topMargin: 8,
        leftMargin: 8,
        rightMargin: 8,
        height: 24,
        width: 24
      },
      destinationConfig: {
        drawCenter: true,
        horizontalStretch: NineSliceStretch.TileFit,
        verticalStretch: NineSliceStretch.TileFit
      }
    };
    this.frame = new NineSlice(this.frameConfig);
    this.uiGroup = new GraphicsGroup({ members: [this.frame] });
  }

  onInitialize(engine: Engine): void {
    conley.on(DialogEvents.ShowDialog, (ev) => {
      const { camera } = this.scene;
      const portraitSize = 64 / camera.zoom;
      const portraitOffset = portraitSize / 2;
      this.frameState = 'start_growing';
      this.pos = ev.target.pos.clone();
      this.pos.y += 156 / camera.zoom;
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
    const { input } = engine;
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

    const { camera } = this.scene;
    switch (this.frameState) {
      case 'start_growing': {
        const xOffset = (engine.canvas.width / 2 / camera.zoom) - (96 / camera.zoom);
        this.pos.x = this.pos.x - xOffset;
        this.frameState = 'growing';
        this.frame.setTargetWidth(568 / camera.zoom, true);
        this.frame = this.frame.clone();
        this.graphics.use(this.frame);
        break;
      }
      case 'growing': {
        this.frame.setTargetHeight(this.frame.height + 12, true);
        this.pos.y -= 12
        if (this.frame.height >= (MAX_FRAME_HEIGHT / camera.zoom)) {
          this.frameState = 'done_opening';
          this.frame.setTargetHeight(MAX_FRAME_HEIGHT / camera.zoom, true);
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
          this.frame.setTargetHeight(this.frame.height - 12, true);
          this.pos.y += 12
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