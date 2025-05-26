export function splitStringIntoGroups(text: string) {
  const cleanedText = text.replace(/[-\s]/g, "");

  const result = [];
  for (let i = 0; i < cleanedText.length; i++) {
    result.push(cleanedText.slice(i, i + 1));
  }
  return result;
}
