import type { SolutionDef } from "@/engine/types"

export const longestArithmeticSubsequenceOfGivenDifference: SolutionDef = {
  code: `// chain(i) = longest subsequence ENDING at arr[i] with step diff
function chain(i) {
  if (memo[i] !== undefined) return memo[i];
  let best = 1;
  for (let j = i - 1; j >= 0; j--) {
    if (arr[j] === arr[i] - diff) { best = 1 + chain(j); break; }
  }
  memo[i] = best;
  return best;
}
// answer = max over all i of chain(i)`,
  codeJava: `// int[] arr; int diff; Integer[] memo
int chain(int i) {
  if (memo[i] != null) return memo[i];
  int best = 1;
  for (int j = i - 1; j >= 0; j--) {
    if (arr[j] == arr[i] - diff) { best = 1 + chain(j); break; }
  }
  memo[i] = best;
  return best;
}
// answer = max over all i of chain(i)`,
  inputs: [
    { kind: "numbers", name: "arr", label: "arr", default: [1, 5, 7, 8, 5, 3, 4, 2, 1], maxLen: 10 },
    { kind: "number", name: "difference", label: "difference", default: -2, min: -9, max: 9 },
  ],
  entry: (a) => `longestChain(diff=${a.difference})`,
  run({ fn, memo, line, vars, narrate }, args) {
    let arr = (args.arr as number[]).map(Math.trunc)
    if (!arr.length) arr = [1, 5, 7, 8, 5, 3, 4, 2, 1]
    const diff = Math.max(-9, Math.min(9, Math.trunc(args.difference as number) || 0))
    const n = arr.length
    const chain = fn(
      "chain",
      (i: number): number => {
        line(2, `chain(${i}): checking the memo…`)
        if (memo[i] !== undefined) return memo[i] as number
        let best = 1
        line(4, `chain(${i}): arr[${i}] = ${arr[i]} needs a predecessor equal to ${arr[i]} − (${diff}) = <b>${arr[i] - diff}</b>; scan left for the NEAREST one.`)
        for (let j = i - 1; j >= 0; j--) {
          if (arr[j] === arr[i] - diff) {
            line(5, `found arr[${j}] = ${arr[j]} → chain(${i}) extends chain(${j}).`)
            best = 1 + chain(j)
            break
          }
        }
        vars({ i, best })
        line(7, `chain(${i}) = <b>${best}</b> → memo[${i}]. ${best === 1 ? "No predecessor — this element starts a fresh chain." : ""}`)
        memo[i] = best
        return best
      },
      1,
    )
    const longestChain = fn("longestChain", (): number => {
      narrate("The nearest occurrence of the needed predecessor is always safe to use — its chain is never shorter than an older copy's.")
      let ans = 0
      for (let i = 0; i < n; i++) {
        const c = chain(i)
        ans = Math.max(ans, c)
        vars({ i, chainI: c, ans })
        line(10, `answer so far = max(answer, chain(${i}) = ${c}) = <b>${ans}</b>.`)
      }
      return ans
    })
    return longestChain()
  },
}
