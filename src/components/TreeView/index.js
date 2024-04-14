import { v4 as uuidv4 } from "uuid";
import {
  DndProvider,
  getBackendOptions,
  getDescendants,
  MultiBackend,
  Tree as ReactDndTree,
} from "@minoru/react-dnd-treeview";
import { NativeTypes } from "react-dnd-html5-backend";
import React from "react";
import Node from "./Node";
import Placeholder from "./Placeholder";
import useTreeOpenHandler from "./hooks/useTreeOpenHandler";
import styles from "../../styles.module.css";
import { ExternalNode } from "./ExternalNode";

const reorderArray = (array, sourceIndex, targetIndex) => {
  const newArray = [...array];
  const element = newArray.splice(sourceIndex, 1)[0];
  newArray.splice(targetIndex, 0, element);
  return newArray;
};

const deleteNode = (tree, id) => {
  const deleteIds = [id, ...getDescendants(tree, id).map((node) => node.id)];
  const newTree = tree.filter((node) => !deleteIds.includes(node.id));
  return newTree;
};

const duplicateSubTree = (tree, rootId) => {
  const targetNode = tree.find((n) => n.id === rootId);
  const descendants = getDescendants(tree, rootId);
  const idMap = {
    [rootId]: uuidv4(),
  };

  const newSubTree = [];
  newSubTree.push({
    ...targetNode,
    id: idMap[rootId],
  });
  while (descendants.length) {
    const node = descendants.shift();
    if (idMap[node.parent] !== undefined) {
      const oldId = node.id;
      const newId = uuidv4();
      newSubTree.push({
        ...node,
        id: newId,
        parent: idMap[node.parent],
      });
      idMap[oldId] = newId;
    } else {
      descendants.push(descendants);
    }
  }
  return newSubTree;
};

const TreeView = ({ nodeTypes, nodeRenderer, tree, setTree }) => {
  const { ref, getPipeHeight, toggle } = useTreeOpenHandler();
  const handleDrop = (_, options) => {
    const { dropTargetId, destinationIndex, monitor } = options;

    const { start, end, treeData, dragSourceId } = (() => {
      const treeData = [...tree];
      let { dragSourceId } = options;

      const itemType = monitor.getItemType();
      if (itemType === NativeTypes.TEXT) {
        const nodeJson = monitor.getItem().text;
        const target = JSON.parse(nodeJson);
        const newSubTree = duplicateSubTree(nodeTypes, target.id);
        dragSourceId = newSubTree[0].id;
        treeData.push(...newSubTree);
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

  const handleDelete = (id) => {
    const newTree = deleteNode(tree, id);
    setTree(newTree);
  };

  const handleCopy = (id) => {
    const targetIndex = tree.findIndex((n) => n.id === id);
    const newSubTree = duplicateSubTree(tree, id);
    const newTree = [...tree];
    newTree.splice(targetIndex + 1, 0, ...newSubTree);
    setTree(newTree);
  };

  const NodeRenderer = nodeRenderer;

  return (
    <div>
      <div className={styles.treeRoot}>
        {nodeTypes.map((node) => {
          if (node.parent !== 0) return null;
          return (
            <ExternalNode key={node.id} node={node}>
              <NodeRenderer {...node} />
            </ExternalNode>
          );
        })}
      </div>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <div className={styles.wrapper}>
          <ReactDndTree
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
              >
                <NodeRenderer {...node} />
              </Node>
            )}
          />
        </div>
      </DndProvider>
    </div>
  );
};

export default TreeView;
