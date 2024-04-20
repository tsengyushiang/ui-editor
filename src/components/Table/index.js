import { v4 as uuidv4 } from "uuid";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react";
import { useEffect, useState } from "react";

registerAllModules();

const indexToKey = (index) => {
  const keyArray = ["id", "parent", "type"];
  return keyArray[index];
};

const EVENTS = {
  AFTER_CREATE_ROW: "AFTER_CREATE_ROW",
  AFTER_REMOVE_ROW: "AFTER_REMOVE_ROW",
  AFTER_CHANGE: "AFTER_CHANGE",
};

const Table = ({ tree, setTree }) => {
  const [events, setEvents] = useState([]);
  const data = tree.map((node) => [node.id, node.parent, node.type]);

  useEffect(() => {
    if (!events.length) return;

    let newTree = [...tree];
    events.forEach(({ event, data }) => {
      if (event === EVENTS.AFTER_CREATE_ROW) {
        const { row } = data;
        newTree.splice(row, 0, { id: uuidv4(), parent: 0, type: null });
      } else if (event === EVENTS.AFTER_REMOVE_ROW) {
        const { row, amount } = data;
        newTree = newTree.filter(
          (_, index) => index < row || index >= row + amount
        );
      } else if (event === EVENTS.AFTER_CHANGE) {
        const { changes } = data;
        changes.forEach(([row, col, _, newValue]) => {
          const target = newTree[row];
          target[indexToKey(col)] = newValue;
        });
      }
    });
    setEvents([]);

    const parseZeroParent = (node) => ({
      ...node,
      parent: node.parent === "0" ? 0 : node.parent,
    });
    setTree(newTree.map(parseZeroParent), false);
  }, [tree, events]);

  const afterCreateRow = (row) => {
    setEvents((prev) => [
      ...prev,
      { event: EVENTS.AFTER_CREATE_ROW, data: { row } },
    ]);
  };
  const afterRemoveRow = (row, amount) => {
    setEvents((prev) => [
      ...prev,
      { event: EVENTS.AFTER_REMOVE_ROW, data: { row, amount } },
    ]);
  };
  const afterChange = (changes) => {
    if (!changes) return;
    setEvents((prev) => [
      ...prev,
      { event: EVENTS.AFTER_CHANGE, data: { changes } },
    ]);
  };

  return (
    <HotTable
      settings={{
        width: "100%",
        rowHeaders: true,
        allowInsertRow: true,
        allowInsertColumn: false,
        allowRemoveColumn: false,
        contextMenu: true,
        licenseKey: "non-commercial-and-evaluation",
      }}
      data={data}
      afterChange={afterChange}
      afterCreateRow={afterCreateRow}
      afterRemoveRow={afterRemoveRow}
    />
  );
};

export default Table;
