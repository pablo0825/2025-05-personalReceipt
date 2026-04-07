import { describe, it, expect } from "vitest";
import { wrapTextByLength } from "../../utils/wrapTextByLength";

describe("wrapTextByLength", () => {
  it("文字超過 maxLength 時正確切割", () => {
    expect(wrapTextByLength("HelloWorld", 3)).toEqual(["Hel", "loW", "orl", "d"]);
  });

  it("文字等於 maxLength 時不切割", () => {
    expect(wrapTextByLength("Hello", 5)).toEqual(["Hello"]);
  });

  it("文字短於 maxLength 時回傳單一元素", () => {
    expect(wrapTextByLength("Hi", 11)).toEqual(["Hi"]);
  });

  it("去除連字號與空白後再切割", () => {
    expect(wrapTextByLength("台灣大學-資訊 工程", 4)).toEqual(["台灣大學", "資訊工程"]);
  });

  it("空字串回傳空陣列", () => {
    expect(wrapTextByLength("", 5)).toEqual([]);
  });
});
