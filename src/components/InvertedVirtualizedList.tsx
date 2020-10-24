import React, { FC, useEffect, useState, useRef } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  ScrollParams,
} from "react-virtualized";
import { AutoSizer, List, ListRowProps } from "react-virtualized";
import ReactDOM from "react-dom";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "@emotion/styled";
import Item from "./Item";
import { Item as ItemEntity } from "../entities/Item";
import Button from "./Button";

/**
 * InvertedVirtualizedList is a drag and droppable virtualized list. It uses
 * CellMeasurerCache for dynamic row height sizing.
 */

export interface InvertedVirtualizedListProps {
  cache: CellMeasurerCache;
  data: ItemEntity[];
}

const StyledList = styled(List)`
  background: #dcdcdc;
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const getRowRender = ({
  cache,
  data,
}: {
  cache: CellMeasurerCache;
  data: ItemEntity[];
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
            />
          )}
        </Draggable>
      )}
    </CellMeasurer>
  );
};

const InvertedVirtualizedList: FC<InvertedVirtualizedListProps> = ({
  cache,
  data,
}) => {
  let listRef = useRef<any>();
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToRow(data.length - 1);
    }
  }, []);

  return (
    <Droppable
      droppableId="droppable"
      mode="virtual"
      renderClone={(provided, snapshot, rubric) => (
        <Item
          provided={provided}
          isDragging={snapshot.isDragging}
          item={data[rubric.source.index]}
          index={rubric.source.index}
        />
      )}
    >
      {(provided) => (
        <AutoSizer>
          {({ width }) => (
            <div>
              <StyledList
                height={500}
                rowCount={data.length}
                rowHeight={cache.rowHeight}
                width={width}
                rowRenderer={getRowRender({ cache, data })}
                onScroll={(params: ScrollParams) => {
                  if (listRef.current) {
                    const offset = listRef.current.getOffsetForRow({
                      index: data.length - 1,
                    });

                    if (offset > params.scrollTop) {
                      setUserHasScrolled(true);
                    }
                  }
                }}
                ref={(ref: any) => {
                  if (ref) {
                    listRef.current = ref;
                    // react-virtualized has no way to get the list's ref
                    // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                    // eslint-disable-next-line react/no-find-dom-node
                    const ele = ReactDOM.findDOMNode(ref);
                    if (ele instanceof HTMLElement) {
                      provided.innerRef(ele);
                    }
                  }
                }}
              />

              {/* TODO: It'd be nice to use react-transition-group here */}
              {userHasScrolled && (
                <Button
                  width="6rem"
                  type="button"
                  onClick={() => {
                    if (listRef.current) {
                      listRef.current.scrollToRow(data.length - 1);
                    }

                    setUserHasScrolled(false);
                  }}
                >
                  Back to bottom
                </Button>
              )}
            </div>
          )}
        </AutoSizer>
      )}
    </Droppable>
  );
};

export default InvertedVirtualizedList;
