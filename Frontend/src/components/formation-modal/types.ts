export interface Formation {
  _id?: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  description?: string;
  lienInscription: string;
  status?: string;
  tags: string; // Decide whether this is required or optional
  categorie?: string;
  niveau?: string;
  image?: File | string;
  isDraft?: boolean;
  currentStep?: number;
  createdAt?: string;
}
export interface FormationResponse {
  message: string;
  data: Formation;
}
export interface Beneficiaire {
  _id?: string;
  nom: string;
  prenom: string;
  email: string;
  genre: string;
  pays: string;
  specialite: string;
  etablissement: string;
  profession: string;
  isBlack: boolean;
  isSaturate: boolean;
  dateNaissance?: string;
  telephone?: number;
  niveau?: string;
  situationProfessionnel?: string;
  nationalite?: string;
  region?: string;
  categorieAge?: string;
}
export interface BeneficiaireInscription {
  _id: string;
  confirmationAppel: boolean;
  confirmationEmail: boolean;
  formation: string;
  beneficiaire: Beneficiaire;
}
// export interface Beneficiaire {
//   _id?: string;
//   nom: string;
//   prenom: string;
//   email: string;
//   genre: string;
//   pays: string;
//   specialite: string;
//   etablissement: string;
//   profession: string;
//   isBlack: boolean;
//   isSaturate: boolean;
// }

export interface Step {
  number: string;
  label: string;
  active: boolean;
  completed: boolean;
}

export interface Participant {
  date: string;
  nom: string;
  prenom: string;
  email: string;
  genre: string;
  telephone: string;
  confTel: string;
  confEmail: string;
}

export interface FormState {
  title: string;
  description: string;
  status: "En Cours" | "Terminé" | "Avenir" | "Replanifier";
  category: string;
  level: string;
  imageFormation: File | null;
  registrationLink: string;
  dateDebut: string;
  dateFin: string;
  tags: string;
}

export interface ProcessingResults {
  totalBeneficiaries?: number;
  eligiblePhoneNumbers?: number;
  totalContacts?: number;
}

export interface UploadedFile {
  name: string;
  data: string;
  fullLength?: number;
  type: 'image' | 'participant-list';
  status?: 'pending' | 'uploading' | 'uploaded' | 'error';
  uploadId?: string;
  url?: string;
  uploadDate?: string;
  processed?: boolean; // New property with default value
}
export interface Message {
  sender: 'user' | 'bot';
  text: string;
  id?: number;
}

export interface FormOption {
  label: string;
  value: string;
}

// In types.ts or a similar file
export interface FormationDraftData {
  nom: string;
  description: string;
  status: string;
  categorie: string;
  niveau: string;
  image?: File | null;
  lienInscription: string;
  dateDebut: string;
  dateFin: string;
  tags: string;
  currentStep?: number;
  id?: string; 
}

export interface FormationDraftResponse {
  _id: string;
  nom: string;
  description: string;
  status: string;
  categorie: string;
  niveau: string;
  image: string;
  lienInscription: string;
  dateDebut: string;
  dateFin: string;
  tags: string;
  currentStep: number;
  // Add any other fields returned by the API
}