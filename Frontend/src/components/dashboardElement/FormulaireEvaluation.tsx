import { useState } from "react";
import { TextField, Button, Typography, Select, MenuItem, IconButton } from "@mui/material";
import { Copy, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function FormulaireEvaluation() {
  const [formTitle, setFormTitle] = useState("");
  const [selectedFormationId, setSelectedFormationId] = useState(""); // ✅ Déclaré ici
  const [questions, setQuestions] = useState<{ id: number; type: string; question: string; options?: string[] }[]>([]);
  const [link, setLink] = useState("");

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), type: "text", question: "" }]);
  };

  const updateQuestion = (id: number, key: string, value: any) => {
    setQuestions(questions.map(q => (q.id === id ? { ...q, [key]: value } : q)));
  };

  const addOption = (id: number) => {
    setQuestions(
      questions.map(q =>
        q.id === id
          ? { ...q, options: [...(q.options || []), ""] }
          : q
      )
    );
  };

  const updateOption = (qId: number, index: number, value: string) => {
    setQuestions(
      questions.map(q =>
        q.id === qId
          ? { ...q, options: q.options?.map((opt, i) => (i === index ? value : opt)) || [] }
          : q
      )
    );
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const generateLink = async () => {
    if (!formTitle.trim() || questions.length === 0 || !selectedFormationId) {
      toast.error("Veuillez ajouter un titre, des questions et sélectionner une formation !");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/evaluation", {
        tauxSatisfaction: null,
        formation: selectedFormationId, // ✅ Utilisation de la valeur du state
        questions,
      });

      setLink(response.data.evaluation.lienEvaluation);
      toast.success("Lien généré avec succès !");
    } catch (error) {
      console.error("Erreur API:", error.response?.data || error.message);
      toast.error("Erreur lors de la génération du lien !");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success("Lien copié !");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Typography variant="h5" className="text-orange-500 font-bold text-center mb-4">
        📋 Créer un Formulaire d'Évaluation
      </Typography>

      <TextField
        label="Titre du formulaire"
        fullWidth
        variant="outlined"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        className="mb-4"
      />

      {/* ✅ Sélection de la formation */}
      <Select
        fullWidth
        value={selectedFormationId}
        onChange={(e) => setSelectedFormationId(e.target.value)}
        displayEmpty
        className="mb-4"
      >
        <MenuItem value="" disabled>Sélectionner une formation</MenuItem>
        <MenuItem value="64b1c2f5a8d1e4a5c2d3e4f6">Formation 1</MenuItem>
        <MenuItem value="64b1c3f5b9d1e5a6d3e5f7a">Formation 2</MenuItem>
      </Select>

      {questions.map((q, index) => (
        <div key={q.id} className="mb-4 p-4 border rounded">
          <TextField
            label={`Question ${index + 1}`}
            fullWidth
            variant="outlined"
            value={q.question}
            onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
            className="mb-2"
          />

          <Select
            value={q.type}
            onChange={(e) => updateQuestion(q.id, "type", e.target.value)}
            fullWidth
            className="mb-2"
          >
            <MenuItem value="text">Réponse libre</MenuItem>
            <MenuItem value="radio">Choix unique</MenuItem>
            <MenuItem value="checkbox">Choix multiple</MenuItem>
            <MenuItem value="number">Numérique</MenuItem>
          </Select>

          {(q.type === "radio" || q.type === "checkbox") && (
            <div className="space-y-2">
              {q.options?.map((option, i) => (
                <TextField
                  key={i}
                  label={`Option ${i + 1}`}
                  fullWidth
                  variant="outlined"
                  value={option}
                  onChange={(e) => updateOption(q.id, i, e.target.value)}
                />
              ))}
              <Button onClick={() => addOption(q.id)} variant="contained" className="bg-orange-500 text-white">
                Ajouter une option
              </Button>
            </div>
          )}

          <IconButton onClick={() => removeQuestion(q.id)} className="mt-2 text-red-500">
            <Trash2 size={18} />
          </IconButton>
        </div>
      ))}

      <Button onClick={addQuestion} variant="outlined" className="mb-4 text-orange-500">
        <PlusCircle size={20} className="mr-2" /> Ajouter une question
      </Button>

      <Button onClick={generateLink} variant="contained" fullWidth className="bg-orange-500 text-white">
        Générer un Lien
      </Button>

      {link && (
        <div className="mt-4 flex justify-between items-center bg-gray-100 p-3 rounded-md border">
          <span className="text-gray-700 font-medium truncate">{link}</span>
          <Button variant="outlined" size="small" onClick={copyToClipboard}>
            <Copy size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
