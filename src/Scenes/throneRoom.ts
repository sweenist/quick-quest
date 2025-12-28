import { Actor, Circle, Color, Rectangle, TileMap, Vector } from "excalibur";
import { BaseLevel } from "./baselevel";
import { config } from "../Configuration/throne-config";

export class ThroneRoom extends BaseLevel {
  tileMap!: TileMap;

  constructor() {
    super();
    this.buildRoom();
    this.buildNpcs();
  }

  buildRoom() {
    this.tileMap = new TileMap({
      columns: config.room[0].length,
      rows: config.room.length,
      tileHeight: 16,
      tileWidth: 16,
      renderFromTopOfGraphic: true
    });

    this.tileMap.tiles.forEach((tile) => {
      const tileVal = config.room[tile.y][tile.x];
      if (tileVal === 1) {
        tile.solid = true;
        tile.addGraphic(new Rectangle({
          width: tile.width,
          height: tile.height,
          color: Color.DarkGray,
        }));
      }
      else if (tileVal === 2) {
        tile.addGraphic(new Circle({
          radius: 8,
          strokeColor: Color.Orange,
          color: Color.Blue
        }));
      }
    });
    this.add(this.tileMap)
  }

  buildNpcs() {
    config.npcs.forEach((npc) => {
      const actor = new Actor({
        x: npc.x,
        y: npc.y,
        width: 16,
        height: 16,
        color: npc.color,
        anchor: Vector.Zero,
      });
      this.add(actor);
    })
  }
}