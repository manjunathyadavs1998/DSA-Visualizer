import type { SolutionDef } from "@/engine/types"

/** Clamp every value into 1..n-1 so the i -> nums[i] walk always stays
 *  in bounds and a duplicate is guaranteed (in-range values pass through unchanged). */
const clampValues = (arr: number[]): number[] => {
  const n = arr.length
  if (n < 2) return [...arr]
  return arr.map((v) => ((((Math.abs(v) - 1) % (n - 1)) + (n - 1)) % (n - 1)) + 1)
}

export const findTheDuplicateNumber: SolutionDef = {
  view: "array",
  array: (a) => clampValues(a.nums as number[]),
  code: `// read i -> nums[i] as a linked list; duplicate = cycle entrance
function findDuplicate(nums) {
  let slow = nums[0], fast = nums[0];
  do {
    slow = nums[slow];           // tortoise: one hop
    fast = nums[nums[fast]];     // hare: two hops
  } while (slow !== fast);
  slow = nums[0];                // phase 2: restart the tortoise
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;                   // they meet at the cycle entrance
}`,
  codeJava: `// read i -> nums[i] as a linked list; duplicate = cycle entrance
int findDuplicate(int[] nums) {
  int slow = nums[0], fast = nums[0];
  do {
    slow = nums[slow];           // tortoise: one hop
    fast = nums[nums[fast]];     // hare: two hops
  } while (slow != fast);
  slow = nums[0];                // phase 2: restart the tortoise
  while (slow != fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;                   // they meet at the cycle entrance
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (values 1..n-1)", default: [1, 3, 4, 2, 2], maxLen: 8 }],
  entry: () => `findDuplicate(nums)`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const nums = clampValues(args.nums as number[])
    const go = fn(
      "findDuplicate",
      (): number => {
        if (nums.length < 2) {
          line(2, `Fewer than two values — no duplicate can exist.`)
          return -1
        }
        let slow = nums[0], fast = nums[0]
        ptr("slow", slow)
        ptr("fast", fast)
        vars({ slow, fast })
        line(2, `Pretend each index is a linked-list node whose "next" is its VALUE: index i → index nums[i]. Because two indices hold the same value, two nodes point at the same node — a <b>cycle</b>. Both runners start at index nums[0] = ${nums[0]}.`)
        do {
          slow = nums[slow]
          fast = nums[nums[fast]]
          ptr("slow", slow)
          ptr("fast", fast)
          vars({ slow, fast })
          line(5, `slow hops once → index ${slow}; fast hops twice → index ${fast}.${slow === fast ? " <b>They meet — the cycle is confirmed!</b>" : ""}`)
        } while (slow !== fast)
        slow = nums[0]
        ptr("slow", slow)
        vars({ slow, fast })
        line(7, `Phase 2: send slow back to the start (index ${nums[0]}). Floyd's theorem: moving BOTH one hop at a time, they meet exactly at the <b>cycle entrance</b> — which is the duplicated value.`)
        while (slow !== fast) {
          slow = nums[slow]
          fast = nums[fast]
          ptr("slow", slow)
          ptr("fast", fast)
          vars({ slow, fast })
          line(9, `Both hop once: slow → index ${slow}, fast → index ${fast}.`)
        }
        const holders = nums.map((v, idx) => (v === slow ? idx : -1)).filter((idx) => idx >= 0)
        mark("good", holders)
        line(12, `They meet at index <b>${slow}</b> — so ${slow} is the duplicate: ${holders.length} different indices (${holders.join(" and ")}) hold the value ${slow} and point to the same "node".`)
        return slow
      },
      1,
    )
    narrate("Floyd's cycle detection on the hidden linked list i → nums[i]: the duplicate value is where the cycle begins.")
    return go()
  },
}
