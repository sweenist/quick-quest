import { Color, DisplayMode, Engine } from "excalibur";
import { loader } from "./resources";
import { ThroneRoom } from "./Scenes/throneRoom";

const game = new Engine({
  width: 640,
  height: 360,
  displayMode: DisplayMode.FitContainerAndFill,
  canvasElementId: 'game',
  pixelArt: true,
  backgroundColor: Color.Black,
  scenes: {
    start: ThroneRoom
  },
});

game.toggleDebug();

game.start(loader).then(() => {
  game.goToScene('start');
});