const DEFAULT_WIDTH = 7;
const widthMap = new Map<string, number>();

widthMap.set('I', 4);

widthMap.set('a', 6);
widthMap.set('b', 5);
widthMap.set('c', 5);
widthMap.set('d', 5);
widthMap.set('e', 5);
widthMap.set('f', 6);
widthMap.set('g', 5);
widthMap.set('h', 5);
widthMap.set('i', 2);
widthMap.set('j', 4);
widthMap.set('k', 5);
widthMap.set('l', 2);
widthMap.set('m', 6);
widthMap.set('n', 5);
widthMap.set('o', 5);
widthMap.set('p', 5);
widthMap.set('q', 5);
widthMap.set('r', 5);
widthMap.set('s', 5);
widthMap.set('t', 5);
widthMap.set('u', 5);
widthMap.set('v', 5);
widthMap.set('w', 6);
widthMap.set('x', 6);
widthMap.set('y', 5);
widthMap.set('z', 5);

widthMap.set(' ', 3);
widthMap.set(",", 2);
widthMap.set('!', 3);
widthMap.set('?', 6);
widthMap.set("'", 2);
widthMap.set('"', 3);
widthMap.set('-', 6);
widthMap.set('_', 6);
widthMap.set('>', 4);
widthMap.set('<', 4);
widthMap.set(':', 2);

export const getCharacterWidth = (char: string) =>
  widthMap.get(char) ?? DEFAULT_WIDTH;

const frameMap = new Map<string, number>();
// # is Left Arrow, ^ is down pointer
[
  'ABCDEFGHIJKLM',
  'NOPQRSTUVWXYZ',
  'abcdefghijklm',
  'nopqrstuvwxyz',
  ".,!?'\"-_:><^#",
  '0123456789()*',
]
  .join('')
  .split('')
  .forEach((char, index) => {
    frameMap.set(char, index);
  });

export const getCharacterFrame = (char: string) => frameMap.get(char);