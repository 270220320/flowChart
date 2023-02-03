import Konva from "konva";

export default (canvas: Konva.Stage) => {
  const scaleBy = 1.1;
  canvas.on("wheel", (e) => {
    e.evt.preventDefault();
    const oldScale = canvas.scaleX();
    const position = canvas.getPointerPosition()!;
    const mousePointTo = {
      x: position.x / oldScale - canvas.x() / oldScale,
      y: position.y / oldScale - canvas.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    canvas.scale({ x: newScale, y: newScale });

    const newPos = {
      x: -(mousePointTo.x - position.x / newScale) * newScale,
      y: -(mousePointTo.y - position.y / newScale) * newScale,
    };
    canvas.position(newPos);
    canvas.batchDraw();
  });
};
