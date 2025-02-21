import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importer useNavigate
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilePlus, LinkIcon } from "lucide-react";

export default function GenerateLink() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Initialiser useNavigate

  const openGoogleForms = () => {
    window.open("https://forms.google.com", "_blank");
  };

  const goToManualFormPage = () => {
    navigate("/formulaire-evaluation"); // ✅ Utiliser le chemin de la route
  };

  return (
    <div className="space-y-4 p-6 bg-gray-50 rounded-lg  max-w-md mx-auto">
      <Button 
        onClick={() => setOpen(true)} 
        className="rounded-none bg-orange-500 text-white px-4 py-2 rounded-md w-full hover:bg-orange-600 transition-all"
      >
        Générer Lien
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white rounded-lg p-6 shadow-lg transition-all">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800">
              🎯 Choisissez une option
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Button 
              onClick={openGoogleForms} 
              className="bg-gray-200 text-gray-800 w-full flex items-center gap-2 px-4 py-2 rounded-md"
            >
              <FilePlus size={18} />
              Créer un formulaire sur Google Forms
            </Button>

            <Button 
              onClick={goToManualFormPage} 
              className="bg-blue-500 text-white w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
            >
              <LinkIcon size={18} />
              Créer un formulaire manuellement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
