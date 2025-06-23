import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
} from "vitest";
import { renderHook } from "@testing-library/react";
import { useGeneratePostalPDF } from "../../hooks/useGeneratePostalPDF";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

let mockFetch: ReturnType<typeof vi.fn>;

const mockFormData = {
  fullName: "王小明",
  organization: "OpenAI Taiwan",
  jobTitle: "工程師",
  receiptReason: "出席講座",
  amount: 3000,
  idNumber: "A123456789",
  email: "test@example.com",
  postalCode: "123",
  postOfficeAccount: "000111222333",
  date: "2025-06-23",
};

//模擬存檔
vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

//初始化設定
beforeAll(() => {
  //spyOn感覺像是攔截原本的function
  //mockResolvedValue 模擬解決值，模擬promise成功執行後的回傳的某個物件
  vi.spyOn(PDFDocument, "load").mockResolvedValue({
    registerFontkit: vi.fn(), //模擬註冊字體
    embedFont: vi.fn().mockResolvedValue({}),
    getPages: vi.fn().mockReturnValue([
      //模擬取得第一頁
      {
        drawText: vi.fn(), //模擬用來繪製文字的方法
      },
    ]),
    save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
  } as unknown as PDFDocument);
});

//每次測試前，都會呼叫一次
//避免真的去抓pdf檔案，可以用假的資料模擬
beforeEach(() => {
  mockFetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
  });

  global.fetch = mockFetch;
});

//每次測試結束後
afterEach(() => {
  vi.restoreAllMocks();
});

describe("useGeneratePDF", () => {
  it("應成功產生 PDF 並呼叫 saveAs", async () => {
    const { result } = renderHook(() => useGeneratePostalPDF());

    await result.current.generatePostalPDF(mockFormData);

    expect(saveAs).toHaveBeenCalledOnce();
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "王小明-領據.pdf");
  });

  it("應在載入 template.pdf 失敗時顯示 alert", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    const { result } = renderHook(() => useGeneratePostalPDF());
    await result.current.generatePostalPDF(mockFormData);

    expect(alertSpy).toHaveBeenCalledWith("發生錯誤，請確認模板檔案是否存在");
    expect(saveAs).not.toHaveBeenCalled();
  });

  it("應在表單資料缺失時不產生 PDF", async () => {
    const { result } = renderHook(() => useGeneratePostalPDF());
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    await result.current.generatePostalPDF({ ...mockFormData, fullName: "" });

    // 根據你的邏輯，這邊可能是產生空 PDF 或直接 alert，要看你的實作
    expect(alertSpy).toHaveBeenCalled();
  });
});
