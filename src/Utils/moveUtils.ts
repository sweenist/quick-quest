import { Vector } from "excalibur";

export function moveToTarget(actorPosition: Vector, destination: Vector, speed: number) {
  let traverseX = destination.x - actorPosition.x;
  let traverseY = destination.y - actorPosition.y;

  let distance = Math.sqrt(traverseX ** 2 + traverseY ** 2);

  if (distance < speed) {
    actorPosition.x = destination.x;
    actorPosition.y = destination.y;
  }
  else {
    const normailzedX = traverseX / distance;
    const normailzedY = traverseY / distance;

    actorPosition.x += normailzedX * speed;
    actorPosition.y += normailzedY * speed;

    traverseX = destination.x - actorPosition.x;
    traverseY = destination.y - actorPosition.y;
    distance = Math.sqrt(traverseX ** 2 + traverseY ** 2);
  }
  return distance;
}