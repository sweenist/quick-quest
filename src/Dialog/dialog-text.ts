import { ScreenElement, Color, ActorArgs } from 'excalibur';
import { TypeWriter, TypeWriterConfig } from "./typewriter";

export interface DialogTextConfig {
  textSpeed?: number;
  textLineHeight?: number;
  textSize?: number;
  message?: string;
}

export class DialogText extends ScreenElement {
  text: TypeWriter
  textSpeed: number;
  textLineHeight: number;
  textSize: number;

  constructor(config: DialogTextConfig & ActorArgs) {
    super({ ...config });
    console.info(config)
    this.textSpeed = config.textSpeed ?? 25;
    this.textSize = config.textSize ?? 16;
    this.textLineHeight = config.textLineHeight ?? 24;

    const typeWriterConfig = this.buildTypeWriterConfig(config.message!);
    this.text = new TypeWriter(typeWriterConfig);
  }

  get isDone() {
    return this.text?.isDone;
  }

  finish() {
    this.text?.finish();
  }

  close() {
    this.graphics.hide();
  }

  show() {
    console.info(this)
    this.graphics.use(this.text);
  }

  private buildTypeWriterConfig(text: string): TypeWriterConfig {
    return {
      text,
      color: Color.White,
      typeDelay: this.textSpeed,
      textConfig: {
        align: "left",
        vAlign: "top",
        height: this.height,
        lineHeight: this.textLineHeight,
        width: this.width,
        x: this.textSize,
        y: this.textSize,
        fontSize: this.textSize,
        font: "RetroText",
      },
    };
  }
}
