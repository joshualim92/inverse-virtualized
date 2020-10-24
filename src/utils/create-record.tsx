import { loremIpsum } from "lorem-ipsum";
import { v4 as uuidv4 } from "uuid";
import { Item } from "../entities/Item";

const createRecord = (count: number): Array<Item> => {
  let records = [];

  for (let i = 0; i < count; i++) {
    records.push({
      id: uuidv4(),
      content: loremIpsum(),
    });
  }
  return records;
};

export default createRecord;
