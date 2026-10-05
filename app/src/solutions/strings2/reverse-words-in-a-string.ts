import type { SolutionDef } from "@/engine/types"

export const reverseWordsInAString: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// s is editable below
function reverseWords(s) {
  const words = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && s[i] === ' ') i++;
    let j = i;
    while (j < s.length && s[j] !== ' ') j++;
    if (j > i) words.push(s.slice(i, j));
    i = j;
  }
  return words.reverse().join(' ');
}`,
  codeJava: `// String s is editable below
String reverseWords(String s) {
  List<String> words = new ArrayList<>();
  int i = 0;
  while (i < s.length()) {
    while (i < s.length() && s.charAt(i) == ' ') i++;
    int j = i;
    while (j < s.length() && s.charAt(j) != ' ') j++;
    if (j > i) words.add(s.substring(i, j));
    i = j;
  }
  Collections.reverse(words); return String.join(" ", words);
}`,
  inputs: [{ kind: "string", name: "s", label: "s", default: "sky is blue", maxLen: 14 }],
  entry: (a) => `reverseWords("${a.s}")`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const s = args.s as string
    const go = fn(
      "reverseWords",
      (): string => {
        const words: string[] = []
        heap("words", words)
        let i = 0
        ptr("i", i); vars({ i })
        line(2, `Collect the words left to right, then reverse the list.`)
        while (i < s.length) {
          while (i < s.length && s[i] === " ") {
            line(5, `s[${i}] is a space — skip it.`)
            i++
            ptr("i", i)
          }
          if (i >= s.length) break
          let j = i
          ptr("j", j)
          line(6, `Word starts at index ${i} — walk j to its end.`)
          while (j < s.length && s[j] !== " ") j++
          ptr("j", j)
          mark("window", Array.from({ length: j - i }, (_, x) => i + x))
          const w = s.slice(i, j)
          words.push(w)
          heap("words", words)
          vars({ i, j, word: `"${w}"` })
          line(8, `Word "<b>${w}</b>" spans [${i}, ${j - 1}] — push it. words = [${words.map((x) => `"${x}"`).join(", ")}].`)
          i = j
          ptr("i", i)
        }
        mark("window", [])
        const rev = [...words].reverse()
        heap("words", rev)
        const ans = rev.join(" ")
        narrate(`Reverse the list: [${rev.map((x) => `"${x}"`).join(", ")}].`)
        line(11, `Join the reversed words with single spaces → "<b>${ans}</b>".`)
        return ans
      },
      1,
    )
    return go()
  },
}
