import type { SolutionDef } from "@/engine/types"

export const onlineStockSpan: SolutionDef = {
  view: "array",
  array: (a) => a.prices as number[],
  code: `// prices arrive one per day (editable below)
function nextPrice(price, i) {
  let span = 1;
  while (stack.length && prices[stack.at(-1)] <= price) {
    span += spans[stack.pop()];  // absorb that day's whole span
  }
  stack.push(i);
  spans.push(span);
  return span;
}`,
  codeJava: `// prices arrive one per day (editable below)
int nextPrice(int price, int i) {
  int span = 1;
  while (!stack.isEmpty() && prices[stack.peek()] <= price) {
    span += spans.get(stack.pop()); // absorb that day's whole span
  }
  stack.push(i);
  spans.add(span);
  return span;
}`,
  inputs: [{ kind: "numbers", name: "prices", label: "prices (day by day)", default: [100, 80, 60, 70, 60, 75, 85], maxLen: 10 }],
  entry: (a) => `stockSpan([${(a.prices as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const prices = args.prices as number[]
    const stack: number[] = []
    const spans: number[] = []
    const snap = () => heap("stack", stack.map((j) => `${j}:${prices[j]}`))
    const nextPrice = fn(
      "nextPrice",
      (price: number, i: number): number => {
        let span = 1
        ptr("day", i)
        mark("focus", [i])
        vars({ i, price, span })
        line(2, `Day ${i}: price <b>${price}</b>. Its span starts at 1 (today counts) and grows by swallowing cheaper days to the left.`)
        while (stack.length > 0 && prices[stack[stack.length - 1]] <= price) {
          const j = stack.pop() as number
          snap()
          span += spans[j]
          vars({ i, price, span })
          line(4, `Day ${j} (price ${prices[j]}) is ≤ ${price} — <b>absorb its whole span of ${spans[j]}</b> in one gulp instead of re-walking those days. span = ${span}.`)
        }
        stack.push(i)
        snap()
        line(6, stack.length > 1
          ? `Push day ${i}. The stack keeps only days with <b>strictly falling</b> prices: [${stack.map((j) => prices[j]).join(", ")}] — everything cheaper got absorbed.`
          : `Push day ${i} — every previous day was cheaper, so the stack holds day ${i} alone.`)
        spans.push(span)
        heap("spans", spans)
        mark("window", Array.from({ length: span }, (_, x) => i - span + 1 + x))
        line(7, `spans[${i}] = <b>${span}</b> — the price ran at or below ${price} for ${span} consecutive day${span === 1 ? "" : "s"} (highlighted).`)
        return span
      },
      1,
    )
    const stockSpan = fn("stockSpan", (): string => {
      narrate(`Online: prices arrive one at a time. The stack remembers the last day that was MORE expensive — everything in between is already summarized in its span.`)
      snap()
      heap("spans", spans)
      for (let i = 0; i < prices.length; i++) nextPrice(prices[i], i)
      mark("focus", [])
      ptr("day", -1)
      narrate(`Each day is pushed once and popped at most once → <b>O(1) amortized</b> per price, even though a single day can absorb many.`)
      return "done"
    })
    stockSpan()
    return JSON.stringify(spans)
  },
}
