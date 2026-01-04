import { ScreenElement, Color, ActorArgs, Engine, Keys } from 'excalibur';
import { TypeWriter, TypeWriterConfig } from "./typewriter";

export interface DialogTextConfig {
  textSpeed?: number;
  textLineHeight?: number;
  textSize?: number;
  message: string | string[];
}

export class DialogText extends ScreenElement {
  text: TypeWriter
  textSpeed: number;
  textLineHeight: number;
  textSize: number;
  private _messages: string[]
  private _currentIndex: number = 0;
  scrollToNextMessage: boolean = false;

  constructor(config: DialogTextConfig & ActorArgs) {
    super({ ...config });
    this.textSpeed = config.textSpeed ?? 25;
    this.textSize = config.textSize ?? 16;
    this.textLineHeight = config.textLineHeight ?? 24;
    this._messages = Array.isArray(config.message) ? config.message : [config.message];

    const typeWriterConfig = this.buildTypeWriterConfig(this._messages[this._currentIndex]!);
    this.text = new TypeWriter(typeWriterConfig);
  }

  get isAllDone() {
    return this.text.isDone && this._currentIndex + 1 === this._messages.length;
  }

  get pharseComplete() {
    return this.text.isDone;
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    const { input } = engine;
    const actionPressed = input.keyboard.wasPressed(Keys.Space);
    if (this.text.isDone && actionPressed && (this._currentIndex + 1) < this._messages.length) {
      this.scrollToNextMessage = true;
      console.info('definitely scrolling', this._messages)
    }
    if (this.scrollToNextMessage) {
      console.info('scrollToNext message is true')
      if (this.text.scrollable) {
        this.text.cnvTextConfig.y -= 2;
      }
      else {
        this.scrollToNextMessage = false;
        this.text.reset();
        this._currentIndex++;
        this.text.setNextText(this._messages[this._currentIndex]);
      }
    }
  }

  finish() {
    this.text?.finish();
  }

  close() {
    this.graphics.hide();
  }

  show() {
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
