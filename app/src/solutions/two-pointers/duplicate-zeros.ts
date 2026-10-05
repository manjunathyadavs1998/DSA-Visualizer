import type { SolutionDef } from "@/engine/types"

export const duplicateZeros: SolutionDef = {
  view: "array",
  array: (a) => a.arr as number[],
  code: `// count the zeros, then shift from the BACK into final slots
function duplicateZeros(arr) {
  let zeros = 0;
  for (const x of arr) if (x === 0) zeros++;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (i + zeros < arr.length) arr[i + zeros] = arr[i];
    if (arr[i] === 0) {
      zeros--;                 // its duplicate lands one slot earlier
      if (i + zeros < arr.length) arr[i + zeros] = arr[i];
    }
  }
  return arr;
}`,
  codeJava: `// count the zeros, then shift from the BACK into final slots
int[] duplicateZeros(int[] arr) {
  int zeros = 0;
  for (int x : arr) if (x == 0) zeros++;
  for (int i = arr.length - 1; i >= 0; i--) {
    if (i + zeros < arr.length) arr[i + zeros] = arr[i];
    if (arr[i] == 0) {
      zeros--;                 // its duplicate lands one slot earlier
      if (i + zeros < arr.length) arr[i + zeros] = arr[i];
    }
  }
  return arr;
}`,
  inputs: [{ kind: "numbers", name: "arr", label: "arr", default: [1, 0, 2, 3, 0, 4, 5, 0], maxLen: 12 }],
  entry: (a) => `duplicateZeros([${(a.arr as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, aset, vars }, args) {
    const arr = [...(args.arr as number[])].map(Math.trunc)
    const go = fn(
      "duplicateZeros",
      (): string => {
        let zeros = 0
        for (const x of arr) if (x === 0) zeros++
        line(3, `Count pass: <b>${zeros}</b> zero${zeros === 1 ? "" : "s"} → every element shifts right by the zeros still before it.`)
        line(4, `Walk <b>backwards</b> so we read each original value before anything overwrites it.`)
        for (let i = arr.length - 1; i >= 0; i--) {
          ptr("read", i)
          mark("focus", [i])
          const target = i + zeros
          const v = arr[i]
          if (target < arr.length) {
            arr[target] = v
            aset(target, v)
            ptr("write", target)
            line(5, `arr[${i}] = ${v} shifts by ${zeros} → lands at index <b>${target}</b>.`)
          } else {
            ptr("write", -1)
            line(5, `arr[${i}] = ${v} would land at ${target} — past the end, so it's <b>cut off</b>.`)
          }
          if (v === 0) {
            zeros--
            line(7, `It's a zero — its duplicate uses up one shift: zeros → ${zeros}.`)
            if (i + zeros < arr.length) {
              arr[i + zeros] = 0
              aset(i + zeros, 0)
              ptr("write", i + zeros)
              mark("good", [i + zeros, ...(target < arr.length ? [target] : [])])
              line(8, `Write the duplicate <b>0</b> at index ${i + zeros}.`)
            } else {
              line(8, `Duplicate would land at ${i + zeros} — also past the end.`)
            }
          }
          vars({ i, zeros })
        }
        mark("focus", [])
        ptr("read", -1)
        ptr("write", -1)
        line(11, `Each zero now appears twice, everything after shifted right (tail truncated): [<b>${arr.join(", ")}</b>].`)
        return `[${arr.join(",")}]`
      },
      1,
    )
    return go()
  },
}
