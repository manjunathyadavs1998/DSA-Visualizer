import type { SolutionDef } from "@/engine/types"

export const majorityElementII: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// at most TWO values can exceed n/3 — track two candidates
function majorityII(nums) {
  let c1 = null, n1 = 0, c2 = null, n2 = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === c1) n1++;                  // vote for candidate 1
    else if (nums[i] === c2) n2++;             // vote for candidate 2
    else if (n1 === 0) { c1 = nums[i]; n1 = 1; }
    else if (n2 === 0) { c2 = nums[i]; n2 = 1; }
    else { n1--; n2--; }                       // cancels one of EACH
  }
  const res = [];
  for (const c of [c1, c2])                    // verify pass
    if (c !== null && countOf(nums, c) > nums.length / 3) res.push(c);
  return res;
}`,
  codeJava: `// at most TWO values can exceed n/3 — track two candidates
List<Integer> majorityII(int[] nums) {
  Integer c1 = null, c2 = null; int n1 = 0, n2 = 0;
  for (int i = 0; i < nums.length; i++) {
    if (Objects.equals(c1, nums[i])) n1++;     // vote for candidate 1
    else if (Objects.equals(c2, nums[i])) n2++;// vote for candidate 2
    else if (n1 == 0) { c1 = nums[i]; n1 = 1; }
    else if (n2 == 0) { c2 = nums[i]; n2 = 1; }
    else { n1--; n2--; }                       // cancels one of EACH
  }
  List<Integer> res = new ArrayList<>();
  for (Integer c : Arrays.asList(c1, c2))      // verify pass
    if (c != null && countOf(nums, c) > nums.length / 3) res.add(c);
  return res;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (majorities > n/3)", default: [1, 1, 2, 3, 2, 2, 1, 1], maxLen: 12 }],
  entry: () => `majorityII(nums)`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = args.nums as number[]
    let answer: number[] = []
    const go = fn(
      "majorityII",
      (): string => {
        let c1: number | null = null, n1 = 0, c2: number | null = null, n2 = 0
        line(2, `Two candidate seats — at most TWO values can each appear more than n/3 = ${(nums.length / 3).toFixed(2)} times (three such values would need more than n elements!).`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          const x = nums[i]
          if (x === c1) {
            n1++
            line(4, `nums[${i}] = ${x} matches c1 → n1 = <b>${n1}</b>.`)
          } else if (x === c2) {
            n2++
            line(5, `nums[${i}] = ${x} matches c2 → n2 = <b>${n2}</b>.`)
          } else if (n1 === 0) {
            c1 = x
            n1 = 1
            line(6, `Seat 1 is empty → seat <b>${x}</b> as c1 with one vote.`)
          } else if (n2 === 0) {
            c2 = x
            n2 = 1
            line(7, `Seat 2 is empty → seat <b>${x}</b> as c2 with one vote.`)
          } else {
            n1--
            n2--
            line(8, `nums[${i}] = ${x} matches neither and both seats are taken → it cancels one vote of EACH: n1 = ${n1}, n2 = ${n2}.`)
          }
          vars({ c1: c1 ?? "—", n1, c2: c2 ?? "—", n2 })
        }
        ptr("i", -1)
        line(11, `Candidates <b>${c1 ?? "—"}</b> and <b>${c2 ?? "—"}</b> merely SURVIVED — the counters were mangled by cancellations, so a real counting pass must verify each.`)
        const res: number[] = []
        const goodIdx: number[] = []
        for (const c of [c1, c2]) {
          if (c === null) continue
          const idxs = nums.map((v, k) => (v === c ? k : -1)).filter((k) => k >= 0)
          const cnt = idxs.length
          vars({ verifying: c, count: cnt })
          if (cnt > nums.length / 3) {
            res.push(c)
            goodIdx.push(...idxs)
            mark("good", [...goodIdx])
            line(12, `Verify ${c}: appears ${cnt} times > ${nums.length}/3 → <b>${c} is a majority</b>.`)
          } else {
            line(12, `Verify ${c}: appears ${cnt} times ≤ ${nums.length}/3 → ${c} does not qualify.`)
          }
        }
        answer = res
        line(13, `Answer: [${res.join(", ")}].`)
        return `[${res.join(", ")}]`
      },
      1,
    )
    narrate("Extended Boyer–Moore: two seats, and a mismatch cancels one vote from BOTH — then a verify pass confirms the survivors.")
    go()
    return JSON.stringify(answer)
  },
}
