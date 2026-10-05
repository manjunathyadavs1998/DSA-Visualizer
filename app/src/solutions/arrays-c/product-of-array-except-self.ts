import type { SolutionDef } from "@/engine/types"

export const productOfArrayExceptSelf: SolutionDef = {
  view: "array",
  array: (a) => a.nums as number[],
  code: `// out[i] = product of everything except nums[i]
function productExceptSelf(nums) {
  const n = nums.length, out = new Array(n);
  let run = 1;
  for (let i = 0; i < n; i++) {      // prefix pass →
    out[i] = run;                    // product of nums[0..i-1]
    run *= nums[i];
  }
  run = 1;
  for (let i = n - 1; i >= 0; i--) { // suffix pass ←
    out[i] *= run;                   // × product of nums[i+1..]
    run *= nums[i];
  }
  return out;
}`,
  codeJava: `// out[i] = product of everything except nums[i]
int[] productExceptSelf(int[] nums) {
  int n = nums.length; int[] out = new int[n];
  int run = 1;
  for (int i = 0; i < n; i++) {      // prefix pass →
    out[i] = run;                    // product of nums[0..i-1]
    run *= nums[i];
  }
  run = 1;
  for (int i = n - 1; i >= 0; i--) { // suffix pass ←
    out[i] *= run;                   // × product of nums[i+1..]
    run *= nums[i];
  }
  return out;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums", default: [1, 2, 3, 4], maxLen: 8 }],
  entry: (a) => `productExceptSelf([${(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = args.nums as number[]
    const go = fn(
      "productExceptSelf",
      (): number[] => {
        const n = nums.length
        const out: number[] = new Array(n).fill(1)
        let run = 1
        heap("prefix", [...out])
        line(3, `Two sweeps, no division: first collect <b>prefix products</b>, then multiply in <b>suffix products</b>.`)
        for (let i = 0; i < n; i++) {
          ptr("i", i)
          mark("focus", [i])
          mark("window", Array.from({ length: i }, (_, k) => k))
          out[i] = run
          heap("prefix", [...out])
          line(5, `out[${i}] = product of nums[0..${i - 1}] = <b>${run}</b>.`)
          run *= nums[i]
          vars({ i, run })
          line(6, `Fold nums[${i}] = ${nums[i]} into the running prefix → run = <b>${run}</b>.`)
        }
        run = 1
        vars({ run })
        line(8, `Reset run = 1 and sweep <b>right → left</b> for the suffix products.`)
        for (let i = n - 1; i >= 0; i--) {
          ptr("i", i)
          mark("focus", [i])
          mark("window", Array.from({ length: n - 1 - i }, (_, k) => i + 1 + k))
          out[i] *= run
          heap("prefix", [...out])
          line(10, `out[${i}] = prefix × suffix = <b>${out[i]}</b> (suffix of nums[${i + 1}..] = ${run}).`)
          run *= nums[i]
          vars({ i, run })
          line(11, `Fold nums[${i}] = ${nums[i]} into the running suffix → run = <b>${run}</b>.`)
        }
        ptr("i", -1)
        mark("focus", [])
        mark("window", [])
        mark("good", Array.from({ length: n }, (_, k) => k))
        line(13, `Done: out = <b>[${out.join(",")}]</b> — each cell is (everything left) × (everything right).`)
        return out
      },
      1,
    )
    narrate("out[i] = (product of all to the left) × (product of all to the right) — build both with one running variable each.")
    const res = go()
    return `[${res.join(",")}]`
  },
}
