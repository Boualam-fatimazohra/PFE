import * as React from "react";

export const FormationAvenir = () => {
  return (
    <div className="px-4">
      {/* Header with Back and Refresh */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm font-bold cursor-pointer">
          <span className="text-gray-600">‹ Retour</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">
            Données actualisées le 20/10/2025 à 8H02
          </span>
          <button className="bg-gray-100 text-black px-4 py-1.5 rounded-md text-sm font-medium">
            Actualiser
          </button>
        </div>
      </div>

      {/* Formation Header */}
      <div className="bg-gray-100 p-6 rounded-sm relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
        <div className="ml-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-bold">Formation</h1>
            <span className="bg-purple-100 text-purple-600 px-3 py-0.5 rounded-full text-sm">
              A venir
            </span>
          </div>
          <h2 className="text-xl text-gray-700">
            AWS : Développement, déploiement et gestion
          </h2>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {[
          'Total Bénéficiaires',
          'Total Formations',
          'Prochain événement',
          'Satisfaction moyenne'
        ].map((title) => (
          <div key={title} className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center justify-center border border-gray-200">
            <span className="text-gray-500 text-sm mb-2">{title}</span>
            <span className="text-xl font-semibold">-</span>
          </div>
        ))}
      </div>

      {/* No Data Message */}
      <div className="flex flex-col items-center justify-center mt-20">
      <div className="relative w-24 h-24 mb-6">
        {/* Cercle principal */}
        <div className="absolute w-16 h-16 bg-gray-200 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Échelle sortant du trou */}
        <div className="absolute w-4 h-12 bg-gray-300 rounded-t-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
        
        {/* Icône d'avertissement */}
        <div className="absolute w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold right-0 top-0">
          !
        </div>
      </div>
      {/* Texte principal */}
      <h3 className="text-gray-800 text-lg font-medium mb-1 text-center">
        Vous n'avez aucune base de données
      </h3>
      <p className="text-gray-600 text-center">pour cette formation</p>
    </div>

    </div>
  );
};

