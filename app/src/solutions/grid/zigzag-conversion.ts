import type { Args, SolutionDef } from "@/engine/types"

function dims(s: string, numRows: number) {
  const cycleLen = 2 * numRows - 2
  const cycles = Math.ceil(s.length / cycleLen)
  return { cycleLen, cols: cycles * (numRows - 1) }
}
const parse = (a: Args) => {
  const s = (a.s as string).replace(/\s+/g, "")
  const numRows = a.numRows as number
  return { s, numRows, trivial: numRows === 1 || numRows >= s.length }
}

export const zigzagConversion: SolutionDef = {
  view: "grid",
  grid: (a) => {
    const { s, numRows, trivial } = parse(a)
    if (trivial) return [s.split("")]
    return Array.from({ length: numRows }, () => Array(dims(s, numRows).cols).fill("·"))
  },
  code: `// LeetCode 6 — write s in a zigzag, read row by row
function convert(s, numRows) {
  if (numRows === 1 || numRows >= s.length) return s;
  const cycleLen = 2 * numRows - 2;
  const cycles = Math.ceil(s.length / cycleLen);
  const cols = cycles * (numRows - 1);
  const arr = make2D(numRows, cols);    // '·' = empty
  let row = 0, col = 0, index = 0;
  while (index < s.length) {
    while (row < numRows && index < s.length) {
      arr[row][col] = s[index];         // straight DOWN
      row++; index++;
    }
    row -= 2; col++;                    // turn the corner
    while (row > 0 && index < s.length) {
      arr[row][col] = s[index];         // diagonal UP-RIGHT
      row--; col++; index++;
    }
  }
  let result = "";
  for (let i = 0; i < numRows; i++)     // read row-wise
    for (let j = 0; j < cols; j++)
      if (arr[i][j] !== "·") result += arr[i][j];
  return result;
}`,
  codeJava: `// LeetCode 6 — write s in a zigzag, read row by row
String convert(String s, int numRows) {
  if (numRows == 1 || numRows >= s.length()) return s;
  int cycleLen = 2 * numRows - 2;
  int cycles = (int) Math.ceil((double) s.length() / cycleLen);
  int cols = cycles * (numRows - 1);
  char[][] arr = new char[numRows][cols]; // '\\0' = empty
  int row = 0, col = 0, index = 0;
  while (index < s.length()) {
    while (row < numRows && index < s.length()) {
      arr[row][col] = s.charAt(index);  // straight DOWN
      row++; index++;
    }
    row -= 2; col++;                    // turn the corner
    while (row > 0 && index < s.length()) {
      arr[row][col] = s.charAt(index);  // diagonal UP-RIGHT
      row--; col++; index++;
    }
  }
  StringBuilder result = new StringBuilder();
  for (int i = 0; i < numRows; i++)     // read row-wise
    for (int j = 0; j < cols; j++)
      if (arr[i][j] != '\\0') result.append(arr[i][j]);
  return result.toString();
}`,
  inputs: [
    { kind: "string", name: "s", label: "s", default: "PAYPALISHIRING", maxLen: 16 },
    { kind: "number", name: "numRows", label: "numRows", default: 3, min: 1, max: 5 },
  ],
  entry: (a) => `convert("${(a.s as string).replace(/\s+/g, "")}", ${a.numRows})`,
  run({ fn, line, gptr, gmark, gset, vars, narrate }, args) {
    const { s, numRows, trivial } = parse(args)
    const convert = fn(
      "convert",
      (): string => {
        line(2, `Edge case: numRows = ${numRows}, length = ${s.length} → ${trivial ? "<b>zigzag is a straight line, return s unchanged</b>" : "no shortcut, simulate the zigzag"}.`)
        if (trivial) return s
        const { cycleLen, cols } = dims(s, numRows)
        vars({ cycleLen, cycles: Math.ceil(s.length / cycleLen), cols })
        line(3, `One full V-cycle = down ${numRows} + up ${numRows - 2} = <b>${cycleLen} chars</b>, and each cycle spans ${numRows - 1} columns → ${cols} columns total.`)
        const arr = Array.from({ length: numRows }, () => Array(cols).fill("·"))
        let row = 0, col = 0, index = 0
        const move = () => { gptr("row", row, -1); gptr("col", -1, col); vars({ row, col, index, next: index < s.length ? `'${s[index]}'` : "—" }) }
        move()
        while (index < s.length) {
          while (row < numRows && index < s.length) {
            arr[row][col] = s[index]
            gset(row, col, s[index]); gmark("focus", [[row, col]])
            line(10, `<b>Down phase</b>: '${s[index]}' → arr[${row}][${col}]. Column stays ${col}, row++.`)
            row++; index++
            move()
          }
          row -= 2; col++
          move()
          line(13, `Hit the bottom → <b>turn the corner</b>: back up two rows (row = ${row}) and one column right (col = ${col}).`)
          while (row > 0 && index < s.length) {
            arr[row][col] = s[index]
            gset(row, col, s[index]); gmark("focus", [[row, col]])
            line(15, `<b>Diagonal phase</b>: '${s[index]}' → arr[${row}][${col}]. Both move: row−−, col++.`)
            row--; col++; index++
            move()
          }
        }
        gptr("row", -2, 0); gptr("col", -2, 0); gmark("focus", [])
        line(19, `All ${s.length} characters placed — the zigzag shape is visible. Now harvest it <b>row by row</b>.`)
        let result = ""
        const read: [number, number][] = []
        for (let i = 0; i < numRows; i++) {
          gptr("i", i, -1)
          for (let j = 0; j < cols; j++) {
            if (arr[i][j] !== "·") {
              result += arr[i][j]
              read.push([i, j])
              gmark("good", [...read]); gmark("focus", [[i, j]])
              vars({ i, j, result })
              line(22, `Row ${i}: pick '${arr[i][j]}' at column ${j} → result = "${result}".`)
            }
          }
        }
        gmark("focus", []); gptr("i", -2, 0)
        line(23, `Done: <b>"${result}"</b> — same letters, reordered by zigzag rows.`)
        return result
      },
      1,
    )
    narrate(`Simulate the zigzag with a real ${numRows}×${trivial ? s.length : dims(s, numRows).cols} matrix, then read it row-wise — your matrix-simulation approach, visualized.`)
    return convert()
  },
}
