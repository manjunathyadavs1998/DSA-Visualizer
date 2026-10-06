export interface TheorySection {
  title: string;
  body: string;
}

export interface TopicTheory {
  topic: string;
  icon: string;
  tagline: string;
  complexity: { time: string; space: string; note: string };
  sections: TheorySection[];
}
