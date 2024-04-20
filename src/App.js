import { useState } from "react";
import TreeView from "./components/TreeView";
import UITree, { TYPES } from "./components/UITree";
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
  const TextLink = [
    {
      id: "TextLink",
      parent: 0,
      type: TYPES.LINK,
    },
    {
      id: "TextLinkContent",
      parent: "TextLink",
      type: TYPES.TEXT,
    },
  ];
  const types = [
    ...TextLink,
    {
      id: "Dropdowns",
      parent: 0,
      type: TYPES.DROPDOWNS,
    },
    {
      id: "HorizontalList",
      parent: 0,
      type: TYPES.HORIZONTAL_LIST,
    },
    {
      id: "Link",
      parent: 0,
      type: TYPES.LINK,
    },
    {
      id: "Text",
      parent: 0,
      type: TYPES.TEXT,
    },
    {
      id: "VerticalList",
      parent: 0,
      type: TYPES.VERTICAL_LIST,
    },
  ];

  const droppableTypes = [
    TYPES.DROPDOWNS,
    TYPES.HORIZONTAL_LIST,
    TYPES.LINK,
    TYPES.VERTICAL_LIST,
  ];
  const getNodeOptions = (node) => {
    if (!node) return null;
    const newNode = {
      ...node,
      droppable: droppableTypes.includes(node.type),
      text: node.id,
    };
    return newNode;
  };

  const Renderer = ({ id, type }) => (
    <Typography variant="body2">{`${type}(${id})`}</Typography>
  );

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
      <UITree data={tree} />
    </>
  );
};

export default App;
