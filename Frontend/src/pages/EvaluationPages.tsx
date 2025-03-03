import * as React from "react";
import { Clock, ArrowRight, Printer, Search, FileDown, Send } from 'lucide-react';
import CourseHeader from "@/components/Formation/CoursHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import test from '@/assets/images/test.jpg';

// Types
interface Beneficiaire {
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
}

interface Formation {
  id: string;
  title: string;
  description: string;
  status: "En cours" | "A venir" | "Terminé" | "Replanifié";
  image: string;
  duration: string;
}

interface FormationCardProps {
  formation: Formation;
  onAccess: () => void;
  onEdit?: (formation: Formation) => void;
  onDelete?: (id: string) => void;
}

// Formation Card Component
const FormationCard = ({ formation, onAccess, onEdit, onDelete }: FormationCardProps) => {
  const getStatusClass = () => {
    switch (formation.status) {
      case "En cours":
        return "bg-[#FFF4EB] text-[#FF7900]";
      case "A venir":
        return "bg-[#F2E7FF] text-[#9C00C3]";
      case "Terminé":
        return "bg-[#E6F7EA] text-[#00C31F]";
      case "Replanifié":
        return "bg-[#F5F5F5] text-[#4D4D4D]"; 
      default:
        return "";
    }
  };

  return (
    <Card className="overflow-hidden shadow-md border rounded-none bg-white">
      <div className="relative">
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <img src={test} alt="Formation" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`px-3 py-1 rounded-full ${getStatusClass()}`}>
            {formation.status}
          </div>
        </div>
        <h3 className="font-semibold text-base mb-2">{formation.title}</h3>
        <p className="text-sm text-gray-500 mb-5">
          {formation.description.substring(0, 50)}...
        </p>
        <div className="flex justify-between items-center">
          <Button
            variant="orange"
            size="sm"
            className="rounded-none"
            onClick={onAccess}
          >
            Accéder →
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Formations List Component
interface FormationsListProps {
  formations: Formation[];
  onAccessBeneficiaires: (formationId: string) => void;
}

const FormationsList = ({ formations, onAccessBeneficiaires }: FormationsListProps) => {
  // Trier les formations: "En cours" d'abord, puis les autres
  const sortedFormations = React.useMemo(() => {
    const enCoursFormations = formations.filter(formation => formation.status === "En cours");
    const otherFormations = formations.filter(formation => formation.status !== "En cours");
    
    return { enCoursFormations, otherFormations };
  }, [formations]);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Liste des formations</h2>
      
      {/* Afficher les formations "En cours" */}
      {sortedFormations.enCoursFormations.length > 0 && (
        <>
          <div className="flex items-center mb-4">
            <hr className="flex-grow border-t border-gray-300" />
            <h3 className="text-xl font-semibold mx-4 whitespace-nowrap">Formations en cours</h3>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedFormations.enCoursFormations.map((formation) => (
              <FormationCard 
                key={formation.id} 
                formation={formation} 
                onAccess={() => onAccessBeneficiaires(formation.id)}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Afficher les autres formations */}
      {sortedFormations.otherFormations.length > 0 && (
        <>
          <div className="flex items-center mb-4">
            <hr className="flex-grow border-t border-gray-300" />
            <h3 className="text-xl font-semibold mx-4 whitespace-nowrap">Autres formations</h3>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFormations.otherFormations.map((formation) => (
              <FormationCard 
                key={formation.id} 
                formation={formation} 
                onAccess={() => onAccessBeneficiaires(formation.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Composant de la liste des bénéficiaires avec fonctionnalité d'envoi
const BeneficiairesListe = ({ formationId }) => {
  const [beneficiaires, setBeneficiaires] = React.useState<Beneficiaire[]>([]);
  const [search, setSearch] = React.useState("");
  const [selectAll, setSelectAll] = React.useState(false);
  const [selectedBeneficiaires, setSelectedBeneficiaires] = React.useState<number[]>([]);
  const [expandedRow, setExpandedRow] = React.useState<number | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [linkSent, setLinkSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null); 
  const itemsPerPage = 11;

  React.useEffect(() => {
    // Simulons des données au cas où l'API n'est pas disponible
    const mockData: Beneficiaire[] = [
      {
        nom: "Dupont", 
        prenom: "Jean", 
        email: "jean.dupont@example.com", 
        genre: "Homme", 
        pays: "France", 
        specialite: "Développement web", 
        etablissement: "Université Paris-Saclay", 
        profession: "Étudiant",
        isBlack: false,
        isSaturate: false
      },
      {
        nom: "Martin", 
        prenom: "Sophie", 
        email: "sophie.martin@example.com", 
        genre: "Femme", 
        pays: "France", 
        specialite: "UX/UI Design", 
        etablissement: "École de design", 
        profession: "Designer",
        isBlack: true,
        isSaturate: false
      },
      {
        nom: "Dubois", 
        prenom: "Pierre", 
        email: "pierre.dubois@example.com", 
        genre: "Homme", 
        pays: "Belgique", 
        specialite: "Data Science", 
        etablissement: "Université de Bruxelles", 
        profession: "Ingénieur",
        isBlack: false,
        isSaturate: true
      },
      {
        nom: "Garcia", 
        prenom: "Maria", 
        email: "maria.garcia@example.com", 
        genre: "Femme", 
        pays: "Espagne", 
        specialite: "IA", 
        etablissement: "Universidad de Madrid", 
        profession: "Chercheuse",
        isBlack: false,
        isSaturate: false
      }
    ];
    
    // Essayez d'abord d'obtenir les données de l'API
    axios.get("http://localhost:5000/api/beneficiaires")
      .then(response => {
        setBeneficiaires(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des bénéficiaires", error);
        // Utilisez des données fictives en cas d'échec de l'API
        setBeneficiaires(mockData);
      });
  }, []);

  const filteredBeneficiaires = beneficiaires.filter(b =>
    b.nom.toLowerCase().includes(search.toLowerCase()) ||
    b.prenom.toLowerCase().includes(search.toLowerCase()) ||
    b.email.toLowerCase().includes(search.toLowerCase())
  );

  // Calcul pour la pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedBeneficiaires = filteredBeneficiaires.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredBeneficiaires.length / itemsPerPage);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBeneficiaires([]);
    } else {
      setSelectedBeneficiaires(displayedBeneficiaires.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOne = (index: number) => {
    let newSelected = [...selectedBeneficiaires];
    if (newSelected.includes(index)) {
      newSelected = newSelected.filter(i => i !== index);
    } else {
      newSelected.push(index);
    }
    setSelectedBeneficiaires(newSelected);
    setSelectAll(newSelected.length === displayedBeneficiaires.length);
  };

  const sendLink = async () => {
    if (selectedBeneficiaires.length === 0) {
      alert("Veuillez sélectionner au moins un bénéficiaire");
      return;
    }
    
    // Simulation d'envoi de lien
    console.log("Envoi du lien aux bénéficiaires sélectionnés:", 
      selectedBeneficiaires.map(index => displayedBeneficiaires[index])
    );
    
    const selectedBeneficiairesList = selectedBeneficiaires.map(index => displayedBeneficiaires[index]);
    const beneficiaryIds = selectedBeneficiairesList.map(beneficiaire => beneficiaire._id || "");
    
    setLoading(true);
    setError(null);
    
    try {
      // Appel à l'API backend pour envoyer les liens d'évaluation
      const response = await axios.post('/api/formations/send-evaluation-links', {
        beneficiaryIds,
        formationId
      });
      
      console.log("Réponse de l'API:", response.data);
      
      // Afficher un message de confirmation
      setLinkSent(true);
      setTimeout(() => setLinkSent(false), 3000);
      
    } catch (error) {
      console.error("Erreur lors de l'envoi des liens:", error);
      setError(error.response?.data?.message || "Une erreur est survenue lors de l'envoi des liens");
    } finally {
      setLoading(false);
    }
  };

  // Fonctions de navigation pour la pagination
  const goToPage = (page: number) => {
    setCurrentPage(page);
    setExpandedRow(null);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setExpandedRow(null);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setExpandedRow(null);
    }
  };

  const toggleRowExpansion = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="bg-white border border-[#DDD] p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Liste des bénéficiaires</h2>
        
        <Button
          variant="orange"
          className="flex items-center gap-2 px-4 py-2"
          onClick={sendLink}
          disabled={selectedBeneficiaires.length === 0 || loading}
        >
          {loading ? (
            <>
              <span className="animate-spin h-5 w-5 mr-2 border-b-2 border-white rounded-full"></span>
              Envoi en cours...
            </>
          ) : (
            <>
              <Send size={18} />
              Envoyer le lien
            </>
          )}
        </Button>
      </div>

      {linkSent && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Lien envoyé avec succès aux bénéficiaires sélectionnés!</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center mb-6 gap-3">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            placeholder="Rechercher un bénéficiaire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-[#DDD] outline-none text-[#666] placeholder:text-[#999] text-sm rounded"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF7900] rounded-full p-1.5">
            <Search className="h-4 w-4 text-white" />
          </div>
        </div>

        <Button variant="ghost" className="text-[#333] flex items-center gap-2 mr-2">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
          </svg>
          Filtres
        </Button>

        <Button variant="outline" className="border-[#999999] text-[#999999] font-normal text-sm whitespace-nowrap mr-1">
          Importer
        </Button>

        <Button variant="outline" className="border-[#FF7900] text-[#FF7900] flex items-center gap-2 text-sm mr-1">
          Exporter
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M17.0196 12.88V17.02H5.9796V12.88H3.6796V17.48C3.6796 18.4962 4.50339 19.32 5.5196 19.32H17.4796C18.4958 19.32 19.3196 18.4962 19.3196 17.48V12.88H17.0196ZM14.2596 10.58V5.06002C14.2596 4.69402 14.1142 4.34301 13.8554 4.08421C13.5966 3.82541 13.2456 3.68002 12.8796 3.68002H10.1196C9.35744 3.68002 8.7396 4.29787 8.7396 5.06002V10.58H5.9796L8.7396 13.3213L10.7794 15.3471C11.1725 15.7376 11.8267 15.7376 12.2198 15.3471L14.2596 13.3213L17.0196 10.58H14.2596Z" fill="#FF7900"/>
          </svg>
        </Button>

        <Button variant="ghost" className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M20.9998 19.8H2.9998C2.33706 19.8 1.7998 19.2627 1.7998 18.6V12.6C1.7998 11.9372 2.33706 11.4 2.9998 11.4H5.3998V4.19995H13.7998L18.5998 8.99995V11.4H20.9998C21.6625 11.4 22.1998 11.9252 22.1998 12.588V18.6C22.1998 19.2627 21.6625 19.8 20.9998 19.8ZM11.9998 18.6C12.3312 18.6 12.5998 18.3313 12.5998 18C12.5998 17.6686 12.3312 17.4 11.9998 17.4C11.6684 17.4 11.3998 17.6686 11.3998 18C11.3998 18.3313 11.6684 18.6 11.9998 18.6ZM6.5998 14.4H17.3998V9.59995H14.3998C13.7371 9.59995 13.1998 9.06269 13.1998 8.39995V5.39995H6.5998V14.4Z" fill="#999999"/>
          </svg>
        </Button> 
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F5F5F5]">
            <th className="p-3 text-left">
              <input 
                type="checkbox" 
                className="border border-[#DDD] w-4 h-4" 
                checked={selectAll} 
                onChange={handleSelectAll} 
              />
            </th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">ID</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Nom</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Prénom</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Email</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Genre</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">isBlack</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">isSaturate</th>
            <th className="p-3 font-bold"></th>
          </tr>
        </thead>
        <tbody>
          {displayedBeneficiaires.map((beneficiaire, index) => (
            <React.Fragment key={index}>
              <tr className="border-t border-[#DDD] hover:bg-[#F5F5F5]">
                <td className="p-3">
                  <input 
                    type="checkbox" 
                    className="border border-[#DDD] w-4 h-4"
                    checked={selectedBeneficiaires.includes(index)}
                    onChange={() => handleSelectOne(index)}
                  />
                </td>
                <td className="p-3 text-[#333] text-sm">{beneficiaire._id}</td>
                <td className="p-3 text-[#333] text-sm">{beneficiaire.nom}</td>
                <td className="p-3 text-[#333] text-sm">{beneficiaire.prenom}</td>
                <td className="p-3 text-[#333] text-sm">{beneficiaire.email}</td>
                <td className="p-3 text-[#333] text-sm">{beneficiaire.genre}</td>
                <td className={`p-3 text-sm ${beneficiaire.isBlack ? "text-red-500" : "text-green-500"}`}>
                  {beneficiaire.isBlack ? "Oui" : "Non"}
                </td>
                <td className={`p-3 text-sm ${beneficiaire.isSaturate ? "text-red-500" : "text-green-500"}`}>
                  {beneficiaire.isSaturate ? "Oui" : "Non"}
                </td>
                <td className="p-3">
                  <button 
                    className="flex items-center gap-2 text-sm text-[#333] font-bold"
                    onClick={() => toggleRowExpansion(index)}
                  >
                    {expandedRow === index ? "Voir moins" : "Voir plus"}
                    <svg 
                      width="8" 
                      height="12" 
                      viewBox="0 0 8 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transform transition-transform ${expandedRow === index ? "rotate-90" : ""}`}
                    >
                      <path fillRule="evenodd" clipRule="evenodd" d="M1.77778 12L8 6L1.77778 0L0 1.71343L4.44533 6L0 10.2849L1.77778 12Z" fill="black"/>
                    </svg>
                  </button>
                </td>
              </tr>
              {expandedRow === index && (
                <tr className="border-t border-[#DDD] bg-[#F9F9F9]">
                  <td colSpan={8} className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-sm mb-2">Pays</p>
                        <p className="text-sm text-[#333]">{beneficiaire.pays}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-2">Spécialité</p>
                        <p className="text-sm text-[#333]">{beneficiaire.specialite}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-2">Établissement</p>
                        <p className="text-sm text-[#333]">{beneficiaire.etablissement}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-2">Profession</p>
                        <p className="text-sm text-[#333]">{beneficiaire.profession}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      
      {/* Pagination - Centrée */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center mt-6">
          <div className="text-sm text-[#666] mb-2">
            Affichage de {startIndex + 1} à {Math.min(endIndex, filteredBeneficiaires.length)} sur {filteredBeneficiaires.length} bénéficiaires
          </div>
          <div className="flex items-center gap-2">
            {/* Bouton précédent */}
            <button 
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-8 h-8 rounded ${currentPage === 1 ? 'text-[#999] cursor-not-allowed' : 'text-[#333] hover:bg-[#F5F5F5]'}`}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-180">
                <path fillRule="evenodd" clipRule="evenodd" d="M1.77778 12L8 6L1.77778 0L0 1.71343L4.44533 6L0 10.2849L1.77778 12Z" fill="currentColor"/>
              </svg>
            </button>
            
            {/* Numéros de page */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`flex items-center justify-center w-8 h-8 rounded ${
                  currentPage === page 
                    ? 'bg-[#FF7900] text-white' 
                    : 'text-[#333] hover:bg-[#F5F5F5]'
                }`}
              >
                {page}
              </button>
            ))}
            
            {/* Bouton suivant */}
            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-8 h-8 rounded ${currentPage === totalPages ? 'text-[#999] cursor-not-allowed' : 'text-[#333] hover:bg-[#F5F5F5]'}`}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M1.77778 12L8 6L1.77778 0L0 1.71343L4.44533 6L0 10.2849L1.77778 12Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// App Component
const EvaluationPages = () => {
  const [showBeneficiaires, setShowBeneficiaires] = React.useState(false);
  const [selectedFormation, setSelectedFormation] = React.useState<string | null>(null);
  
  // Simulated formations data
  const formationsData: Formation[] = [
    {
      id: "1",
      title: "Formation React Avancé",
      description: "Maîtrisez les concepts avancés de React et ses hooks",
      status: "En cours",
      image: "/api/placeholder/400/300",
      duration: "20 heures"
    },
    {
      id: "2",
      title: "Formation TypeScript",
      description: "Apprenez TypeScript pour des applications React robustes",
      status: "A venir",
      image: "/api/placeholder/400/300",
      duration: "15 heures"
    },
    {
      id: "3",
      title: "Formation Node.js",
      description: "Créez des API RESTful avec Node.js et Express",
      status: "Terminé",
      image: "/api/placeholder/400/300",
      duration: "18 heures"
    }
  ];
  
  const handleAccessBeneficiaires = (formationId: string) => {
    setSelectedFormation(formationId);
    setShowBeneficiaires(true);
  };
  
  const handleBackToFormations = () => {
    setShowBeneficiaires(false);
    setSelectedFormation(null);
  };
    return (
      <div className="container mx-auto p-6">
        {!showBeneficiaires ? (
          <FormationsList 
            formations={formationsData} 
            onAccessBeneficiaires={handleAccessBeneficiaires}
          />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-1 text-xl font-medium text-orange-600 hover:text-orange-800 transition"
                onClick={handleBackToFormations}
              >
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.6665 4.65625L5.21143 10L10.6665 15.3437L12.2251 13.8177L8.32784 10L12.2251 6.1838L10.6665 4.65625Z" fill="#F16E00"/>
                </svg>
                <span className="text-lg font-bold text-[#000000]"> Retour</span> 
              </Button>
            </div>
            
            <CourseHeader 
              title="Formation" 
              subtitle={formationsData.find(f => f.id === selectedFormation)?.title || "Formation"} 
              status="En Cours" 
            />
            {/* Passage de l'ID de la formation au composant BeneficiairesListe */}
            <BeneficiairesListe formationId={selectedFormation} />
          </div>
        )}
      </div>
    );
  };

export default EvaluationPages;