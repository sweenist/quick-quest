import { Actor, Engine, NineSlice, NineSliceStretch, vec } from "excalibur";
import { Resources } from "../resources";
import { conley, DialogEvents } from "../Events/eventTypes";


export class Dialog extends Actor {
  frame: NineSlice;

  constructor() {
    super();
    this.pos = vec(200, 100)
    this.frame = new NineSlice({
      height: 120,
      width: 600,
      source: Resources.DialogFrame,
      sourceConfig: {
        leftMargin: 8,
        topMargin: 8,
        rightMargin: 8,
        bottomMargin: 8,
        width: 24,
        height: 24
      },
      destinationConfig: {
        drawCenter: true,
        horizontalStretch: NineSliceStretch.TileFit,
        verticalStretch: NineSliceStretch.TileFit
      }
    });
  }

  onInitialize(engine: Engine): void {
    conley.on(DialogEvents.ShowDialog, (ev) => {
      this.placeFrame(engine.canvas, ev.other)
      this.graphics.use(this.frame);
      console.info('dialog', ev);
    });

    conley.on(DialogEvents.CloseDialog, () => {
      this.graphics.hide();
    });
  }

  placeFrame(canvas: HTMLCanvasElement, actor: Actor | null) {
    this.frame.width = canvas.width - 16;
    this.pos = actor?.pos.clone() ?? this.pos;
    const offsetX = this.frame.width / 2
    this.pos.x -= offsetX
    console.warn(actor, this.pos, this.frame, offsetX, canvas.width)
  }
}