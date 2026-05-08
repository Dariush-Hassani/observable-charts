export function getTriangleAreaFromSide(sideLength: number): number {
  return (Math.sqrt(3) / 4) * Math.pow(sideLength, 2);
}
