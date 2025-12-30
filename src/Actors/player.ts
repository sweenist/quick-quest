import { Actor, Color, Engine, EventEmitter, Keys, TileMap, vec, Vector } from "excalibur";
import { moveToTarget } from "../Utils/moveUtils";
import { Direction } from "../types";
import { Directions, FacingVectors } from "../constants";
import { DialogEvents, PlayerEvents, QuickQuestEvents } from "../Events/eventTypes";
import { InteractionStartEvent, ShowDialogEvent } from "../Events/events";

export class Player extends Actor {
  isLocked: boolean = false;
  destination: Vector;
  facing: Direction = Directions.Down;
  public events: EventEmitter<QuickQuestEvents>;

  constructor(config: { events: EventEmitter<QuickQuestEvents> }) {
    super({
      name: 'Player',
      pos: vec(112, 160),
      width: 16,
      height: 16,
      color: Color.Yellow,
      anchor: Vector.Zero
    });
    this.events = config.events;
    this.destination = this.pos.clone();

  }

  override onInitialize(engine: Engine): void {
    this.events.on(PlayerEvents.StartInteraction, (ev) => {
      console.info('actioned', ev);
      this.isLocked = true;
      this.events.emit(DialogEvents.ShowDialog, new ShowDialogEvent(ev.other!));
    });
  }

  update(engine: Engine, elapsed: number): void {
    const { input } = engine;
    if (input.keyboard.wasPressed(Keys.Space) || input.keyboard.wasPressed(Keys.Enter)) {
      this.act();
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
      this.facing = Directions.Up;
    }
    else if (input.keyboard.isHeld(Keys.ArrowDown)) {
      nextY += MOVE_DELTA;
      this.facing = Directions.Down;
    }
    else if (input.keyboard.isHeld(Keys.ArrowLeft)) {
      nextX -= MOVE_DELTA;
      this.facing = Directions.Left;
    }
    else if (input.keyboard.isHeld(Keys.ArrowRight)) {
      nextX += MOVE_DELTA;
      this.facing = Directions.Right;
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
    let ray = FacingVectors[this.facing];
    ray = ray.scale(16);
    const target = this.pos.clone().add(ray);
    const entity = this.scene?.actors.find((actor) => actor.pos.equals(target));
    const trigger = this.scene?.triggers.find((trigger) => trigger.pos.equals(target));
    if (entity) {
      console.info(`Talking to ${entity.name}`);
      this.events.emit(PlayerEvents.StartInteraction, new InteractionStartEvent(this, entity));
    }
    if (trigger) {
      console.info("About to be triggered", trigger)
    }
  }
}
