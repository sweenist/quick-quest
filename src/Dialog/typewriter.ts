import { Color, ExcaliburGraphicsContext, Graphic } from "excalibur";
import { drawText, CanvasTextConfig } from "canvas-txt";
import { conley, TypeWriterEvents } from "../Events/eventTypes";
export type { CanvasTextConfig } from "canvas-txt";

export interface TypeWriterConfig {
  text: string;
  typeDelay: number;
  textConfig: CanvasTextConfig;
  color?: Color;
}

export class TypeWriter extends Graphic {
  endStringText: string;
  currentStringText: string;
  stringIndex: number = 0;
  typeDelay: number;
  config: TypeWriterConfig;
  lastTimestamp = 0;
  cnv: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  isDone: boolean = false;
  isFinishing: boolean = false;
  color: Color;
  cnvTextConfig: CanvasTextConfig;
  contentHeight!: number;
  originalY: number;

  constructor(config: TypeWriterConfig) {
    super({
      width: config.textConfig.width,
      height: config.textConfig.height,
    });
    this.endStringText = config.text;
    this.cnvTextConfig = config.textConfig;
    this.originalY = config.textConfig.y;

    this.currentStringText = "";
    this.color = config.color || Color.White;
    this.typeDelay = config.typeDelay;
    this.config = config;

    //setup canvas
    this.cnv = document.createElement("canvas");
    this.cnv.width = this.width;
    this.cnv.height = this.height;
    this.ctx = this.cnv.getContext("2d");
    this.ctx!.fillStyle = this.color.toString();
    this.ctx!.strokeStyle = this.color.toString();

    conley.on(TypeWriterEvents.DialogAdvanced, (ev) => {
      this.reset();
      this.setNextText(ev.message);
    });
  }

  clone(): Graphic {
    return new TypeWriter(this.config);
  }

  reset() {
    this.stringIndex = 0;
    this.currentStringText = "";
    this.cnvTextConfig.y = this.originalY;
    this.lastTimestamp = 0;
    this.isDone = false;
    this.isFinishing = false;
  }

  scroll(increment: number) {
    this.cnvTextConfig.y -= increment;
  }

  get scrollable() {
    return Math.abs(this.cnvTextConfig.y) < this.contentHeight;
  }

  setNextText(message: string) {
    this.endStringText = message;
  }

  finish() {
    this.isFinishing = true;
  }

  protected _drawImage(ex: ExcaliburGraphicsContext, x: number, y: number): void {
    if (this.lastTimestamp === 0) {
      conley.emit(TypeWriterEvents.TypingStart, this);
    }
    let now = Date.now();
    let elapsed = now - this.lastTimestamp;
    if (!this.ctx) {
      return;
    }
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (!this.isFinishing && !this.isDone && elapsed > this.typeDelay) {
      this.lastTimestamp = now;

      this.stringIndex++;
      if (this.stringIndex >= this.endStringText.length) {
        this.isDone = true;
        this.stringIndex = this.endStringText.length;
        this.currentStringText = this.endStringText;
        conley.emit(TypeWriterEvents.TypingComplete, this.currentStringText);
      } else {
        this.currentStringText = this.endStringText.slice(0, this.stringIndex);
        conley.emit(TypeWriterEvents.LetterTyped, this.currentStringText.at(-1));
      }
    }

    if (this.isFinishing) {
      this.currentStringText = this.endStringText;
      this.isDone = true;
    }

    // draw image to ex

    this.contentHeight = (drawText(this.ctx, this.currentStringText, this.cnvTextConfig)).height;
    this.cnv.setAttribute("forceUpload", "true");
    ex.drawImage(this.cnv, x, y);
  }
}