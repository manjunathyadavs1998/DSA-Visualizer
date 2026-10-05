import type { SolutionDef } from "@/engine/types"

const sanitize = (raw: number[]): number[] => {
  const pos = raw.filter((x) => x > 0)
  const neg = raw.filter((x) => x < 0)
  const m = Math.min(pos.length, neg.length)
  if (m === 0) return [3, 1, -2, -5, 2, -4]
  // LC guarantees equal counts of positives and negatives — enforce it
  const out: number[] = []
  let p = 0, n = 0
  for (const x of raw) {
    if (x > 0 && p < m) { out.push(x); p++ }
    else if (x < 0 && n < m) { out.push(x); n++ }
  }
  return out
}

export const rearrangeArrayElementsBySign: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.nums as number[]),
  code: `// alternate +/−, keeping each sign's relative order
function rearrangeArray(nums) {
  const res = new Array(nums.length);
  let pos = 0, neg = 1;        // evens get +, odds get −
  for (const x of nums) {
    if (x > 0) {
      res[pos] = x; pos += 2;  // next positive slot
    } else {
      res[neg] = x; neg += 2;  // next negative slot
    }
  }
  return res;
}`,
  codeJava: `// alternate +/−, keeping each sign's relative order
int[] rearrangeArray(int[] nums) {
  int[] res = new int[nums.length];
  int pos = 0, neg = 1;        // evens get +, odds get −
  for (int x : nums) {
    if (x > 0) {
      res[pos] = x; pos += 2;  // next positive slot
    } else {
      res[neg] = x; neg += 2;  // next negative slot
    }
  }
  return res;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (equal +/− counts)", default: [3, 1, -2, -5, 2, -4], maxLen: 12 }],
  entry: (a) => `rearrangeArray([${sanitize(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = sanitize(args.nums as number[])
    const go = fn(
      "rearrangeArray",
      (): number[] => {
        const res: (number | string)[] = new Array(nums.length).fill("·")
        let pos = 0
        let neg = 1
        heap("output", [...res])
        line(3, `Two write cursors into the result: <b>pos = 0</b> (even slots) and <b>neg = 1</b> (odd slots).`)
        for (let i = 0; i < nums.length; i++) {
          const x = nums[i]
          ptr("i", i)
          mark("focus", [i])
          line(5, `nums[${i}] = <b>${x}</b> — ${x > 0 ? "positive" : "negative"}.`)
          if (x > 0) {
            res[pos] = x
            heap("output", [...res])
            vars({ i, pos, neg })
            line(6, `Place <b>${x}</b> at even slot res[${pos}]; pos jumps to ${pos + 2}.`)
            pos += 2
          } else {
            res[neg] = x
            heap("output", [...res])
            vars({ i, pos, neg })
            line(8, `Place <b>${x}</b> at odd slot res[${neg}]; neg jumps to ${neg + 2}.`)
            neg += 2
          }
        }
        ptr("i", -1)
        mark("focus", [])
        mark("good", Array.from({ length: nums.length }, (_, k) => k))
        line(11, `Signs alternate and each sign kept its original order: <b>[${res.join(",")}]</b>.`)
        return res as number[]
      },
      1,
    )
    narrate("Equal counts of + and − means positives own the even slots and negatives the odd ones — one pass, two independent cursors.")
    const res = go()
    return `[${res.join(",")}]`
  },
}
