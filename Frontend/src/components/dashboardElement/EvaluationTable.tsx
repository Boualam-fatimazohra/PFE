import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormations } from "../../contexts/FormationContext";
import { useState } from "react";
import { toast } from "react-toastify";
import { Clipboard, Check, Loader2 } from "lucide-react";

// Interface des formations
interface Formation {
  _id: string;
  nom: string;
  status: string;
}

// Composant pour afficher le statut avec un badge stylisé
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: Record<string, string> = {
    "En Cours": "bg-orange-100 text-orange-700",
    "Terminer": "bg-green-100 text-green-700",
    "Replanifier": "bg-gray-100 text-gray-700",
  };

  const badgeStyle = statusStyles[status] || "bg-red-100 text-red-700";

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${badgeStyle}`}>
      {status}
    </span>
  );
};

export const EvaluationsTable = () => {
  const { formations, loading } = useFormations();
  const [links, setLinks] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  
  // Get API URL from environment variables
  const API_URL = import.meta.env.VITE_API_LINK || '';

  // Fonction pour générer un lien d'évaluation
  const generateEvaluationLink = async (id: string) => {
    try {
      setGenerating(prev => ({ ...prev, [id]: true }));
      
      // Option 1: Generate token on client-side (less secure)
      const randomToken = Math.random().toString(36).substring(2, 10);
      const generatedLink = `${window.location.origin}/evaluation/${id}/${randomToken}`;
      
      // Option 2: Generate token on server-side (more secure)
      // Uncomment this block if you have a server endpoint for token generation
      /*
      const response = await fetch(`${API_URL}/api/evaluations/generate-token/${id}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate evaluation token');
      }
      
      const data = await response.json();
      const generatedLink = `${window.location.origin}/evaluation/${id}/${data.token}`;
      */
      
      setLinks(prev => ({ ...prev, [id]: generatedLink }));
      toast.success("Lien d'évaluation généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du lien:", error);
      toast.error("Erreur lors de la génération du lien d'évaluation");
    } finally {
      setGenerating(prev => ({ ...prev, [id]: false }));
    }
  };

  // Function to copy link to clipboard
  const copyToClipboard = (id: string) => {
    if (links[id]) {
      navigator.clipboard.writeText(links[id])
        .then(() => {
          setCopied(prev => ({ ...prev, [id]: true }));
          toast.success("Lien copié dans le presse-papier");
          
          // Reset copy icon after 2 seconds
          setTimeout(() => {
            setCopied(prev => ({ ...prev, [id]: false }));
          }, 2000);
        })
        .catch(() => {
          toast.error("Échec de la copie du lien");
        });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mr-2" />
        <p>Chargement des formations...</p>
      </div>
    );
  }

  if (!formations || formations.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Aucune formation disponible actuellement.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="py-3">Titre</TableHead>
            <TableHead className="py-3">Status</TableHead>
            <TableHead className="py-3">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formations.map((formation: Formation) => (
            <TableRow key={formation._id} className="hover:bg-orange-50 transition duration-150">
              <TableCell className="py-4 font-medium">{formation.nom}</TableCell>
              <TableCell>
                <StatusBadge status={formation.status} />
              </TableCell>
              <TableCell>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => generateEvaluationLink(formation._id)}
                    disabled={generating[formation._id]}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs"
                  >
                    {generating[formation._id] ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      "Générer le lien d'évaluation"
                    )}
                  </button>
                  
                  {links[formation._id] && (
                    <div className="flex flex-col mt-2 max-w-md">
                      <div className="relative flex items-center">
                        <input
                          readOnly
                          value={links[formation._id]}
                          className="w-full bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-md pl-3 pr-10 py-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <button
                          onClick={() => copyToClipboard(formation._id)}
                          className="absolute right-2 text-gray-500 hover:text-orange-500 transition"
                          title="Copier le lien"
                        >
                          {copied[formation._id] ? <Check className="w-5 h-5 text-green-500" /> : <Clipboard className="w-5 h-5" />}
                        </button>
                      </div>
                     
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};