import { Color, vec } from "excalibur";
import { storyFlags } from "./story-flags";
import { Resources } from "../resources";

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
          message: "I'm da king baby! Grovel before me!",
          portraitConfig: {
            image: Resources.Portrait,
            imageWidth: 48,
            imageHeight: 48,
            scale: vec(2, 2),
          }
        },
        {
          message: "Oh? An adventurer. Our daughter was taken by a dragon! Fetch her!",
          requires: [storyFlags.throne_queen_talked_1],
          portraitConfig: {
            image: Resources.Portrait,
            imageWidth: 48,
            imageHeight: 48,
            scale: vec(2, 2),
          }
        }
      ]
    },
    {
      x: 80, y: 48, color: Color.Rose, name: 'Queen',
      dialog: [
        {
          message: "Ew! Peasant slime! I suppose you're here for a quest?",
          adds: [storyFlags.throne_queen_talked_1]
        },
        {
          message: "Yes, if you could go up north and fetch our daughter from the nasty dragon...",
          requires: [storyFlags.throne_king_talked_1]
        }
      ]
    }
  ]
}