import type { SolutionDef } from "@/engine/types"

const restAscii = (s: string, from: number) => {
  let sum = 0
  for (let k = from; k < s.length; k++) sum += s.charCodeAt(k)
  return sum
}

export const minimumAsciiDeleteSum: SolutionDef = {
  code: `// cost(i,j) = min ASCII sum deleted to make a[i..] equal b[j..]
function cost(i, j) {
  if (i === a.length) return restAscii(b, j);
  if (j === b.length) return restAscii(a, i);
  const key = i + "," + j;
  if (memo[key] !== undefined) return memo[key];
  if (a[i] === b[j])
    memo[key] = cost(i + 1, j + 1);
  else
    memo[key] = Math.min(a.charCodeAt(i) + cost(i + 1, j),
                         b.charCodeAt(j) + cost(i, j + 1));
  return memo[key];
}`,
  codeJava: `// cost(i,j) = min ASCII sum deleted to make a[i..] equal b[j..]
int cost(int i, int j) {
  if (i == a.length()) return restAscii(b, j);
  if (j == b.length()) return restAscii(a, i);
  String key = i + "," + j;
  if (memo.get(key) != null) return memo.get(key);
  if (a.charAt(i) == b.charAt(j))
    memo.put(key, cost(i + 1, j + 1));
  else
    memo.put(key, Math.min(a.charAt(i) + cost(i + 1, j),
                           b.charAt(j) + cost(i, j + 1)));
  return memo.get(key);
}`,
  inputs: [
    { kind: "string", name: "a", label: "s1", default: "sea", maxLen: 7 },
    { kind: "string", name: "b", label: "s2", default: "eat", maxLen: 7 },
  ],
  entry: (a) => `cost(0, 0)  // a="${a.a}", b="${a.b}"`,
  run({ fn, memo, line, narrate }, args) {
    const a = args.a as string
    const b = args.b as string
    const cost = fn(
      "cost",
      (i: number, j: number): number => {
        line(2, `cost(${i},${j}): a exhausted? (${i === a.length ? `<b>yes — delete all of b[${j}..], ASCII sum ${restAscii(b, j)}</b>` : "no"})`)
        if (i === a.length) return restAscii(b, j)
        line(3, `cost(${i},${j}): b exhausted? (${j === b.length ? `<b>yes — delete all of a[${i}..], ASCII sum ${restAscii(a, i)}</b>` : "no"})`)
        if (j === b.length) return restAscii(a, i)
        const key = i + "," + j
        line(5, `cost(${i},${j}): checking memo["${key}"]…`)
        if (memo[key] !== undefined) return memo[key] as number
        if (a[i] === b[j]) {
          line(7, `'${a[i]}' == '${b[j]}' → keep both, <b>pay nothing</b>.`)
          memo[key] = cost(i + 1, j + 1)
        } else {
          line(9, `'${a[i]}' ≠ '${b[j]}' → delete a[${i}] (pay ${a.charCodeAt(i)}) or b[${j}] (pay ${b.charCodeAt(j)}) — cheap chars die first!`)
          memo[key] = Math.min(a.charCodeAt(i) + cost(i + 1, j), b.charCodeAt(j) + cost(i, j + 1))
        }
        line(11, `cost(${i},${j}) = <b>${memo[key]}</b>.`)
        return memo[key] as number
      },
      1,
    )
    narrate("Delete Operation's recurrence, weighted: each deletion costs its ASCII code, so the DP prefers sacrificing 'a' (97) over 'z' (122).")
    return cost(0, 0)
  },
}
