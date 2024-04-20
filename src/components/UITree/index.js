import React from "react";
import TYPES from "./types";
import Dropdowns from "./Dropdowns";
import HorizontalList from "./HorizontalList";
import Link from "./Link";
import Text from "./Text";
import VerticalList from "./VerticalList";

const ComponentDictionary = {
  [TYPES.DROPDOWNS]: Dropdowns,
  [TYPES.HORIZONTAL_LIST]: HorizontalList,
  [TYPES.LINK]: Link,
  [TYPES.TEXT]: Text,
  [TYPES.VERTICAL_LIST]: VerticalList,
};

const nodeArrayToObject = (sortedArray) => {
  const root = {
    id: 0,
    type: null,
    children: [],
  };
  sortedArray.reduce(
    (nodeDict, node) => {
      const newNode = { ...node, children: [] };
      nodeDict[node.parent].children.push(newNode);
      return { ...nodeDict, [newNode.id]: newNode };
    },
    {
      [root.id]: root,
    }
  );

  return root;
};

const render = (node) => {
  const Component = ComponentDictionary[node.type] || React.Fragment;
  return (
    <Component key={node.id} {...node}>
      {node.children.map((node) => render(node))}
    </Component>
  );
};

const UITree = ({ data }) => {
  const root = nodeArrayToObject(data);
  return render(root);
};

export default UITree;
export { TYPES };
