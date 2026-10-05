import type { SolutionDef } from "@/engine/types"

const CAP = 2

export const lruCache: SolutionDef = {
  view: "array",
  array: (a) => a.values as number[],
  code: `// LRU cache (capacity 2): recency list MRU→LRU + key→value map
function put(key, value) {
  if (!(key in map) && recency.length === cap) {
    const lru = recency.pop();   // least recently used = the BACK
    delete map[lru];             // evict it
  }
  map[key] = value;
  touch(key);                    // key jumps to the MRU front
}
function get(key) {
  if (!(key in map)) return -1;
  touch(key);                    // reads refresh recency too
  return map[key];
}`,
  codeJava: `// LRU cache (capacity 2): recency list MRU→LRU + key→value map
void put(int key, int value) {
  if (!map.containsKey(key) && recency.size() == cap) {
    int lru = recency.removeLast();  // least recently used = the BACK
    map.remove(lru);                 // evict it
  }
  map.put(key, value);
  touch(key);                        // key jumps to the MRU front
}
int get(int key) {
  if (!map.containsKey(key)) return -1;
  touch(key);                        // reads refresh recency too
  return map.get(key);
}`,
  inputs: [{ kind: "numbers", name: "values", label: "values (key k stores values[k-1])", default: [10, 20, 30, 40], maxLen: 5 }],
  entry: () => `LRUCache(cap = ${CAP})`,
  run({ fn, line, ptr, mark, vars, heap, narrate, memo }, args) {
    const values = args.values as number[]
    const recency: number[] = []
    const evicted: number[] = []
    const has = (k: number): boolean => {
      const v = memo[String(k)]
      return v !== undefined && v !== "—"
    }
    const paint = () => {
      mark("good", recency.map((k) => k - 1))
      mark("done", [...evicted])
    }
    const touch = (k: number) => {
      const p = recency.indexOf(k)
      if (p >= 0) recency.splice(p, 1)
      recency.unshift(k)
      heap("recency", recency)
    }
    const put = fn(
      "put",
      (key: number, value: number): string => {
        ptr("i", key - 1)
        mark("focus", [key - 1])
        vars({ key, value })
        line(2, `put(${key}, ${value}): ${has(key) ? `key ${key} is already cached — just overwrite, no eviction.` : recency.length === CAP ? `key ${key} is new and the cache is <b>full</b> (${recency.join(", ")}) → someone must leave.` : `key ${key} is new; there's room (${recency.length}/${CAP}).`}`)
        if (!has(key) && recency.length === CAP) {
          const lru = recency.pop() as number
          heap("recency", recency)
          line(3, `The victim is at the <b>back</b> of the recency list: key ${lru} — nobody has touched it for the longest time.`)
          memo[String(lru)] = "—"
          evicted.push(lru - 1)
          line(4, `<b>Evict key ${lru}</b> — its map entry is gone (shown as "—").`)
        }
        memo[String(key)] = value
        line(6, `map[${key}] = ${value}.`)
        touch(key)
        line(7, `Touch key ${key} → recency (MRU→LRU): [${recency.join(", ")}].`)
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
        const present = has(key)
        line(10, `get(${key}): ${present ? `key ${key} is in the map ✓` : `key ${key} is <b>not in the map</b> (evicted or never added) → return -1.`}`)
        if (!present) {
          paint()
          return -1
        }
        const v = memo[String(key)] as number
        touch(key)
        line(11, `A read counts as a use! Key ${key} jumps to the MRU front: [${recency.join(", ")}].`)
        paint()
        line(12, `Return ${v}.`)
        return v
      },
      9,
    )
    const results: number[] = []
    const lruDemo = fn("LRUCache", (): string => {
      narrate(`Two structures, one idea: the map answers "what's the value?", the recency list answers "who leaves next?" — always the back.`)
      heap("recency", recency)
      const n = values.length
      if (n >= 1) put(1, values[0])
      if (n >= 2) {
        put(2, values[1])
        results.push(get(1))
      }
      if (n >= 3) {
        narrate(`Cache is full — this put must evict. Key 2 is the LRU because get(1) refreshed key 1.`)
        put(3, values[2])
        results.push(get(2))
        results.push(get(3))
      }
      if (n >= 4) {
        put(4, values[3])
        results.push(get(1))
        results.push(get(4))
      }
      if (n >= 5) {
        put(5, values[4])
        results.push(get(5))
      }
      mark("focus", [])
      ptr("i", -1)
      return "done"
    })
    lruDemo()
    return `get results: [${results.join(", ")}]`
  },
}
