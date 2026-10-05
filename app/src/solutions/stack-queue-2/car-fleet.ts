import type { SolutionDef } from "@/engine/types"

/** Clamp inputs so every car is strictly before the target with positive speed. */
function fleetArgs(args: Record<string, unknown>): { target: number; position: number[]; speed: number[] } {
  const target = Math.max(2, Math.trunc(args.target as number))
  let position = (args.position as number[]).map((p) => Math.trunc(p))
  let speed = (args.speed as number[]).map((s) => Math.max(1, Math.trunc(s)))
  const n = Math.min(position.length, speed.length)
  position = position.slice(0, n)
  speed = speed.slice(0, n)
  // positions must be distinct and inside [0, target-1]
  const seen = new Set<number>()
  const pos: number[] = []
  const spd: number[] = []
  for (let i = 0; i < n; i++) {
    const p = Math.min(target - 1, Math.max(0, position[i]))
    if (!seen.has(p)) {
      seen.add(p)
      pos.push(p)
      spd.push(speed[i])
    }
  }
  if (!pos.length) return { target: 12, position: [10, 8, 0, 5, 3], speed: [2, 4, 1, 1, 3] }
  return { target, position: pos, speed: spd }
}

export const carFleet: SolutionDef = {
  view: "array",
  array: (a) => {
    const { position, speed } = fleetArgs(a)
    return position.map((p, i) => `${p}@${speed[i]}`)
  },
  code: `// cars can't pass: count fleets reaching target
function carFleet(target, position, speed) {
  const order = position.map((_, i) => i);
  order.sort((x, y) => position[y] - position[x]);
  const stack = [];  // arrival times of fleet leaders
  for (const i of order) {       // closest to target first
    const time = (target - position[i]) / speed[i];
    if (!stack.length || time > stack.at(-1)) {
      stack.push(time);  // too slow to catch the fleet ahead
    }
  }
  return stack.length;
}`,
  codeJava: `// cars can't pass: count fleets reaching target
int carFleet(int target, int[] position, int[] speed) {
  Integer[] order = new Integer[position.length]; // 0..n-1
  Arrays.sort(order, (x, y) -> position[y] - position[x]);
  Deque<Double> stack = new ArrayDeque<>(); // arrival times
  for (int i : order) {          // closest to target first
    double time = (double)(target - position[i]) / speed[i];
    if (stack.isEmpty() || time > stack.peek()) {
      stack.push(time);  // too slow to catch the fleet ahead
    }
  }
  return stack.size();
}`,
  inputs: [
    { kind: "number", name: "target", label: "target", default: 12, min: 2, max: 100 },
    { kind: "numbers", name: "position", label: "position", default: [10, 8, 0, 5, 3], maxLen: 10 },
    { kind: "numbers", name: "speed", label: "speed", default: [2, 4, 1, 1, 3], maxLen: 10 },
  ],
  entry: (a) => {
    const { target, position, speed } = fleetArgs(a)
    return `carFleet(${target}, [${position.join(",")}], [${speed.join(",")}])`
  },
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const { target, position, speed } = fleetArgs(args)
    const go = fn(
      "carFleet",
      (): number => {
        const order = position.map((_, i) => i)
        line(2, `Each cell shows <b>position@speed</b>. A faster car that catches a slower one ahead is stuck behind it — they merge into a <b>fleet</b>.`)
        order.sort((x, y) => position[y] - position[x])
        line(3, `Sort cars by position, <b>closest to the target first</b>: [${order.map((i) => position[i]).join(", ")}]. Only the car ahead can block you.`)
        const stack: number[] = []
        heap("stack", [])
        line(4, `The stack keeps the <b>arrival time of each fleet's leader</b>. A new car joins the fleet ahead or starts its own.`)
        const fleets: number[] = []
        for (const i of order) {
          ptr("i", i)
          mark("focus", [i])
          const time = (target - position[i]) / speed[i]
          vars({ car: `${position[i]}@${speed[i]}`, time: +time.toFixed(2) })
          line(6, `Car at ${position[i]} (speed ${speed[i]}): alone it would arrive at t = (${target} − ${position[i]}) / ${speed[i]} = <b>${+time.toFixed(2)}</b>.`)
          if (stack.length === 0 || time > stack[stack.length - 1]) {
            stack.push(time)
            fleets.push(i)
            mark("good", [...fleets])
            heap("stack", stack.map((t) => +t.toFixed(2)))
            line(8, stack.length === 1
              ? `No fleet ahead → this car <b>leads the first fleet</b>. Push t = ${+time.toFixed(2)}.`
              : `It arrives <b>later</b> (${+time.toFixed(2)} > ${+stack[stack.length - 2].toFixed(2)}) → it never catches the fleet ahead → <b>new fleet</b>. Push.`)
          } else {
            mark("bad", [i])
            line(7, `It would arrive at ${+time.toFixed(2)} ≤ ${+stack[stack.length - 1].toFixed(2)} → it <b>catches the fleet ahead</b> and merges; its own time vanishes. Nothing pushed.`)
            mark("bad", [])
          }
        }
        ptr("i", -1)
        mark("focus", [])
        heap("output", stack.length)
        line(11, `Every stack entry is one fleet crossing the line → <b>${stack.length}</b> fleet${stack.length === 1 ? "" : "s"}. Sorting dominates: O(n log n).`)
        return stack.length
      },
      1,
    )
    return go()
  },
}
