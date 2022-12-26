import {v4 as uuidv4} from "uuid";
export const uuid = () => {
  const uuid: string = uuidv4();
  return uuid.replace(/-/gi, "");
};
