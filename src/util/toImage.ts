import Konva from "konva";

export default (stage: Konva.Stage, background: string) => {
  const canvas = stage.toCanvas();
  canvas.style.background = background;
  return canvas.toDataURL("image/png");
};
