import type { SolutionDef } from "@/engine/types"

export const defuseTheBomb: SolutionDef = {
  view: "array",
  array: (a) => a.code as number[],
  code: `// each cell becomes the circular sum of the next k (or prev |k|) cells
function decrypt(code, k) {
  const n = code.length, res = new Array(n).fill(0);
  if (k === 0) return res;
  const lo = k > 0 ? 1 : n + k;       // window start, relative to i
  const hi = k > 0 ? k : n - 1;       // window end, relative to i
  let sum = 0;
  for (let j = lo; j <= hi; j++) sum += code[j % n];
  for (let i = 0; i < n; i++) {
    res[i] = sum;
    sum -= code[(lo + i) % n];        // old left edge leaves
    sum += code[(hi + i + 1) % n];    // new right edge enters
  }
  return res;
}`,
  codeJava: `// each cell becomes the circular sum of the next k (or prev |k|) cells
int[] decrypt(int[] code, int k) {
  int n = code.length; int[] res = new int[n];
  if (k == 0) return res;
  int lo = k > 0 ? 1 : n + k;         // window start, relative to i
  int hi = k > 0 ? k : n - 1;         // window end, relative to i
  int sum = 0;
  for (int j = lo; j <= hi; j++) sum += code[j % n];
  for (int i = 0; i < n; i++) {
    res[i] = sum;
    sum -= code[(lo + i) % n];        // old left edge leaves
    sum += code[(hi + i + 1) % n];    // new right edge enters
  }
  return res;
}`,
  inputs: [
    { kind: "numbers", name: "code", label: "code", default: [5, 7, 1, 4, 6, 3], maxLen: 12 },
    { kind: "number", name: "k", label: "k", default: 3, min: -11, max: 11 },
  ],
  entry: (a) => `decrypt([${(a.code as number[]).join(",")}], ${a.k})`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const code = (args.code as number[]).map((v) => Math.trunc(v))
    const n = code.length
    const k = Math.max(-(n - 1), Math.min(n - 1, Math.trunc(args.k as number)))
    const go = fn(
      "decrypt",
      (): string => {
        const res: number[] = new Array(n).fill(0)
        heap("res", res)
        if (k === 0) {
          line(3, `k = 0 → every cell is replaced by <b>0</b>.`)
          return `[${res.join(",")}]`
        }
        const lo = k > 0 ? 1 : n + k
        const hi = k > 0 ? k : n - 1
        line(5, `k = ${k} → for each i, sum the ${k > 0 ? "NEXT " + k : "PREVIOUS " + -k} cells: offsets [${lo}..${hi}] (mod ${n}).`)
        let sum = 0
        for (let j = lo; j <= hi; j++) {
          sum += code[j % n]
          mark("focus", [j % n])
          line(7, `Seed the window for i = 0: += code[${j % n}] = ${code[j % n]} → sum = <b>${sum}</b>.`)
        }
        for (let i = 0; i < n; i++) {
          ptr("i", i)
          mark("focus", [i])
          mark("window", Array.from({ length: hi - lo + 1 }, (_, x) => (lo + i + x) % n))
          res[i] = sum
          heap("res", res)
          line(9, `res[${i}] = window sum = <b>${sum}</b> (cells ${Array.from({ length: hi - lo + 1 }, (_, x) => (lo + i + x) % n).join(", ")}).`)
          sum -= code[(lo + i) % n]
          line(10, `Rotate the window: code[${(lo + i) % n}] = ${code[(lo + i) % n]} leaves → sum = ${sum}.`)
          sum += code[(hi + i + 1) % n]
          line(11, `code[${(hi + i + 1) % n}] = ${code[(hi + i + 1) % n]} enters → sum = <b>${sum}</b>.`)
          vars({ i, sum, res: `[${res.join(",")}]` })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", Array.from({ length: n }, (_, x) => x))
        line(13, `Decrypted code: <b>[${res.join(", ")}]</b> — a circular window rotated n times, O(1) per step.`)
        return `[${res.join(",")}]`
      },
      1,
    )
    return go()
  },
}
