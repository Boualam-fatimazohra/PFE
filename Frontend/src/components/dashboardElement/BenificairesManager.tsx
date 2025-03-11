import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import { PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Legend, Line } from "recharts";
import { SearchBar } from "./SearchBar";
const diplomaData = [
    { name: "Fatima Boualam", diploma: "Licence Informatique", year: 2018, specialty: "Développement Web" },
    { name: "Khaoula boualam", diploma: "Master Design", year: 2020, specialty: "UX/UI Design" },
    { name: "Noura aoujil", diploma: "BTS Informatique", year: 2019, specialty: "Réseaux" },
    { name: "ikram ass-aad", diploma: "Baccalauréat", year: 2017, specialty: "Sciences" },
    { name: "saloua ouissa", diploma: "Master Informatique", year: 2021, specialty: "Intelligence Artificielle" }
  ];
const BenificairesManager = () => {

  const [selectedBeneficiary, setSelectedBeneficiary] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const beneficiaryHistoryData = [
    {
      id: 1,
      name: "Fatima boualam",
      formations: [
        { name: "JavaScript Avancé", date: "15/01/2023", completed: true, evaluation: 4.2 },
        { name: "React Fundamentals", date: "22/03/2023", completed: true, evaluation: 3.8 },
        { name: "Node.js", date: "10/06/2023", completed: false, evaluation: null }
      ],
      recommendations: [
        { formateur: "Pierre Legrand", comment: "Élève motivé mais nécessite plus de pratique", rating: 3.5 }
      ],
      reglementSigned: false
    },
    {
      id: 2,
      name: "Marie Martin",
      formations: [
        { name: "UX Design", date: "05/02/2023", completed: true, evaluation: 4.7 },
        { name: "React Fundamentals", date: "22/03/2023", completed: true, evaluation: 4.5 }
      ],
      recommendations: [
        { formateur: "Sophie Dubois", comment: "Excellente participante, très investie et créative", rating: 4.2 }
      ],
      reglementSigned: false
    },
    {
      id: 3,
      name: "Lucas Bernard",
      formations: [
        { name: "UX Design", date: "05/02/2023", completed: true, evaluation: 3.9 },
        { name: "JavaScript Avancé", date: "12/04/2023", completed: false, evaluation: null }
      ],
      recommendations: [
        { formateur: "Pierre Legrand", comment: "Bon élément mais manque d'assiduité", rating: 3.2 }
      ],
      reglementSigned: false
    },
    {
      id: 4,
      name: "Thomas Leroy",
      formations: [
        { name: "JavaScript Avancé", date: "15/01/2023", completed: true, evaluation: 4.8 },
        { name: "React Fundamentals", date: "22/03/2023", completed: true, evaluation: 4.6 },
        { name: "Node.js", date: "10/06/2023", completed: true, evaluation: 4.7 }
      ],
      recommendations: [
        { formateur: "Jean Dupont", comment: "Apprend rapidement et aide ses camarades. Potentiel pour devenir formateur", rating: 4.8 }
      ],
      reglementSigned: true
    }
  ];
  const handleSearch = (searchValue: string) => {
    setSearchQuery(searchValue);
    const foundBeneficiary = beneficiaryHistoryData.find(
      b => b.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSelectedBeneficiary(foundBeneficiary);
  };
  const educationData = [
    { level: 'Baccalauréat', percentage: 30 },
    { level: 'Licence', percentage: 40 },
    { level: 'Master', percentage: 20 },
    { level: 'Doctorat', percentage: 5 },
    { level: 'Autre', percentage: 5 },
  ];
  return (
    <TabsContent value="beneficiaires" className="border-none p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-[#999999] rounded-none">
                    <CardHeader>
                      <CardTitle>Recherche de Bénéficiaires</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <SearchBar onSearch={handleSearch} />
                      </div>
                      {selectedBeneficiary ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Informations du Bénéficiaire</h3>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="font-medium">{selectedBeneficiary.name}</p>
                            <p className="text-sm text-gray-500">Historique des formations:</p>
                            <ul className="list-disc list-inside">
                              {selectedBeneficiary.formations.map((formation, index) => (
                                <li key={index} className="text-sm">
                                  {formation.name} - {formation.date} {formation.completed ? `(Terminé, Évaluation: ${formation.evaluation})` : "(En cours)"}
                                </li>
                              ))}
                            </ul>
                            <p className="text-sm text-gray-500 mt-2">Recommandations:</p>
                            <ul className="list-disc list-inside">
                              {selectedBeneficiary.recommendations.map((recommendation, index) => (
                                <li key={index} className="text-sm">
                                  {recommendation.formateur}: {recommendation.comment} (Note: {recommendation.rating})
                                </li>
                              ))}
                            </ul>
                            <p className="text-sm text-gray-500 mt-2">Règlement intérieur: {selectedBeneficiary.reglementSigned ? "Signé" : "Non signé"}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">Aucun bénéficiaire sélectionné.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-[#999999] rounded-none">
                    <CardHeader>
                      <CardTitle>Statistiques des Bénéficiaires</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold">Répartition par Niveau d'Étude</h3>
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={educationData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="level" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="percentage" name="Pourcentage" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-[#999999] rounded-none mt-6">
                  <CardHeader>
                    <CardTitle>Liste des Diplômés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diplôme</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Année</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spécialité</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {diplomaData.map((diploma, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{diploma.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{diploma.diploma}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{diploma.year}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{diploma.specialty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </TabsContent>
  );
};

export default BenificairesManager ;
