import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Book, 
  Briefcase, 
  Award, 
  Users, 
  ClipboardList, 
  Calendar, 
  FileText, 
  Folder, 
  MapPin, 
  Clock, 
  FileCheck, 
  BarChart2, 
  ChevronDown 
} from "lucide-react";

const FormateurManager = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold">Espace Formateur</h1>
              <p className="text-gray-500">Gestion et suivi des formations et événements</p>
            </div>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="dashboard" className="mb-8">
            <TabsList className="mb-6 bg-white p-1 w-full">
              <TabsTrigger value="dashboard" className="flex items-center py-3">
                <BarChart2 size={18} className="mr-2" />
                Tableau de bord
              </TabsTrigger>
              <TabsTrigger value="formations" className="flex items-center py-3">
                <Book size={18} className="mr-2" />
                Formations
              </TabsTrigger>
              <TabsTrigger value="calendrier" className="flex items-center py-3">
                <Calendar size={18} className="mr-2" />
                Calendrier
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center py-3">
                <FileText size={18} className="mr-2" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="catalogue" className="flex items-center py-3">
                <Folder size={18} className="mr-2" />
                Catalogue
              </TabsTrigger>
              <TabsTrigger value="evenements" className="flex items-center py-3">
                <Calendar size={18} className="mr-2" />
                Événements
              </TabsTrigger>
              <TabsTrigger value="espaces" className="flex items-center py-3">
                <MapPin size={18} className="mr-2" />
                Espaces
              </TabsTrigger>
              <TabsTrigger value="absences" className="flex items-center py-3">
                <Clock size={18} className="mr-2" />
                Absences
              </TabsTrigger>
              <TabsTrigger value="da" className="flex items-center py-3">
                <FileCheck size={18} className="mr-2" />
                Gestion des D.A.
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab Content */}
            <TabsContent value="dashboard" className="border-none p-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">Profil Formateur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src="/api/placeholder/400/400" alt="Formateur" />
                        <AvatarFallback>FM</AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-semibold">Mohammed Amiri</h3>
                      <p className="text-sm text-gray-500">Formateur Senior - Digital Skills</p>
                      <div className="mt-4 w-full">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Évaluation globale</span>
                          <span className="text-sm font-semibold">4.8/5</span>
                        </div>
                        <Progress value={96} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">Statistiques globales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-blue-500 mb-2">
                          <Award size={20} />
                        </div>
                        <div className="text-2xl font-bold">18</div>
                        <div className="text-sm text-gray-500">Formations assurées</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-green-500 mb-2">
                          <Users size={20} />
                        </div>
                        <div className="text-2xl font-bold">243</div>
                        <div className="text-sm text-gray-500">Bénéficiaires formés</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-purple-500 mb-2">
                          <Calendar size={20} />
                        </div>
                        <div className="text-2xl font-bold">54</div>
                        <div className="text-sm text-gray-500">Jours de formation</div>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <div className="text-amber-500 mb-2">
                          <BarChart2 size={20} />
                        </div>
                        <div className="text-2xl font-bold">4.8</div>
                        <div className="text-sm text-gray-500">Note moyenne</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Formations et Bénéficiaires */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">Formations assurées</CardTitle>
                    <Button variant="outline" size="sm">
                      Voir tout <ChevronDown size={16} />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Développement Web Full-Stack", participants: 42, rating: 4.9 },
                        { name: "Data Science et IA", participants: 38, rating: 4.7 },
                        { name: "Marketing Digital", participants: 25, rating: 4.8 },
                        { name: "Gestion de Projets Agiles", participants: 30, rating: 4.6 }
                      ].map((formation, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{formation.name}</h4>
                            <p className="text-sm text-gray-500">{formation.participants} participants</p>
                          </div>
                          <Badge variant="secondary">{formation.rating} ★</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">Données d'intégration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Femmes</span>
                          <span className="text-sm font-medium">48%</span>
                        </div>
                        <Progress value={48} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">18-25 ans</span>
                          <span className="text-sm font-medium">35%</span>
                        </div>
                        <Progress value={35} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">26-35 ans</span>
                          <span className="text-sm font-medium">42%</span>
                        </div>
                        <Progress value={42} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">36+ ans</span>
                          <span className="text-sm font-medium">23%</span>
                        </div>
                        <Progress value={23} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">En recherche d'emploi</span>
                          <span className="text-sm font-medium">65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Calendrier et évaluations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">Prochaines formations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { date: "10 Mars 2025", title: "Développement Web Full-Stack", duration: "5 jours" },
                        { date: "18 Mars 2025", title: "Intelligence Artificielle pour débutants", duration: "3 jours" },
                        { date: "25 Mars 2025", title: "Marketing Digital Avancé", duration: "2 jours" }
                      ].map((event, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="bg-blue-100 text-blue-800 p-3 rounded-lg mr-4 text-center min-w-16">
                            <div className="text-xs">{event.date.split(' ')[1]}</div>
                            <div className="text-lg font-bold">{event.date.split(' ')[0]}</div>
                          </div>
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-gray-500">{event.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">Dernières évaluations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Amal B.", formation: "Développement Web", comment: "Formation exceptionnelle, très pratique.", rating: 5 },
                        { name: "Karim M.", formation: "Data Science", comment: "Contenu clair et bien structuré.", rating: 4 },
                        { name: "Leila H.", formation: "Marketing Digital", comment: "Formateur pédagogue et à l'écoute.", rating: 5 }
                      ].map((evaluation, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{evaluation.name}</span>
                            <span className="text-amber-500">{Array(evaluation.rating).fill('★').join('')}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{evaluation.formation}</p>
                          <p className="text-sm italic">"{evaluation.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Other tabs content */}
            <TabsContent value="formations" className="border-none p-0">
              {/* Formations content */}
            </TabsContent>
            <TabsContent value="calendrier" className="border-none p-0">
              {/* Calendrier content */}
            </TabsContent>
            <TabsContent value="documents" className="border-none p-0">
              {/* Documents content */}
            </TabsContent>
            {/* Add other tabs content as needed */}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FormateurManager;