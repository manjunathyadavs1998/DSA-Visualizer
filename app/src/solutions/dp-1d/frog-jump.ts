import type { SolutionDef } from "@/engine/types"

export const frogJump: SolutionDef = {
  code: `// frog hops 1 or 2 stones; energy = |height difference|
function minEnergy(i) {
  if (i === 0) return 0;
  if (memo[i] !== undefined) return memo[i];
  const one = minEnergy(i - 1) + Math.abs(h[i] - h[i - 1]);
  let two = Infinity;
  if (i > 1) two = minEnergy(i - 2) + Math.abs(h[i] - h[i - 2]);
  memo[i] = Math.min(one, two);
  return memo[i];
}`,
  codeJava: `// int[] h; Integer[] memo; int INF = 1_000_000
int minEnergy(int i) {
  if (i == 0) return 0;
  if (memo[i] != null) return memo[i];
  int one = minEnergy(i - 1) + Math.abs(h[i] - h[i - 1]);
  int two = INF;
  if (i > 1) two = minEnergy(i - 2) + Math.abs(h[i] - h[i - 2]);
  memo[i] = Math.min(one, two);
  return memo[i];
}`,
  inputs: [{ kind: "numbers", name: "heights", label: "stone heights", default: [30, 10, 60, 10, 60, 50], maxLen: 10 }],
  entry: (a) => `minEnergy(${Math.max(0, (a.heights as number[]).length - 1)})`,
  run({ fn, memo, line, vars, heap, narrate }, args) {
    let h = (args.heights as number[]).map((x) => Math.max(0, Math.min(99, Math.trunc(x))))
    if (h.length < 2) h = [30, 10, 60, 10, 60, 50]
    const n = h.length
    heap("heights", h)
    const minEnergy = fn(
      "minEnergy",
      (i: number): number => {
        line(2, `minEnergy(${i}): back at stone 0, the start? (${i === 0 ? "<b>yes — 0 energy</b>" : "no"})`)
        if (i === 0) return 0
        line(3, `minEnergy(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        line(4, `minEnergy(${i}): hop from stone ${i - 1}: cost |${h[i]}−${h[i - 1]}| = <b>${Math.abs(h[i] - h[i - 1])}</b> on top of minEnergy(${i - 1}).`)
        const one = minEnergy(i - 1) + Math.abs(h[i] - h[i - 1])
        let two = Infinity
        line(6, i > 1 ? `minEnergy(${i}): or leap from stone ${i - 2}: cost |${h[i]}−${h[i - 2]}| = <b>${Math.abs(h[i] - h[i - 2])}</b> on top of minEnergy(${i - 2}).` : `minEnergy(${i}): no stone ${i - 2} — only the single hop exists.`)
        if (i > 1) two = minEnergy(i - 2) + Math.abs(h[i] - h[i - 2])
        vars({ i, one, two })
        line(7, `minEnergy(${i}) = min(hop ${one}, leap ${two === Infinity ? "∞" : two}) = <b>${Math.min(one, two)}</b> → memo[${i}].`)
        memo[i] = Math.min(one, two)
        return Math.min(one, two)
      },
      1,
    )
    narrate("Greedy (always the cheaper hop) fails — a pricey leap now can dodge a huge cliff later. The memo prices every stone once.")
    return minEnergy(n - 1)
  },
}
