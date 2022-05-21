import { Hobby } from "src/app/shared/models/hobby.model";
import { Recommendation } from "src/app/shared/models/recommendation.model";
import { SpecialtyRecommendation } from "src/app/shared/models/specialty-recommendation.model";
import { Specialty } from "src/app/shared/models/specialty.model";

export interface User {
  id: string;
  name: string;
  age?: string;
  aboutMe?: string;
  gender?: string;
  email?:string;
  phone?: string;
  avatar?: string;
  documents?: File[];
  favoriteSpecialties?: Specialty[];
  hobbies?: Hobby[];
  recommendations?: Recommendation[];
}
