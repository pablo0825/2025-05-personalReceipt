/**
 * 相容層：此檔案僅作 re-export 用途。
 * 原始定義已移至：
 *   - src/constants/pdfCoordinates.ts  (bankAccountX, idNumberX)
 *   - src/constants/formFields.ts      (formField, postalFormField, item)
 *   - src/schemas/receiptSchema.ts     (schemas, types)
 */

export { bankAccountX, idNumberX } from "../constants/pdfCoordinates";
export {
  formField,
  postalFormField,
  item,
  requiredFields,
  requiredPostalFields,
} from "../constants/formFields";
export {
  formFieldSchema,
  postalFormFieldSchema,
} from "../schemas/receiptSchema";
export type { formFieldTypes, postalFormFieldTypes } from "../schemas/receiptSchema";
