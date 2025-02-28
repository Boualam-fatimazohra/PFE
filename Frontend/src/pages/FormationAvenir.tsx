import * as React from "react";
import oupsImage from '../assets/images/oups.png';

import { StatsCard } from "@/components/dashboardElement/StatsCard";
interface FormationAvenirProps {
  onRetourClick: () => void;
}
export const FormationAvenir:React.FC<FormationAvenirProps> = ({ onRetourClick }) => {
  return (
    <div className="bg-white min-h-screen p-4 font-inter">
      {/* Header with Back and Refresh */}
      <div className="flex justify-between items-center mb-4">
      <button 
            className="flex items-center gap-1 text-xl font-medium text-orange-600 hover:text-orange-800 transition"
            onClick={onRetourClick}
          > 
            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.6665 4.65625L5.21143 10L10.6665 15.3437L12.2251 13.8177L8.32784 10L12.2251 6.1838L10.6665 4.65625Z" fill="#F16E00"/>
            </svg>
            <span className="text-lg font-bold text-[#000000] "> Retour</span> 
          </button>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">
            Données actualisées le 20/10/2025 à 8H02
          </span>
          <button className="flex items-center gap-1 text-black font-medium text-sm ml-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
            </svg>
            Actualiser
          </button>
        </div>
      </div>

      {/* Formation Header - Background Gray */}
      <div className="bg-gray-100 py-3 px-4 mb-4 relative font-inter">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-orange-500" />
        <div className="ml-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold">Formation</h1>
            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
              A venir
            </span>
          </div>
          <h2 className="text-gray-700 text-lg">
            AWS : Développement, déploiement et gestion
          </h2>
        </div>
      </div>

      {/* Stats Grid - With Border */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard title="Total Bénéficiaires" value="-" />
                <StatsCard title="Total Formations" value="-" />
                <StatsCard title="Prochain événement" value="-" />
                <StatsCard title="Satisfaction moyenne" value="-" />
        </div>

      {/* No Data Message with Illustration */}
      <div className="my-8 p-12 flex flex-col items-center justify-center font-inter">
        <div className="mb-6 text-center">
          <img src={oupsImage} alt="Oops" width="300" height="300" />
        </div>
        <p className="mb-6 text-center text-gray-700 text-lg">
          Vous n'avez aucune base de données pour cette formation
        </p>
      </div>
    </div>
  );
};
