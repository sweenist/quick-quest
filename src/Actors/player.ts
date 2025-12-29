import { Actor, ActorEvents, Color, Engine, EventEmitter, GameEvent, Keys, TileMap, vec, Vector } from "excalibur";
import { moveToTarget } from "../Utils/moveUtils";

type PlayerEvents = ActorEvents & {
  startInteraction: InteractionStartEvent
  completeInteraction: InteractionCompleteEvent
}

export const PlayerEvents = {
  StartInteraction: 'startInteraction',
  CompleteInteraction: 'completeInteraction'
} as const

export class InteractionStartEvent extends GameEvent<Player> {
  constructor(self: Player) {
    super();
  }
}
export class InteractionCompleteEvent extends GameEvent<Player> {
  constructor(self: Player) {
    super();
  }
}

export class Player extends Actor {
  isLocked: boolean = false;
  destination: Vector;
  public events = new EventEmitter<PlayerEvents & ActorEvents>()

  constructor() {
    super({
      name: 'Player',
      pos: vec(112, 160),
      width: 16,
      height: 16,
      color: Color.Yellow,
      anchor: Vector.Zero
    });
    this.destination = this.pos.clone();

  }

  override onInitialize(engine: Engine): void {
    this.events.on('startInteraction', (ev) => {
      console.info('actioned', ev);
      this.act();
    });
  }

  update(engine: Engine, elapsed: number): void {
    const { input } = engine;
    if (input.keyboard.wasPressed(Keys.Space) || input.keyboard.wasPressed(Keys.Enter)) {
      this.events.emit('startInteraction', new InteractionStartEvent(this))
    }
    const distance = moveToTarget(this.pos, this.destination, 1);
    if (distance < 1) this.tryMove(engine);
  }

  tryMove(engine: Engine) {
    const { input } = engine
    const MOVE_DELTA = 16 as const;
    let nextX = this.destination.x;
    let nextY = this.destination.y;

    if (input.keyboard.isHeld(Keys.ArrowUp)) {
      nextY -= MOVE_DELTA;
    }
    else if (input.keyboard.isHeld(Keys.ArrowDown)) {
      nextY += MOVE_DELTA;
    }
    else if (input.keyboard.isHeld(Keys.ArrowLeft)) {
      nextX -= MOVE_DELTA;
    }
    else if (input.keyboard.isHeld(Keys.ArrowRight)) {
      nextX += MOVE_DELTA;
    }

    const newDestination = vec(nextX, nextY);

    if (!this.canTravel(newDestination)) return;

    this.destination = newDestination;
  }

  canTravel(target: Vector): boolean {
    const tileMap = this.scene?.entities.find((c) => c instanceof TileMap);
    const targetTile = tileMap?.getTileByPoint(target);

    if (targetTile && targetTile.solid)
      return false;

    if (this.scene?.actors.some((actor) => actor.pos.equals(target)))
      return false;

    return true;
  }

  act() {
    const north = Vector.Up;
    north.y = north.y * 16;
    const target = this.pos.clone().add(north);
    console.info(north, target, Vector.Up);
    const entity = this.scene?.actors.find((actor) => actor.pos.equals(target));
    if (entity) {
      console.info(entity);
    }
    this.scene?.actors.forEach((actor) => console.info(actor.pos))
  }
}
