import { v4 as uuidv4 } from "uuid";
import {
  DndProvider,
  getBackendOptions,
  getDescendants,
  MultiBackend,
  Tree,
} from "@minoru/react-dnd-treeview";
import { NativeTypes } from "react-dnd-html5-backend";
import React from "react";
import Node from "./Node";
import Placeholder from "./Placeholder";
import useTreeOpenHandler from "./useTreeOpenHandler";
import styles from "./styles.module.css";
import { ExternalNode } from "./ExternalNode.js";

const reorderArray = (array, sourceIndex, targetIndex) => {
  const newArray = [...array];
  const element = newArray.splice(sourceIndex, 1)[0];
  newArray.splice(targetIndex, 0, element);
  return newArray;
};

export default function App() {
  const { ref, getPipeHeight, toggle } = useTreeOpenHandler();
  const [tree, setTree] = React.useState([]);
  const handleDrop = (_, options) => {
    const { dropTargetId, destinationIndex, monitor } = options;

    const { start, end, treeData, dragSourceId } = (() => {
      const treeData = [...tree];
      let { dragSourceId } = options;

      const itemType = monitor.getItemType();
      if (itemType === NativeTypes.TEXT) {
        const nodeJson = monitor.getItem().text;
        const node = JSON.parse(nodeJson);
        node.id = uuidv4();
        node.parent = 0;
        dragSourceId = node.id;
        treeData.push(node);
      }

      const start = treeData.find((v) => v.id === dragSourceId);
      const end = treeData.find((v) => v.id === dropTargetId);
      return { start, end, treeData, dragSourceId };
    })();

    if (
      start?.parent === dropTargetId &&
      start &&
      typeof destinationIndex === "number"
    ) {
      const output = reorderArray(
        treeData,
        treeData.indexOf(start),
        destinationIndex
      );
      setTree(output);
    }

    if (
      start?.parent !== dropTargetId &&
      start &&
      typeof destinationIndex === "number"
    ) {
      if (
        getDescendants(treeData, dragSourceId).find(
          (el) => el.id === dropTargetId
        ) ||
        dropTargetId === dragSourceId ||
        (end && !end?.droppable)
      )
        return;

      const output = reorderArray(
        treeData,
        treeData.indexOf(start),
        destinationIndex
      );
      const movedElement = output.find((el) => el.id === dragSourceId);
      if (movedElement) movedElement.parent = dropTargetId;
      setTree(output);
    }
  };

  const externalNodes = [
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

  const handleDelete = (id) => {
    const deleteIds = [id, ...getDescendants(tree, id).map((node) => node.id)];
    const newTree = tree.filter((node) => !deleteIds.includes(node.id));
    setTree(newTree);
  };

  const handleCopy = (id) => {
    const targetNode = tree.find((n) => n.id === id);
    const descendants = getDescendants(tree, id);
    const idMap = {
      [id]: uuidv4(),
    };
    const newDescendants = [];
    while (descendants.length) {
      const node = descendants.shift();
      if (idMap[node.parent] !== undefined) {
        const oldId = node.id;
        const newId = uuidv4();
        newDescendants.push({
          ...node,
          id: newId,
          parent: idMap[node.parent],
        });
        idMap[oldId] = newId;
      } else {
        descendants.push(descendants);
      }
    }

    setTree([
      ...tree,
      {
        ...targetNode,
        id: idMap[id],
      },
      ...newDescendants,
    ]);
  };

  return (
    <div>
      <div>
        {externalNodes.map((node) => (
          <ExternalNode key={node.id} node={node} />
        ))}
      </div>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className={styles.wrapper}>
          <Tree
            ref={ref}
            classes={{
              root: styles.treeRoot,
              placeholder: styles.placeholder,
              dropTarget: styles.dropTarget,
              listItem: styles.listItem,
            }}
            tree={tree}
            extraAcceptTypes={[NativeTypes.TEXT]}
            sort={false}
            rootId={0}
            insertDroppableFirst={false}
            enableAnimateExpand={true}
            onDrop={handleDrop}
            canDrop={() => true}
            dropTargetOffset={5}
            placeholderRender={(node, { depth }) => (
              <Placeholder node={node} depth={depth} />
            )}
            render={(node, { depth, isOpen, isDropTarget, onToggle }) => (
              <Node
                onDelete={handleDelete}
                onCopy={handleCopy}
                getPipeHeight={getPipeHeight}
                node={node}
                depth={depth}
                isOpen={isOpen}
                onToggle={onToggle}
                onClick={() => {
                  if (node.droppable) {
                    toggle(node?.id);
                  }
                }}
                isDropTarget={isDropTarget}
                treeData={tree}
              />
            )}
          />
        </div>
      </DndProvider>
    </div>
  );
}
