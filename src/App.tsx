import React, { useState } from "react";
import styled from "@emotion/styled";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { CellMeasurerCache } from "react-virtualized";
import InvertedVirtualizedList from "./components/InvertedVirtualizedList";
import { Item } from "./entities/Item";
import createRecord from "./utils/create-record";
import reorder from "./utils/reorder";
import Controls from "./components/Controls";

const Main = styled.main`
  margin: auto;
  max-width: 50rem;
`;

const H1 = styled.h1`
  text-align: center;
`;

const cache = new CellMeasurerCache({
  defaultHeight: 100,
  fixedWidth: true,
});

function App() {
  const [data, setData] = useState<Item[]>([]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.source.index === result.destination.index) {
      return;
    }

    const newData: Item[] = reorder(
      data,
      result.source.index,
      result.destination.index
    );

    setData(newData);

    cache.clearAll();
  };

  const addData = (count: number) => {
    setData(data.concat(createRecord(count)));
    cache.clearAll();
  };

  return (
    <Main>
      <H1>Inverse Virtualized</H1>
      <Controls addData={addData} clearData={() => setData([])} />
      <DragDropContext onDragEnd={onDragEnd}>
        <InvertedVirtualizedList cache={cache} data={data} />
      </DragDropContext>
    </Main>
  );
}

export default App;
