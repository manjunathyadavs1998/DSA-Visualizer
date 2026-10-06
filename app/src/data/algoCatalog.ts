import type { Problem as AlgoProblem } from '@/engine/types';
// ---- root-level singles ----
import { fibonacci } from '@/solutions/fibonacci';
import { climbingStairs } from '@/solutions/climbing-stairs';
import { minCostClimbingStairs } from '@/solutions/min-cost-climbing-stairs';
import { houseRobber } from '@/solutions/house-robber';
import { coinChange } from '@/solutions/coin-change';
import { uniquePaths } from '@/solutions/unique-paths';
import { longestCommonSubsequence } from '@/solutions/longest-common-subsequence';
import { subsets } from '@/solutions/subsets';
import { combinationSum } from '@/solutions/combination-sum';
import { permutations } from '@/solutions/permutations';
import { subsetSums } from '@/solutions/subset-sums';
import { subsetsII } from '@/solutions/subsets-ii';
import { combinationSumII } from '@/solutions/combination-sum-ii';
import { palindromePartitioning } from '@/solutions/palindrome-partitioning';
import { permutationSequence } from '@/solutions/permutation-sequence';
import { nQueens } from '@/solutions/n-queens';
import { sudoku } from '@/solutions/sudoku';
import { ratInMaze } from '@/solutions/rat-in-maze';
import { mColoring } from '@/solutions/m-coloring';
import { wordBreak } from '@/solutions/word-break';
import { binarySearch } from '@/solutions/binary-search';
import { twoSumSorted } from '@/solutions/two-sum-sorted';
import { maxSubarray } from '@/solutions/max-subarray';
import { sortColors } from '@/solutions/sort-colors';
import { validPalindrome } from '@/solutions/valid-palindrome';
import { longestSubstring } from '@/solutions/longest-substring';
// ---- topic batches ----
import { ARRAYS_A_PROBLEMS } from '@/solutions/arrays-a';
import { ARRAYS_B_PROBLEMS } from '@/solutions/arrays-b';
import { LINKED_LIST_PROBLEMS } from '@/solutions/linked-list';
import { GREEDY_PROBLEMS } from '@/solutions/greedy';
import { BINARY_SEARCH_PROBLEMS } from '@/solutions/binary-search2';
import { HEAPS_PROBLEMS } from '@/solutions/heaps';
import { STACK_QUEUE_PROBLEMS } from '@/solutions/stack-queue';
import { STRINGS_PROBLEMS } from '@/solutions/strings2';
import { BTREE_A_PROBLEMS } from '@/solutions/btree-a';
import { BTREE_B_PROBLEMS } from '@/solutions/btree-b';
import { BST_PROBLEMS } from '@/solutions/bst';
import { GRAPHS_PROBLEMS } from '@/solutions/graphs';
import { DP_PROBLEMS } from '@/solutions/dp2';
import { TRIE_PROBLEMS } from '@/solutions/trie';
import { SLIDING_WINDOW_PROBLEMS } from '@/solutions/sliding-window';
// ---- FAANG expansion batches (parallel-authored) ----
import { TWO_POINTERS_PROBLEMS } from '@/solutions/two-pointers';
import { SLIDING_WINDOW_2_PROBLEMS } from '@/solutions/sliding-window-2';
import { HEAPS_2_PROBLEMS } from '@/solutions/heap-2';
import { GREEDY_2_PROBLEMS } from '@/solutions/greedy-2';
import { DP_1D_PROBLEMS } from '@/solutions/dp-1d';
import { DP_2D_PROBLEMS } from '@/solutions/dp-2d';
import { BINARY_SEARCH_3_PROBLEMS } from '@/solutions/binary-search-3';
import { STACK_QUEUE_2_PROBLEMS } from '@/solutions/stack-queue-2';
import { STRINGS_3_PROBLEMS } from '@/solutions/strings-3';
import { ARRAYS_C_PROBLEMS } from '@/solutions/arrays-c';
import { GRAPHS_2_PROBLEMS } from '@/solutions/graphs-2';
import { LINKED_LIST_2_PROBLEMS } from '@/solutions/linked-list-2';
import { TREES_2_PROBLEMS } from '@/solutions/trees-2';
import { BACKTRACKING_2_PROBLEMS } from '@/solutions/backtracking-2';
import { BIT_PROBLEMS } from '@/solutions/bit-manipulation';
import { MATH_PROBLEMS } from '@/solutions/math-1';
import { UNION_FIND_PROBLEMS } from '@/solutions/union-find';
import { MONOTONIC_STACK_PROBLEMS } from '@/solutions/monotonic-stack';
import { INTERVALS_PROBLEMS } from '@/solutions/intervals';
import { GRAPHS_3_PROBLEMS } from '@/solutions/graphs-3';
import { DP_ADVANCED_PROBLEMS } from '@/solutions/dp-advanced';
// ---- grid / matrix singles ----
import { rowTraversal } from '@/solutions/grid/row-traversal';
import { colTraversal } from '@/solutions/grid/col-traversal';
import { boundaryTraversal } from '@/solutions/grid/boundary-traversal';
import { diagonalTraverse } from '@/solutions/grid/diagonal-traverse';
import { spiralMatrix } from '@/solutions/grid/spiral-matrix';
import { transposeMatrix } from '@/solutions/grid/transpose-matrix';
import { rotateImage } from '@/solutions/grid/rotate-image';
import { toeplitzMatrix } from '@/solutions/grid/toeplitz-matrix';
import { luckyNumbers } from '@/solutions/grid/lucky-numbers';
import { setMatrixZeroes } from '@/solutions/grid/set-matrix-zeroes';
import { gameOfLife } from '@/solutions/grid/game-of-life';
import { search2dMatrix } from '@/solutions/grid/search-2d-matrix';
import { search2dMatrixII } from '@/solutions/grid/search-2d-matrix-ii';
import { islandPerimeter } from '@/solutions/grid/island-perimeter';
import { floodFill } from '@/solutions/grid/flood-fill';
import { numberOfIslands } from '@/solutions/grid/number-of-islands';
import { maxAreaIsland } from '@/solutions/grid/max-area-island';
import { wordSearch } from '@/solutions/grid/word-search';
import { rottingOranges } from '@/solutions/grid/rotting-oranges';
import { minPathSum } from '@/solutions/grid/min-path-sum';
import { shortestPathBinaryMatrix } from '@/solutions/grid/shortest-path-binary-matrix';
import { zigzagConversion } from '@/solutions/grid/zigzag-conversion';

