import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SearchBar } from "@/components/dashboardElement/SearchBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Users, 
  Briefcase,
  FileText,
  Edit,
  Book,
  Award,
  Download,
  ClipboardList
} from "lucide-react";
import BarChart from "recharts/lib/chart/BarChart";
import Bar from "recharts/lib/cartesian/Bar";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import Tooltip from "recharts/lib/component/Tooltip";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";
import PieChart from "recharts/lib/chart/PieChart";
import Pie from "recharts/lib/polar/Pie";
import Cell from "recharts/lib/component/Cell";

const BootcampsList = () => {
  const navigate = useNavigate();
  const [selectedBootcamp, setSelectedBootcamp] = useState(null);

  const bootcamps = [
    {
      id: "boot1",
      title: "Full Stack Developer Bootcamp",
      status: "En cours",
      startDate: "2025-01-15",
      endDate: "2025-04-15",
      classes: [
        { id: "c1", name: "Class Alpha", type: "Web Development", beneficiaires: 12 },
        { id: "c2", name: "Class Beta", type: "Mobile Development", beneficiaires: 10 }
      ],
      inscrits: 25,
      confirmes: 22,
      presents: 20,
      reglementSigne: 18,
      hommes: 15,
      femmes: 7,
      projets: [
        { id: "p1", title: "E-commerce Platform", deadline: "2025-03-15", status: "En cours" },
        { id: "p2", title: "Community Forum", deadline: "2025-04-01", status: "Planifié" }
      ],
      absences: [
        { date: "2025-02-28", count: 2 },
        { date: "2025-02-27", count: 1 },
        { date: "2025-02-26", count: 3 }
      ]
    },
    {
      id: "boot2",
      title: "Data Science Bootcamp",
      status: "Planifié",
      startDate: "2025-04-01",
      endDate: "2025-07-01",
      classes: [],
      inscrits: 15,
      confirmes: 12,
      presents: 0,
      reglementSigne: 8,
      hommes: 9,
      femmes: 6,
      projets: [],
      absences: []
    }
  ];

  const handleBootcampSelect = (bootcamp) => {
    setSelectedBootcamp(bootcamp);
  };

  const handleCreateBootcamp = () => {
    // Navigate to bootcamp creation page or open modal
    navigate("/bootcamps/create");
  };

  const handleCreateClass = () => {
    // Navigate to class creation page or open modal
    navigate(`/bootcamps/${selectedBootcamp.id}/classes/create`);
  };

  const handleAssignProject = () => {
    // Navigate to project assignment page or open modal
    navigate(`/bootcamps/${selectedBootcamp.id}/projects/assign`);
  };
  
  const handleBootcampClick = () => {
    navigate("/BootcampsList"); // Redirige vers Bootcamps.tsx
  };
  const handleFormationClick = () => {
    navigate("/FormationDashboard"); // Redirige vers Bootcamps.tsx
  };
  const handleSearch = (searchValue) => {
    console.log("Searching for:", searchValue);
    // Implement comprehensive search logic here
  };

  return (
    <div className="container mx-auto py-6">
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
      {/* FIX: Wrap the top TabsList in a Tabs component */}
      <Tabs defaultValue="bootcamps">
        <TabsList className="mb-6 bg-white p-1 w-full">
          <TabsTrigger 
            value="Formations" 
            onClick={handleFormationClick}
            className="flex items-center py-3">
            {/* <Briefcase size={18} className="mr-2" /> */}
            <Book size={18} className="mr-2" />
            Formations
          </TabsTrigger>
          
          <TabsTrigger 
            value="bootcamps" 
            onClick={handleBootcampClick}
            className="flex items-center py-3">
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
        
        {/* Add TabsContent components for these tabs */}
        <TabsContent value="formations">
          <div className="p-4 text-center text-gray-500">
            Contenu pour les Formations
          </div>
        </TabsContent>
        
        <TabsContent value="bootcamps">
          {/* This is where your bootcamps content will go - the existing Tabs component below */}
          <Tabs defaultValue="bootcamps" className="my-6">
            <TabsList className="mb-6">
              <TabsTrigger value="bootcamps">Bootcamps</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="beneficiaires">Bénéficiaires</TabsTrigger>
            </TabsList>

            {/* Bootcamps Tab Content */}
            <TabsContent value="bootcamps" className="border-none p-0">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Bootcamps List */}
                <Card className="lg:col-span-1 border-[#999999] rounded-none">
                  <CardHeader>
                    <CardTitle>Bootcamps</CardTitle>
                    <Button 
                      onClick={handleCreateBootcamp}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Plus size={16} className="mr-2" />
                      Nouveau Bootcamp
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2">
                      {bootcamps.map(bootcamp => (
                        <button 
                          key={bootcamp.id}
                          className={`flex items-center p-3 rounded-md ${selectedBootcamp?.id === bootcamp.id ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'}`}
                          onClick={() => handleBootcampSelect(bootcamp)}
                        >
                          <Briefcase size={20} className="mr-2" />
                          <div className="flex-1 text-left">
                            <div className="font-medium">{bootcamp.title}</div>
                            <div className="text-xs flex justify-between mt-1">
                              <span className="text-gray-500">
                                {new Date(bootcamp.startDate).toLocaleDateString()} - {new Date(bootcamp.endDate).toLocaleDateString()}
                              </span>
                              <Badge className={
                                bootcamp.status === "En cours" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-blue-100 text-blue-800"
                              }>
                                {bootcamp.status}
                              </Badge>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Bootcamp Details */}
                <Card className="lg:col-span-3 border-[#999999] rounded-none">
                  {!selectedBootcamp ? (
                    <CardContent className="p-16 flex flex-col items-center justify-center text-center">
                      <Briefcase size={64} className="text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">Sélectionnez un bootcamp</h3>
                      <p className="text-gray-400 mb-4">Choisissez un bootcamp pour voir ses détails</p>
                      <Button 
                        onClick={handleCreateBootcamp}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Plus size={16} className="mr-2" />
                        Créer un nouveau bootcamp
                      </Button>
                    </CardContent>
                  ) : (
                    <>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>{selectedBootcamp.title}</CardTitle>
                          <CardDescription>
                            {new Date(selectedBootcamp.startDate).toLocaleDateString()} - {new Date(selectedBootcamp.endDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className={
                          selectedBootcamp.status === "En cours" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                        }>
                          {selectedBootcamp.status}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="gestion">
                          <TabsList className="mb-6 w-full">
                            <TabsTrigger value="gestion">Gestion Bootcamp</TabsTrigger>
                            <TabsTrigger value="admin">Gestion Admin</TabsTrigger>
                          </TabsList>

                          {/* Gestion Bootcamp */}
                          <TabsContent value="gestion" className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <Card className="p-4 border rounded-md bg-white">
                                <div className="text-sm font-medium text-gray-500">Inscrits</div>
                                <div className="text-2xl font-bold">{selectedBootcamp.inscrits}</div>
                              </Card>
                              <Card className="p-4 border rounded-md bg-white">
                                <div className="text-sm font-medium text-gray-500">Confirmés</div>
                                <div className="text-2xl font-bold">{selectedBootcamp.confirmes}</div>
                              </Card>
                              <Card className="p-4 border rounded-md bg-white">
                                <div className="text-sm font-medium text-gray-500">Présents</div>
                                <div className="text-2xl font-bold">{selectedBootcamp.presents}</div>
                              </Card>
                              <Card className="p-4 border rounded-md bg-white">
                                <div className="text-sm font-medium text-gray-500">Règlement signé</div>
                                <div className="text-2xl font-bold">{selectedBootcamp.reglementSigne}</div>
                              </Card>
                            </div>

                            {/* Classes Section */}
                            <Card className="border rounded-md bg-white p-4">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Classes</h3>
                                <Button 
                                  onClick={handleCreateClass}
                                  size="sm"
                                  className="bg-orange-500 hover:bg-orange-600"
                                >
                                  <Plus size={16} className="mr-2" />
                                  Ajouter une classe
                                </Button>
                              </div>
                              
                              {selectedBootcamp.classes.length > 0 ? (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Nom</TableHead>
                                      <TableHead>Type</TableHead>
                                      <TableHead>Bénéficiaires</TableHead>
                                      <TableHead>Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedBootcamp.classes.map(classe => (
                                      <TableRow key={classe.id}>
                                        <TableCell className="font-medium">{classe.name}</TableCell>
                                        <TableCell>{classe.type}</TableCell>
                                        <TableCell>{classe.beneficiaires}</TableCell>
                                        <TableCell>
                                          <Button variant="ghost" size="sm">
                                            <Edit size={16} className="mr-1" />
                                            Modifier
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <Users size={48} className="mx-auto text-gray-300 mb-2" />
                                  <p>Aucune classe créée pour ce bootcamp</p>
                                  <Button 
                                    onClick={handleCreateClass}
                                    variant="outline" 
                                    size="sm"
                                    className="mt-2"
                                  >
                                    <Plus size={16} className="mr-2" />
                                    Créer la première classe
                                  </Button>
                                </div>
                              )}
                            </Card>

                            {/* Projets Section */}
                            <Card className="border rounded-md bg-white p-4">
                              <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Projets</h3>
                                <Button 
                                  onClick={handleAssignProject}
                                  size="sm"
                                  className="bg-orange-500 hover:bg-orange-600"
                                >
                                  <Plus size={16} className="mr-2" />
                                  Assigner un projet
                                </Button>
                              </div>
                              
                              {selectedBootcamp.projets.length > 0 ? (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Titre</TableHead>
                                      <TableHead>Deadline</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedBootcamp.projets.map(projet => (
                                      <TableRow key={projet.id}>
                                        <TableCell className="font-medium">{projet.title}</TableCell>
                                        <TableCell>{new Date(projet.deadline).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                          <Badge className={
                                            projet.status === "En cours" 
                                              ? "bg-green-100 text-green-800" 
                                              : projet.status === "Planifié"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-gray-100 text-gray-800"
                                          }>
                                            {projet.status}
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
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <FileText size={48} className="mx-auto text-gray-300 mb-2" />
                                  <p>Aucun projet assigné pour ce bootcamp</p>
                                  <Button 
                                    onClick={handleAssignProject}
                                    variant="outline" 
                                    size="sm"
                                    className="mt-2"
                                  >
                                    <Plus size={16} className="mr-2" />
                                    Assigner un nouveau projet
                                  </Button>
                                </div>
                              )}
                            </Card>

                            {/* Assiduité Section */}
                            {selectedBootcamp.status === "En cours" && (
                              <Card className="border rounded-md bg-white p-4">
                                <h3 className="text-lg font-medium mb-4">Suivi d'assiduité</h3>
                                <div className="flex flex-col lg:flex-row gap-6">
                                  <div className="w-full lg:w-1/2">
                                    <h4 className="text-md font-medium mb-2">Dernières absences</h4>
                                    {selectedBootcamp.absences.length > 0 ? (
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Absents</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {selectedBootcamp.absences.map((absence, index) => (
                                            <TableRow key={index}>
                                              <TableCell>{new Date(absence.date).toLocaleDateString()}</TableCell>
                                              <TableCell>{absence.count}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    ) : (
                                      <p className="text-gray-500 text-center py-4">Aucune absence enregistrée</p>
                                    )}
                                  </div>
                                  <div className="w-full lg:w-1/2">
                                    <h4 className="text-md font-medium mb-2">Taux d'assiduité</h4>
                                    <ResponsiveContainer width="100%" height={200}>
                                      <BarChart
                                        data={[
                                          { name: 'Semaine 1', taux: 98 },
                                          { name: 'Semaine 2', taux: 95 },
                                          { name: 'Semaine 3', taux: 92 },
                                          { name: 'Semaine 4', taux: 94 }
                                        ]}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                      >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Bar dataKey="taux" fill="#FF8042" name="Taux d'assiduité (%)" />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              </Card>
                            )}
                          </TabsContent>

                          {/* Admin Tab */}
                          <TabsContent value="admin" className="space-y-6">
                            {/* KPIs */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              <Card className="p-4 border rounded-md bg-white">
                                <div className="text-sm font-medium text-gray-500 mb-1">Taux de présentéisme</div>
                                <Progress value={(selectedBootcamp.presents / selectedBootcamp.inscrits) * 100} className="h-2 mb-1" />
                                <div className="text-sm font-medium">{Math.round((selectedBootcamp.presents / selectedBootcamp.inscrits) * 100)}%</div>
                              </Card>
                              <Card className="p-4 border rounded-md bg-white">
                                <div className="text-sm font-medium text-gray-500 mb-1">Taux de déperdition</div>
                                <Progress value={((selectedBootcamp.inscrits - selectedBootcamp.presents) / selectedBootcamp.inscrits) * 100} className="h-2 mb-1" />
                                <div className="text-sm font-medium">{Math.round(((selectedBootcamp.inscrits - selectedBootcamp.presents) / selectedBootcamp.inscrits) * 100)}%</div>
                              </Card>
                              <Card className="p-4 border rounded-md bg-white">
                                <div className="text-sm font-medium text-gray-500 mb-1">Règlement intérieur signé</div>
                                <Progress value={(selectedBootcamp.reglementSigne / selectedBootcamp.inscrits) * 100} className="h-2 mb-1" />
                                <div className="text-sm font-medium">{Math.round((selectedBootcamp.reglementSigne / selectedBootcamp.inscrits) * 100)}%</div>
                              </Card>
                            </div>

                            {/* Documents administratifs */}
                            <Card className="border rounded-md bg-white p-4">
                              <h3 className="text-lg font-medium mb-4">Documents administratifs</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Document</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-medium">Convention de formation</TableCell>
                                    <TableCell>{new Date(selectedBootcamp.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                      <Badge className="bg-green-100 text-green-800">Signé</Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Button variant="ghost" size="sm">
                                        <Download size={16} className="mr-1" />
                                        Télécharger
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Règlement intérieur</TableCell>
                                    <TableCell>{new Date(selectedBootcamp.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                      <Badge className="bg-green-100 text-green-800">Signé</Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Button variant="ghost" size="sm">
                                        <Download size={16} className="mr-1" />
                                        Télécharger
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">Attestations de présence</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>
                                      <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Button variant="ghost" size="sm">
                                        <Edit size={16} className="mr-1" />
                                        Générer
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Card>

                            {/* Gender ratio */}
                            <Card className="border rounded-md bg-white p-4">
                              <h3 className="text-lg font-medium mb-4">Ratio Femme/Homme</h3>
                              <div className="flex items-center">
                                <div className="w-2/3">
                                  <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                      <Pie
                                        data={[
                                          { name: 'Hommes', value: selectedBootcamp.hommes },
                                          { name: 'Femmes', value: selectedBootcamp.femmes }
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
                                      <span>Hommes: {selectedBootcamp.hommes}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-orange-500 mr-2"></div>
                                      <span>Femmes: {selectedBootcamp.femmes}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </>
                  )}
                </Card>
              </div>
            </TabsContent>

            {/* Placeholder for other tabs */}
            <TabsContent value="classes">
              <div className="p-4 text-center text-gray-500">
                Contenu pour la gestion des classes
              </div>
            </TabsContent>
            
            <TabsContent value="beneficiaires">
              <div className="p-4 text-center text-gray-500">
                Contenu pour la gestion des bénéficiaires
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="competences">
          <div className="p-4 text-center text-gray-500">
            Contenu pour le Suivi Compétences
          </div>
        </TabsContent>
        
        <TabsContent value="evaluations">
          <div className="p-4 text-center text-gray-500">
            Contenu pour les Évaluations
          </div>
        </TabsContent>
      </Tabs>
      
      <Footer />
    </div>
  );
};

export default BootcampsList;