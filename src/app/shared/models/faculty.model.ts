import { Specialty } from "./specialty.model";

export interface Faculty {
  description: string;
  id: string;
  title: string;
  specialties: Specialty[];
}