type Diff = AlgoProblem['difficulty'];

const mk = (
  topic: string,
  pattern: AlgoProblem['pattern'],
  slug: string,
  title: string,
  difficulty: Diff,
  lc: string,
  summary: string,
  solution: AlgoProblem['solution'],
): AlgoProblem => ({
  slug,
  title,
  neetcodeCategory: topic,
  pattern,
  difficulty,
  leetcodeUrl: lc.startsWith('http') ? lc : `https://leetcode.com/problems/${lc}/`,
  summary,
  solution,
});

/** Re-home a batch under one of the roadmap pattern topics. */
const retopic = (list: AlgoProblem[], topic: string): AlgoProblem[] =>
  list.map((p) => ({ ...p, neetcodeCategory: topic }));

/* Parallel authoring produced a few cross-batch twins. True algorithm
   duplicates are dropped (the canonical pattern keeps its copy); twins that
   teach a genuinely different approach are renamed and kept. */
const dropIn = (list: AlgoProblem[], ...slugs: string[]): AlgoProblem[] =>
  list.filter((p) => !slugs.includes(p.slug));
const renameIn = (list: AlgoProblem[], slug: string, newSlug: string, suffix: string): AlgoProblem[] =>
  list.map((p) => (p.slug === slug ? { ...p, slug: newSlug, title: `${p.title} ${suffix}` } : p));

