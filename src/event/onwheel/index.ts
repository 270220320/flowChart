import Konva from "konva";
import resetBackground from "../onDrag/resetBackground";

export default (stage: Konva.Stage, cb?: () => void) => {
  const scaleBy = 1.1;
  stage.on("wheel", (e) => {
    e.evt.preventDefault();
    const oldScale = stage.scaleX();
    const position = stage.getPointerPosition()!;
    const mousePointTo = {
      x: position.x / oldScale - stage.x() / oldScale,
      y: position.y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: -(mousePointTo.x - position.x / newScale) * newScale,
      y: -(mousePointTo.y - position.y / newScale) * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();

    cb ? cb() : null;
  });
};
