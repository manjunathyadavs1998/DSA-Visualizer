import type { SolutionDef } from "@/engine/types"

export const stringCompression: SolutionDef = {
  view: "array",
  array: (a) => [...(a.chars as string)],
  code: `// read runs with one pointer, write char + count with another
function compress(chars) {
  let write = 0, read = 0;
  while (read < chars.length) {
    const ch = chars[read];
    let len = 0;
    while (read < chars.length && chars[read] === ch) { read++; len++; }
    chars[write] = ch; write++;
    if (len > 1) for (const d of String(len)) { chars[write] = d; write++; }
  }
  return write;        // compressed form lives in chars[0..write-1]
}`,
  codeJava: `// read runs with one pointer, write char + count with another
int compress(char[] chars) {
  int write = 0, read = 0;
  while (read < chars.length) {
    char ch = chars[read];
    int len = 0;
    while (read < chars.length && chars[read] == ch) { read++; len++; }
    chars[write] = ch; write++;
    if (len > 1) for (char d : String.valueOf(len).toCharArray()) { chars[write] = d; write++; }
  }
  return write;        // compressed form lives in chars[0..write-1]
}`,
  inputs: [{ kind: "string", name: "chars", label: "chars", default: "aabbccc", maxLen: 14 }],
  entry: (a) => `compress("${a.chars}")`,
  run({ fn, line, ptr, mark, aset, vars }, args) {
    const chars = [...(args.chars as string)]
    if (chars.length === 0) chars.push("a")
    const go = fn(
      "compress",
      (): number => {
        let write = 0
        let read = 0
        ptr("write", 0)
        ptr("read", 0)
        line(2, `read scans runs; write builds "char + count" in place. write never overtakes read, so nothing unread is clobbered.`)
        while (read < chars.length) {
          const ch = chars[read]
          line(4, `New run starts at ${read}: character '<b>${ch}</b>'.`)
          let len = 0
          const start = read
          while (read < chars.length && chars[read] === ch) {
            read++
            len++
            ptr("read", read < chars.length ? read : -1)
          }
          mark("focus", Array.from({ length: len }, (_, i) => start + i))
          line(6, `Run measured: '<b>${ch}</b>' × <b>${len}</b> (indices ${start}..${read - 1}).`)
          chars[write] = ch
          aset(write, ch)
          write++
          ptr("write", write)
          mark("good", Array.from({ length: write }, (_, i) => i))
          line(7, `Write the character: chars[${write - 1}] = '<b>${ch}</b>'.`)
          if (len > 1) {
            for (const d of String(len)) {
              chars[write] = d
              aset(write, d)
              write++
              ptr("write", write)
              mark("good", Array.from({ length: write }, (_, i) => i))
              line(8, `Write a count digit: chars[${write - 1}] = '<b>${d}</b>' (run length ${len}).`)
            }
          } else {
            line(8, `Run length 1 — the spec says write <b>no count</b> for singletons.`)
          }
          vars({ read, write, len })
        }
        mark("focus", [])
        ptr("read", -1)
        line(10, `Compressed in place to <b>${write}</b> chars: "${chars.slice(0, write).join("")}" — return ${write}.`)
        return write
      },
      1,
    )
    return go()
  },
}
