import type { SolutionDef } from "@/engine/types"

const rng = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, x) => a + x)

export const stringCompression: SolutionDef = {
  view: "array",
  array: (a) => (a.chars as string).split(""),
  code: `// two pointers: read whole runs, write char + count
function compress(chars) {
  let write = 0, read = 0;
  while (read < chars.length) {
    const ch = chars[read];
    let count = 0;
    while (read < chars.length && chars[read] === ch) { read++; count++; }
    chars[write++] = ch;
    if (count > 1) {
      for (const d of String(count)) chars[write++] = d;
    }
  }
  return write;
}`,
  codeJava: `// two pointers: read whole runs, write char + count
int compress(char[] chars) {
  int write = 0, read = 0;
  while (read < chars.length) {
    char ch = chars[read];
    int count = 0;
    while (read < chars.length && chars[read] == ch) { read++; count++; }
    chars[write++] = ch;
    if (count > 1) {
      for (char d : String.valueOf(count).toCharArray()) chars[write++] = d;
    }
  }
  return write;
}`,
  inputs: [{ kind: "string", name: "chars", label: "chars", default: "aabbbbbcccd", maxLen: 14 }],
  entry: (a) => `compress([${(a.chars as string).split("").map((c) => `'${c}'`).join(",")}])`,
  run({ fn, line, ptr, mark, aset, vars, heap }, args) {
    const chars = (args.chars as string).split("")
    const go = fn(
      "compress",
      (): number => {
        let write = 0
        let read = 0
        ptr("read", 0)
        ptr("write", 0)
        line(2, `<b>read</b> scans runs of equal chars; <b>write</b> overwrites the array in place — write never passes read.`)
        while (read < chars.length) {
          const ch = chars[read]
          const start = read
          let count = 0
          while (read < chars.length && chars[read] === ch) {
            read++
            count++
          }
          ptr("read", Math.min(read, chars.length - 1))
          mark("window", rng(start, read - 1))
          line(6, `Run of '<b>${ch}</b>' from index ${start}: length <b>${count}</b> (blue).`)
          aset(write, ch)
          mark("good", rng(0, write))
          ptr("write", write)
          line(7, `Write the char: chars[${write}] = '<b>${ch}</b>'.`)
          write++
          if (count > 1) {
            for (const d of String(count)) {
              aset(write, d)
              mark("good", rng(0, write))
              ptr("write", write)
              line(9, `count = ${count} > 1 → write digit '<b>${d}</b>' at chars[${write}].`)
              write++
            }
          } else {
            line(8, `count = 1 → <b>no digit</b> is written for single chars.`)
          }
          vars({ read, write, ch, count })
        }
        mark("window", [])
        ptr("read", -1)
        heap("compressed prefix", chars.slice(0, write).join(""))
        line(12, `Done: the first <b>${write}</b> cells (green) hold "<b>${chars.slice(0, write).join("")}</b>" — return <b>${write}</b>.`)
        return write
      },
      1,
    )
    return go()
  },
}
