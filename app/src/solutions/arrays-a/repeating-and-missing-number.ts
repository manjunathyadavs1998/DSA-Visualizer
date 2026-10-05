import type { SolutionDef } from "@/engine/types"

export const repeatingAndMissingNumber: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums should hold 1..n, but one value repeats and one is missing
function findTwo(nums) {
  let repeat = -1;
  for (let i = 0; i < nums.length; i++) {
    if (memo[nums[i]] !== undefined) repeat = nums[i];  // seen before!
    memo[nums[i]] = 1;                                  // count it
  }
  let missing = -1;
  for (let v = 1; v <= nums.length; v++) {
    if (memo[v] === undefined) missing = v;             // never counted
  }
  return [repeat, missing];
}`,
  codeJava: `// nums should hold 1..n, but one value repeats and one is missing
int[] findTwo(int[] nums) {
  int repeat = -1;
  for (int i = 0; i < nums.length; i++) {
    if (memo.containsKey(nums[i])) repeat = nums[i];    // seen before!
    memo.put(nums[i], 1);                               // count it
  }
  int missing = -1;
  for (int v = 1; v <= nums.length; v++) {
    if (!memo.containsKey(v)) missing = v;              // never counted
  }
  return new int[]{repeat, missing};
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (1..n, one repeat, one missing)", default: [4, 3, 6, 2, 1, 1], maxLen: 8 }],
  entry: () => `findTwo(nums)`,
  run({ fn, memo, line, ptr, mark, vars, narrate }, args) {
    const nums = args.nums as number[]
    const n = nums.length
    let answer: number[] = []
    const go = fn(
      "findTwo",
      (): string => {
        let repeat = -1
        line(2, `Pass 1: count every value in a table keyed by the <b>value itself</b> — the table's keys should end up being exactly 1..${n}.`)
        const badIdx: number[] = []
        for (let i = 0; i < n; i++) {
          ptr("i", i)
          vars({ i, value: nums[i] })
          if (memo[String(nums[i])] !== undefined) {
            repeat = nums[i]
            badIdx.push(i)
            mark("bad", [...badIdx])
            line(4, `Key "${nums[i]}" is <b>already in the table</b> — writing it again exposes ${nums[i]} as the repeating number!`)
          } else {
            line(4, `Key "${nums[i]}" not in the table yet — first sighting.`)
          }
          memo[String(nums[i])] = 1
          line(5, `Record memo[${nums[i]}] = 1.`)
        }
        ptr("i", -1)
        let missing = -1
        line(7, `Pass 2: walk the EXPECTED keys 1..${n} — whichever slot was never written is the missing number.`)
        for (let v = 1; v <= n; v++) {
          vars({ v })
          if (memo[String(v)] === undefined) {
            missing = v
            line(9, `Key "${v}" was <b>never set</b> — ${v} is the missing number!`)
          } else {
            line(9, `Key "${v}" exists — ${v} is present.`)
          }
        }
        vars({ repeat, missing })
        line(11, `Answer: repeating = <b>${repeat}</b>, missing = <b>${missing}</b>.`)
        answer = [repeat, missing]
        return `[${repeat}, ${missing}]`
      },
      1,
    )
    narrate("A count table keyed by value: the key hit twice is the repeat; the key never hit is the missing one.")
    go()
    return JSON.stringify(answer)
  },
}
