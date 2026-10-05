import type { Problem } from "@/engine/types"
import { searchInABst } from "./search-in-a-bst"
import { constructBstFromPreorder } from "./construct-bst-from-preorder"
import { validateBst } from "./validate-bst"
import { lcaOfBst } from "./lca-of-bst"
import { inorderPredecessorSuccessor } from "./inorder-predecessor-successor"
import { floorAndCeilInBst } from "./floor-and-ceil-in-bst"
import { kthSmallestElementInBst } from "./kth-smallest-element-in-bst"
import { twoSumIvBst } from "./two-sum-iv-bst"
import { bstIterator } from "./bst-iterator"
import { maximumSumBst } from "./maximum-sum-bst"
import { countDistinctElementsInWindow } from "./count-distinct-elements-in-window"

const CAT = "BST"
const lc = (slug: string) => `https://leetcode.com/problems/${slug}/`

export const BST_PROBLEMS: Problem[] = [
  {
    slug: "search-in-a-bst",
    title: "Search in a BST",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Easy",
    leetcodeUrl: lc("search-in-a-binary-search-tree"),
    summary: "One comparison per level — the other half of the tree is never even called.",
    solution: searchInABst,
  },
  {
    slug: "construct-bst-from-preorder",
    title: "Construct BST from Preorder",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: lc("construct-binary-search-tree-from-preorder-traversal"),
    summary: "Each value becomes a root the moment it fits its inherited (lo, hi) window.",
    solution: constructBstFromPreorder,
  },
  {
    slug: "validate-bst",
    title: "Validate BST",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: lc("validate-binary-search-tree"),
    summary: "Every node inherits (lo, hi) bounds from ALL its ancestors — parents alone aren't enough.",
    solution: validateBst,
  },
  {
    slug: "lca-of-bst",
    title: "LCA of BST",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: lc("lowest-common-ancestor-of-a-binary-search-tree"),
    summary: "Descend while p and q sit on the same side — the first split point IS the LCA.",
    solution: lcaOfBst,
  },
  {
    slug: "inorder-predecessor-successor",
    title: "Inorder Predecessor / Successor",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://www.google.com/search?q=inorder+predecessor+and+successor+in+bst+striver",
    summary: "Every right-turn records a pred, every left-turn a succ — one walk, both neighbors.",
    solution: inorderPredecessorSuccessor,
  },
  {
    slug: "floor-and-ceil-in-bst",
    title: "Floor and Ceil in BST",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Easy",
    leetcodeUrl: "https://www.google.com/search?q=floor+and+ceil+in+bst+striver",
    summary: "One walk, two candidates: the last value ≤ x and the smallest value ≥ x pinch in on x.",
    solution: floorAndCeilInBst,
  },
  {
    slug: "kth-smallest-element-in-bst",
    title: "Kth Smallest Element in BST",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: lc("kth-smallest-element-in-a-bst"),
    summary: "Inorder emits sorted order — count down from k and freeze the traversal at 0.",
    solution: kthSmallestElementInBst,
  },
  {
    slug: "two-sum-iv-bst",
    title: "Two Sum IV (BST)",
    neetcodeCategory: CAT,
    pattern: "dp",
    difficulty: "Easy",
    leetcodeUrl: lc("two-sum-iv-input-is-a-bst"),
    summary: "Tree walk + seen-set: the cache hit on k − value IS the pair.",
    solution: twoSumIvBst,
  },
  {
    slug: "bst-iterator",
    title: "BST Iterator",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: lc("binary-search-tree-iterator"),
    summary: "A stack of unvisited ancestors: push once, pop once — next() is amortized O(1).",
    solution: bstIterator,
  },
  {
    slug: "maximum-sum-bst",
    title: "Maximum Sum BST",
    neetcodeCategory: CAT,
    pattern: "recursion",
    difficulty: "Hard",
    leetcodeUrl: lc("maximum-sum-bst-in-binary-tree"),
    summary: "Postorder reports [min, max, sum] upward — invalid subtrees poison their ancestors, not the best.",
    solution: maximumSumBst,
  },
  {
    slug: "count-distinct-elements-in-window",
    title: "Count Distinct Elements in Window",
    neetcodeCategory: CAT,
    pattern: "dp",
    difficulty: "Medium",
    leetcodeUrl: "https://www.google.com/search?q=count+distinct+elements+in+every+window+striver",
    summary: "Slide, don't recount: +1 on entry, −1 on exit — distinct moves only when a count crosses zero.",
    solution: countDistinctElementsInWindow,
  },
]
