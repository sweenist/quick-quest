import { DisplayMode, Engine } from "excalibur";
import { loader } from "./resources";
import { MyLevel } from "./level";

const game = new Engine({
  width: 640,
  height: 360,
  displayMode: DisplayMode.FitScreenAndFill,
  pixelArt: true,
  scenes: {
    start: MyLevel
  },
});

game.start(loader).then(() => {
  game.goToScene('start');
});