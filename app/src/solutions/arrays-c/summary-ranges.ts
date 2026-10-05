import type { SolutionDef } from "@/engine/types"

const sanitize = (raw: number[]): number[] => {
  const uniq = [...new Set(raw.map(Math.trunc))].sort((a, b) => a - b)
  return uniq.length ? uniq : [0, 1, 2, 4, 5, 7]
}

export const summaryRanges: SolutionDef = {
  view: "array",
  array: (a) => sanitize(a.nums as number[]),
  code: `// collapse sorted unique nums into "a->b" ranges
function summaryRanges(nums) {
  const res = [];
  let i = 0;
  while (i < nums.length) {
    const start = i;
    while (i + 1 < nums.length && nums[i + 1] === nums[i] + 1)
      i++;                     // consecutive — extend the run
    if (start === i) res.push(\`\${nums[i]}\`);
    else res.push(\`\${nums[start]}->\${nums[i]}\`);
    i++;                       // next range starts after the break
  }
  return res;
}`,
  codeJava: `// collapse sorted unique nums into "a->b" ranges
List<String> summaryRanges(int[] nums) {
  List<String> res = new ArrayList<>();
  int i = 0;
  while (i < nums.length) {
    int start = i;
    while (i + 1 < nums.length && nums[i + 1] == nums[i] + 1)
      i++;                     // consecutive — extend the run
    if (start == i) res.add("" + nums[i]);
    else res.add(nums[start] + "->" + nums[i]);
    i++;                       // next range starts after the break
  }
  return res;
}`,
  inputs: [{ kind: "numbers", name: "nums", label: "nums (sorted, unique)", default: [0, 1, 2, 4, 5, 7], maxLen: 12 }],
  entry: (a) => `summaryRanges([${sanitize(a.nums as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const nums = sanitize(args.nums as number[])
    const go = fn(
      "summaryRanges",
      (): string[] => {
        const res: string[] = []
        heap("output", [...res])
        let i = 0
        line(3, `Walk left to right; each iteration of the outer loop swallows <b>one whole run</b> of consecutive values.`)
        while (i < nums.length) {
          const start = i
          ptr("start", start)
          ptr("i", i)
          mark("focus", [i])
          line(5, `New range begins at index ${start} with value <b>${nums[start]}</b>.`)
          while (i + 1 < nums.length && nums[i + 1] === nums[i] + 1) {
            i++
            ptr("i", i)
            mark("window", Array.from({ length: i - start + 1 }, (_, k) => start + k))
            line(7, `nums[${i}] = ${nums[i]} = ${nums[i - 1]} + 1 — consecutive, run grows to <b>${nums[start]}..${nums[i]}</b>.`)
          }
          const next = i + 1 < nums.length ? `nums[${i + 1}] = ${nums[i + 1]} breaks the chain` : "end of array"
          line(6, `Run stops at index ${i} (${next}).`)
          if (start === i) {
            res.push(`${nums[i]}`)
            heap("output", [...res])
            vars({ i, range: `${nums[i]}` })
            line(8, `Single element → emit <b>"${nums[i]}"</b>.`)
          } else {
            res.push(`${nums[start]}->${nums[i]}`)
            heap("output", [...res])
            vars({ start, i, range: `${nums[start]}->${nums[i]}` })
            line(9, `Run of ${i - start + 1} → emit <b>"${nums[start]}->${nums[i]}"</b>.`)
          }
          mark("done", Array.from({ length: i - start + 1 }, (_, k) => start + k))
          mark("window", [])
          i++
          line(10, `Jump to index ${i} — the start of the next range.`)
        }
        ptr("i", -1)
        ptr("start", -1)
        mark("focus", [])
        line(12, `All runs emitted: <b>[${res.map((r) => `"${r}"`).join(", ")}]</b>.`)
        return res
      },
      1,
    )
    narrate("Two pointers over one array: 'start' anchors the run, 'i' races ahead while values stay consecutive.")
    const res = go()
    return `[${res.map((r) => `"${r}"`).join(",")}]`
  },
}
