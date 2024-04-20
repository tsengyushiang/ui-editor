import { useState } from "react";
import TreeView from "./components/TreeView";
import Typography from "@mui/material/Typography";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const sortTreeNodes = (newTree) => {
  const parentChildDict = newTree.reduce((prev, node) => {
    const target = prev.find((dict) => dict.parent === node.parent);
    if (target) {
      target.children.push(node);
    } else {
      prev.push({
        parent: node.parent,
        children: [node],
      });
    }
    return prev;
  }, []);
  const tree = [];
  const traverse = (id) => {
    const target = parentChildDict.find((dict) => dict.parent === id);
    if (!target) return;
    target.children.forEach((child) => {
      tree.push(child);
      traverse(child.id);
    });
  };
  traverse(0);
  return tree;
};

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
    const sortedTree = sortTreeNodes(newTree);
    const validHistory = deepCopy(history).slice(0, historyIndex + 1);
    const newHistory = [...validHistory, deepCopy(sortedTree)];
    setHistory(newHistory);
    setHistoryIndex((prev) => prev + 1);
    setTree(sortedTree);
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
