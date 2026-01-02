import { ScreenElement } from "excalibur";
import { TypeWriter } from "./typewriter";

export class DialogText extends ScreenElement {
  text: TypeWriter | null = null;

  constructor() {
    super();
  }
}