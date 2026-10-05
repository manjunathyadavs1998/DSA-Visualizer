import type { SolutionDef } from "@/engine/types"

export const allocatePages: SolutionDef = {
  view: "array",
  array: (a) => a.pages as number[],
  code: `// split books (contiguous!) among m students; minimize the max load
function allocate(pages, m) {
  let lo = Math.max(...pages), hi = sum(pages);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (studentsNeeded(pages, mid) <= m) hi = mid;  // feasible → try smaller
    else lo = mid + 1;                              // infeasible → raise cap
  }
  return lo;
}
function studentsNeeded(pages, cap) {
  let students = 1, load = 0;
  for (const p of pages) {
    if (load + p > cap) { students++; load = p; }
    else load += p;
  }
  return students;
}`,
  codeJava: `// split books (contiguous!) among m students; minimize the max load
int allocate(int[] pages, int m) {
  int lo = max(pages), hi = sum(pages);
  while (lo < hi) {
    int mid = (lo + hi) / 2;
    if (studentsNeeded(pages, mid) <= m) hi = mid;  // feasible → try smaller
    else lo = mid + 1;                              // infeasible → raise cap
  }
  return lo;
}
int studentsNeeded(int[] pages, int cap) {
  int students = 1, load = 0;
  for (int p : pages) {
    if (load + p > cap) { students++; load = p; }
    else load += p;
  }
  return students;
}`,
  inputs: [
    { kind: "numbers", name: "pages", label: "pages per book", default: [12, 34, 67, 90], maxLen: 8 },
    { kind: "number", name: "m", label: "students", default: 2, min: 1, max: 8 },
  ],
  entry: (a) => `allocate(pages, m = ${a.m})`,
  run({ fn, line, ptr, mark, vars }, args) {
    const pages = args.pages as number[]
    const m = args.m as number
    const studentsNeeded = fn(
      "studentsNeeded",
      (cap: number): number => {
        let students = 1, load = 0
        const segs: number[][] = [[]]
        const paint = () => {
          mark("window", segs.filter((_, s) => s % 2 === 0).flat())
          mark("good", segs.filter((_, s) => s % 2 === 1).flat())
        }
        vars({ cap, students, load })
        line(11, `Greedy sweep: hand books to student 1 until the next book would push the pile past cap = ${cap}.`)
        for (let i = 0; i < pages.length; i++) {
          const p = pages[i]
          ptr("book", i)
          if (load + p > cap) {
            students++
            load = p
            segs.push([i]); paint()
            vars({ cap, students, load })
            line(13, `Adding book ${i} (${p} pages) would exceed ${cap} → start <b>student ${students}</b> with this book (load = ${p}).`)
          } else {
            load += p
            segs[segs.length - 1].push(i); paint()
            vars({ cap, students, load })
            line(14, `Book ${i} (${p} pages) fits: student ${students}'s load becomes <b>${load}</b> ≤ ${cap}.`)
          }
        }
        ptr("book", -1)
        line(16, `Cap ${cap} needs <b>${students}</b> student(s).`)
        return students
      },
      10,
    )
    const allocate = fn(
      "allocate",
      (): number => {
        let lo = Math.max(...pages)
        let hi = pages.reduce((s, p) => s + p, 0)
        vars({ lo, hi, m })
        line(2, `The answer (max pages one student reads) lies between the thickest book (${lo}) and all pages combined (${hi}). Binary search <b>that range</b>.`)
        while (lo < hi) {
          const mid = (lo + hi) >> 1
          mark("window", []); mark("good", [])
          vars({ lo, hi, mid, m })
          line(4, `Guess a cap of <b>${mid}</b> pages per student — is it feasible with ${m} student(s)?`)
          const used = studentsNeeded(mid)
          if (used <= m) {
            line(5, `${used} ≤ ${m} → cap ${mid} is <b>feasible</b>. Maybe an even smaller cap works: hi = ${mid}.`)
            hi = mid
          } else {
            line(6, `${used} > ${m} → cap ${mid} is <b>too tight</b>. Loosen it: lo = ${mid + 1}.`)
            lo = mid + 1
          }
          vars({ lo, hi, m })
        }
        line(8, `lo met hi at <b>${lo}</b> — the smallest feasible cap. No allocation can beat a max load of ${lo}.`)
        return lo
      },
      1,
    )
    return allocate()
  },
}
