import { Actor, Engine, vec } from "excalibur";
import { conley, DialogEvents } from "../Events/eventTypes";


export class Dialog extends Actor {
  dialogDiv: HTMLDivElement;

  constructor() {
    super();

    this.pos = vec(200, 100)
    this.dialogDiv = document.querySelector<HTMLDivElement>('#dialog-frame')!;
  }

  onInitialize(engine: Engine): void {
    conley.on(DialogEvents.ShowDialog, (ev) => {
      this.placeFrame(engine.canvas, ev.other)
      console.info('dialog', ev);
    });

    conley.on(DialogEvents.CloseDialog, () => {
      this.graphics.hide();
    });
  }

  placeFrame(canvas: HTMLCanvasElement, actor: Actor | null) {
    this.dialogDiv.setAttribute('data-visible', 'true')
    this.dialogDiv.setAttribute('data-display', 'show')
  }
}