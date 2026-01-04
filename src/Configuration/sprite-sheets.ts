import { SpriteSheet } from "excalibur";
import { Resources } from "../resources";

const portaitSpriteSheet = SpriteSheet.fromImageSource({
  image: Resources.Portrait,
  grid: {
    rows: 1,
    columns: 3,
    spriteWidth: 48,
    spriteHeight: 48
  }
});

const playerSheet = SpriteSheet.fromImageSource({
  image: Resources.GreenSlime,
  grid: {
    rows: 6,
    columns: 5,
    spriteHeight: 16,
    spriteWidth: 16
  }
});

const gameFontSheet = SpriteSheet.fromImageSource({
  image: Resources.GameFont,
  grid: {
    rows: 6,
    columns: 13,
    spriteHeight: 8,
    spriteWidth: 8,
  }
});


export const SpriteSheets = {
  Portraits: portaitSpriteSheet,
  Player: playerSheet,
  GameFont: gameFontSheet,
} as const;