import Konva from "konva";

export default (stage: Konva.Stage) => {
  stage.on("click tap", (e) => {
    const Transformers = stage.find("Transformer");
    for (let i of Transformers) {
      i.destroy();
    }
    const layer = e.target.getLayer();
    // create new transformer
    if (!layer) return;
    const tr = new Konva.Transformer();
    layer.add(tr);
    tr.nodes([e.target]);
    layer.draw();
  });
};
