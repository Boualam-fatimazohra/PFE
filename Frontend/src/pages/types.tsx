
// types.ts
export type FormationStatus = "En Cours" | "Avenir" | "Terminé" | "Replanifier";

export interface FormationItem {
    _id?: string; 
    id?: string;
    title?: string; 
    nom?: string;
    description?: string | null;
    status: FormationStatus; 
    image?: string;
    dateDebut: string;
    dateFin: string;
}
export interface Participant {
  _id: any;
  nom: any;
  prenom: any;
  date: string;
  time: string;
  lastName: string;
  firstName: string;
  email: string;
  gender: string;
  situationProfessionnel : string;
  status: "present" | "absent";
}

export interface Document {
  title: string;
  date: string;
}

export interface StatMetric {
  label: string;
  value: string | number | null;
}