import { Color, DisplayMode, Engine } from "excalibur";
import { loader } from "./resources";
import { BaseLevel } from "./Scenes/level";

const game = new Engine({
  width: 640,
  height: 360,
  displayMode: DisplayMode.FitContainerAndFill,
  canvasElementId: 'game',
  pixelArt: true,
  backgroundColor: Color.Black,
  scenes: {
    start: BaseLevel
  },
});

game.start(loader).then(() => {
  game.goToScene('start');
});