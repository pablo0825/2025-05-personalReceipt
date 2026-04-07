import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGenerateMultiplePDFs } from "../../hooks/useGenerateMultiplePDFs";
import { saveAs } from "file-saver";

// ── Mocks ──────────────────────────────────────────

vi.mock("../../utils/buildPDF", () => ({
  buildPDF: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
}));

vi.mock("file-saver", () => ({ saveAs: vi.fn() }));

// Mock JSZip：模擬 new JSZip() 回傳有 file / generateAsync 的物件
vi.mock("jszip", () => ({
  default: vi.fn().mockImplementation(() => ({
    file: vi.fn(),
    generateAsync: vi.fn().mockResolvedValue(new Blob(["zip"])),
  })),
}));

// Mock XLSX：vi.mock 會被 hoist，不可在 factory 中參照頂層常數
// 直接內聯資料避免 ReferenceError
vi.mock("xlsx", () => ({
  read: vi.fn().mockReturnValue({
    Sheets: { Sheet1: {} },
    SheetNames: ["Sheet1"],
  }),
  utils: {
    sheet_to_json: vi.fn().mockReturnValue([
      { fullName: "王小明", bankBranchCode: "001" },
      { fullName: "李小華", bankBranchCode: "002" },
      { fullName: "張大山", bankBranchCode: "003" },
    ]),
  },
}));

// 建立假的 File 物件（arrayBuffer 回傳空 buffer）
const makeMockFile = () =>
  Object.assign(new File([""], "test.xlsx"), {
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
  });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Batch PDF generation is tested", () => {
  describe("All rows succeed and zip is downloaded", () => {
    it("3 筆全成功時應呼叫 saveAs 一次，檔名為 '批次領據.zip'", async () => {
      const { result } = renderHook(() => useGenerateMultiplePDFs());
      await result.current.generatePDFs(makeMockFile());

      expect(saveAs).toHaveBeenCalledOnce();
      expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "批次領據.zip");
    });
  });

  describe("One row fails without aborting the rest", () => {
    it("第 2 筆 buildPDF 失敗時，第 1、3 筆仍成功，saveAs 仍被呼叫", async () => {
      const { buildPDF } = await import("../../utils/buildPDF");
      vi.mocked(buildPDF)
        .mockResolvedValueOnce(new Uint8Array([1])) // 第 1 筆成功
        .mockRejectedValueOnce(new Error("PDF error")) // 第 2 筆失敗
        .mockResolvedValueOnce(new Uint8Array([3])); // 第 3 筆成功

      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

      const { result } = renderHook(() => useGenerateMultiplePDFs());
      await result.current.generatePDFs(makeMockFile());

      // zip 仍然下載
      expect(saveAs).toHaveBeenCalledOnce();
      // 失敗清單的 alert 被呼叫
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining("PDF 產生失敗")
      );
    });
  });

  describe("Progress callback reflects per-row completion", () => {
    it("3 筆 rows 時 callback 依序以 34、67、100 呼叫", async () => {
      const progressSpy = vi.fn();
      const { result } = renderHook(() => useGenerateMultiplePDFs());
      await result.current.generatePDFs(makeMockFile(), progressSpy);

      // Math.round(1/3*100)=33, Math.round(2/3*100)=67, Math.round(3/3*100)=100
      expect(progressSpy).toHaveBeenNthCalledWith(1, 33);
      expect(progressSpy).toHaveBeenNthCalledWith(2, 67);
      expect(progressSpy).toHaveBeenNthCalledWith(3, 100);
    });
  });
});
