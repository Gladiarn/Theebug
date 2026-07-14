export interface Block {
  id: string;
  code: string;
}

export interface ZoneDef {
  id: string;
  answer: string;
}

export interface LevelConcept {
  summary: string;
  details: string[];
  example?: string;
}

export type Difficulty = "easy" | "medium" | "hard";

export interface Level {
  id: number;
  title: string;
  filename: string;
  difficulty: Difficulty;
  objective: string;
  preview: string[];
  codeLines: string[];
  zones: ZoneDef[];
  blocks: Block[];
  wormIntro: string;
  wormCorrectAll: string;
  concept: LevelConcept;
}

export interface Track {
  id: string;
  title: string;
  description: string;
  color: string;
  comingSoon?: boolean;
  levels: Level[];
}
