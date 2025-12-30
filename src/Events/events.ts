import { Actor, GameEvent } from "excalibur";
import { Player } from "../Actors/player";

export class InteractionStartEvent extends GameEvent<Player, Actor> {
  public player: Player
  constructor(self: Player, other: Actor) {
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

export class ShowDialogEvent extends GameEvent<Actor> {
  constructor(self: Actor) {
    super();
    this.other = self;
  }
}

export class CloseDialogEvent extends GameEvent<Actor> {
  constructor(self: Actor) {
    super();
  }
}