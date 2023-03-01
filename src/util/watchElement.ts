// 检测html元素发生变化 后触发事件.
export default (id: string, callBack: (dom: HTMLElement) => void) => {
  let dom = document.getElementById(id)!;
  let tm: NodeJS.Timer | undefined;
  const resizeObserver = new ResizeObserver((entries) => {
    if (tm) clearTimeout(tm);
    tm = setTimeout(() => {
      dom = document.getElementById(id)!;
      callBack(dom);
    }, 100);
  });
  resizeObserver.observe(dom);
};
