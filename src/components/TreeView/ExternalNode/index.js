import React from "react";

export const ExternalNode = (props) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text", JSON.stringify(props.node));
  };

  return (
    <div draggable onDragStart={handleDragStart}>
      {props.children}
    </div>
  );
};
