import { expect, describe, it } from 'vitest';
import { Keys, TileMap, Vector } from 'excalibur';
import { Player } from '../../../src/Actors/player';

const MOVE_DELTA = 16;

function engineWithKeyHeld(keyHeld: Keys) {
  const engine = {
    input: {
      keyboard: {
        isHeld: (k: Keys) => k === keyHeld
      }
    }
  } as unknown as any;
  return engine;
}

class FakeTileMap extends TileMap {
  constructor(private solid: boolean) {
    super({ rows: 1, columns: 1, tileWidth: 16, tileHeight: 16 } as any);
  }

  // Excalibur's API uses getTileByPoint in Player.canTravel; return a tile-like object when solid
  getTileByPoint(_: Vector) {
    return this.solid ? { solid: true } : null;
  }
}

describe('player', () => {
  it('should block movement when a solid tile exists at destination', () => {
    const player = new Player();

    player.destination = player.pos.clone();
    player.scene = { entities: [new FakeTileMap(true)], actors: [] } as any;

    const engine = engineWithKeyHeld(Keys.ArrowRight);

    player.tryMove(engine);

    // destination should not change when target tile is solid
    expect(player.destination.x).toBe(player.pos.x);
    expect(player.destination.y).toBe(player.pos.y);
  });

  it('should allow movement when no tile exists at destination', () => {
    const player = new Player();
    player.destination = player.pos.clone();
    player.scene = { entities: [new FakeTileMap(false)], actors: [] } as any;

    const engine = engineWithKeyHeld(Keys.ArrowRight);

    player.tryMove(engine);

    // destination should move one tile to the right
    expect(player.destination.x).toBe(player.pos.x + MOVE_DELTA);
    expect(player.destination.y).toBe(player.pos.y);
  });

  it('should allow movement when there are no TileMap children present', () => {
    const player = new Player();
    player.destination = player.pos.clone();
    player.scene = { entities: [], actors: [] } as any;

    const engine = engineWithKeyHeld(Keys.ArrowRight);

    player.tryMove(engine);

    expect(player.destination.x).toBe(player.pos.x + MOVE_DELTA);
    expect(player.destination.y).toBe(player.pos.y);
  });

  it('should block movement when another actor exists at destination', () => {
    const player = new Player();
    player.destination = player.pos.clone();
    const blockingActor = new Player(); // any actor will do
    blockingActor.pos = new Vector(player.pos.x + MOVE_DELTA, player.pos.y);
    player.scene = { entities: [], actors: [blockingActor] } as any;

    const engine = engineWithKeyHeld(Keys.ArrowRight);

    player.tryMove(engine);

    expect(player.destination.x).toBe(player.pos.x);
    expect(player.destination.y).toBe(player.pos.y);
  });
});
