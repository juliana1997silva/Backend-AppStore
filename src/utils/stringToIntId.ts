export function stringToIntId(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // força 32 bits
  }
  return Math.abs(hash); // garante positivo
}