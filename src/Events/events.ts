import { type Actor, GameEvent } from "excalibur";
import { type Player } from "../Actors/player";
import { type VerbalActor } from "../Actors/verbal-actor";
import { type TypeWriter } from "../Dialog/typewriter";

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

export class TypingComplete extends GameEvent<TypeWriter> {
  endingText: string;
  constructor(endingText: string) {
    super();
    this.endingText = endingText;
  }
}

export class TypingForceComplete extends GameEvent<TypeWriter> {
  constructor() {
    super();
  }
}


export class TypingStart extends GameEvent<TypeWriter> {
  constructor() {
    super();
  }
}

export class LetterTyped extends GameEvent<TypeWriter> {
  letter: string;
  constructor(letter: string) {
    super();
    this.letter = letter;
  }
}

export class DialogAdvancing extends GameEvent<TypeWriter> {
  constructor() {
    super();
  }
}

export class DialogAdvanced extends GameEvent<TypeWriter> {
  message: string;
  constructor(message: string) {
    super();
    this.message = message;
  }
}