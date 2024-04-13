import { useState } from "react";
import TreeView from "./components/TreeView";

const App = () => {
  const [tree, setTree] = useState([]);

  const nodePool = [
    {
      id: "text",
      text: "component",
    },
    {
      id: "dropMenu",
      droppable: true,
      text: "container",
    },
  ];
  return <TreeView nodePool={nodePool} tree={tree} setTree={setTree} />;
};

export default App;
