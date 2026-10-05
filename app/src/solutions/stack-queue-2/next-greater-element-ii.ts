import type { SolutionDef } from "@/engine/types"

export const nextGreaterElementII: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// circular array → pretend it's doubled: scan 2n indices
function nextGreaterElements(nums) {
  const n = nums.length;
  const ans = new Array(n).fill(-1);
  const stack = [];   // indices with unknown answers
  for (let t = 0; t < 2 * n; t++) {
    const i = t % n;  // wrap around the circle
    while (stack.length && nums[stack.at(-1)] < nums[i]) {
      ans[stack.pop()] = nums[i];
    }
    if (t < n) stack.push(i);  // only the first lap pushes
  }
  return ans;
}`,
  codeJava: `// circular array → pretend it's doubled: scan 2n indices
int[] nextGreaterElements(int[] nums) {
  int n = nums.length;
  int[] ans = new int[n]; Arrays.fill(ans, -1);
  Deque<Integer> stack = new ArrayDeque<>(); // unknown answers
  for (int t = 0; t < 2 * n; t++) {
    int i = t % n;    // wrap around the circle
    while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
      ans[stack.pop()] = nums[i];
    }
    if (t < n) stack.push(i);  // only the first lap pushes
  }
  return ans;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (circular)", default: [2, 5, 4, 3, 1], maxLen: 10 }],
  entry: (a) => `nextGreaterElements([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "nextGreaterElements",
      (): string => {
        const n = nums.length
        const ans: number[] = new Array(n).fill(-1)
        const stack: number[] = []
        const resolved: number[] = []
        line(3, `Circular means index ${n - 1}'s "next" wraps to index 0. Trick: scan <b>two laps</b> (t = 0 … ${2 * n - 1}) with i = t mod n — same as doubling the array.`)
        heap("output", ans)
        heap("stack", [])
        for (let t = 0; t < 2 * n; t++) {
          const i = t % n
          ptr("i", i)
          mark("focus", [i])
          vars({ t, i, lap: t < n ? 1 : 2 })
          line(6, `t = ${t} → i = ${t} mod ${n} = <b>${i}</b> (${t < n ? "first lap" : "<b>second lap</b> — wrapped around"}), nums[i] = ${nums[i]}.`)
          while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
            const j = stack.pop() as number
            ans[j] = nums[i]
            resolved.push(j)
            mark("good", [...resolved])
            heap("stack", stack.map((k) => `${k}:${nums[k]}`))
            heap("output", ans)
            line(8, `Top index ${j} (value ${nums[j]}) < ${nums[i]} → <b>${nums[i]} is its next greater</b>${t >= n ? " — found only thanks to the wrap-around!" : ""}. ans[${j}] = ${nums[i]}.`)
          }
          if (t < n) {
            stack.push(i)
            heap("stack", stack.map((k) => `${k}:${nums[k]}`))
            line(10, `First lap → push index ${i} to wait. Stack values top-down: [${[...stack].reverse().map((k) => nums[k]).join(", ")}].`)
          } else {
            line(10, `Second lap → <b>don't push</b>: every index already had its chance; this lap only resolves the leftovers.`)
          }
        }
        ptr("i", -1)
        mark("focus", [])
        heap("output", ans)
        line(12, `${stack.length ? `Indices ${stack.join(", ")} are the maxima — nothing in the whole circle beats them → <b>-1</b>.` : "Everyone found an answer."} Result: [${ans.join(", ")}]. 2n iterations → O(n).`)
        return JSON.stringify(ans)
      },
      1,
    )
    return go()
  },
}
