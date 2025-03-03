import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Book,
  Search,
  UserCheck,
  Briefcase,
  Award,
  FileText,
  ChevronRight,
  Download,
  Check,
  X,
  BarChart2,
  Edit,
  ClipboardList
} from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import { EvaluationsTable } from "@/components/dashboardElement/EvaluationTable";
import { SearchBar } from "@/components/dashboardElement/SearchBar";
import { useFormations } from "@/contexts/FormationContext";
import BarChart from "recharts/lib/chart/BarChart";
import Bar from "recharts/lib/cartesian/Bar";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import Tooltip from "recharts/lib/component/Tooltip";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";
import Line  from "recharts/lib/component/ResponsiveContainer";
import LineChart  from "recharts/lib/component/ResponsiveContainer";
import  Legend   from "recharts/lib/component/ResponsiveContainer";
import PieChart  from "recharts/lib/component/ResponsiveContainer";
import Pie  from "recharts/lib/component/ResponsiveContainer";
import Cell  from "recharts/lib/component/ResponsiveContainer";
const FormationDashboard = () => {
  const navigate = useNavigate();
  const [activeFormateur, setActiveFormateur] = useState("all");
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);

  // Sample data
  const formateurs = [
    { id: "f1", name: "Thomas Dubois", avatar: "/avatars/thomas.jpg", formations: 3 },
    { id: "f2", name: "Marie Laurent", avatar: "/avatars/marie.jpg", formations: 2 },
    { id: "f3", name: "Jean Martin", avatar: "/avatars/jean.jpg", formations: 4 },
  ];

  const formations = [
    { 
      id: "form1", 
      title: "JavaScript Avancé", 
      formateur: "f1",
      status: "En cours",
      startDate: "2025-02-15",
      endDate: "2025-03-15",
      inscrits: 25,
      confirmes: 22,
      presents: 20,
      reglementSigne: 18,
      hommes: 12,
      femmes: 10,
      occurrence: 3
    },
    { 
      id: "form2", 
      title: "React Fundamentals", 
      formateur: "f2",
      status: "En cours",
      startDate: "2025-02-20",
      endDate: "2025-03-20",
      inscrits: 20,
      confirmes: 18,
      presents: 17,
      reglementSigne: 16,
      hommes: 10,
      femmes: 8,
      occurrence: 2
    },
    { 
      id: "form3", 
      title: "UX Design", 
      formateur: "f3",
      status: "Terminé",
      startDate: "2025-01-10",
      endDate: "2025-02-10",
      inscrits: 18,
      confirmes: 15,
      presents: 14,
      reglementSigne: 15,
      hommes: 7,
      femmes: 8,
      occurrence: 4
    }
  ];
  const evaluations = [
    {
      id: "eval1",
      formation: "JavaScript Avancé",
      formateur: "Thomas Dubois",
      date: "2025-02-25",
      satisfaction: 4.5,
      pedagogie: 4.7,
      contenu: 4.3,
      commentaires: [
        "Excellente formation, très pratique",
        "Le formateur explique très bien les concepts"
      ]
    },
    {
      id: "eval2",
      formation: "React Fundamentals",
      formateur: "Marie Laurent",
      date: "2025-02-22",
      satisfaction: 4.2,
      pedagogie: 4.1,
      contenu: 4.5,
      commentaires: [
        "Bonne introduction à React",
        "Aurait pu avoir plus d'exercices pratiques"
      ]
    }
  ];

  const competences = [
    {
      id: "comp1",
      beneficiaire: "Sophie Martin",
      hardSkills: [
        { skill: "JavaScript", level: 85 },
        { skill: "React", level: 70 },
        { skill: "Node.js", level: 65 }
      ],
      softSkills: [
        { skill: "Communication", level: 90 },
        { skill: "Travail d'équipe", level: 85 },
        { skill: "Résolution de problèmes", level: 75 }
      ],
      codingame: 1850,
      veilleTech: [
        { sujet: "GraphQL", date: "2025-02-20", qualite: "Excellente" },
        { sujet: "Microservices", date: "2025-02-10", qualite: "Bonne" }
      ]
    },
    {
      id: "comp2",
      beneficiaire: "Lucas Dupont",
      hardSkills: [
        { skill: "JavaScript", level: 75 },
        { skill: "React", level: 80 },
        { skill: "Node.js", level: 60 }
      ],
      softSkills: [
        { skill: "Communication", level: 75 },
        { skill: "Travail d'équipe", level: 90 },
        { skill: "Résolution de problèmes", level: 85 }
      ],
      codingame: 2100,
      veilleTech: [
        { sujet: "WebAssembly", date: "2025-02-15", qualite: "Très bonne" }
      ]
    }
  ];

  const beneficiaires = [
    { id: "b1", nom: "Sophie Martin", formation: "JavaScript Avancé", presence: 95, portfolio: "Complet" },
    { id: "b2", nom: "Lucas Dupont", formation: "JavaScript Avancé", presence: 90, portfolio: "En cours" },
    { id: "b3", nom: "Emma Lefebvre", formation: "JavaScript Avancé", presence: 85, portfolio: "Incomplet" },
    { id: "b4", nom: "Thomas Bernard", formation: "React Fundamentals", presence: 98, portfolio: "Complet" },
    { id: "b5", nom: "Julie Morel", formation: "React Fundamentals", presence: 88, portfolio: "En cours" }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const handleFormateurChange = (id) => {
    setActiveFormateur(id);
  };

  const handleFormationSelect = (formation) => {
    setSelectedFormation(formation);
  };


  const handleCreateClass = () => {
    navigate("/bootcamp/class/create");
  };

  const handleAssignProject = () => {
    navigate("/bootcamp/project/assign");
  };
  const handleSearch = (searchValue) => {
    console.log("Searching for:", searchValue);
    // Implement comprehensive search logic here
  };
  const handleBootcampClick = () => {
    navigate("/BootcampsList"); // Redirige vers Bootcamps.tsx
  };
  

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <ToastContainer />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">Vue Dashboard (Formation)</h1>
              <p className="text-gray-500">Gestion et suivi des formations et bootcamps</p>
            </div>
            <div className="flex gap-4">
            <SearchBar onSearch={handleSearch} />
              
            </div>
          </div>
          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="formations" className="mb-8">
            <TabsList className="mb-6 bg-white p-1 w-full">
              <TabsTrigger value="formations" className="flex items-center py-3">
                <Book size={18} className="mr-2" />
                Formations
              </TabsTrigger>
              
                <TabsTrigger 
                    value="bootcamps" 
                    onClick={handleBootcampClick} // Ajoutez l'événement onClick
                    className="flex items-center py-3"
                >
                    <Briefcase size={18} className="mr-2" />
                    Bootcamps
                </TabsTrigger>
                <TabsTrigger value="competences" className="flex items-center py-3">
            <Award size={18} className="mr-2" />
            Suivi Compétences
          </TabsTrigger>
              <TabsTrigger value="evaluations" className="flex items-center py-3">
                <ClipboardList size={18} className="mr-2" />
                Évaluations
              </TabsTrigger>
            </TabsList>

            {/* Formations Tab Content */}
            <TabsContent value="formations" className="border-none p-0">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Formateurs Sidebar */}
                <Card className="lg:col-span-1 border-[#999999] rounded-none">
                  <CardHeader>
                    <CardTitle>Formateurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      <button 
                        className={`flex items-center p-3 rounded-md ${activeFormateur === 'all' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'}`}
                        onClick={() => handleFormateurChange('all')}
                      >
                        <Users size={20} className="mr-2" />
                        <span>Tous les formateurs</span>
                      </button>
                      
                      {formateurs.map(formateur => (
                        <button 
                          key={formateur.id}
                          className={`flex items-center p-3 rounded-md ${activeFormateur === formateur.id ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'}`}
                          onClick={() => handleFormateurChange(formateur.id)}
                        >
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={formateur.avatar} alt={formateur.name} />
                            <AvatarFallback>{formateur.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{formateur.name}</div>
                            <div className="text-xs text-gray-500">{formateur.formations} formations</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Formations List */}
                <Card className="lg:col-span-3 border-[#999999] rounded-none">
                  {!selectedFormation ? (
                    <>
                      <CardHeader>
                        <CardTitle>Formations en cours</CardTitle>
                        <CardDescription>
                          {activeFormateur === 'all' 
                            ? 'Toutes les formations' 
                            : `Formations de ${formateurs.find(f => f.id === activeFormateur)?.name || ''}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {formations
                            .filter(f => activeFormateur === 'all' || f.formateur === activeFormateur)
                            .map(formation => (
                              <div 
                                key={formation.id} 
                                className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleFormationSelect(formation)}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="text-lg font-medium">{formation.title}</h3>
                                    <div className="flex items-center mt-1">
                                      <span className="text-sm text-gray-500 mr-4">
                                        Formateur: {formateurs.find(f => f.id === formation.formateur)?.name}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {new Date(formation.startDate).toLocaleDateString()} - {new Date(formation.endDate).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <Badge className={formation.status === "En cours" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                                      {formation.status}
                                    </Badge>
                                    <ChevronRight size={20} className="ml-2 text-gray-400" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                  <div className="text-center">
                                    <div className="text-lg font-semibold">{formation.inscrits}</div>
                                    <div className="text-xs text-gray-500">Inscrits</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-semibold">{formation.presents}</div>
                                    <div className="text-xs text-gray-500">Présents</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-semibold">{Math.round((formation.reglementSigne / formation.inscrits) * 100)}%</div>
                                    <div className="text-xs text-gray-500">Règlement signé</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>{selectedFormation.title}</CardTitle>
                          <CardDescription>
                            Formateur: {formateurs.find(f => f.id === selectedFormation.formateur)?.name}
                          </CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => setSelectedFormation(null)}>
                          Retour
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Formation Stats */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="p-4 border rounded-md bg-white">
                              <div className="text-sm font-medium text-gray-500">Inscrits</div>
                              <div className="text-2xl font-bold">{selectedFormation.inscrits}</div>
                            </Card>
                            <Card className="p-4 border rounded-md bg-white">
                              <div className="text-sm font-medium text-gray-500">Confirmés</div>
                              <div className="text-2xl font-bold">{selectedFormation.confirmes}</div>
                            </Card>
                            <Card className="p-4 border rounded-md bg-white">
                              <div className="text-sm font-medium text-gray-500">Présents</div>
                              <div className="text-2xl font-bold">{selectedFormation.presents}</div>
                            </Card>
                            <Card className="p-4 border rounded-md bg-white">
                              <div className="text-sm font-medium text-gray-500">Occurrences</div>
                              <div className="text-2xl font-bold">{selectedFormation.occurrence}</div>
                            </Card>
                          </div>
                          
                          {/* KPIs */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <Card className="p-4 border rounded-md bg-white">
                              <div className="text-sm font-medium text-gray-500 mb-1">Taux de présentéisme</div>
                              <Progress value={(selectedFormation.presents / selectedFormation.inscrits) * 100} className="h-2 mb-1" />
                              <div className="text-sm font-medium">{Math.round((selectedFormation.presents / selectedFormation.inscrits) * 100)}%</div>
                            </Card>
                            <Card className="p-4 border rounded-md bg-white">
                              <div className="text-sm font-medium text-gray-500 mb-1">Taux de déperdition</div>
                              <Progress value={((selectedFormation.inscrits - selectedFormation.presents) / selectedFormation.inscrits) * 100} className="h-2 mb-1" />
                              <div className="text-sm font-medium">{Math.round(((selectedFormation.inscrits - selectedFormation.presents) / selectedFormation.inscrits) * 100)}%</div>
                            </Card>
                            <Card className="p-4 border rounded-md bg-white">
                              <div className="text-sm font-medium text-gray-500 mb-1">Règlement intérieur signé</div>
                              <Progress value={(selectedFormation.reglementSigne / selectedFormation.inscrits) * 100} className="h-2 mb-1" />
                              <div className="text-sm font-medium">{Math.round((selectedFormation.reglementSigne / selectedFormation.inscrits) * 100)}%</div>
                            </Card>
                          </div>
                          
                          {/* Gender ratio */}
                          <Card className="border rounded-md bg-white p-4">
                            <h3 className="text-lg font-medium mb-4">Ratio Femme/Homme</h3>
                            <div className="flex items-center">
                              <div className="w-2/3">
                                <ResponsiveContainer width="100%" height={200}>
                                  <PieChart>
                                    <Pie
                                      data={[
                                        { name: 'Hommes', value: selectedFormation.hommes },
                                        { name: 'Femmes', value: selectedFormation.femmes }
                                      ]}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      fill="#8884d8"
                                      paddingAngle={5}
                                      dataKey="value"
                                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                      <Cell fill="#0088FE" />
                                      <Cell fill="#FF8042" />
                                    </Pie>
                                    <Tooltip />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="w-1/3">
                                <div className="mb-2">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-500 mr-2"></div>
                                    <span>Hommes: {selectedFormation.hommes}</span>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 bg-orange-500 mr-2"></div>
                                    <span>Femmes: {selectedFormation.femmes}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                          
                          {/* Bénéficiaires */}
                          <Card className="border rounded-md bg-white p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-medium">Liste des bénéficiaires</h3>
                              <Button variant="outline" size="sm">
                                <Download size={16} className="mr-2" />
                                Exporter
                              </Button>
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nom</TableHead>
                                  <TableHead>Présence</TableHead>
                                  <TableHead>Règlement signé</TableHead>
                                  <TableHead>Portfolio</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {beneficiaires
                                  .filter(b => b.formation === selectedFormation.title)
                                  .map(beneficiaire => (
                                    <TableRow key={beneficiaire.id}>
                                      <TableCell className="font-medium">{beneficiaire.nom}</TableCell>
                                      <TableCell>{beneficiaire.presence}%</TableCell>
                                      <TableCell>
                                        {Math.random() > 0.3 ? (
                                          <Badge className="bg-green-100 text-green-800">Signé</Badge>
                                        ) : (
                                          <Badge className="bg-red-100 text-red-800">Non signé</Badge>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <Badge className={
                                          beneficiaire.portfolio === "Complet" 
                                            ? "bg-green-100 text-green-800" 
                                            : beneficiaire.portfolio === "En cours" 
                                              ? "bg-yellow-100 text-yellow-800" 
                                              : "bg-red-100 text-red-800"
                                        }>
                                          {beneficiaire.portfolio}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Button variant="ghost" size="sm">
                                          Détails
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </Card>
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FormationDashboard;