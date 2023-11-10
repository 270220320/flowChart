<script setup lang="ts">
import Konva from "konva";
import Editor from "../../dist/";
import { DrawState } from "../../dist/";
import { onMounted } from "vue";

let editor: Editor;
onMounted(() => {
  editor = new Editor({ id: "flowChart" });
  editor.init();
});
const setDrawState = (state: DrawState) => {
  editor.setDrawState(state);
  editor.thingLayer.children.forEach((element: Konva.Node) => {
    if (element.name() === "selfShape") {
      element.name("thingImage");
    }
  });
};
</script>

<template>
  <div class="demo">
    <div class="btns">
      <button @click="setDrawState('Rect')">加矩形</button>
      <button @click="setDrawState('rightAngleLine')">连线</button>
    </div>
    <div id="flowChart"></div>
  </div>
</template>

<style scoped>
.demo {
  #flowChart {
    border: 1px solid blue;
  }
}
</style>
