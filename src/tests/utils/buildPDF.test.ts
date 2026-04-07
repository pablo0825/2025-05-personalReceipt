import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest";
import { PDFDocument } from "pdf-lib";
import { buildPDF } from "../../utils/buildPDF";

const bankData = {
  fullName: "王小明",
  organization: "OpenAI Taiwan",
  jobTitle: "工程師",
  receiptReason: "出席講座",
  amount: 3000,
  idNumber: "A123456789",
  email: "test@example.com",
  bankBranchCode: "1234567",
  bankBranchName: "中山分行",
  bankAccountNumber: "000111222333",
  date: "2025-06-16",
} as const;

const postalData = {
  fullName: "李小華",
  organization: "台大",
  jobTitle: "研究員",
  receiptReason: "出席演講",
  amount: 1500,
  idNumber: "B234567890",
  email: "postal@example.com",
  postalCode: "700",
  postOfficeAccount: "123456789012",
  date: "2025-06-16",
} as const;

let mockFetch: ReturnType<typeof vi.fn>;

const makeFetchMock = () =>
  vi.fn().mockResolvedValue({
    ok: true,
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
  });

beforeAll(() => {
  vi.spyOn(PDFDocument, "load").mockResolvedValue({
    registerFontkit: vi.fn(),
    embedFont: vi.fn().mockResolvedValue({
      /* minimal font stub */
    }),
    getPages: vi.fn().mockReturnValue([{ drawText: vi.fn() }]),
    save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
  } as unknown as PDFDocument);
});

beforeEach(() => {
  mockFetch = makeFetchMock();
  global.fetch = mockFetch;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("buildPDF utility is directly tested", () => {
  describe("bank mode", () => {
    it("應成功產生 Uint8Array（parseDate handles YYYY-MM-DD）", async () => {
      const result = await buildPDF({ ...bankData, mode: "bank" });
      expect(result).toBeInstanceOf(Uint8Array);
    });
  });

  describe("postal mode", () => {
    it("應成功產生 Uint8Array（parseDate handles YYYYMMDD）", async () => {
      // date 格式為 YYYYMMDD，驗證 parseDate 的第二條路徑
      const result = await buildPDF({
        ...postalData,
        mode: "postal",
        date: "20250616",
      });
      expect(result).toBeInstanceOf(Uint8Array);
    });
  });

  describe("Template load failure throws", () => {
    it("模板載入失敗時應 throw Error '無法載入 PDF 模板'", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

      await expect(buildPDF({ ...bankData, mode: "bank" })).rejects.toThrow(
        "無法載入 PDF 模板"
      );
    });
  });

  describe("Font load failure throws", () => {
    it("字型載入失敗時應 throw Error '無法載入中文字型'", async () => {
      // 第一次 fetch（template）成功，第二次（font）失敗
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
        })
        .mockResolvedValueOnce({ ok: false, status: 404 });

      await expect(buildPDF({ ...bankData, mode: "bank" })).rejects.toThrow(
        "無法載入中文字型"
      );
    });
  });
});
