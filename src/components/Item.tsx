import React, { FC } from "react";
import styled from "@emotion/styled";
import { DraggableProvided } from "react-beautiful-dnd";
import { Item as ItemEntity } from "../entities/Item";
import Button from "./Button";

/**
 * Item used in InvertedVirtualizedList. Has props for react-beautiful-dnd
 * and react-virtualized. Could be split to be simpler and more generic when
 * the need arises.
 */

export interface ItemProps {
  // onLoad is used for CellMeasurer measure callback
  onLoad?: () => void;
  index: number;
  // isDragging is from react-beautiful-dnd
  isDragging: boolean;
  item: ItemEntity;
  // provided is from react-beautiful-dnd
  provided: DraggableProvided;
  // style are inline styles from react-virtualized
  style?: Object;
}

const Container = styled.div`
  background: #fff;
  border-radius: 0.25rem;
  border: 1px solid #000;
  box-sizing: border-box;
  padding: 0.5rem 2.5rem 1rem 0.5rem;
  position: relative;
`;

const DeleteButton = styled(Button)`
  position: absolute;
  top: 0.0625rem;
  right: 0.125rem;
`;

const getStyle = ({
  provided,
  style,
  isDragging,
}: {
  provided: DraggableProvided;
  style: any;
  isDragging: boolean;
}) => {
  const combined = {
    ...style,
    ...provided.draggableProps.style,
  };

  const marginBottom = 8;
  const withSpacing = {
    ...combined,
    height: isDragging ? combined?.height : combined?.height - marginBottom,
    marginBottom,
  };

  return withSpacing;
};

const Item: FC<ItemProps> = ({ isDragging, item, provided, style }) => {
  return (
    <Container
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle({ provided, style, isDragging })}
    >
      {item.content}
      <DeleteButton type="button">X</DeleteButton>
    </Container>
  );
};

export default React.memo(Item);
