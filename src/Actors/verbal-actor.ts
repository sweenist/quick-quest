import { Actor, ActorArgs, Graphic, ImageSource } from "excalibur"
import { DialogPlacement } from "../types";


export type DialogScenario = {
  message: string;
  requires?: string[];
  bypass?: string[];
  addFlag?: string;
  portraitConfig?: portraitConfig;
}

export type portraitConfig = {
  image: ImageSource;
  imageWidth: number;
  imageHeight: number;
  placement: DialogPlacement;
  frame?: number;
}

interface VerbalActorArgs {
  dialog: DialogScenario[],
  portrait?: Graphic
}

export class VerbalActor extends Actor {
  dialog: DialogScenario[];

  constructor(config: VerbalActorArgs & ActorArgs) {
    super({ ...config });

    this.dialog = config.dialog;
  }
}
