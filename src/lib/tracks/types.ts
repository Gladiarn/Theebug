export interface Block {
  id: string;
  code: string;
}

export interface ZoneDef {
  id: string;
  answer: string;
}

export interface Level {
  id: number;
  title: string;
  filename: string;
  objective: string;
  preview: string[];
  codeLines: string[];
  zones: ZoneDef[];
  blocks: Block[];
  wormIntro: string;
  wormCorrectAll: string;
}

export interface Track {
  id: string;
  title: string;
  description: string;
  color: string;
  comingSoon?: boolean;
  levels: Level[];
}
