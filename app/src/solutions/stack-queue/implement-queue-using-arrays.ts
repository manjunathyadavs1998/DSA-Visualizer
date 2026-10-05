import type { SolutionDef } from "@/engine/types"

const CAP = 4

export const implementQueueUsingArrays: SolutionDef = {
  view: "array",
  array: () => ["·", "·", "·", "·"],
  code: `// ring buffer of size cap: front & rear wrap with % cap
const q = new Array(cap); let front = 0, rear = -1, count = 0;
function enqueue(x) {
  if (count === cap) return "full";
  rear = (rear + 1) % cap;
  q[rear] = x; count++;
}
function dequeue() {
  if (count === 0) return "empty";
  const x = q[front];
  front = (front + 1) % cap; count--;
  return x;
}`,
  codeJava: `// ring buffer of size cap: front & rear wrap with % cap
int[] q = new int[cap]; int front = 0, rear = -1, count = 0;
void enqueue(int x) {
  if (count == cap) throw new RuntimeException("full");
  rear = (rear + 1) % cap;
  q[rear] = x; count++;
}
int dequeue() {
  if (count == 0) throw new RuntimeException("empty");
  int x = q[front];
  front = (front + 1) % cap; count--;
  return x;
}`,
  inputs: [{ kind: "numbers", name: "values", label: "values to enqueue", default: [3, 5, 7, 2, 8], maxLen: 6 }],
  entry: (a) => `queueOps([${(a.values as number[]).join(",")}])`,
  run({ fn, line, ptr, mark, aset, vars, heap, narrate }, args) {
    const values = args.values as number[]
    let front = 0, rear = -1, count = 0
    const q: number[] = []
    const enqueue = fn(
      "enqueue",
      (x: number): string => {
        line(3, `enqueue(${x}): full? count = ${count}, cap = ${CAP} → ${count === CAP ? "<b>yes — full, reject.</b>" : "no."}`)
        if (count === CAP) return "full"
        const wraps = rear + 1 >= CAP
        line(4, `rear + 1 = ${rear + 1}${wraps ? ` = cap → <b>wraps around</b> to ${(rear + 1) % CAP}. The freed slots at the start get reused — that's the whole point of % cap.` : ` → rear moves to ${rear + 1}.`}`)
        rear = (rear + 1) % CAP
        aset(rear, x)
        q.push(x)
        count++
        heap("queue", q)
        ptr("rear", rear); ptr("front", front)
        mark("focus", [rear])
        vars({ front, rear, count })
        line(5, `q[${rear}] = ${x}; count = ${count}.`)
        return "ok"
      },
      2,
    )
    const dequeue = fn(
      "dequeue",
      (): string => {
        line(8, `dequeue(): empty? count = ${count} → ${count === 0 ? "<b>yes — nothing to take.</b>" : "no."}`)
        if (count === 0) return "empty"
        const x = q.shift() as number
        mark("focus", [front])
        line(9, `FIFO: take the <b>oldest</b> element, q[${front}] = <b>${x}</b>.`)
        aset(front, "·")
        const wraps = front + 1 >= CAP
        line(10, `front + 1 = ${front + 1}${wraps ? ` = cap → front <b>wraps</b> to 0` : ` → front moves to ${front + 1}`}; count drops to ${count - 1}.`)
        front = (front + 1) % CAP
        count--
        heap("queue", q)
        ptr("front", front); ptr("rear", rear)
        vars({ front, rear, count })
        return String(x)
      },
      7,
    )
    const queueOps = fn("queueOps", (): string => {
      line(1, `A naive array queue shifts everything on dequeue — O(n). A <b>ring buffer</b> never shifts: front and rear just chase each other around ${CAP} slots.`)
      heap("queue", q)
      vars({ front, rear, count })
      const first = values.slice(0, 3)
      const rest = values.slice(3)
      for (const v of first) enqueue(v)
      narrate(`Dequeue two — front advances, leaving <b>dead slots</b> on the left.`)
      dequeue()
      if (count > 0) dequeue()
      if (rest.length > 0) {
        narrate(`More arrivals. Watch rear run off the right edge and <b>wrap into the freed slots</b>.`)
        for (const v of rest) enqueue(v)
      }
      narrate(`Drain the queue — values come out in exactly the order they went in.`)
      while (count > 0) dequeue()
      mark("focus", [])
      return "done"
    })
    queueOps()
    return `all values passed through in FIFO order`
  },
}
