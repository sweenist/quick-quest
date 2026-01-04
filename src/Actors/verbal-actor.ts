import { Actor, ActorArgs, Graphic, SpriteSheet, Vector } from "excalibur"
import { DialogPlacement } from "../types";


export type DialogScenario = {
  message: string;
  requires?: string[];
  bypass?: string[];
  addFlag?: string;
  portraitConfig?: PortraitConfig;
}

export type PortraitConfig = {
  image: SpriteSheet;
  imageWidth: number;
  imageHeight?: number;
  placement?: DialogPlacement;
  frame?: number;
  scale?: Vector;
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
