import type { SolutionDef } from "@/engine/types"

export const sortColors: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums of 0/1/2 editable (Dutch National Flag)
function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0)      swap(nums, low++, mid++);
    else if (nums[mid] === 2) swap(nums, mid, high--);
    else                      mid++;
  }
  return nums;
}`,
  codeJava: `// int[] nums of 0/1/2 (Dutch National Flag)
void sortColors(int[] nums) {
  int low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] == 0)      swap(nums, low++, mid++);
    else if (nums[mid] == 2) swap(nums, mid, high--);
    else                     mid++;
  }
  return;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (0/1/2)", default: [2, 0, 2, 1, 1, 0, 1, 2, 0], maxLen: 12 }],
  entry: () => `sortColors(nums)`,
  run({ fn, line, ptr, mark, vars, aset }, args) {
    const nums = [...(args.nums as number[])].map((v) => (v >= 0 && v <= 2 ? v : Math.abs(v) % 3))
    const go = fn(
      "sortColors",
      (): string => {
        let low = 0, mid = 0, high = nums.length - 1
        const sync = () => { ptr("low", low); ptr("mid", mid); ptr("high", high); vars({ low, mid, high }) }
        sync()
        line(2, `Three pointers: 0s go left of <b>low</b>, 2s go right of <b>high</b>, <b>mid</b> scans.`)
        while (mid <= high) {
          mark("focus", [mid])
          if (nums[mid] === 0) {
            line(4, `nums[${mid}] = 0 → swap it back to position ${low}, grow the 0-zone.`)
            const t = nums[low]; nums[low] = nums[mid]; nums[mid] = t
            aset(low, nums[low]); aset(mid, nums[mid])
            mark("good", Array.from({ length: low + 1 }, (_, x) => x))
            low++; mid++
          } else if (nums[mid] === 2) {
            line(5, `nums[${mid}] = 2 → swap it out to position ${high}, grow the 2-zone. (mid stays — the swapped-in value is unchecked!)`)
            const t = nums[high]; nums[high] = nums[mid]; nums[mid] = t
            aset(high, nums[high]); aset(mid, nums[mid])
            mark("done", Array.from({ length: nums.length - high }, (_, x) => high + x))
            high--
          } else {
            line(6, `nums[${mid}] = 1 → already in the middle zone, just move on.`)
            mid++
          }
          sync()
        }
        mark("focus", []); mark("good", nums.map((_, i) => i))
        line(8, `mid passed high — the array is sorted in <b>one pass</b>, O(n) time, O(1) space.`)
        return nums.join(",")
      },
      1,
    )
    return go()
  },
}
