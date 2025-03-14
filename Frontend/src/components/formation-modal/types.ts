// src/components/formation-modal/types.ts
import { RefObject } from 'react';

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