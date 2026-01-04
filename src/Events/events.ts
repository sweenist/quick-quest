import { Actor, GameEvent } from "excalibur";
import { Player } from "../Actors/player";
import { VerbalActor } from "../Actors/verbal-actor";

export class InteractionStartEvent extends GameEvent<Player, VerbalActor> {
  public player: Player
  constructor(self: Player, other: VerbalActor) {
    super();
    this.player = self;
    this.other = other;
  }
}
export class InteractionCompleteEvent extends GameEvent<Player> {
  constructor(self: Player) {
    super();
  }
}

export class ShowDialogEvent extends GameEvent<Actor, VerbalActor> {
  constructor(self: Actor, other: VerbalActor) {
    super();
    this.target = self;
    this.other = other;
  }
}

export class CloseDialogEvent extends GameEvent<Actor> {
  constructor(self: Actor) {
    super();
  }
}