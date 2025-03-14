// src/components/formation-modal/styles.ts
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  .custom-calendar {
    font-family: Arial, sans-serif;
    border: 1px solid #F16E00;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    width: auto; /* Ajustement automatique */
    display: flex;
    border-radius: 5px;
    overflow: hidden;
  }
  .react-datepicker__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Alignement en haut */
    position: relative;
    padding-top: 0;
  }

  .react-datepicker__current-month {
    order: -1; /* Place le mois en premier */
    margin-top: 5px;
    font-size: 16px;
    font-weight: bold;
  }


  /* Permet d'afficher calendrier + heures côte à côte */
  .react-datepicker {
    display: flex !important;
    border: none !important;
    flex-direction: row !important;
    align-items: flex-start; /* Alignement parfait des headers */
  }

  /* Fixe une largeur correcte au calendrier pour éviter une seule ligne */
  .react-datepicker__month-container {
    width: 280px;
    border-right: 1px solid #F16E00;
  }

  /* Conteneur des heures : même hauteur que le calendrier */
  .react-datepicker__time-container {
    width: 100px;
    overflow: hidden; /* Empêche le scroll vertical */
    display: flex;
    flex-direction: column;
  }

  /* Correction du conteneur pour empêcher les heures de descendre */
  .react-datepicker__time-box {
    height: 100%; /* S'assure que les heures restent dans le même cadre */
    overflow-y: auto;
  }

  /* Alignement parfait du trait orange */
  .react-datepicker__header {
    background-color: white;
    border-bottom: 1px solid #F16E00;
    padding-top: 10px;
    height: 40px; /* Hauteur fixe pour un alignement parfait */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .react-datepicker_time-container .react-datepicker_header {
    height: 40px; /* Même hauteur que le header des dates */
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #F16E00;
    padding: 0;
  }

  .react-datepicker__current-month {
    color: black;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .react-datepicker__day-names {
    display: flex;
    justify-content: space-between;
    color: black;
    font-weight: bold;
  }

  .react-datepicker__week {
    display: flex;
    justify-content: space-between;
  }

  .react-datepicker__day {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    transition: background-color 0.2s;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected,
  .react-datepicker__day:hover {
    background-color: #F16E00 !important;
    color: white !important;
  }

  .react-datepicker__time-list {
    height: auto !important;
    max-height: 270px; /* Ajuste la hauteur des heures */
    overflow-y: auto; /* Ajoute un scroll limité si trop d'heures */
  }

  .react-datepicker__time-list-item {
    padding: 8px;
    transition: background-color 0.2s;
    text-align: center;
  }

  .react-datepicker__time-list-item:hover {
    background-color: #F16E00 !important;
    color: white !important;
  }

  .react-datepicker__time-list-item--selected {
    background-color: #F16E00 !important;
    color: white !important;
    font-weight: bold;
  }

  .react-datepicker__time-caption {
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #F16E00;
    padding: 8px 0;
  }
`;

export const inlineStyles = `
  input[type="datetime-local"]::-webkit-calendar-picker-indicator {
    filter: invert(65%) sepia(54%) saturate(2651%) hue-rotate(346deg) brightness(98%) contrast(96%);
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;
  }
  
  input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
    opacity: 0.7;
  }
`;