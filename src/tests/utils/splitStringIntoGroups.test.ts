import { describe, it, expect } from "vitest";
import { splitStringIntoGroups } from "../../utils/splitStringIntoGroups";

describe("splitStringIntoGroups", () => {
  it("每個字元獨立成一個元素", () => {
    expect(splitStringIntoGroups("A123456789")).toEqual([
      "A","1","2","3","4","5","6","7","8","9",
    ]);
  });

  it("去除連字號與空白後再拆分", () => {
    expect(splitStringIntoGroups("A1-23 45")).toEqual([
      "A","1","2","3","4","5",
    ]);
  });

  it("空字串回傳空陣列", () => {
    expect(splitStringIntoGroups("")).toEqual([]);
  });
});
