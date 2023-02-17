import Konva from "konva";

export default () => {
  const poly = new Konva.Line({
    points: [23, 20, 23, 160, 70, 93, 150, 109, 290, 139, 270, 93],
    fill: "#00D2FF",
    stroke: "black",
    strokeWidth: 5,
    closed: true,
  });
  return poly;
};
