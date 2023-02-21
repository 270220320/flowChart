import Konva from "konva";
const scaleBy = 1.1;
export default (deltaY: number, stage: Konva.Stage) => {
  const oldScale = stage.scaleX();
  const position = stage.getPointerPosition()!;
  const mousePointTo = {
    x: position.x / oldScale - stage.x() / oldScale,
    y: position.y / oldScale - stage.y() / oldScale,
  };

  const newScale = deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
  stage.scale({ x: newScale, y: newScale });

  const newPos = {
    x: -(mousePointTo.x - position.x / newScale) * newScale,
    y: -(mousePointTo.y - position.y / newScale) * newScale,
  };
  stage.position(newPos);
  stage.batchDraw();
};
