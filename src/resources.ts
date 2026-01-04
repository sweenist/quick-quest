import { ImageSource, Loader } from 'excalibur';

export const Resources = {
  Sword: new ImageSource('./images/sword.png'),
  DialogFrame: new ImageSource('./images/FrameBlue.png'),
  GameFont: new ImageSource('./fonts/GameFont.png'),
  GreenSlime: new ImageSource('./images/Slime-Green.png'),
  Portrait: new ImageSource('./images/Portraits.png'),
} as const;

export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
