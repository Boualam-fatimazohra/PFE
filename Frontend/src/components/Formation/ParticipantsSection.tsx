import * as React from "react";
import { Printer, Search, FileDown, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportBeneficiairesListToExcel } from "../../services/beneficiaireService";
import { FormationItem } from "@/pages/types";
import { Beneficiaire, PresenceData } from "../formation-modal/types";
import { BeneficiaireWithPresenceResponse } from "../formation-modal/types";
import { enregistrerPresences } from "@/services/presenceService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
interface ParticipantsSectionProps {
  participants: BeneficiaireWithPresenceResponse[];
  currentPage: number;
  itemsPerPage?: number;
  formation: FormationItem; 
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({ 
  participants,
  currentPage,
  itemsPerPage = 11,
  formation
}) => {
  const [selectAll, setSelectAll] = React.useState(false);
  const [selectedParticipants, setSelectedParticipants] = React.useState<number[]>([]);
  const [attendanceState, setAttendanceState] = React.useState<Record<string, Record<string, boolean>>>({});
  const [search, setSearch] = React.useState("");

  // Filtrer les participants en fonction de la recherche
  const filteredParticipants = React.useMemo(() => {
    if (!search.trim()) return participants;
    
    const searchTerm = search.toLowerCase().trim();
    return participants.filter(participant => {
      const nom = participant.beneficiaire.nom?.toLowerCase() || '';
      const prenom = participant.beneficiaire.prenom?.toLowerCase() || '';
      
      return (
        nom.includes(searchTerm) || 
        prenom.includes(searchTerm) ||
        `${nom} ${prenom}`.includes(searchTerm) ||
        `${prenom} ${nom}`.includes(searchTerm)
      );
    });
  }, [participants, search]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Utiliser les participants filtrés pour l'affichage
  const displayedParticipants = filteredParticipants.slice(startIndex, endIndex);

  const [changedAttendance, setChangedAttendance] = React.useState<{
    beneficiareFormationId: string;
    jour: Date;
    isPresent: boolean;
  }[]>([]);

  // Add this flag to track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  // tracking submission
  const [isSubmitting, setIsSubmitting] = React.useState(false);
const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success'|'error'|'warning'|'info'>('success');
  const showAlert = (message: string, severity: 'success'|'error'|'warning'|'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  // function to handle saving
  const handleSaveAttendance = async () => {
    if (changedAttendance.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Debug the formation object
      console.log("Formation object:", formation);
      
      // Make sure we have a valid formation ID
      const formationId = formation._id || formation.id; // Try both common variations
      
      console.log("Formation ID to be used:", formationId);
      
      if (!formationId) {
        throw new Error("Formation ID is missing");
      }
      // Log all changes before processing
      console.log("All pending changes:", changedAttendance.map(change => ({
        beneficiareFormationId: change.beneficiareFormationId,
        jour: change.jour.toISOString(),
        isPresent: change.isPresent
      })));
      
      // Group changes by day for the API
      const changesByDay = changedAttendance.reduce<Record<string, PresenceData[]>>((acc, change) => {
        const dayString = change.jour.toISOString().split('T')[0];
        if (!acc[dayString]) {
          acc[dayString] = [];
        }
        
        acc[dayString].push({
          beneficiareFormationId: change.beneficiareFormationId,
          isPresent: change.isPresent
        });
        
        return acc;
      }, {});
      
      // Log the grouped changes
      console.log("Grouped changes by day:", changesByDay);
      
      // Send one request per day - now including formationId
      const savePromises = Object.entries(changesByDay).map(([day, presences]) => {
        console.log(`Saving ${presences.length} presence changes for day ${day}`);
        
        // Log specific presence changes
        presences.forEach(p => {
          console.log(`- Beneficiaire ${p.beneficiareFormationId}: ${p.isPresent ? 'Present' : 'Absent'}`);
        });
        console.log("formationId: " + formation._id);
        // Updated to include formationId
        return enregistrerPresences({
          jour: day,
          presences: presences,
          formationId: formationId // Add the formation ID from props
        });
      });
      
      const results = await Promise.all(savePromises);
      
      // Log detailed API responses
      results.forEach((result, index) => {
        console.log(`Response for API call ${index+1}:`, JSON.stringify(result, null, 2));
        if (result.results) {
          console.log("Individual change results:");
          result.results.forEach(changeResult => {
            console.log(`- Beneficiaire ${changeResult.beneficiareFormationId}: ${changeResult.success ? 'Success' : 'Failed'} - ${changeResult.message}`);
          });
        }
      });
      
      // Check if all results were successful
      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        setChangedAttendance([]);
        setHasUnsavedChanges(false);
        showAlert("Présences enregistrées avec succès", "success");

      } else {
        // Find failed results and show details
        const failedResults = results.filter(result => !result.success);
        console.error("Failed save results:", failedResults);
        showAlert("Certaines présences n'ont pas pu être enregistrées. Veuillez réessayer.", "success");

      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      
      // More detailed error information
      if (error.response) {
        console.error("API response status:", error.response.status);
        console.error("API response data:", error.response.data);
      }
      
      alert(`Erreur lors de l'enregistrement des présences: ${error.message || 'Une erreur est survenue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(displayedParticipants.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  // calculate days of formation
  const calculateFormationDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate the difference in days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // +1 to include both start and end days
    
    // Generate an array of date objects for each day
    const days = [];
    for (let i = 0; i < diffDays; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  // Calculate formation days
  const formationDays = React.useMemo(() => {
    console.log("Formation dates in useMemo:", {
      dateDebut: formation.dateDebut,
      dateFin: formation.dateFin
    });

    if (!formation.dateDebut || !formation.dateFin) {
      console.log("Using fallback for missing dates");
      return [new Date()];
    }
    
    return calculateFormationDays(formation.dateDebut, formation.dateFin || formation.dateDebut);
  }, [formation.dateDebut, formation.dateFin]);

  // Gérer la recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const toggleAttendance = (participant: BeneficiaireWithPresenceResponse, day: Date) => {
    // Check if participant has confirmed the règlement intérieur
    // If not confirmed, don't allow toggling
    if (participant.confirmationReglementInterieur !== true) {
      return; // Early exit - don't toggle attendance
    }
    
    const participantId = participant.beneficiaire._id;
    const beneficiareFormationId = participant.beneficiaireFormationId; 
    const dayString = day.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    
    // 1. First, determine the ACTUAL current status by checking:
    // - Our local attendance state first (if we've changed it already)
    // - If not in our state, check the API data (participant.presences)
    const existingApiAttendance = participant.presences.find(p => 
      new Date(p.jour).toDateString() === day.toDateString()
    );
    
    const currentStateValue = attendanceState[participantId]?.[dayString];
    const apiValue = existingApiAttendance?.isPresent || false;
    
    // Use our state value if it exists, otherwise use the API value
    const currentStatus = currentStateValue !== undefined ? currentStateValue : apiValue;
    
    // 2. Toggle to the new status
    const newStatus = !currentStatus;
    
    console.log(`Toggling attendance for ${participant.beneficiaire.nom} on ${dayString}:`);
    console.log(`- API status: ${apiValue ? 'Present' : 'Absent'}`);
    console.log(`- Current state status: ${currentStateValue !== undefined ? (currentStateValue ? 'Present' : 'Absent') : 'Not set'}`);
    console.log(`- Effective current status: ${currentStatus ? 'Present' : 'Absent'}`);
    console.log(`- New status: ${newStatus ? 'Present' : 'Absent'}`);
    
    // 3. Update our UI state
    setAttendanceState(prev => ({
      ...prev,
      [participantId]: {
        ...(prev[participantId] || {}),
        [dayString]: newStatus
      }
    }));
    
    // 4. Update our changed attendance tracking array
    setChangedAttendance(prev => {
      // Try to find if we already have a pending change for this participant/day
      const existingIndex = prev.findIndex(
        change => 
          change.beneficiareFormationId === beneficiareFormationId && 
          change.jour.toDateString() === day.toDateString()
      );
      
      if (existingIndex >= 0) {
        // We already have a pending change, update it
        const newChanges = [...prev];
        newChanges[existingIndex].isPresent = newStatus;
        return newChanges;
      } else {
        // Add a new change
        return [
          ...prev,
          {
            beneficiareFormationId,
            jour: day,
            isPresent: newStatus
          }
        ];
      }
    });
    
    // Always mark that we have unsaved changes
    setHasUnsavedChanges(true);
  };
  
  const handleExport = async () => {
    try {
      // Extraction des bénéficiaires depuis les participants
      const beneficiaires = participants.map(p => p.beneficiaire);
      
      // Appel du service d'export
      const { blob, filename } = await exportBeneficiairesListToExcel(beneficiaires);
      
      // Téléchargement automatique
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      showAlert("fichier télécharger avec success","success");
    } catch (error) {
      console.error('Export failed:', error);
      // Ajoutez ici votre système de notifications (toast, alert, etc.)
      alert(error.message || 'Erreur lors de l\'export');
      showAlert('Erreur lors de l\'export',"error");

    }
  };
  
  return (
    <div className="bg-white border border-[#DDD] p-6">
      <h2 className="text-2xl font-bold mb-6">Listes des participants</h2>

      <div className="flex items-center mb-6 gap-3">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            placeholder="Rechercher un bénéficiaire..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-[#DDD] outline-none text-[#666] placeholder:text-[#999] text-sm rounded"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF7900] rounded-full p-1.5">
            <Search className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Bouton Filtres sans bordure */}
        <Button variant="ghost" className="text-[#333] flex items-center gap-2 mr-2">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
          </svg>
          Filtres
        </Button>

        {/* Bouton Importer */}
        <Button variant="outline" className="border-[#999999] text-[#999999] font-normal text-sm whitespace-nowrap mr-1">
          Importer
        </Button>

        {/* Bouton Exporter */}
        <Button variant="outline"
         className="border-[#FF7900] text-[#FF7900] flex items-center gap-2 text-sm mr-1"
         onClick={handleExport}>
          Exporter
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M17.0196 12.88V17.02H5.9796V12.88H3.6796V17.48C3.6796 18.4962 4.50339 19.32 5.5196 19.32H17.4796C18.4958 19.32 19.3196 18.4962 19.3196 17.48V12.88H17.0196ZM14.2596 10.58V5.06002C14.2596 4.69402 14.1142 4.34301 13.8554 4.08421C13.5966 3.82541 13.2456 3.68002 12.8796 3.68002H10.1196C9.35744 3.68002 8.7396 4.29787 8.7396 5.06002V10.58H5.9796L8.7396 13.3213L10.7794 15.3471C11.1725 15.7376 11.8267 15.7376 12.2198 15.3471L14.2596 13.3213L17.0196 10.58H14.2596Z" fill="#FF7900"/>
          </svg>
        </Button>
        {/* Add this button at the bottom of your table or component */}
        <div className="mt-6 flex justify-end">
          <Button 
            variant="default" 
            className="bg-orange-500 text-white"
            onClick={handleSaveAttendance}
            disabled={!hasUnsavedChanges}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Enregistrement...</span>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              "Enregistrer les présences"
            )}
          </Button>
        </div>

        {/* Bouton Imprimer */}
        <Button variant="ghost" className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M20.9998 19.8H2.9998C2.33706 19.8 1.7998 19.2627 1.7998 18.6V12.6C1.7998 11.9372 2.33706 11.4 2.9998 11.4H5.3998V4.19995H13.7998L18.5998 8.99995V11.4H20.9998C21.6625 11.4 22.1998 11.9252 22.1998 12.588V18.6C22.1998 19.2627 21.6625 19.8 20.9998 19.8ZM11.9998 18.6C12.3312 18.6 12.5998 18.3313 12.5998 18C12.5998 17.6686 12.3312 17.4 11.9998 17.4C11.6684 17.4 11.3998 17.6686 11.3998 18C11.3998 18.3313 11.6684 18.6 11.9998 18.6ZM6.5998 14.4H17.3998V9.59995H14.3998C13.7371 9.59995 13.1998 9.06269 13.1998 8.39995V5.39995H6.5998V14.4Z" fill="#999999"/>
          </svg>
        </Button>
      </div>

      {/* Message indiquant le nombre de résultats de recherche */}
      {search.trim() && (
        <div className="mb-4 text-sm text-gray-600">
          {filteredParticipants.length} participant(s) trouvé(s) pour "{search}"
        </div>
      )}

      {/* Legend for règlement intérieur status */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm flex items-center">
          <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
          <span>
            Les participants n'ayant pas confirmé le règlement intérieur ne peuvent pas être marqués présents.
          </span>
        </p>
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
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Nom Prenom</th>

            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">email</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Téléphone</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Specialité</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Genre</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Situation Profetionnelle</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Status</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Règlement</th>
            {/* Dynamic day columns */}
            {formationDays.map((day, idx) => (
              <th key={idx} className="p-3 text-center font-semibold text-[#333] text-sm font-bold">
                {day.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedParticipants.length > 0 ? (
            displayedParticipants.map((participant, index) => {
              // Check if participant has confirmed the règlement intérieur
              const hasConfirmedReglement = participant.confirmationReglementInterieur === true;
              
              return (
                <tr key={index} className={`border-t border-[#DDD] hover:bg-[#F5F5F5] ${!hasConfirmedReglement ? 'bg-gray-50' : ''}`}>
                  <td className="p-3">
                    <input type="checkbox" className="border border-[#DDD] w-4 h-4"
                    checked={selectedParticipants.includes(index)} />
                  </td>
                  <td className="p-3 text-sm">
                    <div className="text-[#333]">{participant.beneficiaire.nom}</div>
                    <div className="text-[#666] text-xs">{participant.beneficiaire.prenom}</div>
                  </td>

                  <td className="p-3 text-[#333] text-sm ">{participant.beneficiaire.email}</td>
                  <td className="p-3 text-[#333] text-sm">{participant.beneficiaire.telephone}</td>
                  <td className="p-3 text-[#333] text-sm">{participant.beneficiaire.specialite}</td>
                  <td className="p-3 text-[#333] text-sm">{participant.beneficiaire.genre}</td>
                  <td className="p-3 text-[#333] text-sm">{participant.beneficiaire.profession}</td>
                  <td className="p-3 text-sm">
                    <span className={cn(
                      "font-medium",
                      participant.presences.length > 0 && participant.presences.some(p => p.isPresent) 
                        ? "text-[#00C31F]"
                        : "text-[#FF4815]"
                    )}>
                      {participant.presences.length > 0 && participant.presences.some(p => p.isPresent) 
                        ? "Présent (e)" 
                        : "Absent (e)"}
                    </span>
                  </td>
                  
                  {/* Status of Règlement Intérieur */}
                  <td className="p-3 text-sm">
                    <span className={cn(
                      "font-medium px-2 py-1 rounded-full text-xs",
                      hasConfirmedReglement ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {hasConfirmedReglement ? "Confirmé" : "En attente"}
                    </span>
                  </td>
                  
                  {formationDays.map((day, dayIdx) => {
                    const dayString = day.toISOString().split('T')[0];
                    const participantId = participant.beneficiaire._id;
                    
                    // Find attendance record for this day and participant
                    const attendance = participant.presences.find(p => 
                      new Date(p.jour).toDateString() === day.toDateString()
                    );
                    
                    // Check if we have a state override, otherwise use the API data
                    const hasStateOverride = attendanceState[participantId]?.[dayString] !== undefined;
                    const isPresent = hasStateOverride 
                      ? attendanceState[participantId][dayString]
                      : (attendance?.isPresent || false);
                    
                    return (
                      <td key={dayIdx} className="p-3 text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => toggleAttendance(participant, day)}
                                className={`w-8 h-8 rounded-full ${
                                  isPresent 
                                    ? "bg-green-500 text-white" 
                                    : "bg-red-500 text-white"
                                } ${
                                  !hasConfirmedReglement 
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:opacity-90"
                                }`}
                                disabled={!hasConfirmedReglement}
                              >
                                {isPresent ? "P" : "A"}
                              </button>
                            </TooltipTrigger>
                            {!hasConfirmedReglement && (
                              <TooltipContent>
                                <p>Le participant doit confirmer le règlement intérieur</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={9 + formationDays.length} className="p-6 text-center text-gray-500">
                {search.trim() ? "Aucun participant ne correspond à votre recherche." : "Aucun participant disponible."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
<Snackbar
  open={alertOpen}
  autoHideDuration={2000}
  onClose={() => setAlertOpen(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert 
    severity={alertSeverity}
    sx={{ 
      width: '100%',
      boxShadow: 3,
      fontSize: '0.875rem',
      '.MuiAlert-icon': { fontSize: '1.25rem' }
    }}
  >
    {alertMessage}
  </Alert>
</Snackbar>
    </div>
  );
};

export default ParticipantsSection;