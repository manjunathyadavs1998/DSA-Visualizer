import type { SolutionDef, Args } from "@/engine/types"

// values must live in [1..n] (n = length-1) so i → nums[i] always stays in bounds
const prep = (args: Args): number[] => {
  let nums = [...(args.nums as number[])].map(Math.trunc)
  if (nums.length < 2) nums = [1, 3, 4, 2, 2]
  const n = nums.length - 1
  return nums.map((v) => Math.min(Math.max(1, v), n))
}

export const findTheDuplicateNumber: SolutionDef = {
  view: "array",
  array: (a) => prep(a),
  code: `// read nums as a linked list: i → nums[i]; a duplicate = two arrows
// into one node = a CYCLE. Find it with slow/fast pointers (Floyd).
function findDuplicate(nums) {
  let slow = nums[0], fast = nums[0];
  do {
    slow = nums[slow];            // one hop
    fast = nums[nums[fast]];      // two hops
  } while (slow !== fast);
  slow = nums[0];                 // phase 2: restart one pointer
  while (slow !== fast) {
    slow = nums[slow];            // now BOTH move one hop
    fast = nums[fast];
  }
  return slow;                    // they meet at the cycle entrance
}`,
  codeJava: `// read nums as a linked list: i → nums[i]; a duplicate = two arrows
// into one node = a CYCLE. Find it with slow/fast pointers (Floyd).
int findDuplicate(int[] nums) {
  int slow = nums[0], fast = nums[0];
  do {
    slow = nums[slow];            // one hop
    fast = nums[nums[fast]];      // two hops
  } while (slow != fast);
  slow = nums[0];                 // phase 2: restart one pointer
  while (slow != fast) {
    slow = nums[slow];            // now BOTH move one hop
    fast = nums[fast];
  }
  return slow;                    // they meet at the cycle entrance
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums (n+1 values in 1..n)", default: [2, 5, 1, 1, 4, 3, 6], maxLen: 12 },
  ],
  entry: (a) => `findDuplicate([${prep(a).join(",")}])`,
  run({ fn, line, ptr, mark, vars }, args) {
    const nums = prep(args)
    const go = fn(
      "findDuplicate",
      (): number => {
        let slow = nums[0]
        let fast = nums[0]
        ptr("slow", slow)
        ptr("fast", fast)
        line(3, `Both pointers start at nums[0] = <b>${nums[0]}</b>. Following i → nums[i] must loop forever (values never leave 1..${nums.length - 1}) — and only the duplicate value has two arrows into it.`)
        do {
          slow = nums[slow]
          ptr("slow", slow)
          line(5, `slow hops once → index <b>${slow}</b>.`)
          fast = nums[nums[fast]]
          ptr("fast", fast)
          line(6, `fast hops twice → index <b>${fast}</b>.`)
          mark("focus", slow === fast ? [slow] : [slow, fast])
          line(7, slow === fast
            ? `slow = fast = <b>${slow}</b> — they collided inside the cycle!`
            : `slow (${slow}) ≠ fast (${fast}) — keep chasing; fast gains one hop per round.`)
          vars({ slow, fast, phase: 1 })
        } while (slow !== fast)
        slow = nums[0]
        ptr("slow", slow)
        line(8, `Phase 2: send slow back to the start (<b>${slow}</b>). Math fact: start and meeting point are the <b>same distance</b> from the cycle entrance.`)
        while (slow !== fast) {
          slow = nums[slow]
          ptr("slow", slow)
          line(10, `slow → <b>${slow}</b>.`)
          fast = nums[fast]
          ptr("fast", fast)
          mark("focus", slow === fast ? [slow] : [slow, fast])
          line(11, `fast → <b>${fast}</b> (single hops now).${slow === fast ? " They meet!" : ""}`)
          vars({ slow, fast, phase: 2 })
        }
        mark("good", [slow])
        line(13, `Meeting point = cycle entrance = the value with two in-arrows → the duplicate is <b>${slow}</b>. O(n) time, O(1) space, array untouched.`)
        return slow
      },
      2,
    )
    return go()
  },
}
