import React from "react";
import Typography from "@mui/material/Typography";
import styles from "./ExternalNode.module.css";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";

export const TypeIcon = (props) => {
  if (props.droppable) {
    return <FolderIcon />;
  }

  return <DescriptionIcon />;
};

export const ExternalNode = (props) => {
  const { droppable } = props.node;

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text", JSON.stringify(props.node));
  };

  return (
    <div draggable className={styles.root} onDragStart={handleDragStart}>
      <div className={styles.filetype}>
        <TypeIcon droppable={droppable || false} />
      </div>
      <div className={styles.label}>
        <Typography variant="body2">{props.node.text}</Typography>
      </div>
    </div>
  );
};
