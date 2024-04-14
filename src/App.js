import { useState } from "react";
import TreeView from "./components/TreeView";
import Typography from "@mui/material/Typography";

const NodeTypes = (() => {
  const TYPES = {
    COMPONENT: "COMPONENT",
    CONTAINER: "CONTAINER",
  };

  const types = [
    {
      id: "component",
      text: "component",
      parent: 0,
      data: {
        type: TYPES.COMPONENT,
      },
    },
    {
      id: "container",
      droppable: true,
      text: "container",
      parent: 0,
      data: {
        type: TYPES.CONTAINER,
      },
    },
    {
      id: "container_child",
      text: "container_child",
      parent: "container",
      data: {
        type: TYPES.COMPONENT,
      },
    },
  ];

  const Renderer = ({ id, data: { type } }) => {
    if (type === TYPES.COMPONENT) {
      return <Typography variant="body2">{`component(${id})`}</Typography>;
    }

    if (type === TYPES.CONTAINER) {
      return <Typography variant="body2">{`container(${id})`}</Typography>;
    }

    return `${type} not found`;
  };

  return { Renderer, types };
})();

const App = () => {
  const [tree, setTree] = useState([]);

  return (
    <TreeView
      nodeTypes={NodeTypes.types}
      nodeRenderer={NodeTypes.Renderer}
      tree={tree}
      setTree={setTree}
    />
  );
};

export default App;
