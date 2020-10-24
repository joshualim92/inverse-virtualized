import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import Button from "./Button";

/**
 * Controls for virtualized list
 *
 * ```jsx
 * <Controls addData={(count) => addSomeData(count)} clearData={clearData} />
 * ```
 */

export interface ControlsProps {
  // addData callback with count from input
  addData: (numberOfItems: number) => void;
  // clearData callback
  clearData: () => void;
}

const Container = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const Input = styled.input<{ error?: boolean }>`
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
  ${({ error }) =>
    error &&
    `
    outline: none;
    border-color: red;
    border-width: 2px;
    `}
`;

const SubmitButton = styled(Button)`
  margin: 0 0.5rem;
  padding: 0.75rem;
`;

const Controls: FC<ControlsProps> = ({ addData, clearData }) => {
  const [numberOfItems, setNumberOfItems] = useState<number | undefined>();
  const [numberOfItemsError, setNumberOfItemsError] = useState(false);

  const onSubmit: React.FormEventHandler<any> = (e) => {
    e.preventDefault();

    if (numberOfItems && typeof numberOfItems === "number") {
      addData(numberOfItems);
    } else {
      setNumberOfItemsError(true);
    }
  };

  return (
    <Container>
      <form onSubmit={onSubmit}>
        <Input
          type="number"
          name="item-count"
          id="item-count"
          placeholder="# of items"
          value={numberOfItems}
          onChange={(e) => {
            setNumberOfItems(parseInt(e.target.value, 10));
            setNumberOfItemsError(false);
          }}
          error={numberOfItemsError}
        />

        <SubmitButton type="submit" width="6rem">
          Generate
        </SubmitButton>
      </form>
      <Button onClick={clearData} type="button" width="6rem">
        Reset
      </Button>
    </Container>
  );
};

export default Controls;
