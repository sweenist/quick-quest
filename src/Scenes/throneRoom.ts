import { Actor, Color, vec } from "excalibur";
import { BaseLevel } from "./baselevel";
import { config } from "../Configuration/throne-config";

export class ThroneRoom extends BaseLevel {
  constructor() {
    super();
    this.buildRoom();
  }

  buildRoom() {
    for (const wall of config.walls) {
      const w = new Actor({
        pos: vec(wall.x * 16, wall.y * 16),
        color: Color.DarkGray,
        height: 16,
        width: 16,
        z: 1,
        name: 'wall'
      });
      this.add(w);
    }
  }
}