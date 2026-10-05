import type { SolutionDef } from "@/engine/types"

const CAP = 2

export const lfuCache: SolutionDef = {
  view: "array",
  array: (a) => a.values as number[],
  code: `// LFU cache (capacity 2): evict lowest freq; ties → least recent
function put(key, value) {
  if (!(key in cache) && size === cap) {
    const victim = lfuKey();  // lowest freq, then oldest use
    evict(victim);
  }
  cache[key] = value;
  bump(key);                  // freq[key]++ and refresh recency
}
function get(key) {
  if (!(key in cache)) return -1;
  bump(key);                  // every touch raises frequency
  return cache[key];
}`,
  codeJava: `// LFU cache (capacity 2): evict lowest freq; ties → least recent
void put(int key, int value) {
  if (!cache.containsKey(key) && cache.size() == cap) {
    int victim = lfuKey();     // lowest freq, then oldest use
    evict(victim);
  }
  cache.put(key, value);
  bump(key);                   // freq[key]++ and refresh recency
}
int get(int key) {
  if (!cache.containsKey(key)) return -1;
  bump(key);                   // every touch raises frequency
  return cache.get(key);
}`,
  inputs: [{ kind: "numbers", name: "values", label: "values (key k stores values[k-1])", default: [10, 20, 30, 40], maxLen: 4 }],
  entry: () => `LFUCache(cap = ${CAP})`,
  run({ fn, line, ptr, mark, vars, heap, narrate }, args) {
    const values = args.values as number[]
    const cache: Record<string, number> = {}
    const freq: Record<string, number> = {}
    const recency: number[] = [] // MRU → LRU, cached keys only
    const evicted: number[] = []
    const freqView = () => {
      const m: Record<string, number[]> = {}
      for (const k of recency) {
        const f = `freq ${freq[String(k)]}`
        if (!m[f]) m[f] = []
        m[f].push(k)
      }
      heap("freq", m)
    }
    const paint = () => {
      mark("good", recency.map((k) => k - 1))
      mark("done", [...evicted])
    }
    const bump = (k: number) => {
      freq[String(k)] = (freq[String(k)] ?? 0) + 1
      const p = recency.indexOf(k)
      if (p >= 0) recency.splice(p, 1)
      recency.unshift(k)
      heap("cache", cache)
      freqView()
    }
    const lfuKey = (): number => {
      let victim = recency[recency.length - 1]
      for (let i = recency.length - 1; i >= 0; i--) {
        if (freq[String(recency[i])] < freq[String(victim)]) victim = recency[i]
      }
      return victim
    }
    const put = fn(
      "put",
      (key: number, value: number): string => {
        ptr("i", key - 1)
        mark("focus", [key - 1])
        vars({ key, value })
        const isNew = !(String(key) in cache)
        line(2, `put(${key}, ${value}): ${!isNew ? `key ${key} already cached — overwrite, no eviction.` : recency.length === CAP ? `key ${key} is new and the cache is <b>full</b> → the least-frequently-used key must go.` : `key ${key} is new; room available (${recency.length}/${CAP}).`}`)
        if (isNew && recency.length === CAP) {
          const victim = lfuKey()
          const ties = recency.filter((k) => freq[String(k)] === freq[String(victim)])
          line(3, `Frequencies: ${recency.map((k) => `key ${k}→${freq[String(k)]}`).join(", ")}. ${ties.length > 1 ? `<b>Tie</b> at freq ${freq[String(victim)]} — break it by LRU: key ${victim} has been idle longest.` : `Lowest is key ${victim} (freq ${freq[String(victim)]}).`}`)
          delete cache[String(victim)]
          delete freq[String(victim)]
          recency.splice(recency.indexOf(victim), 1)
          evicted.push(victim - 1)
          heap("cache", cache)
          freqView()
          line(4, `<b>Evict key ${victim}</b> — being used a lot in the past doesn't save you if others are used more.`)
        }
        cache[String(key)] = value
        line(6, `cache[${key}] = ${value}.`)
        bump(key)
        line(7, `bump(${key}): freq → ${freq[String(key)]}, recency front. Freq map: ${recency.map((k) => `${k}→${freq[String(k)]}`).join(", ")}.`)
        paint()
        return "ok"
      },
      1,
    )
    const get = fn(
      "get",
      (key: number): number => {
        ptr("i", key - 1)
        mark("focus", [key - 1])
        vars({ key })
        const present = String(key) in cache
        line(10, `get(${key}): ${present ? `in the cache ✓` : `<b>not in the cache</b> (evicted or never added) → return -1.`}`)
        if (!present) {
          paint()
          return -1
        }
        const v = cache[String(key)]
        bump(key)
        line(11, `bump(${key}): its frequency rises to <b>${freq[String(key)]}</b> — popular keys become ever harder to evict.`)
        paint()
        line(12, `Return ${v}.`)
        return v
      },
      9,
    )
    const results: number[] = []
    const lfuDemo = fn("LFUCache", (): string => {
      narrate(`LFU evicts the key with the <b>fewest touches</b>; frequency ties fall back to LRU. (Real LFU keeps freq→keys buckets for O(1) — same idea, tiny scale here.)`)
      heap("cache", cache)
      freqView()
      const n = values.length
      if (n >= 1) put(1, values[0])
      if (n >= 2) {
        put(2, values[1])
        results.push(get(1)) // key 1 → freq 2
      }
      if (n >= 3) {
        narrate(`Full cache: key 1 has freq 2, key 2 only 1 → key 2 is the LFU victim.`)
        put(3, values[2])
        results.push(get(2))
        results.push(get(3)) // key 3 → freq 2: now tied with key 1
      }
      if (n >= 4) {
        narrate(`Keys 1 and 3 are <b>tied</b> at freq 2 — the LRU tiebreak picks key 1 (key 3 was touched more recently).`)
        put(4, values[3])
        results.push(get(1))
        results.push(get(4))
      }
      mark("focus", [])
      ptr("i", -1)
      return "done"
    })
    lfuDemo()
    return `get results: [${results.join(", ")}]`
  },
}
