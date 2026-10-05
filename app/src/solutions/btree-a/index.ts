import type { Problem } from "@/engine/types"
import { inorderTraversal } from "./inorder-traversal"
import { preorderTraversal } from "./preorder-traversal"
import { postorderTraversal } from "./postorder-traversal"
import { morrisInorderTraversal } from "./morris-inorder-traversal"
import { leftViewOfBinaryTree } from "./left-view-of-binary-tree"
import { bottomViewOfBinaryTree } from "./bottom-view-of-binary-tree"
import { topViewOfBinaryTree } from "./top-view-of-binary-tree"
import { levelOrderTraversal } from "./level-order-traversal"
import { maximumDepthHeight } from "./maximum-depth-height"
import { diameterOfBinaryTree } from "./diameter-of-binary-tree"
import { balancedBinaryTree } from "./balanced-binary-tree"

const BT = "Binary Tree"
const bt = (
  slug: string,
  title: string,
  pattern: Problem["pattern"],
  difficulty: Problem["difficulty"],
  lc: string,
  summary: string,
  solution: Problem["solution"],
): Problem => ({
  slug,
  title,
  neetcodeCategory: BT,
  pattern,
  difficulty,
  leetcodeUrl: lc.startsWith("http") ? lc : `https://leetcode.com/problems/${lc}/`,
  summary,
  solution,
})

export const BTREE_A_PROBLEMS: Problem[] = [
  bt(
    "inorder-traversal",
    "Inorder Traversal",
    "recursion",
    "Easy",
    "binary-tree-inorder-traversal",
    "Left, myself, then right — each value appears only after its whole left side is done.",
    inorderTraversal,
  ),
  bt(
    "preorder-traversal",
    "Preorder Traversal",
    "recursion",
    "Easy",
    "binary-tree-preorder-traversal",
    "Myself before my children — the tree read top-down, ready to be copied.",
    preorderTraversal,
  ),
  bt(
    "postorder-traversal",
    "Postorder Traversal",
    "recursion",
    "Easy",
    "binary-tree-postorder-traversal",
    "Children before parent — the root always comes out last.",
    postorderTraversal,
  ),
  bt(
    "morris-inorder-traversal",
    "Morris Inorder Traversal",
    "recursion",
    "Medium",
    "https://www.google.com/search?q=Morris+Inorder+Traversal+striver",
    "Inorder with O(1) space — thread the predecessor back to me, walk, then unthread.",
    morrisInorderTraversal,
  ),
  bt(
    "left-view-of-binary-tree",
    "Left View of Binary Tree",
    "recursion",
    "Easy",
    "https://www.google.com/search?q=Left+View+of+Binary+Tree+striver",
    "Go left first — the first node to reach each level IS the left view.",
    leftViewOfBinaryTree,
  ),
  bt(
    "bottom-view-of-binary-tree",
    "Bottom View of Binary Tree",
    "dp",
    "Medium",
    "https://www.google.com/search?q=Bottom+View+of+Binary+Tree+striver",
    "One map slot per column; deeper writes overwrite — what survives is what you see from below.",
    bottomViewOfBinaryTree,
  ),
  bt(
    "top-view-of-binary-tree",
    "Top View of Binary Tree",
    "dp",
    "Medium",
    "https://www.google.com/search?q=Top+View+of+Binary+Tree+striver",
    "Same columns, opposite rule — only the first (topmost) claim per column counts.",
    topViewOfBinaryTree,
  ),
  bt(
    "level-order-traversal",
    "Level Order Traversal",
    "recursion",
    "Medium",
    "binary-tree-level-order-traversal",
    "A queue that holds exactly one ring of the tree at a time — drain it, refill with the next.",
    levelOrderTraversal,
  ),
  bt(
    "maximum-depth-height",
    "Maximum Depth (Height)",
    "recursion",
    "Easy",
    "maximum-depth-of-binary-tree",
    "1 + max(left, right) — the recursion tree IS the tree, so the answer is its own height.",
    maximumDepthHeight,
  ),
  bt(
    "diameter-of-binary-tree",
    "Diameter of Binary Tree",
    "recursion",
    "Easy",
    "diameter-of-binary-tree",
    "At every node ask: how long is the longest path bending through me? lh + rh answers it.",
    diameterOfBinaryTree,
  ),
  bt(
    "balanced-binary-tree",
    "Balanced Binary Tree",
    "recursion",
    "Easy",
    "balanced-binary-tree",
    "Heights bubble up; the -1 sentinel is an alarm that short-circuits everything above it.",
    balancedBinaryTree,
  ),
]
