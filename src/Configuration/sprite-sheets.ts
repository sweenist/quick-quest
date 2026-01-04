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

export const SpriteSheets = {
  Portraits: portaitSpriteSheet
} as const;