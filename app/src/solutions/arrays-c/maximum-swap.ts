import type { SolutionDef } from "@/engine/types"

const digitsOf = (num: number): number[] => String(Math.max(1, Math.trunc(Math.abs(num)))).split("").map(Number)

export const maximumSwap: SolutionDef = {
  view: "array",
  array: (a) => digitsOf(a.num as number),
  code: `// swap two digits at most once → largest number
function maximumSwap(num) {
  const d = String(num).split("");
  const last = new Array(10).fill(-1);
  for (let i = 0; i < d.length; i++)
    last[d[i]] = i;              // digit → LAST position
  for (let i = 0; i < d.length; i++) {
    for (let big = 9; big > d[i]; big--) {
      if (last[big] > i) {       // bigger digit later on?
        [d[i], d[last[big]]] = [d[last[big]], d[i]];
        return Number(d.join(""));
      }
    }
  }
  return num;                    // already maximal
}`,
  codeJava: `// swap two digits at most once → largest number
int maximumSwap(int num) {
  char[] d = String.valueOf(num).toCharArray();
  int[] last = new int[10]; Arrays.fill(last, -1);
  for (int i = 0; i < d.length; i++)
    last[d[i] - '0'] = i;        // digit → LAST position
  for (int i = 0; i < d.length; i++) {
    for (int big = 9; big > d[i] - '0'; big--) {
      if (last[big] > i) {       // bigger digit later on?
        char t = d[i]; d[i] = d[last[big]]; d[last[big]] = t;
        return Integer.parseInt(new String(d));
      }
    }
  }
  return num;                    // already maximal
}`,
  inputs: [{ kind: "number", name: "num", label: "num", default: 2736, min: 1, max: 99999999 }],
  entry: (a) => `maximumSwap(${a.num})`,
  run({ fn, line, ptr, mark, aset, vars, heap, narrate }, args) {
    const d = digitsOf(args.num as number)
    const num = Number(d.join(""))
    const go = fn(
      "maximumSwap",
      (): number => {
        const last: number[] = new Array(10).fill(-1)
        line(3, `Record where each digit 0–9 appears <b>last</b> — the rightmost copy is the cheapest to give away.`)
        for (let i = 0; i < d.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          last[d[i]] = i
          const snapshot: Record<number, number> = {}
          last.forEach((idx, dig) => { if (idx >= 0) snapshot[dig] = idx })
          heap("map", snapshot)
          line(5, `last[${d[i]}] = <b>${i}</b>.`)
        }
        line(6, `Now scan left → right: the FIRST place we can plant a bigger digit wins the most.`)
        for (let i = 0; i < d.length; i++) {
          ptr("i", i)
          mark("focus", [i])
          vars({ i, digit: d[i] })
          line(6, `Position ${i} holds <b>${d[i]}</b> — hunt for the biggest digit > ${d[i]} that occurs later.`)
          for (let big = 9; big > d[i]; big--) {
            if (last[big] < 0) continue
            ptr("j", last[big])
            line(8, `Does <b>${big}</b> (last at index ${last[big]}) sit after index ${i}? (${last[big] > i ? "<b>yes — swap!</b>" : "no, it's before"})`)
            if (last[big] > i) {
              const j = last[big]
              ;[d[i], d[j]] = [d[j], d[i]]
              aset(i, d[i])
              aset(j, d[j])
              mark("good", [i, j])
              const ans = Number(d.join(""))
              vars({ i, j, ans })
              line(9, `Swap digits at ${i} and ${j} → <b>${ans}</b>.`)
              line(10, `A bigger digit in a more significant slot — no other single swap beats it. Return <b>${ans}</b>.`)
              return ans
            }
          }
          ptr("j", -1)
          mark("done", [i])
        }
        ptr("i", -1)
        mark("focus", [])
        mark("good", Array.from({ length: d.length }, (_, k) => k))
        line(14, `The digits are already non-increasing — no single swap can improve <b>${num}</b>.`)
        return num
      },
      1,
    )
    narrate("Greedy: fix the leftmost position where a strictly bigger digit exists later, and take that digit's RIGHTMOST copy so lower positions lose as little as possible.")
    return go()
  },
}
