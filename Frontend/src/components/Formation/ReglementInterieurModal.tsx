import * as React from "react";
import { useState, useEffect } from "react";
import { Check, AlertCircle, X, Filter, Download, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { BeneficiaireWithPresenceResponse } from "../formation-modal/types";
import { FormationItem } from "@/pages/types";

// Enhanced participant type with string status for UI
interface ParticipantWithStatus extends BeneficiaireWithPresenceResponse {
  reglementStatus: "confirmed" | "declined" | "pending";
}

interface ReglementInterieurModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: ParticipantWithStatus[];
  formation: FormationItem;
  onConfirmReglement: (participantIds: string[], action: "confirm" | "decline") => Promise<void>;
}

const ReglementInterieurModal: React.FC<ReglementInterieurModalProps> = ({
  isOpen,
  onClose,
  participants,
  formation,
  onConfirmReglement
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [filteredParticipants, setFilteredParticipants] = useState<ParticipantWithStatus[]>(participants);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedParticipants([]);
      setSelectAll(false);
      setSearchQuery("");
      setFilteredParticipants(participants);
    }
  }, [isOpen, participants]);

  // Filter participants based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredParticipants(participants);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = participants.filter(
        (p) =>
          p.beneficiaire.nom.toLowerCase().includes(query) ||
          p.beneficiaire.prenom.toLowerCase().includes(query) ||
          p.beneficiaire.email.toLowerCase().includes(query)
      );
      setFilteredParticipants(filtered);
    }
  }, [searchQuery, participants]);

  // Toggle select all
  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(filteredParticipants.map((p) => p.beneficiaireFormationId));
    }
    setSelectAll(!selectAll);
  };

  // Toggle selection for a single participant
  const handleToggleParticipant = (id: string) => {
    setSelectedParticipants((prev) => {
      if (prev.includes(id)) {
        const newSelected = prev.filter((p) => p !== id);
        setSelectAll(false);
        return newSelected;
      } else {
        const newSelected = [...prev, id];
        if (newSelected.length === filteredParticipants.length) {
          setSelectAll(true);
        }
        return newSelected;
      }
    });
  };

  // Submit confirmation
  const handleConfirmation = async (action: "confirm" | "decline") => {
    if (selectedParticipants.length === 0) {
      toast.error("Veuillez sélectionner au moins un participant");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirmReglement(selectedParticipants, action);
      const actionText = action === "confirm" ? "confirmé" : "refusé";
      toast.success(`Règlement ${actionText} avec succès`);
      
      // Reset selections
      setSelectedParticipants([]);
      setSelectAll(false);
      
      // Close modal if needed
      if (action === "confirm") {
        onClose();
      }
    } catch (error) {
      console.error(`Error ${action === "confirm" ? "confirming" : "declining"} règlement:`, error);
      toast.error(`Erreur lors de l'opération`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get a visual status for a participant
  const getStatusIndicator = (status: "confirmed" | "declined" | "pending") => {
    if (status === "confirmed") {
      return (
        <div className="flex items-center text-green-600 font-medium">
          <Check className="w-4 h-4 mr-1" />
          <span>Confirmé</span>
        </div>
      );
    } else if (status === "declined") {
      return (
        <div className="flex items-center text-red-600 font-medium">
          <X className="w-4 h-4 mr-1" />
          <span>Refusé</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-orange-600 font-medium">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>En attente</span>
        </div>
      );
    }
  };
  
  // Check if the participant has any presence record
  const hasPresenceRecord = (participant: ParticipantWithStatus): boolean => {
    return participant.presences && participant.presences.length > 0;
  };

  // Calculate status counts
  const confirmedCount = participants.filter(p => p.reglementStatus === "confirmed").length;
  const pendingCount = participants.filter(p => p.reglementStatus === "pending").length;
  const declinedCount = participants.filter(p => p.reglementStatus === "declined").length;
  const totalCount = participants.length;
  const confirmedPercentage = totalCount > 0 ? Math.round((confirmedCount / totalCount) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Règlement Intérieur - {formation.title}
          </DialogTitle>
          <DialogDescription>
            Vérifiez que les participants ont pris connaissance et accepté le règlement intérieur.
          </DialogDescription>
        </DialogHeader>

        {/* Statistics bar showing progress */}
        <div className="bg-gray-100 p-3 rounded-md mb-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Total:</span> {totalCount} participants
            </div>
            <div className="flex gap-4">
              <span className="text-green-600 font-medium">
                <Check className="w-4 h-4 inline mr-1" />
                {confirmedCount} ({confirmedPercentage}%)
              </span>
              <span className="text-orange-600 font-medium">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                {pendingCount}
              </span>
              <span className="text-red-600 font-medium">
                <X className="w-4 h-4 inline mr-1" />
                {declinedCount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-4 gap-3">
          <div className="relative flex-grow mr-4">
            <input
              type="text"
              placeholder="Rechercher un participant..."
              className="w-full px-4 py-2 border border-[#DDD] outline-none text-[#666] placeholder:text-[#999] text-sm rounded-md pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF7900] rounded-full p-1.5">
              <Search className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Button Filtres */}
          <Button variant="ghost" className="text-[#333] flex items-center gap-2 mr-2">
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </Button>

          {/* Button Exporter */}
          <Button variant="outline" className="border-[#FF7900] text-[#FF7900] flex items-center gap-2 text-sm mr-1">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </Button>
        </div>

        <div className="overflow-y-auto flex-1 border border-gray-200 rounded-md">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr className="bg-[#F5F5F5]">
                <th className="p-3 text-left">
                  <input 
                    type="checkbox" 
                    className="border border-[#DDD] w-4 h-4" 
                    checked={selectAll}
                    onChange={handleToggleSelectAll}
                  />
                </th>
                <th className="p-3 text-left font-semibold text-[#333] text-sm">Nom</th>
                <th className="p-3 text-left font-semibold text-[#333] text-sm">Prénom</th>
                <th className="p-3 text-left font-semibold text-[#333] text-sm">Email</th>
                <th className="p-3 text-left font-semibold text-[#333] text-sm">Status</th>
                <th className="p-3 text-left font-semibold text-[#333] text-sm">Règlement</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant) => (
                <tr key={participant.beneficiaireFormationId} className="border-t border-[#DDD] hover:bg-[#F5F5F5]">
                  <td className="p-3">
                    <input 
                      type="checkbox" 
                      className="border border-[#DDD] w-4 h-4"
                      checked={selectedParticipants.includes(participant.beneficiaireFormationId)}
                      onChange={() => handleToggleParticipant(participant.beneficiaireFormationId)}
                      disabled={participant.reglementStatus === "confirmed"} // Optional: disable selection of already confirmed
                    />
                  </td>
                  <td className="p-3 text-[#333] text-sm">{participant.beneficiaire.nom}</td>
                  <td className="p-3 text-[#333] text-sm">{participant.beneficiaire.prenom}</td>
                  <td className="p-3 text-[#333] text-sm">{participant.beneficiaire.email}</td>
                  <td className="p-3 text-sm">
                    <span className={cn(
                      "font-medium",
                      hasPresenceRecord(participant) ? "text-[#00C31F]" : "text-[#FF4815]"
                    )}>
                      {hasPresenceRecord(participant) ? "Présent(e)" : "Absent(e)"}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    {getStatusIndicator(participant.reglementStatus)}
                  </td>
                </tr>
              ))}
              {filteredParticipants.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    Aucun participant trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <DialogFooter className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            {selectedParticipants.length} participant(s) sélectionné(s) sur {filteredParticipants.length}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleConfirmation("decline")}
              disabled={isSubmitting || selectedParticipants.length === 0}
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              {isSubmitting ? "Traitement..." : "Refuser"}
            </Button>
            <Button
              variant="default"
              onClick={() => handleConfirmation("confirm")}
              disabled={isSubmitting || selectedParticipants.length === 0}
              className="bg-[#FF7900] hover:bg-[#E56600]"
            >
              {isSubmitting ? "Traitement..." : "Confirmer"}
            </Button>
            <DialogClose asChild>
              <Button variant="ghost">Fermer</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReglementInterieurModal;