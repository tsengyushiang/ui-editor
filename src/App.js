import { useState } from "react";
import TreeView from "./components/TreeView";
import Typography from "@mui/material/Typography";

const NodeTypes = (() => {
  const TYPES = {
    TEXT: "TEXT",
  };

  const types = [
    {
      id: "text",
      text: "component",
      data: {
        type: TYPES.TEXT,
        text: "component",
      },
    },
    {
      id: "dropMenu",
      droppable: true,
      text: "component",
      data: {
        type: TYPES.TEXT,
        text: "container",
      },
    },
  ];

  const Renderer = ({ data: { type, ...props } }) => {
    if (type === TYPES.TEXT) {
      return <Typography variant="body2">{props.text}</Typography>;
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
