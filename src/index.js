import { V1 } from "./v1";

/**@jsx V1.createElement  */
const App = (
  <div name="react">
    <div from="father">hello</div>
    <div style="color:red">world</div>
    <p from="sibling">
      <div from="sibling_son">hi</div>
      <div>longjiang</div>
    </p>
  </div>
);
// V1.render(App, document.getElementById("root"));

requestIdleCallback((e) => {
  console.log(e);
});
