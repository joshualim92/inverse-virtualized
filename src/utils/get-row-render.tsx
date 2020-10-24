import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { CellMeasurer, CellMeasurerCache } from "react-virtualized";
import { ListRowProps } from "react-virtualized";
import Item from "../components/Item";
import { Item as ItemEntity } from "../entities/Item";

const getRowRender = ({
  cache,
  data,
  onDelete,
}: {
  cache: CellMeasurerCache;
  data: ItemEntity[];
  onDelete: (id: string) => void;
}) => ({ parent, index, style }: ListRowProps) => {
  const item = data[index];

  return (
    <CellMeasurer
      rowIndex={index}
      cache={cache}
      parent={parent}
      key={item.id}
      columnIndex={0}
    >
      {({ measure }) => (
        <Draggable draggableId={item.id} index={index}>
          {(provided, snapshot) => (
            <Item
              onLoad={measure}
              provided={provided}
              item={item}
              isDragging={snapshot.isDragging}
              style={style}
              index={index}
              onDelete={onDelete}
            />
          )}
        </Draggable>
      )}
    </CellMeasurer>
  );
};

export default getRowRender;
