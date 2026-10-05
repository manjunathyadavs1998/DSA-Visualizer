import type { SolutionDef } from "@/engine/types"

const asc = (xs: number[]) => [...xs].sort((a, b) => a - b)

export const minimumPlatforms: SolutionDef = {
  view: "array",
  // sorted arrivals | sorted departures — one timeline split by a separator
  array: (a) => [...asc(a.arrivals as number[]), "|", ...asc(a.departures as number[])],
  code: `// arrivals & departures of trains at one station
function minPlatforms(arr, dep) {
  arr.sort((a, b) => a - b);
  dep.sort((a, b) => a - b);
  let i = 0, j = 0, platforms = 0, maxNeeded = 0;
  while (i < arr.length) {
    if (arr[i] <= dep[j]) {        // a train arrives first
      platforms++;                 // it needs its own platform
      maxNeeded = Math.max(maxNeeded, platforms);
      i++;
    } else {                       // a train departs first
      platforms--;                 // its platform is freed
      j++;
    }
  }
  return maxNeeded;
}`,
  codeJava: `// arrivals & departures of trains at one station
int minPlatforms(int[] arr, int[] dep) {
  Arrays.sort(arr);
  Arrays.sort(dep);
  int i = 0, j = 0, platforms = 0, maxNeeded = 0;
  while (i < arr.length) {
    if (arr[i] <= dep[j]) {        // a train arrives first
      platforms++;                 // it needs its own platform
      maxNeeded = Math.max(maxNeeded, platforms);
      i++;
    } else {                       // a train departs first
      platforms--;                 // its platform is freed
      j++;
    }
  }
  return maxNeeded;
}`,
  inputs: [
    { kind: "numbers", name: "arrivals", label: "arrival times", default: [900, 940, 950, 1100, 1500], maxLen: 5 },
    { kind: "numbers", name: "departures", label: "departure times", default: [910, 1200, 1120, 1130, 1900], maxLen: 5 },
  ],
  entry: () => `minPlatforms(arrivals, departures)`,
  run({ fn, line, ptr, mark, vars, narrate }, args) {
    const arr = asc(args.arrivals as number[])
    const dep = asc(args.departures as number[])
    const n = arr.length
    const sep = n // index of the "|" cell; departures live at sep + 1 + j
    const solve = fn(
      "minPlatforms",
      (): number => {
        line(2, `Sort arrivals: we don't care <b>which</b> train needs a platform, only <b>how many</b> are at the station at once.`)
        line(3, `Sort departures too — now we can sweep both timelines left to right.`)
        let i = 0, j = 0, platforms = 0, maxNeeded = 0
        ptr("i", i)
        ptr("j", sep + 1 + j)
        vars({ i, j, platforms, maxNeeded })
        line(4, `Two pointers sweep time: <b>i</b> over arrivals, <b>j</b> over departures.`)
        const arrived: number[] = []
        const departed: number[] = []
        while (i < n) {
          mark("focus", [i, sep + 1 + j])
          line(6, `Next event: arrival <b>${arr[i]}</b> vs departure <b>${dep[j] ?? "—"}</b>. ${j >= dep.length || arr[i] <= dep[j] ? "The arrival comes first (ties count as overlap)." : "The departure comes first."}`)
          if (j >= dep.length || arr[i] <= dep[j]) {
            platforms++
            line(7, `Train arriving at ${arr[i]} finds <b>${platforms - 1}</b> train(s) still here — platforms in use: <b>${platforms}</b>.`)
            maxNeeded = Math.max(maxNeeded, platforms)
            vars({ i, j, platforms, maxNeeded })
            line(8, `maxNeeded = max so far = <b>${maxNeeded}</b>.`)
            arrived.push(i)
            mark("good", arrived)
            i++
            line(9, `Advance i to the next arrival.`)
          } else {
            platforms--
            vars({ i, j, platforms, maxNeeded })
            line(11, `Train departing at ${dep[j]} frees a platform — in use: <b>${platforms}</b>.`)
            departed.push(sep + 1 + j)
            mark("done", departed)
            j++
            line(12, `Advance j to the next departure.`)
          }
          ptr("i", i < n ? i : -1)
          ptr("j", j < dep.length ? sep + 1 + j : -1)
        }
        mark("focus", [])
        line(15, `All arrivals handled — the busiest moment needed <b>${maxNeeded}</b> platforms.`)
        return maxNeeded
      },
      1,
    )
    narrate(`The answer is the peak overlap: sweep both sorted timelines, +1 platform per arrival, -1 per departure.`)
    return solve()
  },
}
