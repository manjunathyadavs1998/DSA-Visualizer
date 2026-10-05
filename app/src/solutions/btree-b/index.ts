import type { Problem } from "@/engine/types"
import { lowestCommonAncestor } from "@/solutions/btree-b/lowest-common-ancestor"
import { sameTree } from "@/solutions/btree-b/same-tree"
import { maximumPathSum } from "@/solutions/btree-b/maximum-path-sum"
import { constructFromPreorderInorder } from "@/solutions/btree-b/construct-from-preorder-inorder"
import { constructFromInorderPostorder } from "@/solutions/btree-b/construct-from-inorder-postorder"
import { symmetricTree } from "@/solutions/btree-b/symmetric-tree"
import { flattenBinaryTree } from "@/solutions/btree-b/flatten-binary-tree-to-linked-list"
import { invertMirrorBinaryTree } from "@/solutions/btree-b/invert-mirror-binary-tree"
import { populatingNextRightPointers } from "@/solutions/btree-b/populating-next-right-pointers"
import { serializeAndDeserializeBinaryTree } from "@/solutions/btree-b/serialize-and-deserialize-binary-tree"
import { binaryTreeToDoublyLinkedList } from "@/solutions/btree-b/binary-tree-to-doubly-linked-list"

const BT = "Binary Tree"

export const BTREE_B_PROBLEMS: Problem[] = [
  {
    slug: "lowest-common-ancestor",
    title: "Lowest Common Ancestor",
    neetcodeCategory: BT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
    summary: "Each node reports found-or-null; the first node hearing from BOTH sides is the ancestor.",
    solution: lowestCommonAncestor,
  },
  {
    slug: "same-tree",
    title: "Same Tree",
    neetcodeCategory: BT,
    pattern: "recursion",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/same-tree/",
    summary: "Walk both trees in lockstep — same shape (nulls agree) AND same values, pair by pair.",
    solution: sameTree,
  },
  {
    slug: "maximum-path-sum",
    title: "Maximum Path Sum",
    neetcodeCategory: BT,
    pattern: "recursion",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
    summary: "Each node offers one arm upward but records the bent path through itself — max(0, child) drops toxic branches.",
    solution: maximumPathSum,
  },
  {
    slug: "construct-from-preorder-inorder",
    title: "Construct from Preorder + Inorder",
    neetcodeCategory: BT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
    summary: "Preorder names the root, inorder splits left from right — recurse on the two halves.",
    solution: constructFromPreorderInorder,
  },
  {
    slug: "construct-from-inorder-postorder",
    title: "Construct from Inorder + Postorder",
    neetcodeCategory: BT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",
    summary: "Postorder read from the BACK yields root then right then left — the mirror of the preorder build.",
    solution: constructFromInorderPostorder,
  },
  {
    slug: "symmetric-tree",
    title: "Symmetric Tree",
    neetcodeCategory: BT,
    pattern: "recursion",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/symmetric-tree/",
    summary: "Fold the tree down its center: outside pairs vs outside, inside vs inside — arms crossed.",
    solution: symmetricTree,
  },
  {
    slug: "flatten-binary-tree-to-linked-list",
    title: "Flatten Binary Tree to Linked List",
    neetcodeCategory: BT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
    summary: "Reverse preorder: everything after me is already a list — just prepend myself to it.",
    solution: flattenBinaryTree,
  },
  {
    slug: "invert-mirror-binary-tree",
    title: "Invert / Mirror Binary Tree",
    neetcodeCategory: BT,
    pattern: "recursion",
    difficulty: "Easy",
    leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/",
    summary: "Swap left↔right at every node — watch the level order flip a pair at a time.",
    solution: invertMirrorBinaryTree,
  },
  {
    slug: "populating-next-right-pointers",
    title: "Populating Next Right Pointers",
    neetcodeCategory: BT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/",
    summary: "BFS holds exactly one level — whoever is dequeued after me IS my next pointer.",
    solution: populatingNextRightPointers,
  },
  {
    slug: "serialize-and-deserialize-binary-tree",
    title: "Serialize and Deserialize Binary Tree",
    neetcodeCategory: BT,
    pattern: "recursion",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
    summary: 'Preorder with "#" null markers is uniquely decodable — serialize writes the story, deserialize replays it.',
    solution: serializeAndDeserializeBinaryTree,
  },
  {
    slug: "binary-tree-to-doubly-linked-list",
    title: "Binary Tree to Doubly Linked List",
    neetcodeCategory: BT,
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://www.google.com/search?q=Binary+Tree+to+Doubly+Linked+List+striver",
    summary: "Inorder visits in sorted order — stitch each node behind the last: left becomes prev, right becomes next.",
    solution: binaryTreeToDoublyLinkedList,
  },
]
