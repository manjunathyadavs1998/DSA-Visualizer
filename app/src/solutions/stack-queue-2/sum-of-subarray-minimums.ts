import type { SolutionDef } from "@/engine/types"

export const sumOfSubarrayMinimums: SolutionDef = {
  view: "array",
  array: (a) => a.arr as number[],
  code: `// each arr[m] is the min of (left spans × right spans) subarrays
function sumSubarrayMins(arr) {
  const stack = [];   // indices, values increasing bottom→top
  let total = 0;
  for (let i = 0; i <= arr.length; i++) {
    const cur = i < arr.length ? arr[i] : -Infinity; // sentinel
    while (stack.length && arr[stack.at(-1)] >= cur) {
      const m = stack.pop();      // m's reign ends at i
      const left = m - (stack.length ? stack.at(-1) : -1);
      const right = i - m;
      total += arr[m] * left * right;
    }
    stack.push(i);
  }
  return total % 1000000007;
}`,
  codeJava: `// each arr[m] is the min of (left spans × right spans) subarrays
int sumSubarrayMins(int[] arr) {
  Deque<Integer> stack = new ArrayDeque<>(); // incr. values
  long total = 0;
  for (int i = 0; i <= arr.length; i++) {
    int cur = i < arr.length ? arr[i] : Integer.MIN_VALUE;
    while (!stack.isEmpty() && arr[stack.peek()] >= cur) {
      int m = stack.pop();        // m's reign ends at i
      int left = m - (stack.isEmpty() ? -1 : stack.peek());
      int right = i - m;
      total += (long) arr[m] * left * right;
    }
    stack.push(i);
  }
  return (int)(total % 1000000007);
}`,
  inputs: [{ kind: "numbers", name: "arr", label: "arr", default: [3, 1, 2, 4], maxLen: 10 }],
  entry: (a) => `sumSubarrayMins([${(a.arr as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const arr = args.arr as number[]
    const go = fn(
      "sumSubarrayMins",
      (): number => {
        const stack: number[] = []
        let total = 0
        line(2, `Flip the question: instead of "what's the min of each subarray", ask <b>"for how many subarrays is arr[m] the minimum?"</b> — then total = Σ arr[m] × count(m).`)
        heap("stack", [])
        line(2, `The stack keeps indices with <b>increasing values</b>: an element is popped exactly when its "reign as minimum" is ended by something smaller.`)
        for (let i = 0; i <= arr.length; i++) {
          const cur = i < arr.length ? arr[i] : -Infinity
          if (i < arr.length) {
            ptr("i", i)
            mark("focus", [i])
            line(5, `i = ${i}: cur = <b>${cur}</b>. Pop everyone on the stack with value ≥ ${cur} — their reign ends here.`)
          } else {
            ptr("i", -1)
            mark("focus", [])
            line(5, `i = ${i} (past the end): cur = <b>−∞ sentinel</b> → flush everything left on the stack; their reign extends to the array's end.`)
          }
          while (stack.length > 0 && arr[stack[stack.length - 1]] >= cur) {
            const m = stack.pop() as number
            heap("stack", [...stack])
            const leftBound = stack.length ? stack[stack.length - 1] : -1
            const left = m - leftBound
            const right = i - m
            mark("window", Array.from({ length: i - leftBound - 1 }, (_, x) => leftBound + 1 + x))
            mark("good", [m])
            line(7, `Pop m = ${m} (value <b>${arr[m]}</b>). Previous smaller is at index ${leftBound}, next smaller-or-equal at ${i} — ${arr[m]} is the min of every subarray inside (${leftBound}, ${i}) that covers index ${m}.`)
            line(9, `left choices = ${m} − ${leftBound} = <b>${left}</b>, right choices = ${i} − ${m} = <b>${right}</b> → ${left} × ${right} = <b>${left * right}</b> subarrays have min ${arr[m]}.`)
            total += arr[m] * left * right
            vars({ i, m, contribution: `${arr[m]}×${left}×${right}=${arr[m] * left * right}`, total })
            heap("output", total)
            line(10, `total += ${arr[m]} × ${left} × ${right} = ${arr[m] * left * right} → total = <b>${total}</b>.`)
            mark("good", [])
            mark("window", [])
          }
          stack.push(i)
          heap("stack", stack.map((k) => (k < arr.length ? `${k}:${arr[k]}` : `${k}:sentinel`)))
          if (i < arr.length) line(12, `Push index ${i}. Stack values bottom→top: [${stack.filter((k) => k < arr.length).map((k) => arr[k]).join(", ")}] — <b>increasing</b>, as the invariant demands.`)
        }
        mark("focus", [])
        const ans = total % 1000000007
        heap("output", ans)
        line(14, `Every index pushed once, popped once → <b>O(n)</b> for a problem with O(n²) subarrays. Answer: <b>${ans}</b>.`)
        return ans
      },
      1,
    )
    return go()
  },
}
