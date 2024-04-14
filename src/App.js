import { useState } from "react";
import TreeView from "./components/TreeView";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

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

const deepCopy = (data) => JSON.parse(JSON.stringify(data));

const App = () => {
  const [historyIndex, setHistoryIndex] = useState(0);
  const [history, setHistory] = useState([[]]);
  const [tree, setTree] = useState([]);

  const setNewTree = (newTree) => {
    const validHistory = deepCopy(history).slice(0, historyIndex + 1);
    const newHistory = [...validHistory, deepCopy(newTree)];
    setHistory(newHistory);
    setHistoryIndex((prev) => prev + 1);
    setTree(newTree);
  };

  const revert = () => {
    setTree(deepCopy(history[historyIndex - 1]));
    setHistoryIndex((prev) => prev - 1);
  };
  const restore = () => {
    setTree(deepCopy(history[historyIndex + 1]));
    setHistoryIndex((prev) => prev + 1);
  };

  return (
    <>
      <TreeView
        nodeTypes={NodeTypes.types}
        nodeRenderer={NodeTypes.Renderer}
        tree={tree}
        setTree={setNewTree}
      />
      {historyIndex > 0 && (
        <Button variant="contained" onClick={revert}>
          revert
        </Button>
      )}
      {historyIndex !== history.length - 1 && (
        <Button variant="contained" onClick={restore}>
          restore
        </Button>
      )}
    </>
  );
};

export default App;
