import image from "@rollup/plugin-image";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { entry } from "./entry.cjs";
const rollupConfig = [];
const externals = ["konva", "lodash"];
// 打包核心包文件
for (let i of entry) {
  const type = i.type === "main" ? "" : `${i.type}/`;
  rollupConfig.push({
    external: externals,
    input: i.root,
    output: [
      {
        file: `dist/${type}index.js`,
        format: "es",
      },
    ],
    plugins: [typescript(), image()],
  });

  // 生成相关d.ts
  rollupConfig.push({
    input: i.root,
    external: externals,
    output: [
      {
        file: `dist/${type}index.d.ts`,
        format: "es",
      },
    ],
    plugins: [dts()],
  });
}
export default rollupConfig;
