import type { SolutionDef } from "@/engine/types"

export const countSubarraysXorK: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// nums and k are editable below
function countXor(nums, k) {
  let xr = 0, count = 0;
  memo[0] = 1;              // empty prefix has xor 0
  for (let i = 0; i < nums.length; i++) {
    xr ^= nums[i];
    const need = xr ^ k;    // prefix that closes a k-xor subarray
    count += memo[need] || 0;
    memo[xr] = (memo[xr] || 0) + 1;
  }
  return count;
}`,
  codeJava: `// int[] nums and int k editable below
int countXor(int[] nums, int k) {
  int xr = 0, count = 0;
  memo.put(0, 1);           // empty prefix has xor 0
  for (int i = 0; i < nums.length; i++) {
    xr ^= nums[i];
    int need = xr ^ k;      // prefix that closes a k-xor subarray
    count += memo.getOrDefault(need, 0);
    memo.put(xr, memo.getOrDefault(xr, 0) + 1);
  }
  return count;
}`,
  inputs: [
    { kind: "numbers", name: "nums", label: "nums", default: [4, 2, 2, 6, 4], maxLen: 10 },
    { kind: "number", name: "k", label: "k", default: 6, min: 0, max: 31 },
  ],
  entry: (a) => `countXor(nums, ${a.k})`,
  run({ fn, memo, line, ptr, vars, narrate }, args) {
    const nums = args.nums as number[]
    const k = args.k as number
    const go = fn(
      "countXor",
      (): number => {
        let xr = 0, count = 0
        memo["0"] = 1
        vars({ xr, count })
        line(3, `Seed the memo: the <b>empty prefix</b> has XOR 0, seen once.`)
        for (let i = 0; i < nums.length; i++) {
          ptr("i", i)
          xr ^= nums[i]
          vars({ i, xr, count })
          line(5, `Fold in nums[${i}] = ${nums[i]} → prefix XOR xr = <b>${xr}</b>.`)
          const need = xr ^ k
          line(6, `If some earlier prefix had XOR <b>xr ^ k = ${xr} ^ ${k} = ${need}</b>, the part after it XORs to exactly ${k}.`)
          const seen = (memo[String(need)] as number | undefined) ?? 0
          count += seen
          vars({ i, xr, count })
          line(7, `${seen} earlier prefix${seen === 1 ? "" : "es"} had XOR ${need} → ${seen === 0 ? "nothing to add" : `<b>+${seen}</b> subarray${seen === 1 ? "" : "s"} ending at ${i}`}. count = ${count}.`)
          memo[String(xr)] = ((memo[String(xr)] as number | undefined) ?? 0) + 1
          line(8, `Record this prefix: XOR ${xr} has now been seen ${memo[String(xr)] as number} time${(memo[String(xr)] as number) === 1 ? "" : "s"}.`)
        }
        line(10, `Total subarrays with XOR ${k}: <b>${count}</b>.`)
        return count
      },
      1,
    )
    narrate("XOR is its own inverse: prefix ^ earlierPrefix = subarray XOR. So counting subarrays with XOR k = counting earlier prefixes equal to xr ^ k.")
    return go()
  },
}
