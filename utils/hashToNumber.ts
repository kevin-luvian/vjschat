export default function hashToNumber(str: string, n: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % n; // 31 prime number
  }
  return ((hash + n) % n) + 1;
}
