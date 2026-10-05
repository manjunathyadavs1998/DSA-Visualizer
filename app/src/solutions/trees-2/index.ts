import type { Problem } from "@/engine/types"
import { binaryTreeRightSideView } from "./binary-tree-right-side-view"
import { zigzagLevelOrderTraversal } from "./zigzag-level-order-traversal"
import { pathSum } from "./path-sum"
import { pathSumII } from "./path-sum-ii"
import { countGoodNodesInBinaryTree } from "./count-good-nodes-in-binary-tree"
import { houseRobberIII } from "./house-robber-iii"
import { sumRootToLeafNumbers } from "./sum-root-to-leaf-numbers"
import { mergeTwoBinaryTrees } from "./merge-two-binary-trees"
import { subtreeOfAnotherTree } from "./subtree-of-another-tree"
import { cousinsInBinaryTree } from "./cousins-in-binary-tree"
import { insertIntoABst } from "./insert-into-a-bst"
import { deleteNodeInABst } from "./delete-node-in-a-bst"
import { trimABst } from "./trim-a-bst"
import { rangeSumOfBst } from "./range-sum-of-bst"
import { convertSortedArrayToBst } from "./convert-sorted-array-to-bst"
import { recoverBinarySearchTree } from "./recover-binary-search-tree"
import { uniqueBinarySearchTrees } from "./unique-binary-search-trees"
import { closestBinarySearchTreeValue } from "./closest-binary-search-tree-value"
import { minimumAbsoluteDifferenceInBst } from "./minimum-absolute-difference-in-bst"
import { increasingOrderSearchTree } from "./increasing-order-search-tree"
import { binarySearchTreeToGreaterSumTree } from "./binary-search-tree-to-greater-sum-tree"
import { findModeInBinarySearchTree } from "./find-mode-in-binary-search-tree"

const mkProblem = (topic: string) => (
  slug: string,
  title: string,
  pattern: Problem["pattern"],
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
  time: string,
  space: string,
): Problem => ({
  slug,
  title,
  neetcodeCategory: topic,
  pattern,
  difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary,
  solution,
  time,
  space,
})

const bt = mkProblem("Binary Trees")
const bst = mkProblem("BST")

