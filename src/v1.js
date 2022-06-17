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
function render(element, container) {
  let dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
  const isProperty = (key) => key !== "children";

  // DOM 貌似是一个特殊对象 不能用es6 的。。。
  console.log(dom.constructor);
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((key) => {
      dom[key] = element.props[key];
    });

  element.props.children.forEach((child) => {
    render(child, dom);
  });

  container.appendChild(dom);
}

const V1 = {
  render,
  createElement
};
export { V1 };
