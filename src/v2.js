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
function performUnitWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // 构建子元素fiber信息
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  // 构建fiber关系
  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }

  // 有子元素直接返回子元素  否则寻找sibling 最后再往parent寻找
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}
function createDom(fiber) {}

const V1 = {
  render,
  createElement,
  workLoop
};
export { V1 };
