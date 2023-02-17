import Konva from "konva";

export default () => {
  const poly = new Konva.Star({
    x: 0,
    y: 19,
    numPoints: 5,
    innerRadius: 2,
    outerRadius: 3,
    fill: "black",
    strokeWidth: 0,
  });
  return poly;
};
