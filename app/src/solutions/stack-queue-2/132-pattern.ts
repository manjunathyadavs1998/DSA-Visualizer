import type { SolutionDef } from "@/engine/types"

export const pattern132: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// is there i < j < k with nums[i] < nums[k] < nums[j]?
function find132pattern(nums) {
  const stack = [];        // candidate "3"s, decreasing
  let third = -Infinity;   // the best "2" found so far
  for (let j = nums.length - 1; j >= 0; j--) {
    if (nums[j] < third) return true;   // nums[j] is a "1"!
    while (stack.length && stack.at(-1) < nums[j]) {
      third = stack.pop(); // popped value sits right of a bigger one
    }
    stack.push(nums[j]);   // nums[j] is a candidate "3"
  }
  return false;
}`,
  codeJava: `// is there i < j < k with nums[i] < nums[k] < nums[j]?
boolean find132pattern(int[] nums) {
  Deque<Integer> stack = new ArrayDeque<>(); // "3"s, decreasing
  long third = Long.MIN_VALUE; // the best "2" found so far
  for (int j = nums.length - 1; j >= 0; j--) {
    if (nums[j] < third) return true;   // nums[j] is a "1"!
    while (!stack.isEmpty() && stack.peek() < nums[j]) {
      third = stack.pop(); // popped sits right of a bigger one
    }
    stack.push(nums[j]);   // nums[j] is a candidate "3"
  }
  return false;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [3, 1, 4, 2, 5, 0], maxLen: 12 }],
  entry: (a) => `find132pattern([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "find132pattern",
      (): boolean => {
        const stack: number[] = []
        let third = -Infinity
        line(2, `Scan <b>right to left</b>. The stack holds candidate "<b>3</b>"s (the peak); <b>third</b> is the best "<b>2</b>" — a value known to have something bigger to its left-within-the-scanned-part.`)
        heap("stack", [])
        for (let j = nums.length - 1; j >= 0; j--) {
          ptr("j", j)
          mark("focus", [j])
          vars({ j, "nums[j]": nums[j], third: third === -Infinity ? "-∞" : third })
          if (nums[j] < third) {
            mark("good", [j])
            heap("output", true)
            line(5, `nums[${j}] = <b>${nums[j]}</b> < third = <b>${third}</b> → it is a valid "<b>1</b>": some bigger "3" and middle "2" = ${third} already exist to its right. <b>132 found!</b>`)
            return true
          }
          line(5, `nums[${j}] = ${nums[j]} ${third === -Infinity ? "— no \"2\" discovered yet" : `≥ third = ${third}`} → not a "1". Can it be a better "3"?`)
          while (stack.length > 0 && stack[stack.length - 1] < nums[j]) {
            third = stack.pop() as number
            heap("stack", [...stack])
            vars({ j, "nums[j]": nums[j], third })
            line(7, `Pop <b>${third}</b>: it is smaller than ${nums[j]} and sits to its <b>right</b> → a certified "2" (with ${nums[j]} as its "3"). third = <b>${third}</b> — we keep the <b>largest</b> such value to catch more "1"s.`)
          }
          stack.push(nums[j])
          heap("stack", [...stack])
          line(9, `Push ${nums[j]} as a candidate "3". Stack top-down: [${[...stack].reverse().join(", ")}] — the top is the <b>smallest</b>, and every entry is > third.`)
        }
        ptr("j", -1)
        mark("focus", [])
        heap("output", false)
        line(11, `Scanned everything, no element ever dipped below <b>third</b> → <b>no 132 pattern</b>. Each element pushed/popped once: O(n).`)
        return false
      },
      1,
    )
    return go()
  },
}
