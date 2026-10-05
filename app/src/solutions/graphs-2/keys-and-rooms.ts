import type { SolutionDef } from "@/engine/types"

// 6 rooms; ROOMS[i] = keys lying in room i.
//   room 0: keys to 1, 2   room 1: key to 3   room 2: key to 4
//   room 3: (empty)        room 4: key to 5   room 5: (empty)
// Every room is reachable from room 0 → answer true.
const ROOMS: number[][] = [
  [1, 2], // 0
  [3], // 1
  [4], // 2
  [], // 3
  [5], // 4
  [], // 5
]
const N = ROOMS.length

export const keysAndRooms: SolutionDef = {
  view: "array",
  // the array below marks each room: 1 = opened, 0 = still locked
  array: () => [1, 0, 0, 0, 0, 0],
  code: `// keys per room: 0:[1,2] 1:[3] 2:[4] 3:[] 4:[5] 5:[]
function canVisitAllRooms(rooms) {
  const stack = [0];                  // room 0 starts unlocked
  const visited = new Set([0]);
  while (stack.length > 0) {
    const room = stack.pop();         // enter the room…
    for (const key of rooms[room]) {  // …and grab every key
      if (visited.has(key)) continue; // that door is already open
      visited.add(key);
      stack.push(key);                // visit it later (DFS)
    }
  }
  return visited.size === rooms.length;
}`,
  codeJava: `// keys per room: 0:[1,2] 1:[3] 2:[4] 3:[] 4:[5] 5:[]
boolean canVisitAllRooms(List<List<Integer>> rooms) {
  Deque<Integer> stack = new ArrayDeque<>(List.of(0));
  Set<Integer> visited = new HashSet<>(Set.of(0));
  while (!stack.isEmpty()) {
    int room = stack.pop();           // enter the room…
    for (int key : rooms.get(room)) { // …and grab every key
      if (visited.contains(key)) continue; // already open
      visited.add(key);
      stack.push(key);                // visit it later (DFS)
    }
  }
  return visited.size() == rooms.size();
}`,
  inputs: [],
  entry: () => `canVisitAllRooms(rooms)  // start inside room 0`,
  run({ fn, line, vars, aset, mark, heap, narrate }) {
    const go = fn(
      "canVisitAllRooms",
      (): string => {
        const stack: number[] = [0]
        const visited = new Set<number>([0])
        heap("stack", stack)
        heap("visited", [...visited])
        line(2, `Room 0 is unlocked for free — push it. Cell 0 below is already 1 (open).`)
        while (stack.length > 0) {
          const room = stack.pop() as number
          heap("stack", stack)
          mark("focus", [room])
          vars({ room, opened: visited.size })
          line(5, `Enter room <b>${room}</b>${ROOMS[room].length ? ` — keys on the floor: {${ROOMS[room].join(", ")}}` : " — it's empty, dead end"}.`)
          for (const key of ROOMS[room]) {
            if (visited.has(key)) {
              line(7, `Key to room ${key} — but that door is <b>already open</b>, toss it.`)
              continue
            }
            visited.add(key)
            aset(key, 1)
            stack.push(key)
            heap("stack", stack)
            heap("visited", [...visited])
            line(9, `Key to room <b>${key}</b> — unlock it (cell ${key} flips to 1) and stack it for a visit.`)
          }
        }
        mark("focus", [])
        const all = visited.size === N
        if (all) {
          mark("good", Array.from({ length: N }, (_, i) => i))
          line(12, `Stack empty and <b>${visited.size}/${N}</b> rooms opened — every room reachable: <b>true</b>.`)
        } else {
          const locked = Array.from({ length: N }, (_, i) => i).filter((i) => !visited.has(i))
          mark("bad", locked)
          line(12, `Stack empty but rooms {${locked.join(",")}} never opened: <b>false</b>.`)
        }
        return String(all)
      },
      1,
    )
    narrate(`"Keys and Rooms" is plain graph reachability in disguise: rooms are nodes, keys are directed edges, and the question is whether DFS from node 0 covers everything.`)
    return go()
  },
}
