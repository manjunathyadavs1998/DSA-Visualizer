import type { SolutionDef } from "@/engine/types"

/** Keep it a plausible unix path: letters, dots and slashes, leading "/". */
function unixPath(args: Record<string, unknown>): string {
  let p = String(args.path ?? "").replace(/[^a-z0-9./]/gi, "")
  if (!p.startsWith("/")) p = "/" + p
  return p.length > 1 ? p.slice(0, 14) : "/a/./b/../c/"
}

/** The token view: what split("/") yields, with empties made visible. */
function pathTokens(args: Record<string, unknown>): string[] {
  return unixPath(args)
    .split("/")
    .map((t) => (t === "" ? '""' : t))
}

export const simplifyPath: SolutionDef = {
  view: "array",
  array: (a) => pathTokens(a),
  code: `// collapse ".", "..", and "//" into a canonical path
function simplifyPath(path) {
  const stack = [];   // directories on the current path
  for (const part of path.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      if (stack.length) stack.pop();  // go up one level
    } else {
      stack.push(part);               // go down into part
    }
  }
  return "/" + stack.join("/");
}`,
  codeJava: `// collapse ".", "..", and "//" into a canonical path
String simplifyPath(String path) {
  Deque<String> stack = new ArrayDeque<>(); // dirs on path
  for (String part : path.split("/")) {
    if (part.isEmpty() || part.equals(".")) continue;
    if (part.equals("..")) {
      if (!stack.isEmpty()) stack.pollLast(); // go up one level
    } else {
      stack.addLast(part);            // go down into part
    }
  }
  return "/" + String.join("/", stack);
}`,
  inputs: [{ kind: "string", name: "path", label: "path", default: "/a/./b/../c/", maxLen: 14 }],
  entry: (a) => `simplifyPath("${unixPath(a)}")`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const path = unixPath(args)
    const parts = path.split("/")
    const go = fn(
      "simplifyPath",
      (): string => {
        const stack: string[] = []
        line(2, `A path is a <b>stack of directories</b>: a name pushes, ".." pops, "." and "" (from //) are no-ops.`)
        heap("stack", [])
        line(3, `split("/") on "${path}" → [${parts.map((t) => `"${t}"`).join(", ")}] — note the <b>empty strings</b> from leading/double/trailing slashes.`)
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i]
          ptr("i", i)
          mark("focus", [i])
          vars({ part: part === "" ? '""' : part, depth: stack.length })
          if (part === "" || part === ".") {
            mark("bad", [i])
            line(4, `"${part}" ${part === "" ? "(an empty segment from a slash)" : '(the "stay here" directory)'} changes nothing → <b>skip</b>.`)
            mark("bad", [])
          } else if (part === "..") {
            if (stack.length > 0) {
              const popped = stack.pop() as string
              heap("stack", [...stack])
              line(6, `".." means <b>go up</b> → pop "<b>${popped}</b>". Now at /${stack.join("/")}.`)
            } else {
              line(6, `".." at the <b>root</b> — there is no parent above "/" → ignore it.`)
            }
          } else {
            stack.push(part)
            heap("stack", [...stack])
            line(8, `"${part}" is a real directory → <b>push</b>. Current path: /${stack.join("/")}.`)
          }
        }
        ptr("i", -1)
        mark("focus", [])
        const ans = "/" + stack.join("/")
        heap("output", ans)
        line(11, `Join what survived under a leading slash → "<b>${ans}</b>". One pass over the segments: O(n).`)
        return ans
      },
      1,
    )
    return go()
  },
}
