// concurrent mode 并发模式 将render拆成更小的单元
let nextUnitWork = null;

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createTextElement(child) : child;
      })
    }
  };
}

/**
 * concurrent 将render中的遍历工作 拆分成小单元
 * 然后在浏览器idle 逐个执行
 * @param {*} element
 * @param {*} container
 */
function render(element, container) {
  nextUnitWork = {
    dom: container,
    props: {
      children: [element]
    }
  };
}

// 这里也不是完全意义的调度
// 拆成单元之后  在每个单元执行完之后去查询是否idle
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitWork && !shouldYield) {
    nextUnitWork = performUnitWork(nextUnitWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}

/**
 * 每个work需要有 parent son sibling
 * @param {*} nextUnitWork
 */
function performUnitWork(nextUnitWork) {}

const V1 = {
  render,
  createElement,
  workLoop
};
export { V1 };
