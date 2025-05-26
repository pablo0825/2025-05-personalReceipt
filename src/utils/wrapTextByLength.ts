export function wrapTextByLength(text: string, maxLength: number): string[] {
  /* 清理字串 */
  const cleanedText = text.replace(/[-\s]/g, "");

  const result = [];
  for (let i = 0; i < cleanedText.length; i += maxLength) {
    result.push(cleanedText.slice(i, i + maxLength));
  }
  return result;
}
