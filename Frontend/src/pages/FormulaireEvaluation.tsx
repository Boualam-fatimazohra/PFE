import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { Loader2, AlertTriangle, Star, Book, Users, CheckCircle, Sun, Coffee , Clock } from "lucide-react";

// Définition des champs d'évaluation
const evaluationFields = [
  { label: "Qualité du contenu de la formation", name: "contentQuality", icon: Book },
  { label: "Qualité des compétences acquises", name: "acquiredSkillsQuality", icon: Star },
  { label: "Alignement des compétences acquises avec vos besoins professionnels", name: "alignmentWithNeeds", icon: Users },
  { label: "Structure de la formation (rythme, progression pédagogique, etc.)", name: "trainingStructure", icon: Clock },
  { label: "Niveau de difficulté de la formation", name: "difficultyLevel", icon: Book },
  { label: "Qualité pédagogique du formateur (élocution, dynamisme, etc.)", name: "trainerPedagogyQuality", icon: Users },
  { label: "Expertise du formateur (niveau de connaissance dans son domaine)", name: "trainerExpertise", icon: Star },
  { label: "Qualité des supports de formation", name: "materialQuality", icon: Book },
  { label: "Qualité des exercices et des activités", name: "exercisesQuality", icon: Book },
  { label: "Adaptation au profil et au niveau des participants", name: "adaptationToParticipants", icon: Users },
  { label: "Confort de la salle", name: "roomComfort", icon: Sun },
  { label: "Accessibilité du lieu de formation", name: "accessibility", icon: Users },
  { label: "Horaires et pauses", name: "timingAndBreaks", icon: Coffee },
  { label: "État et disponibilité du matériel pédagogique", name: "equipmentCondition", icon: Book },
  { label: "Communication des informations d'ordre organisationnel", name: "organizationalCommunication", icon: Users },
  { label: "Gestion administrative", name: "administrativeManagement", icon: Users },
  { label: "Composition du groupe (taille et niveau)", name: "groupComposition", icon: Users },
  { label: "Durée de la formation", name: "trainingDuration", icon: Clock },
]

