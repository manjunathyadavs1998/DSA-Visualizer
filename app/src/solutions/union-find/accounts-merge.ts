import type { SolutionDef } from "@/engine/types"

// accounts: [Alice: a@x, a@y], [Bob: b@z], [Alice: a@y, a@w]
// After merge: Alice owns {a@x, a@y, a@w}, Bob owns {b@z}
const ACCOUNTS = [
  ["Alice", "a@x.com", "a@y.com"],
  ["Bob",   "b@z.com"],
  ["Alice", "a@y.com", "a@w.com"],
]

export const accountsMerge: SolutionDef = {
  view: "array",
  array: () => [0, 1, 2],   // parent of each account index
  code: `function accountsMerge(accounts) {
  // map each email → first account index that owns it
  const owner = new Map();
  for (let i = 0; i < accounts.length; i++)
    for (const email of accounts[i].slice(1)) {
      if (owner.has(email)) union(i, owner.get(email));
      else owner.set(email, i);
    }
  // group accounts by root
  const groups = new Map();
  for (let i = 0; i < accounts.length; i++) {
    const r = find(i);
    if (!groups.has(r)) groups.set(r, new Set());
    for (const e of accounts[i].slice(1)) groups.get(r).add(e);
  }
  return [...groups.entries()].map(([r, emails]) =>
    [accounts[r][0], ...[...emails].sort()]);
}`,
  codeJava: `List<List<String>> accountsMerge(List<List<String>> accounts) {
  int n = accounts.size();
  // map each email → first account index that owns it
  Map<String,Integer> owner = new HashMap<>();
  for (int i = 0; i < n; i++)
    for (int j = 1; j < accounts.get(i).size(); j++) {
      String e = accounts.get(i).get(j);
      if (owner.containsKey(e)) union(i, owner.get(e));
      else owner.put(e, i);
    }
  // group accounts by root
  Map<Integer,TreeSet<String>> groups = new HashMap<>();
  for (int i = 0; i < n; i++) {
    int r = find(i);
    groups.computeIfAbsent(r, k -> new TreeSet<>());
    for (int j = 1; j < accounts.get(i).size(); j++)
      groups.get(r).add(accounts.get(i).get(j));
  }
  List<List<String>> res = new ArrayList<>();
  for (var entry : groups.entrySet()) {
    List<String> row = new ArrayList<>();
    row.add(accounts.get(entry.getKey()).get(0));
    row.addAll(entry.getValue());
    res.add(row);
  }
  return res;
}`,
  inputs: [],
  entry: () => `accountsMerge(3 accounts)`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const n = ACCOUNTS.length
    const parent = [0, 1, 2]
    const find = fn("find", (x: number): number => {
      if (parent[x] !== x) { parent[x] = find(parent[x]); aset(x, parent[x]) }
      return parent[x]
    }, 0)
    const unionFn = fn("union", (a: number, b: number): void => {
      const ra = find(a), rb = find(b)
      if (ra !== rb) { parent[rb] = ra; aset(rb, ra) }
    }, 0)
    const go = fn("accountsMerge", (): string => {
      const owner = new Map<string, number>()
      line(1, `Pass 1: for each account, map every email to its account index. If an email is already owned, union the two accounts.`)
      for (let i = 0; i < n; i++) {
        mark("focus", [i])
        for (const email of ACCOUNTS[i].slice(1)) {
          vars({ account: i, email })
          if (owner.has(email)) {
            const j = owner.get(email)!
            line(5, `Email <b>${email}</b> already seen in account ${j} — union(${i}, ${j}).`)
            unionFn(i, j)
            mark("good", parent.map((p, k) => (p === k ? k : -1)).filter(k => k >= 0))
          } else {
            owner.set(email, i)
            line(6, `Email <b>${email}</b> first seen — owner[${email}] = ${i}.`)
          }
          heap("owner", Object.fromEntries(owner))
        }
      }
      mark("focus", [])
      line(9, `Pass 2: group all emails by their root account.`)
      const groups = new Map<number, Set<string>>()
      for (let i = 0; i < n; i++) {
        const r = find(i)
        if (!groups.has(r)) groups.set(r, new Set())
        for (const e of ACCOUNTS[i].slice(1)) groups.get(r)!.add(e)
      }
      const result = [...groups.entries()].map(([r, emails]) =>
        [ACCOUNTS[r][0], ...[...emails].sort()])
      heap("result", result)
      line(14, `Merged into <b>${result.length}</b> account${result.length > 1 ? "s" : ""}.`)
      return JSON.stringify(result)
    }, 0)
    narrate("Union-Find on account indices: shared emails are the edges. After all unions, group emails by root — each root is one merged account.")
    return go()
  },
}
