export interface Recommendation {
  facultyTitle: string;
  recommendationScore: number;
  specialties: SpecialtyRecommendation[];
  opened?: boolean;
}

export interface SpecialtyRecommendation {
  title: string;
  score: number;
  hobbiesData: any[];
}
