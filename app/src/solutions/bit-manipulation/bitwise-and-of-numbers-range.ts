import type { SolutionDef } from "@/engine/types"

const W = 8
const clamp = (n: number): number => Math.max(0, Math.min(255, Math.trunc(n)))
const bits = (n: number): number[] => Array.from({ length: W }, (_, i) => (n >> (W - 1 - i)) & 1)
const bin = (x: number): string => (x >>> 0).toString(2).padStart(W, "0").slice(-W)

export const bitwiseAndOfNumbersRange: SolutionDef = {
  view: "array",
  array: (a) => {
    const l = Math.min(clamp(a.left as number), clamp(a.right as number))
    const r = Math.max(clamp(a.left as number), clamp(a.right as number))
    return [...bits(l), "∧", ...bits(r)]
  },
  code: `// AND of [left..right] = their common binary prefix
function rangeBitwiseAnd(left, right) {
  let shift = 0;
  while (left < right) { // tails differ → they AND to 0
    left = left >> 1;    // strip one low bit from both
    right = right >> 1;
    shift++;
  }
  return left << shift;  // shared prefix, zero-padded back
}`,
  codeJava: `// AND of [left..right] = their common binary prefix
int rangeBitwiseAnd(int left, int right) {
  int shift = 0;
  while (left < right) { // tails differ → they AND to 0
    left = left >> 1;    // strip one low bit from both
    right = right >> 1;
    shift++;
  }
  return left << shift;  // shared prefix, zero-padded back
}`,
  inputs: [
    { kind: "number", name: "left", label: "left (0–255)", default: 18, min: 0, max: 255 },
    { kind: "number", name: "right", label: "right (0–255)", default: 29, min: 0, max: 255 },
  ],
  entry: (a) => {
    const l = Math.min(clamp(a.left as number), clamp(a.right as number))
    const r = Math.max(clamp(a.left as number), clamp(a.right as number))
    return `rangeBitwiseAnd(${l}, ${r})`
  },
  run({ fn, line, mark, aset, vars, heap }, args) {
    const l0 = Math.min(clamp(args.left as number), clamp(args.right as number))
    const r0 = Math.max(clamp(args.left as number), clamp(args.right as number))
    const go = fn(
      "rangeBitwiseAnd",
      (left: number, right: number): number => {
        let shift = 0
        line(2, `left = ${bin(left)} (${left}), right = ${bin(right)} (${right}). Key insight: between left and right, <b>every low bit flips through 0 at some point</b> — only the shared high prefix survives an AND over the whole range.`)
        heap("left", `${left} = ${bin(left)}`)
        heap("right", `${right} = ${bin(right)}`)
        while (left < right) {
          mark("focus", [W - 1 - shift, W + 1 + (W - 1 - shift)])
          line(3, `left (${bin(left)}) < right (${bin(right)}) — they still differ somewhere, so the current lowest bit cannot be trusted: somewhere in the range it was 0.`)
          left = left >> 1
          line(4, `Strip it: left >>= 1 → <b>${bin(left)}</b>…`)
          for (let j = 0; j < W; j++) aset(j, (left >> (W - 1 - j)) & 1)
          heap("left", `${left} = ${bin(left)}`)
          right = right >> 1
          line(5, `…and right >>= 1 → <b>${bin(right)}</b>.`)
          for (let j = 0; j < W; j++) aset(W + 1 + j, (right >> (W - 1 - j)) & 1)
          heap("right", `${right} = ${bin(right)}`)
          shift++
          line(6, `shift = <b>${shift}</b> — remember how many bits we stripped.`)
          vars({ left, right, shift })
          mark("focus", [])
        }
        const ans = left << shift
        mark("good", Array.from({ length: W - shift }, (_, j) => j))
        line(8, `left == right == ${bin(left)} — that is the <b>common prefix</b>. Pad the ${shift} stripped bit(s) back with zeros: ${bin(left)} << ${shift} = <b>${bin(ans)}</b> (= ${ans}) = AND of all of [${l0}..${r0}].`)
        return ans
      },
      1,
    )
    return go(l0, r0)
  },
}
