import type { SolutionDef } from "@/engine/types"

export const binaryWatch: SolutionDef = {
  code: `// 10 LEDs: i<4 → hour bit 2^i, else minute bit 2^(i-4)
function backtrack(i, on, h, m) {
  if (h > 11 || m > 59) return;        // impossible time — prune
  if (on === k) {                      // exactly k LEDs lit
    output.push(h + ":" + pad(m));
    return;
  }
  if (10 - i < k - on) return;         // too few LEDs left — prune
  if (i < 4) backtrack(i + 1, on + 1, h + (1 << i), m);
  else       backtrack(i + 1, on + 1, h, m + (1 << (i - 4)));
  backtrack(i + 1, on, h, m);          // leave LED i off
}`,
  codeJava: `// 10 LEDs: i<4 → hour bit 2^i, else minute bit 2^(i-4)
void backtrack(int i, int on, int h, int m) {
  if (h > 11 || m > 59) return;        // impossible time — prune
  if (on == k) {                       // exactly k LEDs lit
    output.add(h + ":" + String.format("%02d", m));
    return;
  }
  if (10 - i < k - on) return;         // too few LEDs left — prune
  if (i < 4) backtrack(i + 1, on + 1, h + (1 << i), m);
  else       backtrack(i + 1, on + 1, h, m + (1 << (i - 4)));
  backtrack(i + 1, on, h, m);          // leave LED i off
}`,
  inputs: [{ kind: "number", name: "turnedOn", label: "turnedOn (lit LEDs)", default: 1, min: 0, max: 2 }],
  entry: (a) => `backtrack(0, 0, 0, 0)  // k = ${a.turnedOn}`,
  run({ fn, heap, line, vars, narrate }, args) {
    const k = Math.max(0, Math.min(2, args.turnedOn as number))
    const output: string[] = []
    const pad = (m: number) => String(m).padStart(2, "0")
    const backtrack = fn(
      "backtrack",
      (i: number, on: number, h: number, m: number): string => {
        vars({ i, on, h, m })
        if (h > 11 || m > 59) {
          line(2, `h = ${h}, m = ${m}: <b>${h > 11 ? `${h} hours is off the dial` : `${m} minutes is off the dial`}</b> — prune.`)
          return "✗ invalid"
        }
        line(2, `h = ${h} ≤ 11 and m = ${m} ≤ 59 — still a real time.`)
        line(3, `${on} of ${k} LEDs lit — exact? (${on === k ? "<b>yes</b>" : "no"})`)
        if (on === k) {
          line(4, `<b>Leaf!</b> Reading the watch: <b>${h}:${pad(m)}</b>.`)
          output.push(`${h}:${pad(m)}`)
          heap("output", output)
          return `${h}:${pad(m)}`
        }
        if (10 - i < k - on) {
          line(7, `Only ${10 - i} LED(s) remain but ${k - on} must still turn on — <b>unreachable, prune</b>.`)
          return "✗ short"
        }
        const bit = i < 4 ? 1 << i : 1 << (i - 4)
        line(i < 4 ? 8 : 9, `LED ${i} <b>ON</b>: ${i < 4 ? `hour bit ${bit} → h = ${h + bit}` : `minute bit ${bit} → m = ${m + bit}`}.`)
        if (i < 4) backtrack(i + 1, on + 1, h + bit, m)
        else backtrack(i + 1, on + 1, h, m + bit)
        line(10, `LED ${i} <b>OFF</b>: time stays ${h}:${pad(m)}.`)
        backtrack(i + 1, on, h, m)
        return "✓"
      },
      1,
    )
    narrate(`Classic choose-k-of-n backtracking on 10 LEDs: each level decides ON/OFF for one LED, with pruning for impossible times and unreachable counts.`)
    heap("output", output)
    backtrack(0, 0, 0, 0)
    return JSON.stringify(output)
  },
}
