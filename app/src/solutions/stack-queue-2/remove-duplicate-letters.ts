import type { SolutionDef } from "@/engine/types"

function lettersOf(args: Record<string, unknown>): string {
  const s = String(args.s ?? "").toLowerCase().replace(/[^a-z]/g, "").slice(0, 14)
  return s.length ? s : "cbacdcbc"
}

export const removeDuplicateLetters: SolutionDef = {
  view: "array",
  array: (a) => lettersOf(a).split(""),
  code: `// lexicographically smallest subsequence with each letter once
function removeDuplicateLetters(s) {
  const last = {};   // last index of every letter
  for (let i = 0; i < s.length; i++) last[s[i]] = i;
  const stack = [], inStack = new Set();
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStack.has(c)) continue;     // already placed — skip
    while (stack.length && stack.at(-1) > c && last[stack.at(-1)] > i) {
      inStack.delete(stack.pop());    // top reappears later: demote it
    }
    stack.push(c); inStack.add(c);
  }
  return stack.join("");
}`,
  codeJava: `// lexicographically smallest subsequence with each letter once
String removeDuplicateLetters(String s) {
  int[] last = new int[26]; // last index of every letter
  for (int i = 0; i < s.length(); i++) last[s.charAt(i)-'a'] = i;
  StringBuilder stack = new StringBuilder(); boolean[] in = new boolean[26];
  for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
    if (in[c-'a']) continue;          // already placed — skip
    while (stack.length() > 0 && top(stack) > c && last[top(stack)-'a'] > i) {
      in[pop(stack)-'a'] = false;     // top reappears later: demote it
    }
    stack.append(c); in[c-'a'] = true;
  }
  return stack.toString();
}`,
  inputs: [{ kind: "string", name: "s", label: "s (lowercase)", default: "cbacdcbc", maxLen: 14 }],
  entry: (a) => `removeDuplicateLetters("${lettersOf(a)}")`,
  run({ fn, line, ptr, mark, heap, vars }, args) {
    const s = lettersOf(args)
    const go = fn(
      "removeDuplicateLetters",
      (): string => {
        const last: Record<string, number> = {}
        for (let i = 0; i < s.length; i++) last[s[i]] = i
        line(3, `First pass: record each letter's <b>last</b> position — ${Object.entries(last).map(([c, i]) => `${c}:${i}`).join(", ")}. We may only drop a letter if it <b>reappears later</b>.`)
        const stack: string[] = []
        const inStack = new Set<string>()
        heap("stack", [])
        line(4, `The stack builds the answer and we keep it <b>as ascending as the future allows</b> — like remove-k-digits, but every letter must survive exactly once.`)
        for (let i = 0; i < s.length; i++) {
          const c = s[i]
          ptr("i", i)
          mark("focus", [i])
          vars({ i, c, "last[c]": last[c] })
          if (inStack.has(c)) {
            mark("bad", [i])
            line(7, `'${c}' is already in the answer ("${stack.join("")}") — a second copy can't help. <b>Skip.</b>`)
            mark("bad", [])
            continue
          }
          while (stack.length > 0 && stack[stack.length - 1] > c && last[stack[stack.length - 1]] > i) {
            const top = stack[stack.length - 1]
            line(8, `Top '${top}' > '${c}' AND '${top}' reappears later (last[${top}] = ${last[top]} > ${i}) → popping it now gives a smaller string <b>without losing it forever</b>.`)
            inStack.delete(stack.pop() as string)
            heap("stack", [...stack])
            line(9, `Pop '${top}'. Answer so far: "<b>${stack.join("")}</b>".`)
          }
          if (stack.length > 0 && stack[stack.length - 1] > c) {
            line(8, `Top '${stack[stack.length - 1]}' > '${c}' but it <b>never appears again</b> (last[${stack[stack.length - 1]}] = ${last[stack[stack.length - 1]]} ≤ ${i}) — we must keep it. Stop popping.`)
          }
          stack.push(c)
          inStack.add(c)
          heap("stack", [...stack])
          line(11, `Push '<b>${c}</b>'. Answer so far: "<b>${stack.join("")}</b>".`)
        }
        ptr("i", -1)
        mark("focus", [])
        const ans = stack.join("")
        heap("output", ans)
        line(13, `Every letter appears once, and no allowed swap could make it smaller: "<b>${ans}</b>". O(n) — each letter pushed/popped at most once.`)
        return ans
      },
      1,
    )
    return go()
  },
}
