import type { Args, SolutionDef, TraceEvent, TraceResult, TracerApi } from "./types"

const MAX_CALLS = 3000
// Caps recursion depth well below the JS stack limit so a divergent solution
// (e.g. user inputs that never shrink the subproblem) raises __LIMIT__ instead
// of a RangeError that would escape mid-frame.
const MAX_DEPTH = 400

export function fmt(v: unknown): string {
  let s: string
  try {
    s = typeof v === "string" ? `"${v}"` : Array.isArray(v) ? JSON.stringify(v) : String(v)
  } catch {
    s = String(v)
  }
  return s.length > 24 ? s.slice(0, 22) + "…" : s
}

/** Run a solution once against the given inputs, recording the full event trace. */
export function trace(def: SolutionDef, args: Args): TraceResult {
  const events: TraceEvent[] = []
  let cur: number | null = null
  let nextId = 0
  let calls = 0
  let depth = 0
  let truncated = false

  const api: TracerApi = {
    fn(name, impl, sigLine) {
      return (...a) => {
        if (++calls > MAX_CALLS || depth >= MAX_DEPTH) throw new Error("__LIMIT__")
        const me = nextId++
        events.push({ t: "call", id: me, parent: cur, label: `${name}(${a.map(fmt).join(", ")})`, line: sigLine })
        const prev = cur
        cur = me
        depth++
        try {
          const v = impl(...a)
          events.push({ t: "ret", id: me, value: fmt(v) })
          return v
        } finally {
          cur = prev
          depth--
        }
      }
    },
    memo: new Proxy({} as Record<string, unknown>, {
      get(t, k) {
        if (typeof k === "string" && k in t) {
          const last = events[events.length - 1]
          if (!(last && last.t === "mget" && last.key === k && last.id === cur))
            events.push({ t: "mget", id: cur, key: k, value: t[k] })
        }
        return t[k as string]
      },
      set(t, k, v) {
        t[k as string] = v
        events.push({ t: "mset", id: cur, key: String(k), value: v })
        return true
      },
    }),
    line(n, msg) {
      events.push({ t: "line", id: cur, line: n, msg })
    },
    vars(v) {
      const out: Record<string, string> = {}
      for (const [k, val] of Object.entries(v)) out[k] = fmt(val)
      events.push({ t: "vars", id: cur, vars: out })
    },
    ptr(name, index) {
      events.push({ t: "ptr", name, index })
    },
    mark(kind, indices) {
      events.push({ t: "mark", kind, indices })
    },
    aset(index, value) {
      events.push({ t: "aset", index, value })
    },
    gptr(name, r, c) {
      events.push({ t: "gptr", name, r, c })
    },
    gmark(kind, cells) {
      events.push({ t: "gmark", kind, cells })
    },
    gset(r, c, value) {
      events.push({ t: "gset", r, c, value })
    },
    heap(name, value) {
      // deep-copy now — the solution mutates the live object in place
      let snap: unknown
      try {
        snap = JSON.parse(JSON.stringify(value))
      } catch {
        snap = fmt(value)
      }
      events.push({ t: "hset", name, value: snap })
    },
    lnode(id, val, row = 0) {
      events.push({ t: "lnode", id, val, row })
    },
    lnext(id, target, kind = "next") {
      events.push({ t: "lnext", id, target, kind })
    },
    lptr(name, id) {
      events.push({ t: "lptr", name, id })
    },
    lmark(kind, ids) {
      events.push({ t: "lmark", kind, ids })
    },
    narrate(msg) {
      events.push({ t: "narrate", msg })
    },
  }

  let result: unknown
  try {
    result = def.run(api, args)
  } catch (e) {
    if ((e as Error).message === "__LIMIT__") truncated = true
    else throw e
  }
  return { events, result, truncated }
}

/** Parse+clamp raw text field values into typed args, falling back to defaults. */
export function parseArgs(def: SolutionDef, raw: Record<string, string>): Args {
  const out: Args = {}
  for (const spec of def.inputs) {
    const text = raw[spec.name]
    if (spec.kind === "number") {
      const n = Math.round(Number(text))
      out[spec.name] = Number.isFinite(n) ? Math.max(spec.min, Math.min(spec.max, n)) : spec.default
    } else if (spec.kind === "numbers") {
      const arr = (text ?? "")
        .split(/[,\s]+/)
        .map(Number)
        .filter(Number.isFinite)
        .slice(0, spec.maxLen)
      out[spec.name] = arr.length ? arr : spec.default
    } else {
      const s = (text ?? "").trim()
      out[spec.name] = s ? s.slice(0, spec.maxLen) : spec.default
    }
  }
  return out
}

export function defaultRaw(def: SolutionDef): Record<string, string> {
  const out: Record<string, string> = {}
  for (const spec of def.inputs)
    out[spec.name] = spec.kind === "numbers" ? spec.default.join(",") : String(spec.default)
  return out
}
