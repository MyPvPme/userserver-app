export function removeColorCodes(input: string): string {
  return input.replaceAll(/§[0-9 a-g]/g, "");
}
