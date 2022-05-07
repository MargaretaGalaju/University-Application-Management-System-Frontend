export interface SpecialtyRecommendation {
  title: string;
  score: RecommendationData[];
}

export interface RecommendationData {
  hobbyTitle: string;
  score: number;
}
