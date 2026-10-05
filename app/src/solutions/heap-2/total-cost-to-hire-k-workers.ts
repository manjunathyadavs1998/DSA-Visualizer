import type { SolutionDef } from "@/engine/types"

const clean = (a: Record<string, unknown>): number[] => {
  const c = (a.costs as number[]).map((x) => Math.max(1, Math.trunc(x)))
  if (!c.length) c.push(17, 12, 10, 2, 7, 2, 11, 20, 8)
  return c
}

export const totalCostToHireKWorkers: SolutionDef = {
  view: "array",
  array: (a) => clean(a),
  code: `// two candidate windows race; the cheaper head wins (tie → left)
function totalCost(costs, k, candidates) {
  const head = new MinHeap(), tail = new MinHeap();
  let left = 0, right = costs.length - 1, total = 0;
  while (head.size() < candidates && left <= right) head.push(costs[left++]);
  while (tail.size() < candidates && left <= right) tail.push(costs[right--]);
  for (let round = 1; round <= k; round++) {
    if (tail.isEmpty() || (!head.isEmpty() && head.top() <= tail.top())) {
      total += head.pop();           // hire from the front window
      if (left <= right) head.push(costs[left++]);
    } else {
      total += tail.pop();           // hire from the back window
      if (left <= right) tail.push(costs[right--]);
    }
  }
  return total;
}`,
  codeJava: `// two candidate windows race; the cheaper head wins (tie → left)
long totalCost(int[] costs, int k, int candidates) {
  PriorityQueue<Integer> head = new PriorityQueue<>(), tail = new PriorityQueue<>();
  int left = 0, right = costs.length - 1; long total = 0;
  while (head.size() < candidates && left <= right) head.offer(costs[left++]);
  while (tail.size() < candidates && left <= right) tail.offer(costs[right--]);
  for (int round = 1; round <= k; round++) {
    if (tail.isEmpty() || (!head.isEmpty() && head.peek() <= tail.peek())) {
      total += head.poll();          // hire from the front window
      if (left <= right) head.offer(costs[left++]);
    } else {
      total += tail.poll();          // hire from the back window
      if (left <= right) tail.offer(costs[right--]);
    }
  }
  return total;
}`,
  inputs: [
    { kind: "numbers", name: "costs", label: "costs", default: [17, 12, 10, 2, 7, 2, 11, 20, 8], maxLen: 12 },
    { kind: "number", name: "k", label: "k hires", default: 3, min: 1, max: 12 },
    { kind: "number", name: "candidates", label: "candidates", default: 2, min: 1, max: 6 },
  ],
  entry: (a) => `totalCost(costs, ${a.k}, ${a.candidates})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const costs = clean(args)
    const k = Math.max(1, Math.min(costs.length, Math.trunc(args.k as number)))
    const candidates = Math.max(1, Math.trunc(args.candidates as number))
    const go = fn(
      "totalCost",
      (): number => {
        // both heaps simulated as arrays sorted ASCENDING
        const head: number[] = []
        const tail: number[] = []
        const snap = () => heap("pq", { head: [...head], tail: [...tail] })
        const push = (h: number[], v: number) => {
          let p = 0
          while (p < h.length && h[p] <= v) p++
          h.splice(p, 0, v)
        }
        let left = 0
        let right = costs.length - 1
        let total = 0
        snap()
        line(2, `Two min-heaps: <b>head</b> = first ${candidates} candidate(s), <b>tail</b> = last ${candidates}. Each round hires the cheaper of the two roots.`)
        while (head.length < candidates && left <= right) {
          push(head, costs[left])
          mark("window", Array.from({ length: left + 1 }, (_, x) => x))
          ptr("left", left)
          snap()
          line(4, `Fill head window: push costs[${left}] = <b>${costs[left]}</b> → head [${head.join(", ")}].`)
          left++
          ptr("left", left <= right ? left : -1)
        }
        while (tail.length < candidates && left <= right) {
          push(tail, costs[right])
          ptr("right", right)
          snap()
          line(5, `Fill tail window: push costs[${right}] = <b>${costs[right]}</b> → tail [${tail.join(", ")}].`)
          right--
          ptr("right", right >= left ? right : -1)
        }
        const hired: number[] = []
        for (let round = 1; round <= k; round++) {
          const takeHead = !tail.length || (head.length > 0 && head[0] <= tail[0])
          line(7, `Round ${round}: head root = ${head.length ? head[0] : "∅"}, tail root = ${tail.length ? tail[0] : "∅"} → hire from <b>${takeHead ? "head" : "tail"}</b>${head.length && tail.length && head[0] === tail[0] ? " (tie → lower index wins)" : ""}.`)
          if (takeHead) {
            const c = head.shift() as number
            total += c
            hired.push(c)
            snap()
            heap("output", [...hired, `total ${total}`])
            line(8, `total += <b>${c}</b> → ${total}.`)
            if (left <= right) {
              push(head, costs[left])
              ptr("left", left)
              snap()
              line(9, `Refill head from the middle: push costs[${left}] = ${costs[left]} → head [${head.join(", ")}].`)
              left++
            }
          } else {
            const c = tail.shift() as number
            total += c
            hired.push(c)
            snap()
            heap("output", [...hired, `total ${total}`])
            line(11, `total += <b>${c}</b> → ${total}.`)
            if (left <= right) {
              push(tail, costs[right])
              ptr("right", right)
              snap()
              line(12, `Refill tail from the middle: push costs[${right}] = ${costs[right]} → tail [${tail.join(", ")}].`)
              right--
            }
          }
          vars({ round, total, left, right })
        }
        ptr("left", -1)
        ptr("right", -1)
        line(15, `Hired ${k} worker(s) for a total of <b>${total}</b>: [${hired.join(", ")}].`)
        return total
      },
      1,
    )
    narrate("The two windows creep toward each other from both ends; the heaps make 'cheapest current candidate' an O(log c) question each round.")
    return go()
  },
}
