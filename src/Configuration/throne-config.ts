import { Color, vec } from "excalibur";
import { storyFlags } from "./story-flags";
import { SpriteSheets } from "./sprite-sheets";

export const config = {
  room: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  npcs: [
    {
      x: 112, y: 48, color: Color.Red, name: 'King',
      dialog: [
        {
          message: [
            "Oh? An adventurer. Our daughter was taken by a dragon! Fetch her! I'll give you golds and ladies!",
            "If you go due north, there is an old cave. Word on the dirt road is that the beast lives there."
          ],
          requires: [storyFlags.throne_queen_talked_1],
          addFlag: storyFlags.throne_king_talked_1,
          portraitConfig: {
            image: SpriteSheets.Portraits,
            imageWidth: 48,
            imageHeight: 48,
            frame: 0,
            scale: vec(2, 2),
          }
        },
        {
          message: ["I'm da king baby! Grovel before me!", "Oh yeah!"],
          portraitConfig: {
            image: SpriteSheets.Portraits,
            imageWidth: 48,
            imageHeight: 48,
            frame: 0,
            scale: vec(2, 2),
          }
        }
      ]
    },
    {
      x: 80, y: 48, color: Color.Rose, name: 'Queen',
      dialog: [
        {
          message: "Yes, if you could go up north and fetch our daughter from the nasty dragon... Shoo, shoo!",
          requires: [storyFlags.throne_king_talked_1],
          portraitConfig: {
            image: SpriteSheets.Portraits,
            imageWidth: 48,
            imageHeight: 48,
            frame: 1,
            scale: vec(2, 2),
          }
        },
        {
          message: "Ew! Peasant slime! I suppose you're here for a quest?",
          addFlag: storyFlags.throne_queen_talked_1,
          portraitConfig: {
            image: SpriteSheets.Portraits,
            imageWidth: 48,
            imageHeight: 48,
            frame: 2,
            scale: vec(2, 2),
          }
        },
      ]
    }
  ]
}