/** Per-slug pattern corrections (problems whose batch topic isn't their pattern). */
const TOPIC_OVERRIDE: Record<string, string> = {
  'count-distinct-elements-in-window': 'Sliding Window',
  'sliding-window-maximum': 'Sliding Window', // lives in stack-queue batch (monotonic deque)
  'merge-sorted-array-in-place': 'Two Pointers',
};

const WARM = 'Warmup';
const ARR = 'Arrays & Hashing';
const TP = 'Two Pointers';
const SW = 'Sliding Window';
const BSR = 'Binary Search';
const RB = 'Recursion & Backtracking';
const DP1 = '1-D DP';
const DP2 = '2-D DP';

/** Canonical time/space complexity per slug (memoized variants where the
 *  solution uses a memo). Shown in the Run · Live Metrics panel. */
const COMPLEXITY: Record<string, [time: string, space: string]> = {
  fibonacci: ['O(2ⁿ)', 'O(n)'],
  'subset-sums': ['O(2ⁿ)', 'O(n)'],
  'subsets-ii': ['O(2ⁿ·n)', 'O(n)'],
  'combination-sum-ii': ['O(2ⁿ·n)', 'O(n)'],
  'palindrome-partitioning': ['O(2ⁿ·n)', 'O(n)'],
  'permutation-sequence': ['O(n²)', 'O(n)'],
  'n-queens': ['O(n!)', 'O(n²)'],
  sudoku: ['O(4ᵐ)', 'O(m)'],
  'rat-in-maze': ['O(4^(n²))', 'O(n²)'],
  'm-coloring': ['O(mᵛ)', 'O(V)'],
  'word-break': ['O(n²·m)', 'O(n)'],
  subsets: ['O(2ⁿ·n)', 'O(n)'],
  'combination-sum': ['O(2ᵗ)', 'O(t)'],
  permutations: ['O(n·n!)', 'O(n)'],
  'climbing-stairs': ['O(n)', 'O(n)'],
  'min-cost-climbing-stairs': ['O(n)', 'O(n)'],
  'house-robber': ['O(n)', 'O(n)'],
  'coin-change': ['O(a·c)', 'O(a)'],
  'unique-paths': ['O(m·n)', 'O(m·n)'],
  'longest-common-subsequence': ['O(m·n)', 'O(m·n)'],
  'maximum-product-subarray': ['O(n)', 'O(1)'],
  'longest-increasing-subsequence': ['O(n²)', 'O(n)'],
  '0-1-knapsack': ['O(n·W)', 'O(n·W)'],
  'edit-distance': ['O(m·n)', 'O(m·n)'],
  'maximum-sum-increasing-subsequence': ['O(n²)', 'O(n)'],
  'matrix-chain-multiplication': ['O(n³)', 'O(n²)'],
  'partition-equal-subset-sum': ['O(n·s)', 'O(n·s)'],
  'rod-cutting': ['O(n²)', 'O(n)'],
  'egg-dropping-puzzle': ['O(e·f²)', 'O(e·f)'],
  'palindrome-partitioning-ii': ['O(n²)', 'O(n²)'],
  'maximum-profit-in-job-scheduling': ['O(n log n)', 'O(n)'],
  'binary-search': ['O(log n)', 'O(log n)'],
  'two-sum-sorted': ['O(n)', 'O(1)'],
  'max-subarray': ['O(n)', 'O(1)'],
  'sort-colors': ['O(n)', 'O(1)'],
  'valid-palindrome': ['O(n)', 'O(1)'],
  'longest-substring': ['O(n)', 'O(k)'],
  'max-sum-subarray-size-k': ['O(n)', 'O(1)'],
  'minimum-size-subarray-sum': ['O(n)', 'O(1)'],
  'longest-repeating-character-replacement': ['O(n)', 'O(26)'],
  'permutation-in-string': ['O(n·26)', 'O(26)'],
  'max-consecutive-ones-iii': ['O(n)', 'O(1)'],
  'sliding-window-maximum': ['O(n)', 'O(k)'],
};

