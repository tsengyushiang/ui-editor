import { useState } from "react";
import TreeView from "./components/TreeView";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const NodeTypes = (() => {
  const TYPES = {
    COMPONENT: "COMPONENT",
    CONTAINER: "CONTAINER",
  };

  const types = [
    {
      id: "component",
      parent: 0,
      type: TYPES.COMPONENT,
    },
    {
      id: "container",
      parent: 0,
      type: TYPES.CONTAINER,
    },
    {
      id: "container_child",
      parent: "container",
      type: TYPES.COMPONENT,
    },
  ];

  const droppableTypes = [TYPES.CONTAINER];
  const getNodeOptions = (node) => {
    if (!node) return null;
    const newNode = {
      ...node,
      droppable: droppableTypes.includes(node.type),
      text: node.id,
    };
    return newNode;
  };

  const Renderer = ({ id, type }) => {
    if (type === TYPES.COMPONENT) {
      return <Typography variant="body2">{`component(${id})`}</Typography>;
    }

    if (type === TYPES.CONTAINER) {
      return <Typography variant="body2">{`container(${id})`}</Typography>;
    }

    return `${type} not found`;
  };

  return { Renderer, getNodeOptions, types };
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
      {historyIndex > 0 && <KeyboardArrowLeftIcon onClick={revert} />}
      {historyIndex !== history.length - 1 && (
        <KeyboardArrowRightIcon onClick={restore} />
      )}
      <TreeView
        nodeTypes={NodeTypes.types}
        nodeRenderer={NodeTypes.Renderer}
        getNodeOptions={NodeTypes.getNodeOptions}
        tree={tree}
        setTree={setNewTree}
      />
    </>
  );
};

export default App;
