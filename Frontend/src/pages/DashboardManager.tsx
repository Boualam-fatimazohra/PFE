import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboardElement/StatsCard";
import { FormationsTable } from "@/components/dashboardElement/FormationTable";
import KitFormateur from "@/components/dashboardElement/KitFormateur";
import RapportCard from "@/components/dashboardElement/RapportCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Share2, 
  Calendar, 
  BarChart2, 
  Users, 
  Activity, 
  Clock, 
  AlertTriangle,
  Book,
  Search,
  UserCheck
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

const DashboardManager = () => {
  const navigate = useNavigate();
  const { formations } = useFormations();
  const [formationCount, setFormationCount] = useState(0);
  const [beneficiaryCount, setBeneficiaryCount] = useState(250);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState("semestre");
  const [ageFilter, setAgeFilter] = useState("all");
  const [notificationCount, setNotificationCount] = useState(3);

  // Sample data for visualizations
  const absenceData = [
    { name: 'Jan', rate: 5 },
    { name: 'Feb', rate: 7 },
    { name: 'Mar', rate: 8 },
    { name: 'Apr', rate: 3 },
    { name: 'May', rate: 4 },
    { name: 'Jun', rate: 6 },
  ];

  const kpiData = [
    { name: 'Chercheur d\'emploi', value: 65 },
    { name: 'En emploi', value: 35 },
  ];

  const genderData = [
    { name: 'Homme', value: 55 },
    { name: 'Femme', value: 45 },
  ];

  const mobilityData = [
    { name: 'Standard', value: 85 },
    { name: 'Mobilité réduite', value: 15 },
  ];

  const educationData = [
    { level: 'Baccalauréat', percentage: 30 },
    { level: 'Licence', percentage: 40 },
    { level: 'Master', percentage: 20 },
    { level: 'Doctorat', percentage: 5 },
    { level: 'Autre', percentage: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    if (formations) {
      setFormationCount(formations.length);
      setIsLoading(false);
    }
  }, [formations]);

  useEffect(() => {
    const handleChatbotToggle = (event) => {
      if (event.detail) {
        setIsChatbotOpen(event.detail.isOpen);
      }
    };

    window.addEventListener('chatbotToggled', handleChatbotToggle);
    
    return () => {
      window.removeEventListener('chatbotToggled', handleChatbotToggle);
    };
  }, []);

  const handleOpenModal = () => {
    navigate("/formationModal");
  };

  const handleSearch = (searchValue) => {
    console.log("Searching for:", searchValue);
    // Implement comprehensive search logic here
  };

  const handlePeriodChange = (value) => {
    setTimePeriod(value);
    console.log("Time period changed to:", value);
    // Update data based on selected time period
  };

  const handleAgeFilterChange = (value) => {
    setAgeFilter(value);
    console.log("Age filter changed to:", value);
    // Filter data based on age group
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <ToastContainer />
      
      <main className={`flex-grow bg-gray-50 transition-all duration-300 ${isChatbotOpen ? 'translate-x-[-0rem]' : ''}`}>
        <div className={`transition-all duration-300 px-4 py-8 ${isChatbotOpen ? 'w-[calc(100%-30rem)]' : 'container mx-auto'}`}>

          {/* Header Section with Notifications */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">Vue d'Ensemble</h1>
              <p className="text-gray-500">Dashboard Principal</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="relative">
                <div className="absolute hidden group-hover:block right-0 mt-2 bg-white shadow-lg rounded-md p-2 w-64">
                  <p className="text-sm">3 bénéficiaires n'ont pas signé le règlement intérieur.</p>
                </div>
              </div>              
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-md shadow-sm">
            <div className="flex items-center gap-4">
              <span className="font-medium">Période:</span>
              <Select value={timePeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semaine">Semaine</SelectItem>
                  <SelectItem value="mois">Mois</SelectItem>
                  <SelectItem value="trimestre">Trimestre</SelectItem>
                  <SelectItem value="semestre">Semestre</SelectItem>
                  <SelectItem value="annee">Année</SelectItem>
                  <SelectItem value="toujours">Toujours</SelectItem>
                </SelectContent>
              </Select>
              <span className="font-medium">Tranche d'âge:</span>
              <Select value={ageFilter} onValueChange={handleAgeFilterChange}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Âge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="under18">-18 ans</SelectItem>
                  <SelectItem value="18to24">18 à 24 ans</SelectItem>
                  <SelectItem value="25to35">25 à 35 ans</SelectItem>
                  <SelectItem value="over35">+35 ans</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button className="text-orange-500 flex items-center gap-2">
              <Share2 size={18} />
              <span>Exporter</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Bénéficiaires" 
              value={beneficiaryCount} 
              // icon={<Users className="text-blue-500" />} 
              // change="+5% depuis dernier mois"
            />
            <StatsCard 
              title="Total Formations" 
              value={isLoading ? '...' : formationCount} 
              // icon={<Book className="text-green-500" />}
              // change="+2 nouvelles ce mois"
            />
            <StatsCard 
              title="Prochain événement" 
              value="07 jours" 
              // icon={<Calendar className="text-purple-500" />}
              // change="Formation JavaScript"
            />
            <StatsCard 
              title="Satisfaction moyenne" 
              value="95%" 
              // icon={<Activity className="text-orange-500" />}
              // change="+2% depuis dernier mois"
            />
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="planification" className="mb-8">
            <TabsList className="mb-6 bg-white p-1 w-full">
              <TabsTrigger value="planification" className="flex-1 py-3">
                <Calendar size={18} className="mr-2" />
                Planification
              </TabsTrigger>
              <TabsTrigger value="kpi" className="flex-1 py-3">
                <BarChart2 size={18} className="mr-2" />
                KPI Performance
              </TabsTrigger>
              <TabsTrigger value="absences" className="flex-1 py-3">
                <Clock size={18} className="mr-2" />
                Gestion d'Absence
              </TabsTrigger>
              <TabsTrigger value="beneficiaires" className="flex-1 py-3">
                <Users size={18} className="mr-2" />
                Bénéficiaires
              </TabsTrigger>
            </TabsList>

            {/* Planification Content */}
            <TabsContent value="planification" className="border-none p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-[#999999] rounded-none">
                  <CardHeader>
                    <CardTitle>Calendrier des Formations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Formations à venir</h3>
                      <button className="text-orange-500">Voir tout</button>
                    </div>
                    <FormationsTable />
                  </CardContent>
                </Card>

                <Card className="border-[#999999] rounded-none">
                  <CardHeader>
                    <CardTitle>Évaluations en cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RapportCard />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* KPI Performance Content */}
            <TabsContent value="kpi" className="border-none p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-[#999999] rounded-none">
                  <CardHeader>
                    <CardTitle>Situation Professionnelle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={kpiData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {kpiData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-[#999999] rounded-none">
                  <CardHeader>
                    <CardTitle>Participation par Genre et Mobilité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Répartition par Genre</h3>
                        <ResponsiveContainer width="100%" height={100}>
                          <PieChart>
                            <Pie
                              data={genderData}
                              cx="50%"
                              cy="50%"
                              outerRadius={40}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {genderData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Mobilité</h3>
                        <ResponsiveContainer width="100%" height={100}>
                          <PieChart>
                            <Pie
                              data={mobilityData}
                              cx="50%"
                              cy="50%"
                              outerRadius={40}
                              fill="#8884d8"
                              dataKey="value"
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {mobilityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Gestion d'Absence Content */}
            <TabsContent value="absences" className="border-none p-0">
              <Card className="border-[#999999] rounded-none">
                <CardHeader>
                  <CardTitle>Taux de Déperdition des Formations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Vue d'ensemble</h3>
                    <p className="text-gray-500">Taux moyen d'absence: 5.5%</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={absenceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="rate" stroke="#FF8042" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bénéficiaires Content */}
            <TabsContent value="beneficiaires" className="border-none p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-[#999999] rounded-none">
                  <CardHeader>
                    <CardTitle>Niveau de Scolarité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={educationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="level" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="percentage" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-[#999999] rounded-none">
                  <CardHeader>
                    <CardTitle>Contrôle des Règlements Intérieurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">État des signatures</h3>
                        <p className="text-gray-500">3 bénéficiaires n'ont pas signé</p>
                      </div>
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        Action requise
                      </span>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formation</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">Jean Dupont</td>
                          <td className="px-6 py-4 whitespace-nowrap">JavaScript Avancé</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                              Non signé
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-orange-500">Rappeler</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">Marie Martin</td>
                          <td className="px-6 py-4 whitespace-nowrap">React Fundamentals</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                              Non signé
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-orange-500">Rappeler</button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">Lucas Bernard</td>
                          <td className="px-6 py-4 whitespace-nowrap">UX Design</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                              Non signé
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-orange-500">Rappeler</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>

              {/* Recherche Bénéficiaire et Recommandations */}
              <div className="grid grid-cols-1 mt-6">
                <Card className="border-[#999999] rounded-none">
                  <CardHeader>
                    <CardTitle>Historique et Recommandations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/2">
                        <h3 className="text-lg font-semibold mb-4">Recherche Historique</h3>
                        <div className="mb-4">
                          <SearchBar onSearch={handleSearch} />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-500 text-sm text-center">
                            Recherchez un bénéficiaire pour voir son historique de formations
                          </p>
                        </div>
                      </div>
                      <div className="w-full md:w-1/2">
                        <h3 className="text-lg font-semibold mb-4">Recommandations Formateurs</h3>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-md">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">Sophie Dubois</h4>
                                <p className="text-sm text-gray-500">Formation: UX Design</p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-yellow-500">★★★★☆</span>
                                <span className="ml-2 text-sm text-gray-500">4.2/5</span>
                              </div>
                            </div>
                            <p className="mt-2 text-sm">
                              "Excellente participante, très investie et créative."
                            </p>
                          </div>
                          <div className="p-4 border rounded-md">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">Thomas Leroy</h4>
                                <p className="text-sm text-gray-500">Formation: JavaScript</p>
                              </div>
                              <div className="flex items-center">
                                <span className="text-yellow-500">★★★★★</span>
                                <span className="ml-2 text-sm text-gray-500">4.8/5</span>
                              </div>
                            </div>
                            <p className="mt-2 text-sm">
                              "Apprend rapidement et aide ses camarades. Potentiel pour devenir formateur."
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
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

export default DashboardManager;