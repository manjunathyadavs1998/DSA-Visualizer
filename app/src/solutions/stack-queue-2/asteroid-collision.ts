import type { SolutionDef } from "@/engine/types"

/** Zero-size asteroids are undefined by the problem — drop them. */
function asteroids(args: Record<string, unknown>): number[] {
  const a = (args.asteroids as number[]).map((x) => Math.trunc(x)).filter((x) => x !== 0)
  return a.length ? a : [5, 10, -5, 8, -8, 2, -13, 4]
}

export const asteroidCollision: SolutionDef = {
  view: "array",
  array: (a) => asteroids(a),
  code: `// + moves right, − moves left; equal sizes both explode
function asteroidCollision(ast) {
  const stack = [];   // survivors so far (a hallway)
  for (const a of ast) {
    let alive = true;
    while (alive && a < 0 && stack.at(-1) > 0) {
      if (stack.at(-1) < -a) stack.pop();        // top explodes
      else if (stack.at(-1) === -a) { stack.pop(); alive = false; }
      else alive = false;                        // a explodes
    }
    if (alive) stack.push(a);
  }
  return stack;
}`,
  codeJava: `// + moves right, − moves left; equal sizes both explode
int[] asteroidCollision(int[] ast) {
  Deque<Integer> stack = new ArrayDeque<>(); // survivors
  for (int a : ast) {
    boolean alive = true;
    while (alive && a < 0 && !stack.isEmpty() && stack.peek() > 0) {
      if (stack.peek() < -a) stack.pop();        // top explodes
      else if (stack.peek() == -a) { stack.pop(); alive = false; }
      else alive = false;                        // a explodes
    }
    if (alive) stack.push(a);
  }
  return toArray(stack);   // bottom → top order
}`,
  inputs: [
    { kind: "numbers", name: "asteroids", label: "asteroids", default: [5, 10, -5, 8, -8, 2, -13, 4], maxLen: 12 },
  ],
  entry: (a) => `asteroidCollision([${asteroids(a).join(",")}])`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const ast = asteroids(args)
    const go = fn(
      "asteroidCollision",
      (): string => {
        const stack: number[] = []
        line(2, `The stack is the hallway of <b>survivors</b>. A collision only happens when a new <b>left-mover (−)</b> meets a <b>right-mover (+)</b> on top.`)
        heap("stack", [])
        for (let i = 0; i < ast.length; i++) {
          const a = ast[i]
          ptr("i", i)
          mark("focus", [i])
          let alive = true
          vars({ i, a, alive })
          line(4, `Asteroid <b>${a}</b> (${a > 0 ? "→ right" : "← left"}) enters. ${a > 0 || stack.length === 0 || stack[stack.length - 1] < 0 ? "No head-on collision possible." : "It flies into the right-movers on the stack!"}`)
          while (alive && a < 0 && stack.length > 0 && stack[stack.length - 1] > 0) {
            const top = stack[stack.length - 1]
            line(5, `Collision: incoming <b>${a}</b> vs top <b>${top}</b> — compare sizes ${top} vs ${-a}.`)
            if (top < -a) {
              stack.pop()
              heap("stack", [...stack])
              line(6, `|${top}| < |${a}| → the top <b>explodes</b>; ${a} keeps flying left into the next survivor.`)
            } else if (top === -a) {
              stack.pop()
              alive = false
              heap("stack", [...stack])
              line(7, `Equal sizes → <b>both explode</b>. Pop ${top}; ${a} is gone too.`)
            } else {
              alive = false
              mark("bad", [i])
              line(8, `|${top}| > |${a}| → the incoming <b>${a} explodes</b>; the stack is untouched.`)
              mark("bad", [])
            }
            vars({ i, a, alive })
          }
          if (alive) {
            stack.push(a)
            heap("stack", [...stack])
            line(10, `<b>${a}</b> survives → push. Hallway now: [${stack.join(", ")}].`)
          }
        }
        ptr("i", -1)
        mark("focus", [])
        heap("output", [...stack])
        line(12, `No more collisions possible — survivors: <b>[${stack.join(", ")}]</b>. Each asteroid is pushed/popped at most once → O(n).`)
        return JSON.stringify(stack)
      },
      1,
    )
    return go()
  },
}
