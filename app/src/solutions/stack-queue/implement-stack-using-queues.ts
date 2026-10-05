import type { SolutionDef } from "@/engine/types"

export const implementStackUsingQueues: SolutionDef = {
  view: "array",
  array: (a) => a.values as number[],
  code: `// stack from two queues: the newest must reach q1's FRONT
function push(x) {
  q2.enqueue(x);
  while (q1.length > 0)
    q2.enqueue(q1.dequeue());
  [q1, q2] = [q2, q1];  // swap roles
}
function pop() {
  return q1.dequeue();  // front = newest
}`,
  codeJava: `// stack from two queues: the newest must reach q1's FRONT
void push(int x) {
  q2.add(x);
  while (q1.size() > 0)
    q2.add(q1.remove());
  Queue<Integer> t = q1; q1 = q2; q2 = t; // swap roles
}
int pop() {
  return q1.remove();   // front = newest
}`,
  inputs: [{ kind: "numbers", name: "values", label: "values to push", default: [3, 5, 7, 2], maxLen: 5 }],
  entry: (a) => `stackFromQueues([${(a.values as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const values = args.values as number[]
    let q1: { v: number; i: number }[] = []
    let q2: { v: number; i: number }[] = []
    const done: number[] = []
    const snap = () => {
      heap("q1", q1.map((e) => e.v))
      heap("q2", q2.map((e) => e.v))
    }
    const push = fn(
      "push",
      (x: number, i: number): string => {
        ptr("i", i)
        mark("focus", [i])
        vars({ x })
        line(2, `push(${x}): a queue only hands out its <b>front</b> — so the newest element must end up there. Start by enqueuing ${x} into the empty helper q2.`)
        q2.push({ v: x, i })
        snap()
        line(3, `Now drain q1 (${q1.length} element${q1.length === 1 ? "" : "s"}) in behind it — this <b>rotates ${x} to the front</b>.`)
        while (q1.length > 0) {
          const e = q1.shift() as { v: number; i: number }
          q2.push(e)
          snap()
          line(4, `Move ${e.v} from q1 to q2 — older elements line up <b>behind</b> ${x}, keeping their own order.`)
        }
        const t = q1; q1 = q2; q2 = t
        snap()
        line(5, `Swap names: q1 = [${q1.map((e) => e.v).join(", ")}], q2 = []. q1 now reads <b>newest → oldest</b>: LIFO built from FIFO.`)
        return "ok"
      },
      1,
    )
    const pop = fn(
      "pop",
      (): string => {
        const e = q1.shift() as { v: number; i: number }
        snap()
        done.push(e.i)
        mark("done", [...done])
        line(8, `pop(): dequeue q1's front = <b>${e.v}</b> — the most recently pushed value, in O(1). All the work was prepaid at push time (O(n)).`)
        return String(e.v)
      },
      7,
    )
    const stackFromQueues = fn("stackFromQueues", (): string => {
      narrate(`Trick: make push expensive so pop is trivial — after every push, q1's front is the newest element.`)
      snap()
      if (values.length === 0) return "no ops"
      push(values[0], 0)
      if (values.length > 1) push(values[1], 1)
      pop()
      for (let i = 2; i < values.length; i++) push(values[i], i)
      if (q1.length > 0) pop()
      if (q1.length > 0) pop()
      mark("focus", [])
      ptr("i", -1)
      return "done"
    })
    stackFromQueues()
    return `pops came out newest-first (LIFO) — q1 = [${q1.map((e) => e.v).join(", ")}]`
  },
}
