import type { Problem as ClassicProblem } from '@/types/trace';
import type { Problem as AlgoProblem } from '@/engine/types';
import { PROBLEMS as CLASSICS } from '@/lib/problems';
import { ALGO_PROBLEMS } from './algoCatalog';

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | '—';

export interface CatalogItem {
  id: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  kind: 'classic' | 'algo';
  classic?: ClassicProblem;
  algo?: AlgoProblem;
}

export const CATALOG: CatalogItem[] = [
  ...CLASSICS.map(
    (p): CatalogItem => ({
      id: `classic:${p.id}`,
      title: p.title,
      topic: 'Classics',
      difficulty: '—',
      kind: 'classic',
      classic: p,
    }),
  ),
  ...ALGO_PROBLEMS.map(
    (p): CatalogItem => ({
      id: `algo:${p.slug}`,
      title: p.title,
      topic: p.neetcodeCategory,
      difficulty: p.difficulty,
      kind: 'algo',
      algo: p,
    }),
  ),
];

/** Sidebar topic order — follows the FAANG interview-prep roadmap:
 *  linear structures → search → hierarchical → graphs → paradigms. */
const TOPIC_ORDER = [
  'Classics',
  'Warmup',
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Strings',
  'Linked List',
  'Stack & Queue',
  'Monotonic Stack',
  'Binary Trees',
  'BST',
  'Heap / Priority Queue',
  'Recursion & Backtracking',
  'Union-Find',
  'Graphs',
  'Matrix / Grid',
  'Intervals',
  'Greedy',
  'Trie',
  'Bit Manipulation',
  'Math & Geometry',
  '1-D DP',
  '2-D DP',
  'Advanced DP',
];

export const TOPICS: string[] = [
  ...TOPIC_ORDER.filter((t) => CATALOG.some((c) => c.topic === t)),
  // safety net: any topic not in the explicit order still shows (at the end)
  ...[...new Set(CATALOG.map((c) => c.topic))].filter((t) => !TOPIC_ORDER.includes(t)),
];

export const byId = (id: string) => CATALOG.find((c) => c.id === id);
