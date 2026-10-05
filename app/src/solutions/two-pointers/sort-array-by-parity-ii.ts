import type { SolutionDef, Args } from "@/engine/types"

// the problem guarantees half evens / half odds — fall back if the input doesn't
const prep = (args: Args): number[] => {
  const nums = [...(args.nums as number[])].map((x) => Math.abs(Math.trunc(x)))
  const evens = nums.filter((x) => x % 2 === 0).length
  if (nums.length % 2 !== 0 || evens !== nums.length / 2) return [4, 2, 5, 7, 1, 8, 3, 6, 10, 9, 12, 11]
  return nums
}

export const sortArrayByParityIi: SolutionDef = {
  view: "array",
  array: (a) => prep(a),
  code: `// one pointer patrols EVEN slots, the other ODD slots
function sortArrayByParityII(nums) {
  let even = 0, odd = 1;
  const n = nums.length;
  while (even < n && odd < n) {
    if (nums[even] % 2 === 0)     { even += 2; }  // slot already correct
    else if (nums[odd] % 2 === 1) { odd += 2; }   // slot already correct
    else {
      [nums[even], nums[odd]] = [nums[odd], nums[even]];
      even += 2; odd += 2;        // one swap fixes both slots
    }
  }
  return nums;
}`,
  codeJava: `// one pointer patrols EVEN slots, the other ODD slots
int[] sortArrayByParityII(int[] nums) {
  int even = 0, odd = 1;
  int n = nums.length;
  while (even < n && odd < n) {
    if (nums[even] % 2 == 0)      { even += 2; }  // slot already correct
    else if (nums[odd] % 2 == 1)  { odd += 2; }   // slot already correct
    else {
      int t = nums[even]; nums[even] = nums[odd]; nums[odd] = t;
      even += 2; odd += 2;        // one swap fixes both slots
    }
  }
  return nums;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums (half even, half odd)", default: [4, 2, 5, 7, 1, 8, 3, 6, 10, 9, 12, 11], maxLen: 12 },
  ],
  entry: (a) => `sortArrayByParityII([${prep(a).join(",")}])`,
  run({ fn, line, ptr, mark, aset, vars }, args) {
    const nums = prep(args)
    const go = fn(
      "sortArrayByParityII",
      (): string => {
        let even = 0
        let odd = 1
        const n = nums.length
        ptr("even", even)
        ptr("odd", odd < n ? odd : -1)
        line(2, `Goal: nums[i] even at even i, odd at odd i. The <b>even</b> pointer hops 0→2→4…, the <b>odd</b> pointer 1→3→5…`)
        line(3, `Key insight: if an even slot is wrong AND an odd slot is wrong, they hold exactly each other's kind of number.`)
        while (even < n && odd < n) {
          mark("focus", [even, odd])
          if (nums[even] % 2 === 0) {
            mark("good", [even])
            line(5, `nums[${even}] = ${nums[even]} is even in an even slot ✓ — even pointer hops to ${even + 2}.`)
            even += 2
            ptr("even", even < n ? even : -1)
          } else if (nums[odd] % 2 === 1) {
            mark("good", [odd])
            line(6, `nums[${odd}] = ${nums[odd]} is odd in an odd slot ✓ — odd pointer hops to ${odd + 2}.`)
            odd += 2
            ptr("odd", odd < n ? odd : -1)
          } else {
            const t = nums[even]
            nums[even] = nums[odd]
            nums[odd] = t
            aset(even, nums[even])
            aset(odd, nums[odd])
            mark("good", [even, odd])
            line(8, `Both misplaced: odd ${t} in slot ${even}, even ${nums[even]} in slot ${odd} — <b>swap</b> fixes both at once.`)
            even += 2
            odd += 2
            ptr("even", even < n ? even : -1)
            ptr("odd", odd < n ? odd : -1)
            line(9, `even → ${even}, odd → ${odd}.`)
          }
          vars({ even, odd })
        }
        mark("focus", [])
        line(12, `Every slot's parity matches its index: [<b>${nums.join(", ")}</b>] — one pass, O(1) space.`)
        return `[${nums.join(",")}]`
      },
      1,
    )
    return go()
  },
}
