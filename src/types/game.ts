export type Language = "English" | "Chinese" | "Hokkien" | "Cantonese";

export type Topic = string;

export interface GameSettings {
  languages: Language[];
  topics: Topic[];
  timer: number;
}

export interface Word {
  id: number;
  topic_id: number;
  translations: Record<string, string>;
  created_at: string;
  topics: {
    id: number;
    name: string;
    created_at: string;
  };
}

export interface GameState {
  score: number;
  currentWord: Word | null;
  timeLeft: number;
  isPlaying: boolean;
}