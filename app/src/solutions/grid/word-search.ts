import type { SolutionDef } from "@/engine/types"

const B = [
  ["A", "B", "C", "E"],
  ["S", "F", "C", "S"],
  ["A", "D", "E", "E"],
]

export const wordSearch: SolutionDef = {
  view: "grid",
  grid: () => B.map((r) => [...r]),
  code: `// word editable — DFS from every cell, backtracking marks
function exist(r, c, k) {       // k = index into word
  if (k === word.length) return true;       // matched it all!
  if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
  if (board[r][c] !== word[k]) return false; // wrong letter
  const ch = board[r][c];
  board[r][c] = "#";            // claim this cell (no reuse)
  const found = exist(r+1,c,k+1) || exist(r-1,c,k+1)
             || exist(r,c+1,k+1) || exist(r,c-1,k+1);
  board[r][c] = ch;             // release it — backtrack
  return found;
}`,
  codeJava: `// String word — DFS from every cell, backtracking marks
boolean exist(int r, int c, int k) { // k = index into word
  if (k == word.length()) return true;       // matched it all!
  if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
  if (board[r][c] != word.charAt(k)) return false; // wrong char
  char ch = board[r][c];
  board[r][c] = '#';            // claim this cell (no reuse)
  boolean found = exist(r+1,c,k+1) || exist(r-1,c,k+1)
               || exist(r,c+1,k+1) || exist(r,c-1,k+1);
  board[r][c] = ch;             // release it — backtrack
  return found;
}`,
  inputs: [{ kind: "string", name: "word", label: "word", default: "ABCCED", maxLen: 8 }],
  entry: (a) => `exist from every cell  // word = "${a.word}"`,
  run({ fn, line, gmark, gset, vars }, args) {
    const word = (args.word as string).toUpperCase()
    const board = B.map((r) => [...r]) as string[][]
    const exist = fn(
      "exist",
      (r: number, c: number, k: number): boolean => {
        if (k === word.length) {
          line(2, `k = ${word.length} — every letter of "${word}" matched. <b>Found!</b>`)
          return true
        }
        if (r < 0 || c < 0 || r >= 3 || c >= 4) return false
        if (board[r][c] !== word[k]) {
          if (board[r][c] !== "#") {
            gmark("bad", [[r, c]])
            line(4, `(${r},${c}) = '${board[r][c]}' but we need '${word[k]}' → dead end.`)
          }
          return false
        }
        vars({ r, c, k, matching: `'${word[k]}'`, "so far": word.slice(0, k + 1) })
        line(6, `(${r},${c}) = '${word[k]}' matches position ${k} → <b>claim it</b> and search 4 neighbors for '${word[k + 1] ?? "∎"}'.`)
        const ch = board[r][c]
        board[r][c] = "#"
        gset(r, c, "#")
        gmark("good", [[r, c]])
        const found = exist(r + 1, c, k + 1) || exist(r - 1, c, k + 1) || exist(r, c + 1, k + 1) || exist(r, c - 1, k + 1)
        if (!found) {
          line(9, `No direction from (${r},${c}) completes the word → <b>release the cell</b> (backtrack).`)
        }
        board[r][c] = ch
        gset(r, c, ch)
        return found
      },
      1,
    )
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === word[0]) {
          line(1, `Cell (${i},${j}) = '${board[i][j]}' matches the first letter — start a DFS here.`)
          if (exist(i, j, 0)) return true
        }
      }
    return false
  },
}
