import { ScreenElement, Vector, Color } from 'excalibur';
import { TypeWriter, TypeWriterConfig } from "./typewriter";
import { Dialog } from "./dialog";

export interface DialogTextConfig {
  textSpeed?: number;
  textLineHeight?: number;
  textSize?: number;
}

export class DialogText extends ScreenElement {
  text: TypeWriter | null = null;
  textSpeed: number;
  textLineHeight: number;
  textSize: number;

  constructor(config: DialogTextConfig) {
    super();

    this.textSpeed = config.textSpeed ?? 25;
    this.textSize = config.textSize ?? 16;
    this.textLineHeight = config.textLineHeight ?? 24;
  }

  get isDone() {
    return this.text?.isDone;
  }

  finish() {
    this.text?.finish();
  }

  close() {
    this.graphics.hide();
    this.text = null;
  }

  configure(position: Vector, text: string, width: number) {
    this.pos = position;
    const config = this.buildTypeWriterConfig(text, width);
    console.info(position, config)
    this.text = new TypeWriter(config);
    this.graphics.use(this.text);
  }

  private buildTypeWriterConfig(text: string, width: number): TypeWriterConfig {
    const parent = this.parent as Dialog;
    return {
      text,
      color: Color.White,
      typeDelay: this.textSpeed,
      textConfig: {
        align: "left",
        vAlign: "top",
        height: parent.maxFrameHeight,
        lineHeight: this.textLineHeight,
        width: width - parent.margin * 2,
        x: this.textSize,
        y: this.textSize,
        fontSize: this.textSize,
        font: "RetroText",
      },
    };
  }
}