/** The full catalog, ordered as a FAANG interview-prep roadmap. */
const RAW_PROBLEMS: AlgoProblem[] = [
  // ---- Warmup ----
  mk(WARM, 'recursion', 'fibonacci', 'Fibonacci Number', 'Easy', 'fibonacci-number',
    'The hello-world of recursion — and the clearest picture of why plain recursion explodes.', fibonacci),

  // ---- Arrays & Hashing ----
  ...retopic(ARRAYS_A_PROBLEMS, ARR),
  ...retopic(ARRAYS_B_PROBLEMS, ARR),
  mk(ARR, 'recursion', 'max-subarray', 'Maximum Subarray (Kadane)', 'Medium', 'maximum-subarray',
    'Extend the run or start fresh — the running window and best window, live.', maxSubarray),
  ...ARRAYS_C_PROBLEMS,

  // ---- Two Pointers ----
  // find-the-duplicate-number already exists in Arrays; partition-labels is canonically Greedy
  ...dropIn(TWO_POINTERS_PROBLEMS, 'find-the-duplicate-number', 'partition-labels'),
  mk(TP, 'recursion', 'two-sum-sorted', 'Two Sum II (sorted)', 'Medium', 'two-sum-ii-input-array-is-sorted',
    'Two pointers squeeze inward — sum too small moves left, too big moves right.', twoSumSorted),
  mk(TP, 'recursion', 'sort-colors', 'Sort Colors (Dutch Flag)', 'Medium', 'sort-colors',
    'Three pointers, one pass — watch 0s and 2s fly to their zones in place.', sortColors),
  mk(TP, 'recursion', 'valid-palindrome', 'Valid Palindrome', 'Easy', 'valid-palindrome',
    'Compare from both ends inward — the gentlest two-pointer problem.', validPalindrome),

  // ---- Sliding Window ----
  ...SLIDING_WINDOW_PROBLEMS,
  ...SLIDING_WINDOW_2_PROBLEMS,
  mk(SW, 'recursion', 'longest-substring', 'Longest Substring Without Repeating', 'Medium',
    'longest-substring-without-repeating-characters',
    'Sliding window + last-seen map — watch the window snap forward on repeats.', longestSubstring),

  // ---- Binary Search ----
  mk(BSR, 'recursion', 'binary-search', 'Binary Search', 'Easy', 'binary-search',
    'Halve the search space every step — watch the discarded halves gray out.', binarySearch),
  ...retopic(BINARY_SEARCH_PROBLEMS, BSR),
  ...BINARY_SEARCH_3_PROBLEMS,

  // ---- Strings ----
  ...retopic(STRINGS_PROBLEMS, 'Strings'),
  // dropped twins live in Sliding Window / Stack & Queue / Two Pointers
  ...dropIn(STRINGS_3_PROBLEMS, 'find-all-anagrams-in-a-string', 'decode-string', 'string-compression'),

  // ---- Linked List ----
  ...retopic(LINKED_LIST_PROBLEMS, 'Linked List'),
  ...renameIn(LINKED_LIST_2_PROBLEMS, 'merge-k-sorted-lists', 'merge-k-sorted-lists-divide-and-conquer', '(Divide & Conquer)'),

  // ---- Stack & Queue ----
  ...retopic(STACK_QUEUE_PROBLEMS, 'Stack & Queue'),
  ...STACK_QUEUE_2_PROBLEMS,

  // ---- Binary Trees ----
  ...retopic(BTREE_A_PROBLEMS, 'Binary Trees'),
  ...retopic(BTREE_B_PROBLEMS, 'Binary Trees'),

  // ---- BST ----
  ...retopic(BST_PROBLEMS, 'BST'),
  // carries its own per-problem Binary Trees / BST categories
  ...TREES_2_PROBLEMS,

  // ---- Heap / Priority Queue ----
  ...retopic(HEAPS_PROBLEMS, 'Heap / Priority Queue'),
  ...HEAPS_2_PROBLEMS,

  // ---- Recursion & Backtracking ----
  mk(RB, 'recursion', 'subset-sums', 'Subset Sums', 'Easy', 'https://www.google.com/search?q=subset+sums+striver',
    'Every element in or out — sums appear at the leaves.', subsetSums),
  mk(RB, 'recursion', 'subsets', 'Subsets', 'Medium', 'subsets',
    'Include or exclude each element — the perfect binary decision tree.', subsets),
  mk(RB, 'recursion', 'subsets-ii', 'Subsets II', 'Medium', 'subsets-ii',
    'Skip equal neighbors at the same level — duplicates never happen.', subsetsII),
  mk(RB, 'recursion', 'combination-sum', 'Combination Sum', 'Medium', 'combination-sum',
    'Build combinations that hit a target, reusing candidates — watch dead ends prune.', combinationSum),
  mk(RB, 'recursion', 'combination-sum-ii', 'Combination Sum II', 'Medium', 'combination-sum-ii',
    'Single-use candidates + duplicate-skip — watch both prunes fire.', combinationSumII),
  mk(RB, 'recursion', 'permutations', 'Permutations', 'Medium', 'permutations',
    'Every ordering of the array — pick an unused element per level, then backtrack.', permutations),
  mk(RB, 'recursion', 'palindrome-partitioning', 'Palindrome Partitioning', 'Medium', 'palindrome-partitioning',
    'Cut every palindromic prefix, recurse on the rest, backtrack.', palindromePartitioning),
  mk(RB, 'recursion', 'permutation-sequence', 'Permutation Sequence (k-th)', 'Hard', 'permutation-sequence',
    'No enumeration — factorial block sizes jump straight to the k-th.', permutationSequence),
  mk(RB, 'recursion', 'n-queens', 'N-Queens', 'Hard', 'n-queens',
    'Queens appear and vanish on a live board as rows backtrack.', nQueens),
  mk(RB, 'recursion', 'sudoku', 'Sudoku Solver (4×4)', 'Hard', 'sudoku-solver',
    'Fill left-to-right, erase on contradiction — the board animates below.', sudoku),
  mk(RB, 'recursion', 'rat-in-maze', 'Rat in a Maze', 'Medium', 'https://www.google.com/search?q=rat+in+a+maze+striver',
    'The rat marks its trail and un-marks dead ends, live on the grid.', ratInMaze),
  mk(RB, 'recursion', 'm-coloring', 'M-Coloring Problem', 'Medium', 'https://www.google.com/search?q=m+coloring+problem+striver',
    'Paint nodes, wash off on clashes — try m = 2 and watch it prove impossibility.', mColoring),
  mk(RB, 'recursion', 'word-break', 'Word Break', 'Medium', 'word-break',
    'Backtracking plus a memo of failing positions — tried once, never again.', wordBreak),
  ...BACKTRACKING_2_PROBLEMS,

  // ---- Union-Find ----
  ...UNION_FIND_PROBLEMS,

  // ---- Graphs ----
  ...retopic(GRAPHS_PROBLEMS, 'Graphs'),
  // content twins of existing Matrix/Grid problems (different slugs, same algorithms)
  ...dropIn(GRAPHS_2_PROBLEMS, 'shortest-path-in-binary-matrix', 'max-area-of-island'),
  ...GRAPHS_3_PROBLEMS,

  // ---- Matrix / Grid ----
  ...(
    [
      ['row-traversal', 'Row-wise Traversal (basics)', 'Easy', 'https://www.google.com/search?q=matrix+row+wise+traversal', 'i picks the row and stays; j sweeps the columns. The foundation.', rowTraversal],
      ['col-traversal', 'Column-wise Traversal (basics)', 'Easy', 'https://www.google.com/search?q=matrix+column+wise+traversal', 'Loops swapped, brackets unchanged — mat[i][j] forever.', colTraversal],
      ['boundary-traversal', 'Boundary Traversal', 'Easy', 'https://www.google.com/search?q=boundary+traversal+of+matrix', "Walk the border clockwise: each side fixes one index, moves the other.", boundaryTraversal],
      ['diagonal-traverse', 'Diagonal Traversal (i + j = d)', 'Medium', 'diagonal-traverse', 'Every anti-diagonal shares one secret: i + j is constant.', diagonalTraverse],
      ['spiral-matrix', 'Spiral Matrix', 'Medium', 'spiral-matrix', 'Four shrinking walls — top, bottom, left, right — visible as header pointers.', spiralMatrix],
      ['transpose-matrix', 'Transpose Matrix', 'Easy', 'transpose-matrix', 'Swap across the diagonal — and why j starts at i + 1.', transposeMatrix],
      ['rotate-image', 'Rotate Image', 'Medium', 'rotate-image', '90° clockwise = transpose + reverse each row, fully in place.', rotateImage],
      ['toeplitz-matrix', 'Toeplitz Matrix', 'Easy', 'toeplitz-matrix', "Compare every cell with its upper-left neighbor — that's the whole trick.", toeplitzMatrix],
      ['lucky-numbers', 'Lucky Numbers in a Matrix', 'Easy', 'lucky-numbers-in-a-matrix', 'Min of its row AND max of its column — watch the band flip from horizontal to vertical.', luckyNumbers],
      ['set-matrix-zeroes', 'Set Matrix Zeroes', 'Medium', 'set-matrix-zeroes', 'Two passes: mark doomed rows/cols first, wipe second — and why one pass fails.', setMatrixZeroes],
      ['game-of-life', 'Game of Life', 'Medium', 'game-of-life', 'Survive = 3, born = 2 — the next generation hides in bit 2 until one shift reveals it.', gameOfLife],
      ['search-2d-matrix', 'Search a 2D Matrix', 'Medium', 'search-a-2d-matrix', 'mid ÷ cols = row, mid mod cols = col — the index arithmetic, live.', search2dMatrix],
      ['search-2d-matrix-ii', 'Search a 2D Matrix II', 'Medium', 'search-a-2d-matrix-ii', 'The staircase walk from the top-right corner — one compare kills a row or column.', search2dMatrixII],
      ['island-perimeter', 'Island Perimeter', 'Easy', 'island-perimeter', '+4 per land cell, −2 per shared edge — checked up/left only.', islandPerimeter],
      ['flood-fill', 'Flood Fill', 'Easy', 'flood-fill', 'Paint-bucket DFS: recolor, then spread four ways.', floodFill],
      ['number-of-islands', 'Number of Islands', 'Medium', 'number-of-islands', "Each unvisited 1 is a new island — sink it whole so it's never recounted.", numberOfIslands],
      ['max-area-island', 'Max Area of Island', 'Medium', 'max-area-of-island', "Same sink-DFS, but the recursion returns 1 + its neighbors' areas.", maxAreaIsland],
      ['word-search', 'Word Search', 'Medium', 'word-search', 'Backtracking on the grid: claim a cell with #, release it on failure.', wordSearch],
      ['rotting-oranges', 'Rotting Oranges', 'Medium', 'rotting-oranges', 'BFS in waves — every minute is one ring. This is why BFS, not DFS.', rottingOranges],
      ['min-path-sum', 'Minimum Path Sum', 'Medium', 'minimum-path-sum', 'Grid DP in place — each cell becomes the cheapest cost to reach it.', minPathSum],
      ['shortest-path-binary-matrix', 'Shortest Path in Binary Matrix', 'Medium', 'shortest-path-in-binary-matrix', 'BFS rings labeled with distances — first arrival is provably shortest.', shortestPathBinaryMatrix],
      ['zigzag-conversion', 'Zigzag Conversion', 'Medium', 'zigzag-conversion', 'Characters march down, turn the corner, climb the diagonal — then get read row by row.', zigzagConversion],
    ] as [string, string, Diff, string, string, AlgoProblem['solution']][]
  ).map(([slug, title, difficulty, lc, summary, solution]) =>
    mk('Matrix / Grid', 'recursion', slug, title, difficulty, lc, summary, solution),
  ),

  // ---- Monotonic Stack ----
  ...MONOTONIC_STACK_PROBLEMS,

  // ---- Intervals ----
  ...INTERVALS_PROBLEMS,

  // ---- Greedy ----
  ...retopic(GREEDY_PROBLEMS, 'Greedy'),
  // boats/bag-of-tokens live in Two Pointers, remove-k-digits in Stack & Queue;
  // the heap batch owns the PQ versions of meeting-rooms-ii / task-scheduler
  ...renameIn(
    renameIn(
      dropIn(GREEDY_2_PROBLEMS, 'boats-to-save-people', 'bag-of-tokens', 'remove-k-digits'),
      'meeting-rooms-ii', 'meeting-rooms-ii-sweep-line', '(Sweep Line)',
    ),
    'task-scheduler', 'task-scheduler-greedy', '(Greedy Math)',
  ),

  // ---- Trie ----
  ...retopic(TRIE_PROBLEMS, 'Trie'),

  // ---- Bit Manipulation ----
  ...BIT_PROBLEMS,

  // ---- Math & Geometry ----
  ...MATH_PROBLEMS,

  // ---- Dynamic Programming (progression) ----
  mk(DP1, 'dp', 'climbing-stairs', 'Climbing Stairs', 'Easy', 'climbing-stairs',
    'Ways to reach step n taking 1 or 2 steps — Fibonacci in disguise, now with a memo.', climbingStairs),
  mk(DP1, 'dp', 'min-cost-climbing-stairs', 'Min Cost Climbing Stairs', 'Easy', 'min-cost-climbing-stairs',
    'Cheapest path to the top when every step has a price — min() instead of sum.', minCostClimbingStairs),
  mk(DP1, 'dp', 'house-robber', 'House Robber', 'Medium', 'house-robber',
    'Max loot without robbing adjacent houses — the classic take-it-or-leave-it decision.', houseRobber),
  mk(DP1, 'dp', 'coin-change', 'Coin Change', 'Medium', 'coin-change',
    'Fewest coins to make an amount — unbounded choices, one memo row.', coinChange),
  ...DP_1D_PROBLEMS,
  mk(DP2, 'dp', 'unique-paths', 'Unique Paths', 'Medium', 'unique-paths',
    'Count grid paths moving only right/down — the gateway 2-D DP.', uniquePaths),
  mk(DP2, 'dp', 'longest-common-subsequence', 'Longest Common Subsequence', 'Medium', 'longest-common-subsequence',
    'Two pointers into two strings, a 2-D memo — the template for edit-distance-style DP.', longestCommonSubsequence),
  // DP-table twins of the Strings expand-around-center versions — kept, renamed
  ...renameIn(
    renameIn(DP_2D_PROBLEMS, 'longest-palindromic-substring', 'longest-palindromic-substring-dp', '(DP)'),
    'palindromic-substrings', 'palindromic-substrings-dp', '(DP)',
  ),
  ...retopic(DP_PROBLEMS, 'Advanced DP'),
  ...DP_ADVANCED_PROBLEMS,
];

const seenSlugs = new Set<string>();
export const ALGO_PROBLEMS: AlgoProblem[] = RAW_PROBLEMS.flatMap((p) => {
  // safety net: first occurrence wins if any cross-batch twin slipped through
  if (seenSlugs.has(p.slug)) return [];
  seenSlugs.add(p.slug);
  const topic = TOPIC_OVERRIDE[p.slug] ?? p.neetcodeCategory;
  const c = COMPLEXITY[p.slug];
  return [{ ...p, neetcodeCategory: topic, ...(c ? { time: c[0], space: c[1] } : {}) }];
});

export const algoBySlug = (slug: string) => ALGO_PROBLEMS.find((p) => p.slug === slug);