export default function EvaluationForm() {
  const { id, token } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [evaluation, setEvaluation] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const API_URL = import.meta.env.VITE_API_LINK || "";

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id || !token) {
        setError("Lien invalide. ID ou Token manquant.");
        setLoading(false);
        return;
      }

      try {
        const apiEndpoint = `${API_URL}/api/formation/GetOneFormation/${id}`;
        
        // Ensure token is properly formatted in the Authorization header
        const headers = new Headers({
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        const response = await fetch(apiEndpoint, { 
          method: 'GET',
          headers: headers,
          credentials: 'include' // Include cookies if needed
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Session expirée ou non autorisée. Veuillez vous reconnecter.");
          }
          const errorText = await response.text();
          throw new Error(`Erreur ${response.status}: ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Réponse API non valide (format incorrect)");
        }

        const data = await response.json();
        setCourseDetails(data);
      } catch (err) {
        console.error("Erreur API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, token, API_URL]);

  const handleInputChange = (name, value) => {
    setEvaluation(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!courseDetails?.mentors?.length) {
        throw new Error("Informations sur le formateur manquantes.");
      }

      const submitEndpoint = `${API_URL}/api/evaluation/SubmitEvaluation`;
      
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      const response = await fetch(submitEndpoint, {
        method: "POST",
        headers: headers,
        credentials: 'include',
        body: JSON.stringify({
          ...evaluation,
          courseId: id,
          mentorId: courseDetails.mentors[0]._id
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      setIsSubmitted(true);
      toast.success("Évaluation soumise avec succès !");
    } catch (error) {
      console.error("Erreur soumission:", error);
      toast.error(`Échec : ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };
// export default function EvaluationForm() {
//   const { id, token } = useParams();
//   const [courseDetails, setCourseDetails] = useState(null);
//   const [evaluation, setEvaluation] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   // Récupérer l'URL de l'API
//   const API_URL = import.meta.env.VITE_API_LINK || "";

//   useEffect(() => {
//     console.log("ID formation:", id);
//     console.log("API URL:", API_URL);
//     console.log("Token utilisateur:", token);
//     console.log("VITE_API_LINK:", import.meta.env.VITE_API_LINK);

//     if (!id || !token) {
//       setError("Lien invalide. ID ou Token manquant.");
//       setLoading(false);
//       return;
//     }

//     const fetchCourseDetails = async () => {
//       const apiEndpoint = `${API_URL}/api/formation/GetOneFormation/${id}`;
      
//       try {
//         console.log("URL de l'API appelée :", apiEndpoint);
//         const response = await fetch(apiEndpoint, { 
//           headers: { 
//           "Accept": "application/json" ,
//           "Authorization": `Bearer ${token}`
//         } });

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Erreur ${response.status}: ${errorText}`);
//         }

//         // Vérifier si la réponse est JSON
//         const contentType = response.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//           throw new Error("Réponse API non valide (HTML reçu au lieu de JSON)");
//         }

//         const data = await response.json();
//         setCourseDetails(data);
//       } catch (err) {
//         console.error("Erreur API:", err);
//         setError(`Impossible de charger les détails du cours: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourseDetails();
//   }, [id, token, API_URL]);

//   const handleInputChange = (name, value) => {
//     setEvaluation((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       if (!courseDetails || !courseDetails.mentors || courseDetails.mentors.length === 0) {
//         throw new Error("Informations sur le formateur manquantes.");
//       }

//       const submitEndpoint = `${API_URL}/api/evaluation/SubmitEvaluation`;

//       const response = await fetch(submitEndpoint, {
//         method: "POST",
//         headers: { 
//           "Content-Type": "application/json" ,
//           "Authorization": `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           ...evaluation,
//           courseId: id,
//           mentorId: courseDetails.mentors[0]._id,
//           token: token,
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Erreur ${response.status}: ${errorText}`);
//       }

//       setIsSubmitted(true);
//       toast.success("Évaluation soumise avec succès !");
//     } catch (error) {
//       console.error("Erreur soumission:", error);
//       toast.error(`Échec : ${error.message}`);
//     } finally {
//       setSubmitting(false);
//     }
//   };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100">
        <Loader2 className="w-16 h-16 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100">
        <AlertTriangle className="w-20 h-20 text-red-500 mb-4" />
        <p className="text-2xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Card className="w-full max-w-md mx-auto shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
              <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-8 h-8" />
                Merci !
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <p className="text-lg text-gray-700 text-center">
                Nous apprécions votre retour. Vos commentaires nous aideront à améliorer nos formations.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-w-screen p-8 bg-gradient-to-br from-gray-100 to-gray-200">
  <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    
    {/* Première Card qui prend presque toute la taille de la page */}
    <Card className="w-full shadow-lg overflow-hidden min-h-screen flex flex-col">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardTitle className="text-3xl font-bold text-center">Évaluation de la formation</CardTitle>
        {courseDetails && <p className="text-center text-white text-lg mt-2">{courseDetails.title}</p>}
      </CardHeader>
      
      <CardContent className="p-6 bg-white flex-grow">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Conteneur des questions, chaque deux questions côte à côte */}
          <div className="grid grid-cols-2 gap-4">
            {evaluationFields.map((field, index) => (
              <Card key={field.name} className="shadow-lg overflow-hidden p-4">
                <Label htmlFor={field.name} className="font-bold text-lg">{field.label}</Label>
                <div className="flex space-x-2 mt-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <FaStar
                      key={value}
                      size={30}
                      className={`cursor-pointer ${evaluation[field.name] >= value ? "text-yellow-500" : "text-gray-300"}`}
                      onClick={() => handleInputChange(field.name, value)}
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>

        </form>
      </CardContent>
      <CardContent className="p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Recommanderiez-vous cette formation ? */}
            <div>
              <Label className="font-bold text-lg">Recommanderiez-vous cette formation autour de vous ?</Label>
              <RadioGroup className="mt-2 flex space-x-4" onValueChange={(value) => handleInputChange("recommendation", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="oui" id="oui" />
                  <Label htmlFor="oui">Oui</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non" id="non" />
                  <Label htmlFor="non">Non</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Commentaires */}
            <div>
              <Label htmlFor="comments" className="font-bold text-lg">Commentaires et appréciation générale :</Label>
              <Textarea id="comments" className="mt-2" onChange={(e) => handleInputChange("comments", e.target.value)} />
            </div>
            
            <Button type="submit" disabled={submitting} className="w-full bg-orange-500 text-white">Soumettre</Button>
          </form>
        </CardContent>
    </Card>

  </motion.div>
</div>
  );
}