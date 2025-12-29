import { Vector } from "excalibur";
import { Direction } from "./types";

export const LEFT = 'LEFT';
export const RIGHT = 'RIGHT';
export const UP = 'UP';
export const DOWN = 'DOWN';

export const Directions = {
  Left: LEFT,
  Right: RIGHT,
  Up: UP,
  Down: DOWN
} as const

export const FacingVectors: Record<Direction, Vector> = {
  LEFT: Vector.Left,
  RIGHT: Vector.Right,
  UP: Vector.Up,
  DOWN: Vector.Down
} as const;