// types.ts - Create this file to centralize your types

// Common FormationStatus type to use across all components
export type FormationStatus = "En Cours" | "Avenir" | "Terminé" | "Replanifier";

// Common FormationItem interface to use across all components
export interface FormationItem {
  id: string;
  title: string;
  status: FormationStatus;
  image: string;
}

// Participant interface for reuse
export interface Participant {
  date: string;
  time: string;
  lastName: string;
  firstName: string;
  email: string;
  gender: string;
  phone: string;
  status: "present" | "absent";
}

// Document interface for reuse
export interface Document {
  title: string;
  date: string;
}

// Stat metric interface for reuse
export interface StatMetric {
  label: string;
  value: string | number | null;
}