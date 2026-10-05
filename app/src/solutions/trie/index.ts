import type { Problem } from "@/engine/types"
import { implementTrie } from "@/solutions/trie/implement-trie"
import { implementTrieII } from "@/solutions/trie/implement-trie-ii-count-words"
import { longestWordAllPrefixes } from "@/solutions/trie/longest-word-with-all-prefixes"
import { distinctSubstrings } from "@/solutions/trie/number-of-distinct-substrings"
import { maximumXor } from "@/solutions/trie/maximum-xor-of-two-numbers"
import { maximumXorWithElement } from "@/solutions/trie/maximum-xor-with-an-element"

export const TRIE_PROBLEMS: Problem[] = [
  {
    slug: "implement-trie",
    title: "Implement Trie",
    neetcodeCategory: "Trie",
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/",
    summary: "Words become root-to-node paths — shared prefixes are walked, never rebuilt.",
    solution: implementTrie,
  },
  {
    slug: "implement-trie-ii-count-words",
    title: "Implement Trie II (count words)",
    neetcodeCategory: "Trie",
    pattern: "dp",
    difficulty: "Medium",
    leetcodeUrl: "https://www.google.com/search?q=implement+trie+ii+count+words+striver",
    summary: "A counter on every node — inserts prepay, so count queries are a single read.",
    solution: implementTrieII,
  },
  {
    slug: "longest-word-with-all-prefixes",
    title: "Longest Word With All Prefixes",
    neetcodeCategory: "Trie",
    pattern: "dp",
    difficulty: "Medium",
    leetcodeUrl: "https://www.google.com/search?q=longest+word+with+all+prefixes+striver",
    summary: "A word wins only if every prefix is a word too — one missing link breaks the chain.",
    solution: longestWordAllPrefixes,
  },
  {
    slug: "number-of-distinct-substrings",
    title: "Number of Distinct Substrings",
    neetcodeCategory: "Trie",
    pattern: "dp",
    difficulty: "Hard",
    leetcodeUrl: "https://www.google.com/search?q=number+of+distinct+substrings+striver",
    summary: "Insert every suffix — each brand-new trie node is a substring never seen before.",
    solution: distinctSubstrings,
  },
  {
    slug: "maximum-xor-of-two-numbers",
    title: "Maximum XOR of Two Numbers",
    neetcodeCategory: "Trie",
    pattern: "recursion",
    difficulty: "Medium",
    leetcodeUrl: "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
    summary: "Walk the bit trie taking the opposite bit — every disagreement doubles the XOR.",
    solution: maximumXor,
  },
  {
    slug: "maximum-xor-with-an-element",
    title: "Maximum XOR With an Element",
    neetcodeCategory: "Trie",
    pattern: "recursion",
    difficulty: "Hard",
    leetcodeUrl: "https://leetcode.com/problems/maximum-xor-with-an-element-from-array/",
    summary: "Same greedy bit walk, but only numbers the limit allows may enter the trie.",
    solution: maximumXorWithElement,
  },
]
