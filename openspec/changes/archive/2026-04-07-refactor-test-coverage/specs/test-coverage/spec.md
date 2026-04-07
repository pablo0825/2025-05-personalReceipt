## ADDED Requirements

### Requirement: buildPDF utility is directly tested

The test suite SHALL include `src/tests/utils/buildPDF.test.ts` that directly tests the `buildPDF` function without going through hook wrappers.

#### Scenario: Bank mode generates PDF bytes

- **WHEN** `buildPDF` is called with `mode: "bank"` and valid bank fields
- **THEN** the function SHALL return a `Uint8Array` and `saveAs` SHALL be called with a blob named `"<fullName>-領據.pdf"`

#### Scenario: Postal mode generates PDF bytes

- **WHEN** `buildPDF` is called with `mode: "postal"` and valid postal fields
- **THEN** the function SHALL return a `Uint8Array` and `saveAs` SHALL be called with a blob named `"<fullName>-領據.pdf"`

#### Scenario: parseDate handles YYYY-MM-DD

- **WHEN** `buildPDF` is called with `date: "2025-06-16"`
- **THEN** the PDF SHALL be generated without error (confirming the YYYY-MM-DD parse path executes)

#### Scenario: parseDate handles YYYYMMDD

- **WHEN** `buildPDF` is called with `date: "20250616"`
- **THEN** the PDF SHALL be generated without error (confirming the YYYYMMDD parse path executes)

#### Scenario: Template load failure throws

- **WHEN** the fetch for `/template.pdf` returns a non-ok response
- **THEN** `buildPDF` SHALL throw an `Error` with message `"無法載入 PDF 模板"`

#### Scenario: Font load failure throws

- **WHEN** the fetch for `/fonts/NotoSansCJK-Regular.ttf` returns a non-ok response
- **THEN** `buildPDF` SHALL throw an `Error` with message `"無法載入中文字型"`

---

### Requirement: Batch PDF generation is tested

The test suite SHALL include `src/tests/hooks/useGenerateMultiplePDFs.test.ts` covering the three primary paths of `useGenerateMultiplePDFs`.

#### Scenario: All rows succeed and zip is downloaded

- **WHEN** `generatePDFs` is called with a valid multi-row Excel file
- **THEN** `saveAs` SHALL be called once with a Blob named `"批次領據.zip"` and the progress callback SHALL have been called with `100` as the last value

#### Scenario: One row fails without aborting the rest

- **WHEN** one row in the Excel file causes `buildPDF` to throw
- **THEN** the remaining rows SHALL still be processed, and `saveAs` SHALL still be called with the zip

#### Scenario: Progress callback reflects per-row completion

- **WHEN** `generatePDFs` processes 3 rows and a progress callback is provided
- **THEN** the callback SHALL be called with `33`, `67`, and `100` (rounded percentages per `Math.round((i+1)/n*100)`)

---

### Requirement: Batch postal PDF generation is tested

The test suite SHALL include `src/tests/hooks/useGenerateMultiplePostalPDFs.test.ts` covering the three primary paths of `useGenerateMultiplePostalPDFs`.

#### Scenario: All postal rows succeed and zip is downloaded

- **WHEN** `generatePostalPDFs` is called with a valid multi-row Excel file
- **THEN** `saveAs` SHALL be called once with a Blob named `"批次領據.zip"`

#### Scenario: One postal row fails without aborting the rest

- **WHEN** one row causes `buildPDF` to throw
- **THEN** the remaining rows SHALL still be processed and `saveAs` SHALL still be called with the zip

#### Scenario: Postal progress callback reflects per-row completion

- **WHEN** `generatePostalPDFs` processes 3 rows and a progress callback is provided
- **THEN** the callback SHALL be called with `33`, `67`, and `100`

---

### Requirement: splitStringIntoGroups is directly tested

The test suite SHALL include `src/tests/utils/splitStringIntoGroups.test.ts` covering character splitting and input normalization.

#### Scenario: Each character becomes an individual element

- **WHEN** `splitStringIntoGroups("A123456789")` is called
- **THEN** it SHALL return an array of 10 single-character strings

#### Scenario: Hyphens and spaces are stripped before splitting

- **WHEN** `splitStringIntoGroups("A1-23 45")` is called
- **THEN** it SHALL return `["A","1","2","3","4","5"]` (hyphens and spaces removed)

#### Scenario: Empty string returns empty array

- **WHEN** `splitStringIntoGroups("")` is called
- **THEN** it SHALL return `[]`

---

### Requirement: wrapTextByLength is directly tested

The test suite SHALL include `src/tests/utils/wrapTextByLength.test.ts` covering chunking, boundary conditions, and input normalization.

#### Scenario: Text longer than maxLength is chunked correctly

- **WHEN** `wrapTextByLength("HelloWorld", 3)` is called
- **THEN** it SHALL return `["Hel", "loW", "orl", "d"]`

#### Scenario: Text exactly equal to maxLength is not split

- **WHEN** `wrapTextByLength("Hello", 5)` is called
- **THEN** it SHALL return `["Hello"]`

#### Scenario: Text shorter than maxLength returns single element

- **WHEN** `wrapTextByLength("Hi", 11)` is called
- **THEN** it SHALL return `["Hi"]`

#### Scenario: Hyphens and spaces are stripped before chunking

- **WHEN** `wrapTextByLength("台灣大學-資訊 工程", 4)` is called
- **THEN** it SHALL return `["台灣大學", "資訊工程"]`

#### Scenario: Empty string returns empty array

- **WHEN** `wrapTextByLength("", 5)` is called
- **THEN** it SHALL return `[]`

---

### Requirement: Hook-layer tests verify saveAs is called

The test suite SHALL retain smoke tests for `useGeneratePDF` and `useGeneratePostalPDF` that confirm `saveAs` is invoked after a successful `buildPDF` call, and that errors are caught and surfaced as alerts.

#### Scenario: useGeneratePDF calls saveAs on success

- **WHEN** `generatePDF` is called with valid bank form data and `buildPDF` resolves
- **THEN** `saveAs` SHALL be called once with a PDF blob

#### Scenario: useGeneratePostalPDF calls saveAs on success

- **WHEN** `generatePostalPDF` is called with valid postal form data and `buildPDF` resolves
- **THEN** `saveAs` SHALL be called once with a PDF blob

#### Scenario: Hook catches buildPDF error and alerts

- **WHEN** `buildPDF` throws (e.g., template load fails)
- **THEN** `window.alert` SHALL be called and `saveAs` SHALL NOT be called
