import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)

export const grumpyBookstoreOwner: SolutionDef = {
  view: "array",
  array: (a) => a.customers as number[],
  code: `// base = satisfied anyway; window = best extra rescued by the secret
function maxSatisfied(customers, grumpy, minutes) {
  let base = 0;
  for (let i = 0; i < customers.length; i++)
    if (grumpy[i] === 0) base += customers[i];
  let extra = 0, bestExtra = 0;
  for (let right = 0; right < customers.length; right++) {
    if (grumpy[right] === 1) extra += customers[right];
    if (right >= minutes && grumpy[right - minutes] === 1)
      extra -= customers[right - minutes];      // leaves the window
    bestExtra = Math.max(bestExtra, extra);
  }
  return base + bestExtra;
}`,
  codeJava: `// base = satisfied anyway; window = best extra rescued by the secret
int maxSatisfied(int[] customers, int[] grumpy, int minutes) {
  int base = 0;
  for (int i = 0; i < customers.length; i++)
    if (grumpy[i] == 0) base += customers[i];
  int extra = 0, bestExtra = 0;
  for (int right = 0; right < customers.length; right++) {
    if (grumpy[right] == 1) extra += customers[right];
    if (right >= minutes && grumpy[right - minutes] == 1)
      extra -= customers[right - minutes];      // leaves the window
    bestExtra = Math.max(bestExtra, extra);
  }
  return base + bestExtra;
}`,
  inputs: [
    { kind: "numbers", name: "customers", label: "customers", default: [1, 0, 1, 2, 1, 1, 7, 5], maxLen: 10 },
    { kind: "numbers", name: "grumpy", label: "grumpy (0/1)", default: [0, 1, 0, 1, 0, 1, 0, 1], maxLen: 10 },
    { kind: "number", name: "minutes", label: "minutes", default: 3, min: 1, max: 10 },
  ],
  entry: (a) => `maxSatisfied([${(a.customers as number[]).join(",")}], [${(a.grumpy as number[]).join(",")}], ${a.minutes})`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const customers = (args.customers as number[]).map((v) => Math.max(0, Math.trunc(v)))
    const n = customers.length
    const grumpy = Array.from({ length: n }, (_, i) => ((args.grumpy as number[])[i] === 1 ? 1 : 0))
    const minutes = Math.min(Math.max(1, Math.trunc(args.minutes as number)), n)
    const go = fn(
      "maxSatisfied",
      (): number => {
        heap("grumpy", grumpy)
        const grumpyIdx = grumpy.flatMap((g, i) => (g === 1 ? [i] : []))
        mark("bad", grumpyIdx)
        let base = 0
        line(2, `Red cells are <b>grumpy minutes</b> — those customers are lost unless the secret window covers them.`)
        for (let i = 0; i < n; i++) {
          if (grumpy[i] === 0) {
            base += customers[i]
            mark("focus", [i])
            line(4, `Minute ${i} is calm → customers[${i}] = ${customers[i]} are happy anyway. base = <b>${base}</b>.`)
          }
        }
        mark("focus", [])
        let extra = 0
        let bestExtra = 0
        let bestEnd = minutes - 1
        line(5, `base = <b>${base}</b>. Now slide a ${minutes}-minute window to rescue the most grumpy-minute customers.`)
        for (let right = 0; right < n; right++) {
          ptr("right", right)
          mark("focus", [right])
          if (grumpy[right] === 1) {
            extra += customers[right]
            line(7, `Minute ${right} is grumpy → the secret rescues customers[${right}] = ${customers[right]}. extra = <b>${extra}</b>.`)
          } else {
            line(7, `Minute ${right} is calm — nothing to rescue here.`)
          }
          if (right >= minutes && grumpy[right - minutes] === 1) {
            extra -= customers[right - minutes]
            line(9, `Minute ${right - minutes} slid out of the window → lose its ${customers[right - minutes]} rescued customers. extra = <b>${extra}</b>.`)
          }
          const start = Math.max(0, right - minutes + 1)
          ptr("left", start)
          mark("window", win(start, right))
          if (extra > bestExtra) {
            bestExtra = extra
            bestEnd = right
            line(10, `Window [${start}..${right}] rescues <b>${extra}</b> — new best!`)
          } else {
            line(10, `Window rescues ${extra} — best stays ${bestExtra}.`)
          }
          vars({ right, extra, bestExtra, base })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", win(Math.max(0, bestEnd - minutes + 1), bestEnd))
        line(12, `Answer = base ${base} + bestExtra ${bestExtra} = <b>${base + bestExtra}</b>. The window only competes for grumpy minutes.`)
        return base + bestExtra
      },
      1,
    )
    return go()
  },
}
