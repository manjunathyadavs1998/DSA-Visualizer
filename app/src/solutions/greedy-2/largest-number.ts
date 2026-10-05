import type { SolutionDef } from "@/engine/types"

const sanitize = (nums: number[]): number[] => {
  const out = nums.map((v) => Math.max(0, Math.trunc(Math.abs(v))))
  return out.length ? out : [3, 30, 34, 5, 9]
}

export const largestNumber: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.nums as number[]),
  code: `// order rule: a goes before b iff concat ab > ba
function largestNumber(nums) {
  const s = nums.map(String);
  s.sort((a, b) => (b + a).localeCompare(a + b));
  if (s[0] === '0') return '0';   // all zeros collapse
  return s.join('');
}`,
  codeJava: `// order rule: a goes before b iff concat ab > ba
String largestNumber(int[] nums) {
  String[] s = toStrings(nums);
  Arrays.sort(s, (a, b) -> (b + a).compareTo(a + b));
  if (s[0].equals("0")) return "0";  // all zeros collapse
  return String.join("", s);
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums (non-negative integers)", default: [3, 30, 34, 5, 9], maxLen: 10 },
  ],
  entry: (a) => `largestNumber([${sanitize(a.nums as number[]).join(",")}])`,
  run({ fn, line, mark, vars, aset, heap, narrate }, args) {
    const nums = sanitize(args.nums as number[])
    const solve = fn(
      "largestNumber",
      (): string => {
        const s = nums.map(String)
        line(2, `Treat numbers as strings — "largest number" is about which <b>concatenation order</b> wins, not numeric size.`)
        line(3, `Sort with a custom rule: compare the two possible gluings <b>ab</b> vs <b>ba</b> and keep the bigger one first.`)
        s.sort((a, b) => {
          const ab = a + b
          const ba = b + a
          const winner = ba.localeCompare(ab) < 0 ? a : ba.localeCompare(ab) > 0 ? b : "tie"
          line(3, `Compare "${a}" vs "${b}": "${ab}" vs "${ba}" → ${winner === "tie" ? "equal, order irrelevant" : `"<b>${winner}</b>" goes first`}.`)
          return ba.localeCompare(ab)
        })
        heap("sorted", [...s])
        for (let i = 0; i < s.length; i++) aset(i, s[i])
        mark("good", s.map((_, k) => k))
        narrate(`Sorted order: [${s.join(", ")}]. This comparator is transitive, so one sort settles every pairwise fight.`)
        vars({ first: s[0] })
        line(4, `Edge case: if the biggest piece is "0", everything is zero → ${s[0] === "0" ? "<b>return \"0\"</b>" : "not the case here"}.`)
        if (s[0] === "0") return "0"
        const res = s.join("")
        line(5, `Glue them in sorted order → <b>${res}</b>.`)
        return res
      },
      1,
    )
    narrate(`Classic trap: "9" must beat "34" even though 9 < 34 — only the ab-vs-ba comparator captures that.`)
    return solve()
  },
}
