import { Actor, Animation, AnimationStrategy, Color, Engine, Keys, SpriteSheet, TileMap, vec, Vector } from "excalibur";
import { moveToTarget } from "../Utils/moveUtils";
import { Direction } from "../types";
import { Directions, FacingVectors } from "../constants";
import { conley, DialogEvents, PlayerEvents } from "../Events/eventTypes";
import { InteractionStartEvent, ShowDialogEvent } from "../Events/events";
import { Resources } from "../resources";
import { VerbalActor } from "./verbal-actor";

export class Player extends Actor {
  isLocked: boolean = false;
  destination: Vector;
  facing: Direction = Directions.Down;
  animations: Animation[] = [];

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

    this.buildAnimations()

  }

  buildAnimations() {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.GreenSlime,
      grid: {
        rows: 6,
        columns: 5,
        spriteHeight: 16,
        spriteWidth: 16
      }
    });
    const animation = Animation.fromSpriteSheet(spriteSheet, [0, 1], 250, AnimationStrategy.Loop);
    this.animations.push(animation);
    this.graphics.use(animation);
  }

  override onInitialize(engine: Engine): void {
    conley.on(PlayerEvents.StartInteraction, (ev) => {
      console.info('actioned', ev);
      this.isLocked = true;
      conley.emit(DialogEvents.ShowDialog, new ShowDialogEvent(ev.player, ev.other!));
    });

    conley.on(DialogEvents.CloseDialog, () => {
      this.isLocked = false;
    });
  }

  update(engine: Engine, elapsed: number): void {
    const { input } = engine;
    if (input.keyboard.wasPressed(Keys.Space) || input.keyboard.wasPressed(Keys.Enter)) {
      if (!this.isLocked)
        this.act();
    }
    const distance = moveToTarget(this.pos, this.destination, 1);
    if (distance < 1) this.tryMove(engine);
  }

  tryMove(engine: Engine) {
    if (this.isLocked) return;

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
    if (entity && entity instanceof VerbalActor) {
      console.info(`Talking to ${entity.name}`);
      conley.emit(PlayerEvents.StartInteraction, new InteractionStartEvent(this, entity));
    }
    if (trigger) {
      console.info("About to be triggered", trigger)
    }
  }
}
