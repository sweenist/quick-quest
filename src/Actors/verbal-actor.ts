import { Actor, ActorArgs, SpriteSheet, Vector } from "excalibur"
import { DialogPlacement } from "../types";

export interface IDialogable {
  dialog: DialogScenario[]
}

export type DialogScenario = {
  message: string | string[];
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
}

export class VerbalActor extends Actor implements IDialogable {
  dialog: DialogScenario[];

  constructor(config: VerbalActorArgs & ActorArgs) {
    super({ ...config });

    this.dialog = config.dialog;
  }
}
