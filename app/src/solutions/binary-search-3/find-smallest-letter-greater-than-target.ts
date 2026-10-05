import type { SolutionDef } from "@/engine/types"

const clean = (s: string) => {
  const letters = s.toLowerCase().replace(/[^a-z]/g, "").split("").sort()
  return letters.length ? letters : ["c", "f", "j"]
}

export const nextGreatestLetter: SolutionDef = {
  view: "array",
  array: (a) => clean(a.letters as string),
  code: `// smallest letter strictly greater than target (wraps around)
function nextGreatestLetter(letters, target) {
  let lo = 0, hi = letters.length;   // upper bound search
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (letters[mid] <= target)
      lo = mid + 1;   // not strictly greater — go right
    else
      hi = mid;       // candidate — try to find an earlier one
  }
  return letters[lo % letters.length];  // wrap: past-the-end → first
}`,
  codeJava: `// smallest letter strictly greater than target (wraps around)
char nextGreatestLetter(char[] letters, char target) {
  int lo = 0, hi = letters.length;   // upper bound search
  while (lo < hi) {
    int mid = (lo + hi) / 2;
    if (letters[mid] <= target)
      lo = mid + 1;   // not strictly greater — go right
    else
      hi = mid;       // candidate — try to find an earlier one
  }
  return letters[lo % letters.length];  // wrap: past-the-end → first
}`,
  inputs: [
    { kind: "string", name: "letters", label: "sorted letters", default: "cfjmpu", maxLen: 14 },
    { kind: "string", name: "target", label: "target letter", default: "k", maxLen: 1 },
  ],
  entry: (a) => `nextGreatestLetter("${a.letters}", '${a.target}')`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const letters = clean(args.letters as string)
    const target = (((args.target as string) || "a").toLowerCase().match(/[a-z]/) ?? ["a"])[0]
    const n = letters.length
    const go = fn(
      "nextGreatestLetter",
      (): string => {
        narrate(`This is <b>upper bound</b>: the first letter strictly greater than '${target}' — with a circular twist if none exists.`)
        let lo = 0, hi = n
        const gone: number[] = []
        ptr("lo", lo); ptr("hi", hi); vars({ lo, hi, target })
        mark("window", Array.from({ length: n }, (_, x) => x))
        line(2, `hi starts past the end so "no letter beats '${target}'" has a slot: lo = ${n} would mean wrap around.`)
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          ptr("mid", mid); vars({ lo, hi, mid, "letters[mid]": letters[mid], target })
          mark("focus", [mid])
          line(4, `mid of [${lo}..${hi}) is ${mid} → '<b>${letters[mid]}</b>' vs target '${target}'.`)
          if (letters[mid] <= target) {
            line(6, `'${letters[mid]}' ≤ '${target}' → not strictly greater; nothing in ${lo}..${mid} can be. Discard it.`)
            for (let x = lo; x <= mid; x++) if (!gone.includes(x)) gone.push(x)
            lo = mid + 1
          } else {
            line(8, `'${letters[mid]}' > '${target}' → a valid answer! But maybe an earlier letter also beats '${target}'. Keep mid: hi = ${mid}.`)
            for (let x = mid + 1; x < hi; x++) if (!gone.includes(x)) gone.push(x)
            hi = mid
          }
          mark("done", [...gone]); mark("focus", [])
          ptr("lo", lo < n ? lo : -1); ptr("hi", hi < n ? hi : -1); vars({ lo, hi })
          mark("window", Array.from({ length: hi - lo }, (_, x) => lo + x))
        }
        ptr("mid", -1); mark("window", [])
        const ans = letters[lo % n]
        mark("good", [lo % n])
        line(10, lo === n
          ? `lo ran off the end — every letter is ≤ '${target}', so wrap around: answer is the first letter '<b>${ans}</b>'.`
          : `First letter beating '${target}' is '<b>${ans}</b>' at index ${lo}.`)
        return ans
      },
      1,
    )
    return go()
  },
}