export const TREES_2_PROBLEMS: Problem[] = [
  bt("binary-tree-right-side-view", "Binary Tree Right Side View", "recursion", "Medium",
    "binary-tree-right-side-view",
    "DFS right-first: the first node to reach each depth is exactly what you see from the right.",
    binaryTreeRightSideView, "O(n)", "O(h)"),
  bt("zigzag-level-order-traversal", "Zigzag Level Order Traversal", "recursion", "Medium",
    "binary-tree-zigzag-level-order-traversal",
    "Plain BFS — only the pen flips: append on even rings, prepend on odd ones.",
    zigzagLevelOrderTraversal, "O(n)", "O(n)"),
  bt("path-sum", "Path Sum", "recursion", "Easy",
    "path-sum",
    "Carry the shrinking budget down; a path exists iff some leaf spends it to exactly 0.",
    pathSum, "O(n)", "O(h)"),
  bt("path-sum-ii", "Path Sum II", "recursion", "Medium",
    "path-sum-ii",
    "Backtracking on a tree: push going down, snapshot at good leaves, pop coming back up.",
    pathSumII, "O(n²)", "O(h)"),
  bt("count-good-nodes-in-binary-tree", "Count Good Nodes in Binary Tree", "recursion", "Medium",
    "count-good-nodes-in-binary-tree",
    "The whole root path compresses into one number carried down: maxSoFar. Compare, update, recurse.",
    countGoodNodesInBinaryTree, "O(n)", "O(h)"),
  bt("house-robber-iii", "House Robber III", "recursion", "Medium",
    "house-robber-iii",
    "Each node returns a PAIR — best loot robbed vs skipped — so no state is ever recomputed.",
    houseRobberIII, "O(n)", "O(h)"),
  bt("sum-root-to-leaf-numbers", "Sum Root to Leaf Numbers", "recursion", "Medium",
    "sum-root-to-leaf-numbers",
    "Spell each path going down with prefix × 10 + digit; leaves return finished numbers.",
    sumRootToLeafNumbers, "O(n)", "O(h)"),
  bt("merge-two-binary-trees", "Merge Two Binary Trees", "recursion", "Easy",
    "merge-two-binary-trees",
    "Walk both trees in lock-step: overlaps add, and a missing side grafts the other in one move.",
    mergeTwoBinaryTrees, "O(min(n,m))", "O(min(h₁,h₂))"),
  bt("subtree-of-another-tree", "Subtree of Another Tree", "recursion", "Easy",
    "subtree-of-another-tree",
    "Slide an anchor over every node; at each one, an exact same-tree check that fails fast.",
    subtreeOfAnotherTree, "O(n·m)", "O(h)"),
  bt("cousins-in-binary-tree", "Cousins in Binary Tree", "recursion", "Easy",
    "cousins-in-binary-tree",
    "Cousins = same depth, different parents — two DFS lookups, then compare two pairs of facts.",
    cousinsInBinaryTree, "O(n)", "O(h)"),
  bst("insert-into-a-bst", "Insert into a BST", "recursion", "Medium",
    "insert-into-a-binary-search-tree",
    "Insertion is a failed search: where you fall off the tree is exactly where the new leaf goes.",
    insertIntoABst, "O(h)", "O(h)"),
  bst("delete-node-in-a-bst", "Delete Node in a BST", "recursion", "Medium",
    "delete-node-in-a-bst",
    "0–1 children: splice. 2 children: overwrite with the inorder successor, then delete THAT (easy case).",
    deleteNodeInABst, "O(h)", "O(h)"),
  bst("trim-a-bst", "Trim a BST", "recursion", "Medium",
    "trim-a-binary-search-tree",
    "One comparison discards whole subtrees: below lo kills the node AND its entire left side.",
    trimABst, "O(n)", "O(h)"),
  bst("range-sum-of-bst", "Range Sum of BST", "recursion", "Easy",
    "range-sum-of-bst",
    "Sum values in [lo, hi] with pruning: out-of-range nodes skip one whole side unvisited.",
    rangeSumOfBst, "O(n)", "O(h)"),
  bst("convert-sorted-array-to-bst", "Convert Sorted Array to BST", "recursion", "Easy",
    "convert-sorted-array-to-binary-search-tree",
    "Root every subtree at the middle of its slice — binary search frozen into a balanced tree.",
    convertSortedArrayToBst, "O(n)", "O(log n)"),
  bst("recover-binary-search-tree", "Recover Binary Search Tree", "recursion", "Medium",
    "recover-binary-search-tree",
    "Two swapped values show up as descents in the inorder stream — catch both culprits in one pass.",
    recoverBinarySearchTree, "O(n)", "O(h)"),
  bst("unique-binary-search-trees", "Unique Binary Search Trees", "dp", "Medium",
    "unique-binary-search-trees",
    "Pick each value as root: left shapes × right shapes, memoized by size — the Catalan numbers.",
    uniqueBinarySearchTrees, "O(n²)", "O(n)"),
  bst("closest-binary-search-tree-value", "Closest BST Value", "recursion", "Easy",
    "closest-binary-search-tree-value",
    "Binary search in a tree costume: record each node as a candidate, descend the only side that can improve.",
    closestBinarySearchTreeValue, "O(h)", "O(h)"),
  bst("minimum-absolute-difference-in-bst", "Minimum Absolute Difference in BST", "recursion", "Easy",
    "minimum-absolute-difference-in-bst",
    "Inorder gives the sorted stream, and the closest pair is always adjacent in it — compare only neighbors.",
    minimumAbsoluteDifferenceInBst, "O(n)", "O(h)"),
  bst("increasing-order-search-tree", "Increasing Order Search Tree", "recursion", "Easy",
    "increasing-order-search-tree",
    "Rewire the BST into a sorted right-only vine during inorder: cut left, hang on tail, become tail.",
    increasingOrderSearchTree, "O(n)", "O(h)"),
  bst("binary-search-tree-to-greater-sum-tree", "BST to Greater Sum Tree", "recursion", "Medium",
    "binary-search-tree-to-greater-sum-tree",
    "Reverse inorder visits biggest-first, so one running sum always equals 'everything ≥ me'.",
    binarySearchTreeToGreaterSumTree, "O(n)", "O(h)"),
  bst("find-mode-in-binary-search-tree", "Find Mode in BST", "recursion", "Easy",
    "find-mode-in-binary-search-tree",
    "Duplicates arrive back-to-back in the inorder stream — count runs, not a hash map.",
    findModeInBinarySearchTree, "O(n)", "O(h)"),
]
