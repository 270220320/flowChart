import Konva from "konva";

const computedZoom = (n: number, magnify: number) => {
  const steep = 30 * magnify;
  let zoom = n * 0.999 ** steep;
  zoom = zoom >= 20 ? 20 : zoom;
  zoom = zoom < 0.1 ? 0.1 : zoom;
  return zoom;
};

export default (canvas: Konva.Stage) => {
  canvas.on("wheel", (e) => {
    const magnify = e.evt.deltaY > 0 ? 1 : -1;
    let zoom = canvas.scale() || { x: 1, y: 1 };
    zoom = {
      x: computedZoom(zoom.x, magnify),
      y: computedZoom(zoom.y, magnify),
    };
    canvas.scale(zoom);
    // 后期优化 错位问题
    canvas.setAttrs({
      x: e.evt.layerX * (1 - zoom.x),
      y: e.evt.layerY * (1 - zoom.y),
    });
  });
};
