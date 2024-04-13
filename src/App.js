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
      id: "text",
      text: "component",
      data: {
        type: TYPES.COMPONENT,
      },
    },
    {
      id: "dropMenu",
      droppable: true,
      text: "container",
      data: {
        type: TYPES.CONTAINER,
      },
    },
  ];

  const Creator = (node, id, parent) => {
    const {
      data: { type },
    } = node;
    if (type === TYPES.COMPONENT) {
      const newNode = { ...node, id, parent };
      const descendants = [];
      return { node: newNode, descendants };
    }

    if (type === TYPES.CONTAINER) {
      const newNode = { ...node, id, parent };
      const descendants = [
        {
          ...types[0],
          id: `${id}_child`,
          parent: id,
        },
      ];
      return { node: newNode, descendants };
    }
  };

  const Renderer = ({ id, data: { type } }) => {
    if (type === TYPES.COMPONENT) {
      return <Typography variant="body2">{`component(${id})`}</Typography>;
    }

    if (type === TYPES.CONTAINER) {
      return <Typography variant="body2">{`container(${id})`}</Typography>;
    }

    return `${type} not found`;
  };

  return { Renderer, Creator, types };
})();

const App = () => {
  const [tree, setTree] = useState([]);

  return (
    <TreeView
      nodeTypes={NodeTypes.types}
      nodeRenderer={NodeTypes.Renderer}
      nodeCreator={NodeTypes.Creator}
      tree={tree}
      setTree={setTree}
    />
  );
};

export default App;
