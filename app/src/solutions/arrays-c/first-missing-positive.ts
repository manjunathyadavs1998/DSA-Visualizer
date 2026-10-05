import type { SolutionDef } from "@/engine/types"

export const firstMissingPositive: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// smallest positive integer missing from nums
function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n
        && nums[nums[i] - 1] !== nums[i]) {
      const j = nums[i] - 1;   // home slot for value nums[i]
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
  }
  for (let i = 0; i < n; i++)
    if (nums[i] !== i + 1) return i + 1;
  return n + 1;                // 1..n all present
}`,
  codeJava: `// smallest positive integer missing from nums
int firstMissingPositive(int[] nums) {
  int n = nums.length;
  for (int i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n
        && nums[nums[i] - 1] != nums[i]) {
      int j = nums[i] - 1;     // home slot for value nums[i]
      int t = nums[i]; nums[i] = nums[j]; nums[j] = t;
    }
  }
  for (int i = 0; i < n; i++)
    if (nums[i] != i + 1) return i + 1;
  return n + 1;                // 1..n all present
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [3, 4, -1, 1, 7, 2], maxLen: 10 }],
  entry: (a) => `firstMissingPositive([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, aset, vars, narrate }, args) {
    const nums = [...(args.nums as number[])] // work on a copy — we swap in place
    const go = fn(
      "firstMissingPositive",
      (): number => {
        const n = nums.length
        line(2, `n = ${n}. The answer must be in <b>1..${n + 1}</b> — so park each value v ∈ 1..${n} at its home index <b>v−1</b> (cyclic sort).`)
        for (let i = 0; i < n; i++) {
          ptr("i", i)
          mark("focus", [i])
          while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
            const v = nums[i]
            line(4, `nums[${i}] = <b>${v}</b> is in range 1..${n} and slot ${v - 1} doesn't hold a ${v} yet — move it home.`)
            const j = v - 1
            ptr("j", j)
            vars({ i, j, moving: v })
            line(6, `Home slot for value ${v} is index <b>j = ${j}</b>.`)
            ;[nums[i], nums[j]] = [nums[j], nums[i]]
            aset(i, nums[i])
            aset(j, nums[j])
            mark("done", [j])
            line(7, `Swap: <b>${v}</b> settles at index ${j}; index ${i} now holds <b>${nums[i]}</b>.`)
          }
          const why =
            nums[i] >= 1 && nums[i] <= n
              ? `a copy of ${nums[i]} already sits at its home ${nums[i] - 1}`
              : `${nums[i]} is outside 1..${n} — useless`
          ptr("j", -1)
          line(4, `nums[${i}] = ${nums[i]}: stop swapping (${why}). Move on.`)
        }
        mark("focus", [])
        line(10, `Second pass: the first index whose value ≠ index+1 reveals the gap.`)
        for (let i = 0; i < n; i++) {
          ptr("i", i)
          mark("focus", [i])
          if (nums[i] !== i + 1) {
            mark("bad", [i])
            line(11, `nums[${i}] = ${nums[i]} ≠ ${i + 1} → <b>${i + 1}</b> is missing.`)
            return i + 1
          }
          line(11, `nums[${i}] = ${i + 1} ✓ — value ${i + 1} is present.`)
        }
        ptr("i", -1)
        mark("focus", [])
        line(12, `All of 1..${n} are present → the answer is <b>${n + 1}</b>.`)
        return n + 1
      },
      1,
    )
    narrate("Each swap places one value in its final home forever, so despite the nested loop the total work is O(n) — with O(1) extra space.")
    return go()
  },
}
