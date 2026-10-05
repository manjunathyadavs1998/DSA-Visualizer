import type { SolutionDef } from "@/engine/types"

const win = (l: number, r: number) => Array.from({ length: Math.max(0, r - l + 1) }, (_, i) => l + i)

export const fruitIntoBaskets: SolutionDef = {
  view: "array",
  array: (a) => a.fruits as number[],
  code: `// longest subarray with at most 2 distinct fruit types
function totalFruit(fruits) {
  const basket = new Map();   // type -> count in window
  let left = 0, best = 0;
  for (let right = 0; right < fruits.length; right++) {
    basket.set(fruits[right], (basket.get(fruits[right]) || 0) + 1);
    while (basket.size > 2) {         // a 3rd type: shrink
      basket.set(fruits[left], basket.get(fruits[left]) - 1);
      if (basket.get(fruits[left]) === 0) basket.delete(fruits[left]);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  codeJava: `// longest subarray with at most 2 distinct fruit types
int totalFruit(int[] fruits) {
  Map<Integer, Integer> basket = new HashMap<>();
  int left = 0, best = 0;
  for (int right = 0; right < fruits.length; right++) {
    basket.merge(fruits[right], 1, Integer::sum);
    while (basket.size() > 2) {       // a 3rd type: shrink
      basket.merge(fruits[left], -1, Integer::sum);
      if (basket.get(fruits[left]) == 0) basket.remove(fruits[left]);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  inputs: [{ kind: "numbers", name: "fruits", label: "fruits", default: [1, 2, 1, 2, 3, 2, 2, 1], maxLen: 12 }],
  entry: (a) => `totalFruit([${(a.fruits as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap }, args) {
    const fruits = args.fruits as number[]
    const go = fn(
      "totalFruit",
      (): number => {
        const basket = new Map<number, number>()
        let left = 0
        let best = 0
        let bestRange: [number, number] = [0, -1]
        ptr("left", 0)
        line(3, `Two baskets = at most <b>2 distinct types</b> in the window. Find the longest such window.`)
        for (let right = 0; right < fruits.length; right++) {
          ptr("right", right)
          mark("focus", [right])
          basket.set(fruits[right], (basket.get(fruits[right]) || 0) + 1)
          heap("basket", Object.fromEntries(basket))
          mark("window", win(left, right))
          line(5, `Pick fruit type <b>${fruits[right]}</b> → basket counts {${[...basket].map(([t, c]) => `${t}:${c}`).join(", ")}}.`)
          while (basket.size > 2) {
            line(6, `<b>${basket.size} types</b> in the basket — one too many. Shrink from the left.`)
            basket.set(fruits[left], (basket.get(fruits[left]) || 0) - 1)
            if (basket.get(fruits[left]) === 0) {
              basket.delete(fruits[left])
              line(8, `Drop fruits[${left}] = ${fruits[left]} — its count hits 0, so type <b>${fruits[left]}</b> leaves the basket.`)
            } else {
              line(8, `Drop fruits[${left}] = ${fruits[left]} — count of type ${fruits[left]} is now ${basket.get(fruits[left])}.`)
            }
            heap("basket", Object.fromEntries(basket))
            left++
            ptr("left", left)
            mark("window", win(left, right))
            line(9, `left → ${left}.`)
          }
          if (right - left + 1 > best) {
            best = right - left + 1
            bestRange = [left, right]
            line(11, `Window [${left}..${right}] has ${basket.size} type(s), length <b>${best}</b> — new best!`)
          } else {
            line(11, `Window [${left}..${right}] length ${right - left + 1} — best stays ${best}.`)
          }
          vars({ left, right, best, types: basket.size })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", win(bestRange[0], bestRange[1]))
        line(13, `Longest 2-type stretch (green) has <b>${best}</b> fruits. Classic "at most K distinct" with K = 2.`)
        return best
      },
      1,
    )
    return go()
  },
}
