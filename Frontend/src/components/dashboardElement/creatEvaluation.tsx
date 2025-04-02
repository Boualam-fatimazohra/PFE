import { useState } from 'react';
import { Calendar, Eye, Lock, Plus, Check, X, ChevronRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateEvaluationForm = () => {
  const navigate = useNavigate();
  
  // State pour gérer les étapes
  const [step, setStep] = useState(1);

  // State pour les données du formulaire
  const [formData, setFormData] = useState({
    title: "AWS : Développement, déploiement et gestion",
    startDate: "25 Janvier 2025",
    endDate: "29 Janvier 2025", 
    trainer: "",
    participants: "25",
    anonymousResponses: true,
    responseDeadline: false,
  });

  const [participants, setParticipants] = useState([
    {
      id: 1,
      date: '20/03/2025',
      time: '09:30',
      nom: 'Bakayoko',
      prenom: 'Mohamed',
      email: 'mohamed.bakayoko@gmail.com',
      genre: 'Homme',
      telephone: '0644343412',
      confTel: true,
      confEmail: false
    }
  ]);

  // Gérer le changement d'étape
  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire soumis', formData);
  };
  
  const handleBack = () => {
    // Redirection vers la page /formateur/dahbordevaluation
    navigate('/formateur/EvaluationDashboard');
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-white">
      {/* En-tête avec bouton Retour et titre - Ajusté pour correspondre à l'image */}
      <div className="flex flex-col pb-2 mb-4">
        <button  
          type="button" 
          className="text-black text-lg font-bold flex items-center mb-2"
          onClick={handleBack}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M10.6664 3.65625L5.21137 9L10.6664 14.3437L12.225 12.8177L8.32777 9L12.225 5.1838L10.6664 3.65625Z" fill="#F16E00"/>
          </svg>
          Retour
        </button>

        <h5 className="text-2xl font-extrabold text-gray-800">Créer une Nouvelle Évaluation</h5>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Étape 1 : Informations de la formation */}
        {step === 1 && (
          <div>
            <div className="border border-gray-200 rounded-md mb-6">
                <h2 className="font-bold bg-white p-4">Informations de la Formation</h2>
              
              <div className="p-4">
                {/* Titre de la formation */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Titre de la formation <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full p-2 border border-gray-300 rounded appearance-none bg-white pr-8"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    >
                      <option value="AWS : Développement, déploiement et gestion">AWS : Développement, déploiement et gestion</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Dates de formation - Ajusté pour correspondre à l'image */}
                <div className="flex space-x-4 mb-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Date début formation
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded pl-10" 
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">
                      Date fin formation
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded pl-10" 
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formateur */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Formateur
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded" 
                    placeholder="Nom du formateur"
                    value={formData.trainer}
                    onChange={(e) => setFormData({...formData, trainer: e.target.value})}
                  />
                </div>

                {/* Nombre de participants */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Nombre de participants
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded" 
                    placeholder="25"
                    value={formData.participants}
                    onChange={(e) => setFormData({...formData, participants: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Paramètres de l'évaluation */}
            <div className="border border-gray-200 rounded-md mb-6">
                <h2 className="font-bold bg-white p-4 ">Paramètres de l'Évaluation</h2>
              
              <div className="p-4">
                {/* Anonymat des réponses */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-500 mr-3">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Anonymat des réponses</p>
                      <p className="text-sm text-gray-500">Les participants ne seront pas identifiés</p>
                    </div>
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.anonymousResponses}
                        onChange={() => setFormData({...formData, anonymousResponses: !formData.anonymousResponses})}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Date limite de réponse */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-start">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-500 mr-3">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Date limite de réponse</p>
                      <p className="text-sm text-gray-500">Définir une date limite pour les réponses</p>
                    </div>
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.responseDeadline}
                        onChange={() => setFormData({...formData, responseDeadline: !formData.responseDeadline})}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Questionnaire d'évaluation */}
            <div className="border border-gray-200 rounded-md mb-6">
              <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
                <h2 className="font-medium">Questionnaire d'Évaluation</h2>
                <div className="flex items-center">
                  <button className="mr-2 text-gray-500">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="text-gray-500">
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Boutons navigation */}
            <div className="flex justify-end gap-4 mt-4">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded border"
              >
                Retour
              </button>
              <button 
                type="button" 
                className="px-4 py-2 bg-orange-500 text-white rounded"
                onClick={handleNext}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Étape 2 : Liste des participants */}
        {step === 2 && (
          <div>
            <div className="border border-gray-200 rounded-md mb-6">
              <div className="bg-gray-50 p-4 border-b">
                <h2 className="font-medium">Listes des Participants</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3 w-8">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="p-3 text-sm font-medium">Date & Heure</th>
                      <th className="p-3 text-sm font-medium">Nom</th>
                      <th className="p-3 text-sm font-medium">Prénom</th>
                      <th className="p-3 text-sm font-medium">Email</th>
                      <th className="p-3 text-sm font-medium">Genre</th>
                      <th className="p-3 text-sm font-medium">Téléphone</th>
                      <th className="p-3 text-sm font-medium">Conf Tél</th>
                      <th className="p-3 text-sm font-medium">Conf Email</th>
                      <th className="p-3 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="p-3">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="p-3">
                        <div className="text-sm">20/03/2025</div>
                        <div className="text-xs text-gray-500">09:30</div>
                      </td>
                      <td className="p-3 text-sm">Bakayoko</td>
                      <td className="p-3 text-sm">Mohamed</td>
                      <td className="p-3 text-sm">mohamed.bakayoko@gmail.com</td>
                      <td className="p-3 text-sm">Homme</td>
                      <td className="p-3 text-sm">0644343412</td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Confirmé <Check className="h-3 w-3 ml-1" />
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          En cours <X className="h-3 w-3 ml-1" />
                        </span>
                      </td>
                      <td className="p-3">
                        <button className="text-gray-400 hover:text-gray-600">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Zone vide pour indiquer que le tableau peut contenir plus d'entrées */}
              <div className="min-h-48"></div>
            </div>

            {/* Boutons de navigation */}
            <div className="flex justify-end gap-4 mt-4">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded border"
                onClick={handlePrevious}
              >
                Retour
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-orange-500 text-white rounded"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateEvaluationForm;