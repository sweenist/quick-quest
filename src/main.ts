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

const retroText = new FontFace('RetroText', "url('/fonts/PressStart2P.ttf')");

retroText.load().then((font) => {
  document.fonts.add(font);
});

game.start(loader).then(() => {
  game.goToScene('start');
});