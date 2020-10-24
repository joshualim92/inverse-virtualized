import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import {
  AutoSizer,
  List,
  CellMeasurerCache,
  ScrollParams,
} from "react-virtualized";
import { Item as ItemEntity } from "./entities/Item";
import createRecord from "./utils/create-record";
import reorder from "./utils/reorder";
import Controls from "./components/Controls";
import Button from "./components/Button";
import Item from "./components/Item";
import getRowRender from "./utils/get-row-render";
import useRecallLastList from "./hooks/use-recall-last-list";

const Main = styled.main`
  margin: auto;
  max-width: 50rem;
`;

const H1 = styled.h1`
  text-align: center;
`;

const StyledList = styled(List)`
  background: #dcdcdc;
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const cache = new CellMeasurerCache({
  defaultHeight: 100,
  fixedWidth: true,
});

function App() {
  let listRef = useRef<any>();
  const [data, setData] = useState<ItemEntity[]>([]);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  useRecallLastList({ data }, { setData });

  // Scroll to bottom initially
  useEffect(() => {
    if (listRef.current) {
      // Wait for useRecallLastList
      setTimeout(() => {
        listRef.current.scrollToRow(data.length - 1);
      });
    }
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.source.index === result.destination.index) {
      return;
    }

    const newData: ItemEntity[] = reorder(
      data,
      result.source.index,
      result.destination.index
    );

    setData(newData);

    // Reset heights
    cache.clearAll();
  };

  const addData = (count: number) => {
    setData(data.concat(createRecord(count)));
    cache.clearAll();

    if (listRef.current) {
      // Wait for state to update before scrolling to bottom
      setTimeout(() => {
        listRef.current.scrollToRow(data.length - 1 + count);
        setUserHasScrolled(false);
      });
    }
  };

  const deleteData = (id: string) => {
    const index = data.findIndex((item) => item.id === id);
    setData([...data.slice(0, index), ...data.slice(index + 1)]);
    // Reset heights
    cache.clearAll();
  };

  return (
    <Main>
      <H1>Inverse Virtualized</H1>
      <Controls addData={addData} clearData={() => setData([])} />
      <DragDropContext onDragEnd={onDragEnd}>
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
                    rowRenderer={getRowRender({
                      cache,
                      data,
                      onDelete: deleteData,
                    })}
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
      </DragDropContext>
    </Main>
  );
}

export default App;
