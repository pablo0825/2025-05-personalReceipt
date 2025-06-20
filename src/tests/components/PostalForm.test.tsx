import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; //用useEvent來模擬真實的點擊和輸入
import { describe, it, expect, vi, beforeEach } from "vitest";
import PostalForm from "../../components/PostalForm";
import { postalFormField } from "../../var/GlobalVariable";

// 模擬 props
const mockGeneratePDF = vi.fn();
const mockSetProgress = vi.fn();
const mockSetIsPopupOpen = vi.fn();

const renderForm = () =>
  render(
    <PostalForm
      generatePostalPDF={mockGeneratePDF}
      setProgress={mockSetProgress}
      setIsPopupOpen={mockSetIsPopupOpen}
    />
  );

const fillValidFormData = async () => {
  await userEvent.type(screen.getByLabelText("姓名"), "王小明");
  await userEvent.type(screen.getByLabelText("服務單位"), "OpenAI Taiwan");
  await userEvent.type(screen.getByLabelText("職稱"), "講師");
  await userEvent.type(screen.getByLabelText("身分證字號"), "A123456789");
  await userEvent.type(screen.getByLabelText("金額"), "4000");
  await userEvent.type(screen.getByLabelText("Email"), "test@example.com");
  await userEvent.type(screen.getByLabelText("郵局代號"), "123");
  await userEvent.type(screen.getByLabelText("郵局帳號"), "000111222333");
  await userEvent.type(screen.getByLabelText("日期"), "2025-06-16");
};

//在每次測試前，清除模擬資料
beforeEach(() => {
  vi.clearAllMocks();
});

describe("postForm Component", () => {
  it("應該渲染所有 input 欄位", () => {
    renderForm();
    for (const field of postalFormField) {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    }
  });

  it("輸入錯誤時，應顯示錯誤訊息", async () => {
    renderForm();
    await userEvent.click(screen.getByRole("button", { name: "提交" }));
    await waitFor(() => {
      expect(screen.getByText("姓名")).toBeInTheDocument();
    });
  });

  it("填寫正確時應呼叫 generatePDF", async () => {
    renderForm();
    await fillValidFormData();
    await userEvent.click(screen.getByRole("button", { name: "提交" }));

    await waitFor(() => {
      expect(mockGeneratePDF).toHaveBeenCalledOnce();
    });
  });

  it("提交後，應重置所有欄位", async () => {
    renderForm();
    await userEvent.click(screen.getByRole("button", { name: "提交" }));

    //等待重置完成
    await waitFor(() => {
      for (const field of postalFormField) {
        const input = screen.getByLabelText(field.label) as HTMLInputElement;
        expect(input.value).toBe("");
      }
    });
  });
});
