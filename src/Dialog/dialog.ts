import { Actor, Engine, Graphic, GraphicsGroup, Keys, NineSlice, NineSliceConfig, NineSliceStretch, Rectangle, SpriteFont, SpriteSheet, vec, Vector } from "excalibur";
import { conley, DialogEvents } from "../Events/eventTypes";
import { alphabet } from "./font-config";
import { Resources } from "../resources";
import { TypeWriter } from "./typewriter";

const MAX_FRAME_HEIGHT = 180;

export class Dialog extends Actor {
  dialogDiv: HTMLDivElement;
  spriteFont: SpriteFont;
  uiGroup: GraphicsGroup;
  frame: NineSlice;
  frameState: 'closed' | 'start_growing' | 'growing' | 'done_opening' | 'open' | 'shrinking' = 'closed';
  frameConfig: NineSliceConfig;
  text: TypeWriter | null = null;
  portrait?: Graphic | null = null;

  constructor() {
    super();

    this.pos = vec(100, 100);
    this.anchor = Vector.Zero;
    this.dialogDiv = document.querySelector<HTMLDivElement>('#dialog-frame')!;
    this.spriteFont = new SpriteFont({
      alphabet: alphabet,
      spriteSheet: SpriteSheet.fromImageSource({
        image: Resources.GameFont,
        grid: {
          rows: 6,
          columns: 13,
          spriteHeight: 8,
          spriteWidth: 8
        }
      }),
    });
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
      this.frameState = 'start_growing';
      this.pos = ev.target.pos.clone();
      this.pos.y += 156;
      console.info('dialog', ev);
      this.portrait = new Rectangle({
        width: 48,
        height: 48,
        color: ev.other?.graphics.color
      });
      console.info('portrait', this.portrait);
    });
  }

  update(engine: Engine, elapsed: number): void {
    const { input } = engine;
    if (input.keyboard.wasPressed(Keys.Space)) {
      if (this.frameState === 'open') {
        this.frameState = 'shrinking';
        this.uiGroup.members = this.uiGroup.members.filter((m) => m !== this.text);
        conley.emit(DialogEvents.CloseDialog);
      }
    }

    switch (this.frameState) {
      case 'start_growing': {
        const xOffset = engine.canvas.width / 2 - 96;
        console.info(xOffset, this.pos);
        this.pos.x = this.pos.x - xOffset;
        this.frameState = 'growing';
        this.frame.setTargetWidth(568, true);
        this.frame = this.frame.clone();
        this.graphics.use(this.frame);
        break;
      }
      case 'growing': {
        this.frame.setTargetHeight(this.frame.height + 12, true);
        this.pos.y -= 12
        if (this.frame.height >= MAX_FRAME_HEIGHT) {
          this.frameState = 'done_opening';
          this.frame.setTargetHeight(MAX_FRAME_HEIGHT, true);
        }
        this.frame = this.frame.clone();
        this.graphics.use(this.uiGroup);
        break;
      }
      case 'done_opening': {
        this.frameState = 'open';
        this.text = new TypeWriter({
          text: "This is some sample text. You are in the throne room\n        \nLine break",
          typeDelay: 18,
          textConfig: {
            align: 'left',
            vAlign: 'top',
            height: 180,
            lineHeight: 24,
            width: 560,
            x: this.portrait ? 80 : 24,
            y: 24,
            fontSize: 16,
            font: 'RetroText'
          }
        });
        if (this.portrait)
          this.uiGroup.members.push(this.portrait);
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
            this.graphics.hide();
            this.uiGroup.members = [this.frame];
          }
          this.frame = this.frame.clone();
          this.graphics.use(this.uiGroup);
          break;
        }
    }
  }
}