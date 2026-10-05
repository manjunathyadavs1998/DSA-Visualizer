export type NodeStatus = 'waiting' | 'current' | 'active' | 'done';

export interface RTreeNode {
  id: string;
  parentId: string | null;
  label: string;
  status: NodeStatus;
  ret?: string;
  depth: number;
}

export interface LocalVar {
  k: string;
  v: string;
}

export interface StackFrame {
  id: string;
  name: string;
  locals: LocalVar[];
  line: number;
}

export interface BinNode {
  id: string;
  label: string;
  x: number;
  y: number;
  parentId: string | null;
}

export interface HeapEntry {
  id: string;
  label: string;
  kind: 'array' | 'towers' | 'bintree' | 'note';
  values?: (string | number)[];
  highlight?: number[];
  faded?: number[];
  pointers?: { index: number; name: string }[];
  towers?: number[][];
  pegNames?: string[];
  treeData?: { nodes: BinNode[]; current: string | null };
  note?: string;
}

export interface TraceStep {
  line: number; // -1 = no highlight
  message: string;
  stack: StackFrame[];
  tree: RTreeNode[];
  heap: HeapEntry[];
  calls: number;
  depth: number;
  maxDepth: number;
}

export interface NumberInputSpec {
  kind: 'number';
  label: string;
  min: number;
  max: number;
  def: number;
  format?: (v: number) => string;
}

export interface ArrayInputSpec {
  kind: 'array';
  label: string;
  def: number[];
  minLen: number;
  maxLen: number;
  minVal: number;
  maxVal: number;
}

export type InputSpec = NumberInputSpec | ArrayInputSpec;

export interface Problem {
  id: string;
  num: string;
  title: string;
  tag: string;
  desc: string;
  time: string;
  space: string;
  recurrence: string;
  code: string[];
  input: InputSpec | null;
  generate: (input: number | number[]) => TraceStep[];
}
