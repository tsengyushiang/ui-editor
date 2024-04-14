import "handsontable/dist/handsontable.full.min.css";
import Handsontable from "handsontable/base";
import { registerAllModules } from "handsontable/registry";
import { HotTable } from "@handsontable/react";

registerAllModules();

const Table = ({ data }) => {
  const afterCreateRow = (row) => {
    console.log(row);
  };
  const afterRemoveRow = (row) => {
    console.log(row);
  };
  const afterChange = (a) => {
    console.log(a);
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
