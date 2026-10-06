import type { SolutionDef } from "@/engine/types"

export const sumOfSubarrayMinimums: SolutionDef = {
  view: "array",
  array: (a) => a.arr as number[],
  code: `// arr is editable below; MOD = 1e9+7
function sumSubarrayMins(arr) {
  const n = arr.length, MOD = 1e9 + 7;
  // left[i] = distance to previous smaller (or left boundary)
  // right[i] = distance to next smaller-or-equal (or right boundary)
  const left = new Array(n), right = new Array(n);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && arr[stack.at(-1)] >= arr[i]) stack.pop();
    left[i] = stack.length ? i - stack.at(-1) : i + 1;
    stack.push(i);
  }
  stack.length = 0;
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length && arr[stack.at(-1)] > arr[i]) stack.pop();
    right[i] = stack.length ? stack.at(-1) - i : n - i;
    stack.push(i);
  }
  let ans = 0;
  for (let i = 0; i < n; i++)
    ans = (ans + arr[i] * left[i] * right[i]) % MOD;
  return ans;
}`,
  codeJava: `int sumSubarrayMins(int[] arr) {
  int n = arr.length; long MOD = 1_000_000_007L;
  int[] left = new int[n], right = new int[n];
  Deque<Integer> stack = new ArrayDeque<>();
  for (int i = 0; i < n; i++) {
    while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) stack.pop();
    left[i] = stack.isEmpty() ? i + 1 : i - stack.peek();
    stack.push(i);
  }
  stack.clear();
  for (int i = n - 1; i >= 0; i--) {
    while (!stack.isEmpty() && arr[stack.peek()] > arr[i]) stack.pop();
    right[i] = stack.isEmpty() ? n - i : stack.peek() - i;
    stack.push(i);
  }
  long ans = 0;
  for (int i = 0; i < n; i++)
    ans = (ans + (long)arr[i] * left[i] * right[i]) % MOD;
  return (int)ans;
}`,
  inputs: [{ kind: "numbers", name: "arr", label: "arr", default: [3, 1, 2, 4], maxLen: 8 }],
  entry: (a) => `sumSubarrayMins([${(a.arr as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const arr = args.arr as number[]
    const n = arr.length
    const MOD = 1e9 + 7
    const go = fn("sumSubarrayMins", (): number => {
      const left = new Array(n), right = new Array(n)
      const stack: number[] = []
      line(3, `For each index i, count subarrays where arr[i] is the minimum. left[i] = subarrays ending at i with arr[i] as min; right[i] = subarrays starting at i.`)
      for (let i = 0; i < n; i++) {
        ptr("i", i)
        mark("focus", [i])
        while (stack.length > 0 && arr[stack[stack.length - 1]] >= arr[i]) stack.pop()
        left[i] = stack.length > 0 ? i - stack[stack.length - 1] : i + 1
        stack.push(i)
        vars({ i, "left[i]": left[i] })
        heap("left", [...left.slice(0, i + 1)])
        line(9, `left[${i}]=${left[i]}: arr[${i}]=${arr[i]} is min in ${left[i]} subarray${left[i] > 1 ? "s" : ""} ending here.`)
      }
      stack.length = 0
      for (let i = n - 1; i >= 0; i--) {
        ptr("i", i)
        mark("focus", [i])
        while (stack.length > 0 && arr[stack[stack.length - 1]] > arr[i]) stack.pop()
        right[i] = stack.length > 0 ? stack[stack.length - 1] - i : n - i
        stack.push(i)
        vars({ i, "right[i]": right[i] })
        heap("right", [...right.slice(i)])
        line(14, `right[${i}]=${right[i]}: arr[${i}]=${arr[i]} is min in ${right[i]} subarray${right[i] > 1 ? "s" : ""} starting here.`)
      }
      let ans = 0
      for (let i = 0; i < n; i++) {
        const contrib = arr[i] * left[i] * right[i]
        ans = (ans + contrib) % MOD
        mark("good", [i])
        vars({ i, contrib, ans })
        line(19, `arr[${i}]=${arr[i]} × left=${left[i]} × right=${right[i]} = ${contrib}. Running sum: <b>${ans}</b>.`)
      }
      mark("focus", [])
      line(20, `Total sum of subarray minimums: <b>${ans}</b>.`)
      return ans
    }, 1)
    return go()
  },
}
