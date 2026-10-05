import type { SolutionDef } from "@/engine/types"

export const longestRepeatingCharacterReplacement: SolutionDef = {
  view: "array",
  array: (a) => (a.s as string).split(""),
  code: `// longest window where (len - maxFreq) <= k
function characterReplacement(s, k) {
  let left = 0, best = 0, maxFreq = 0;
  for (let right = 0; right < s.length; right++) {
    memo[s[right]] = (memo[s[right]] || 0) + 1;
    maxFreq = Math.max(maxFreq, memo[s[right]]);
    if (right - left + 1 - maxFreq > k) {
      memo[s[left]]--;      // too many repaints needed
      left++;               // slide, never shrink below best
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  codeJava: `// longest window where (len - maxFreq) <= k
int characterReplacement(String s, int k) {
  int left = 0, best = 0, maxFreq = 0;    // int[26] freq
  for (int right = 0; right < s.length(); right++) {
    freq[s.charAt(right) - 'A']++;
    maxFreq = Math.max(maxFreq, freq[s.charAt(right) - 'A']);
    if (right - left + 1 - maxFreq > k) {
      freq[s.charAt(left) - 'A']--; // too many repaints needed
      left++;             // slide, never shrink below best
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "AABABBA", maxLen: 14 },
    { kind: "number", name: "k", label: "k (repaints)", default: 1, min: 0, max: 5 },
  ],
  entry: (a) => `characterReplacement("${a.s}", ${a.k})`,
  run({ fn, line, ptr, mark, vars, memo }, args) {
    const s = args.s as string
    const k = args.k as number
    const go = fn(
      "characterReplacement",
      (): number => {
        let left = 0
        let best = 0
        let maxFreq = 0
        let bestRange: [number, number] = [0, -1]
        const freq: Record<string, number> = {}
        ptr("left", 0)
        line(2, `A window is fixable when (length − count of its most common letter) ≤ ${k} repaints.`)
        for (let right = 0; right < s.length; right++) {
          const c = s[right]
          ptr("right", right)
          mark("focus", [right])
          freq[c] = (freq[c] || 0) + 1
          memo[c] = freq[c]
          line(4, `Count '${c}' → freq['${c}'] = ${freq[c]}.`)
          if (freq[c] > maxFreq) maxFreq = freq[c]
          line(5, `maxFreq = <b>${maxFreq}</b> — the letter we keep; everything else gets repainted.`)
          if (right - left + 1 - maxFreq > k) {
            const d = s[left]
            freq[d]--
            memo[d] = freq[d]
            mark("bad", [left])
            line(7, `len ${right - left + 1} − maxFreq ${maxFreq} > k=${k} → drop '${d}' from the left.`)
            left++
            ptr("left", left)
            mark("bad", [])
            line(8, `Window slides to [${left}..${right}] — it never shrinks below the best length so far.`)
          }
          const len = right - left + 1
          mark("window", Array.from({ length: len }, (_, x) => left + x))
          if (len > best) {
            best = len
            bestRange = [left, right]
            line(10, `"${s.slice(left, right + 1)}" works with ≤ ${k} repaints — <b>best = ${best}</b>.`)
          } else {
            line(10, `Window length ${len} — best stays ${best}.`)
          }
          vars({ left, right, maxFreq, best })
        }
        mark("focus", [])
        mark("window", [])
        mark("good", Array.from({ length: bestRange[1] - bestRange[0] + 1 }, (_, x) => bestRange[0] + x))
        line(12, `Longest uniform block after ≤ ${k} repaints: <b>${best}</b> (green).`)
        return best
      },
      1,
    )
    return go()
  },
}
