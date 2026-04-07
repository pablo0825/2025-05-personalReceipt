## ADDED Requirements

### Requirement: Shared PDF build utility

The system SHALL provide a single `buildPDF` function in `src/utils/buildPDF.ts` that accepts a data object with a `mode` discriminator (`'bank'` or `'postal'`) and returns a `Uint8Array` of the generated PDF bytes.

#### Scenario: Generate bank mode PDF

- **WHEN** `buildPDF` is called with `mode: 'bank'` and valid common fields plus bank-specific fields (`bankBranchCode`, `bankBranchName`, `bankAccountNumber`)
- **THEN** the function SHALL return a `Uint8Array` containing a valid PDF with all fields written at their correct coordinates

#### Scenario: Generate postal mode PDF

- **WHEN** `buildPDF` is called with `mode: 'postal'` and valid common fields plus postal-specific fields (`postalCode`, `postOfficeAccount`)
- **THEN** the function SHALL return a `Uint8Array` containing a valid PDF with all fields written at their correct coordinates

#### Scenario: Template load failure

- **WHEN** the PDF template fetch returns a non-ok HTTP response
- **THEN** `buildPDF` SHALL throw an `Error` with message `"無法載入 PDF 模板"`

#### Scenario: Font load failure

- **WHEN** the font fetch returns a non-ok HTTP response
- **THEN** `buildPDF` SHALL throw an `Error` with message `"無法載入中文字型"`

---

### Requirement: Unified date parsing

The system SHALL parse date strings in both `YYYY-MM-DD` and `YYYYMMDD` formats when writing the date field to the PDF.

#### Scenario: Parse YYYY-MM-DD format (single form input)

- **WHEN** the `date` field is `"2025-03-15"`
- **THEN** the year `"2025"`, month `"03"`, and day `"15"` SHALL each be drawn at their respective PDF coordinates

#### Scenario: Parse YYYYMMDD format (Excel batch input)

- **WHEN** the `date` field is `"20250315"`
- **THEN** the year `"2025"`, month `"03"`, and day `"15"` SHALL each be drawn at their respective PDF coordinates

---

### Requirement: Module separation for GlobalVariable

The system SHALL expose PDF coordinate constants from `src/constants/pdfCoordinates.ts`, form field definitions from `src/constants/formFields.ts`, and Zod schemas with derived types from `src/schemas/receiptSchema.ts`.

#### Scenario: Backward-compatible re-export

- **WHEN** any existing file imports from `src/var/GlobalVariable.ts`
- **THEN** all previously exported symbols SHALL remain importable without change (via re-export)

---

### Requirement: Shared base Zod schema

The system SHALL define a `baseReceiptSchema` containing the 8 shared fields (fullName, organization, jobTitle, receiptReason, amount, idNumber, email, date). `formFieldSchema` and `postalFormFieldSchema` SHALL each extend this base schema with their mode-specific fields.

#### Scenario: Shared validation rules applied to both modes

- **WHEN** either `formFieldSchema` or `postalFormFieldSchema` validates an object with an invalid `idNumber` (wrong format)
- **THEN** validation SHALL fail with the error message `"格式錯誤，需為1英文字+9數字"`

#### Scenario: Mode-specific field required only in bank mode

- **WHEN** `formFieldSchema` validates an object missing `bankBranchCode`
- **THEN** validation SHALL fail

#### Scenario: Mode-specific field required only in postal mode

- **WHEN** `postalFormFieldSchema` validates an object missing `postalCode`
- **THEN** validation SHALL fail
