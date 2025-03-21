import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DatePicker } from "@/components/ui/DatePicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormationsTable } from "@/components/dashboardElement/FormationTableManager";
import { FormationStatus } from "@/pages/types"; 
import { ChevronDown, Download } from "lucide-react";
import { useEdc } from "@/contexts/EdcContext"; // Import the EdcContext hook
import {Formation} from "@/components/formation-modal/types"

// Define FormationItem interface
export interface FormationItem {
  _id: string;
  nom: string;
  title: string;
  dateDebut: string;
  dateFin: string;
  status: "En Cours" | "Avenir" | "Terminé" | "Replanifier";
  image?: string;
  formateur?: string; // Formateur ID
  formateurName?: string; // Formatted formateur name
}

import { EvaluationsTable } from "@/components/dashboardElement/EvaluationManager";
import { LineChart, Line, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts";
import { SearchBar } from "@/components/dashboardElement/SearchBar";
import { Calendar, Users, ChevronRight, Search, Plus, BookOpen, Star, Calendar as CalendarIcon, PieChart, Award, Briefcase, User, X } from "lucide-react";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import FormateurList from "@/components/dashboardElement/FormateurManager";

// Define proper type for DatePicker props
interface CustomDatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  placeholder: string;
}

// Assuming DatePicker actually accepts these props
const CustomDatePicker = ({ date, onDateChange, placeholder }: CustomDatePickerProps) => {
  return (
    <DatePicker 
      date={date}
      setDate={onDateChange}
    />
  );
};

const Ecolecode = () => {
  // Get formations and formateurs data from EdcContext
  const {
    edcFormations,
    edcFormateurs,
    loading,
    error,
    fetchEdcFormations,
    fetchEdcFormateurs
  } = useEdc();

  // Fetch formations and formateurs when the component mounts
  useEffect(() => {
    fetchEdcFormations();
    fetchEdcFormateurs();
  }, [fetchEdcFormations, fetchEdcFormateurs]);

  const [selectedTab, setSelectedTab] = useState("overview");
  const [year, setYear] = useState("2025");
  const [timePeriod, setTimePeriod] = useState("ce-mois-ci");
  const [activeTab, setActiveTab] = useState("formations");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFormation, setSelectedFormation] = useState<FormationItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const renderActionsRapides = () => {
    return (
      <div className="relative">
        {/* Container principal with fixed width */}
        <div className="w-[220px]">
          {/* Bouton principal */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-black text-white font-medium px-4 py-2 flex justify-between items-center rounded-md"
          >
            <span>Actions Rapides</span>
            <ChevronDown size={16} />
          </button>
    
          {/* Options dropdown that appears when isOpen is true */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 p-2 space-y-2 bg-black rounded-b-md shadow-lg z-10">
              <button className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-md">
                <Plus size={16} className="mr-2" />
                <span>Nouvelle Formation</span>
              </button>
              
              <button className="w-full flex items-center bg-white text-black hover:bg-gray-200 py-2 px-3 rounded-md">
                <User size={16} className="mr-2" />
                <span>Titre</span>
              </button>
              
              <button className="w-full flex items-center bg-white text-black hover:bg-gray-200 py-2 px-3 rounded-md">
                <Download size={16} className="mr-2" />
                <span>Exporter Statistiques</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Transformed data - Use edcFormations if available, otherwise use static data
  const formationData = edcFormations && edcFormations.length > 0
    ? edcFormations.map(formation => ({
        _id: formation._id,
        nom: formation.nom,
        dateDebut: formation.dateDebut,
        dateFin: formation.dateFin,
        status: formation.status || "En Cours",
        image: "/api/placeholder/60/60", // Default placeholder since real data might not have images
        formateur: formation.formateur?._id, // Extract formateur ID from the nested object
        formateurName: formation.formateur ? `${formation.formateur.utilisateur.prenom} ${formation.formateur.utilisateur.nom}` : "", // Format formateur name
      }))
    : [
        { nom: "JavaScript Avancé", dateDebut: "2025-03-01", dateFin: "2025-03-15", status: "En Cours", image: "/api/placeholder/60/60" },
        { nom: "React Fondamentaux", dateDebut: "2025-03-10", dateFin: "2025-03-25", status: "En Cours", image: "/api/placeholder/60/60" },
        { nom: "Python Data Science", dateDebut: "2025-04-05", dateFin: "2025-04-20", status: "Avenir", image: "/api/placeholder/60/60" },
        { nom: "UI/UX Bootcamp", dateDebut: "2025-02-10", dateFin: "2025-02-28", status: "Terminé", image: "/api/placeholder/60/60" },
      ];

  const mappedFormations = formationData.map((formation, index) => ({
    _id: formation._id || index.toString(),
    nom: formation.nom,
    title: formation.nom,
    dateDebut: formation.dateDebut,
    dateFin: formation.dateFin,
    status: formation.status as "En Cours" | "Avenir" | "Terminé" | "Replanifier",
    image: formation.image,
    formateur: formation.formateurName // Include formateur ID in the mapped formations
  }));

  // Use edcFormateurs if available for FormateurList component, otherwise use static data
  const formateurData = edcFormateurs && edcFormateurs.length > 0
    ? edcFormateurs.map(formateur => ({
        nom: `${formateur.utilisateur?.nom || ''} ${formateur.utilisateur?.prenom || ''}`,
        formations: 10, // Default value since real data might not have these counts
        beneficiaires: 150,
        satisfaction: "4.8/5"
      }))
    : [
        { nom: "Sophie Martin", formations: 12, beneficiaires: 184, satisfaction: "4.8/5" },
        { nom: "Thomas Dubois", formations: 8, beneficiaires: 126, satisfaction: "4.7/5" },
        { nom: "Amina Benali", formations: 10, beneficiaires: 152, satisfaction: "4.9/5" },
      ];

  // Keep the rest of the data as static
  const performanceData = [
    { mois: 'Jan', taux: 78 },
    { mois: 'Feb', taux: 82 },
    { mois: 'Mar', taux: 85 },
    { mois: 'Apr', taux: 87 },
    { mois: 'May', taux: 84 },
    { mois: 'Jun', taux: 89 },
  ];

  const bootcamps = [
    { name: "Full Stack JS", value: 28, subtitle: "Participants", color: "bg-gray-100" },
    { name: "Data Science", value: 24, subtitle: "Participants", color: "bg-gray-100" },
    { name: "UX/UI Design", value: 18, subtitle: "Participants", color: "bg-gray-100" },
  ];

  const evaluationData = [
    { formation: "JavaScript Avancé", note: 4.8, participants: 22, date: "2025-03-05" },
    { formation: "React Fondamentaux", note: 4.6, participants: 18, date: "2025-03-12" },
    { formation: "UI/UX Bootcamp", note: 4.9, participants: 24, date: "2025-02-28" },
  ];

  const stats = [
    { 
      title: "Total Formations", 
      value: edcFormations?.length || 412, 
      subtitle: "sur 15 événements", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="22" viewBox="0 0 28 22" fill="none"><g clip-path="url(#clip0_865_2094)"><path d="M13.7501 1.375C13.402 1.375 13.0583 1.43516 12.7317 1.55117L0.678957 5.90391C0.270754 6.0543 5.1035e-05 6.44102 5.1035e-05 6.875C5.1035e-05 7.30898 0.270754 7.6957 0.678957 7.84609L3.16685 8.74414C2.46216 9.85273 2.06255 11.1633 2.06255 12.5426V13.75C2.06255 14.9703 1.59849 16.2293 1.10435 17.2219C0.825051 17.7805 0.507082 18.3305 0.137551 18.8375C5.10365e-05 19.0223 -0.0386208 19.2629 0.0387229 19.482C0.116067 19.7012 0.296535 19.8645 0.519973 19.9203L3.26997 20.6078C3.45044 20.6551 3.6438 20.6207 3.80279 20.5219C3.96177 20.423 4.07349 20.2598 4.10786 20.075C4.47739 18.2359 4.29263 16.5859 4.01763 15.4043C3.88013 14.7941 3.69536 14.1711 3.43755 13.5996V12.5426C3.43755 11.2449 3.87583 10.0203 4.63638 9.04062C5.19068 8.37461 5.90825 7.8375 6.75044 7.50664L13.4965 4.85547C13.8489 4.71797 14.2485 4.88984 14.386 5.24219C14.5235 5.59453 14.3516 5.99414 13.9993 6.13164L7.25318 8.78281C6.72036 8.99336 6.252 9.31563 5.86958 9.71094L12.7274 12.1859C13.054 12.302 13.3977 12.3621 13.7458 12.3621C14.0938 12.3621 14.4376 12.302 14.7641 12.1859L26.8211 7.84609C27.2293 7.7 27.5 7.30898 27.5 6.875C27.5 6.44102 27.2293 6.0543 26.8211 5.90391L14.7684 1.55117C14.4418 1.43516 14.0981 1.375 13.7501 1.375ZM5.50005 17.5312C5.50005 19.048 9.19536 20.625 13.7501 20.625C18.3047 20.625 22 19.048 22 17.5312L21.3426 11.2836L15.2325 13.4922C14.7555 13.6641 14.2528 13.75 13.7501 13.75C13.2473 13.75 12.7403 13.6641 12.2676 13.4922L6.15747 11.2836L5.50005 17.5312Z" fill="#FF7900"/></g><defs><clipPath id="clip0_865_2094"><path d="M0 0H27.5V22H0V0Z" fill="white"/></clipPath></defs></svg>
    },
    { 
      title: "Total Bénéficiaires", 
      value: "89%", 
      subtitle: "↑ +12% ce mois", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="33" height="26" viewBox="0 0 33 26" fill="none"><g clip-path="url(#clip0_865_2062)"><path d="M7.3125 0C8.38994 0 9.42325 0.428012 10.1851 1.18988C10.947 1.95175 11.375 2.98506 11.375 4.0625C11.375 5.13994 10.947 6.17325 10.1851 6.93512C9.42325 7.69699 8.38994 8.125 7.3125 8.125C6.23506 8.125 5.20175 7.69699 4.43988 6.93512C3.67801 6.17325 3.25 5.13994 3.25 4.0625C3.25 2.98506 3.67801 1.95175 4.43988 1.18988C5.20175 0.428012 6.23506 0 7.3125 0ZM26 0C27.0774 0 28.1108 0.428012 28.8726 1.18988C29.6345 1.95175 30.0625 2.98506 30.0625 4.0625C30.0625 5.13994 29.6345 6.17325 28.8726 6.93512C28.1108 7.69699 27.0774 8.125 26 8.125C24.9226 8.125 23.8892 7.69699 23.1274 6.93512C22.3655 6.17325 21.9375 5.13994 21.9375 4.0625C21.9375 2.98506 22.3655 1.95175 23.1274 1.18988C23.8892 0.428012 24.9226 0 26 0ZM0 15.1684C0 12.1773 2.42734 9.75 5.41836 9.75H7.58672C8.39414 9.75 9.16094 9.92773 9.85156 10.2426C9.78555 10.6082 9.75508 10.9891 9.75508 11.375C9.75508 13.3148 10.6082 15.0566 11.9539 16.25C11.9437 16.25 11.9336 16.25 11.9184 16.25H1.08164C0.4875 16.25 0 15.7625 0 15.1684ZM20.5816 16.25C20.5715 16.25 20.5613 16.25 20.5461 16.25C21.8969 15.0566 22.7449 13.3148 22.7449 11.375C22.7449 10.9891 22.7094 10.6133 22.6484 10.2426C23.3391 9.92266 24.1059 9.75 24.9133 9.75H27.0816C30.0727 9.75 32.5 12.1773 32.5 15.1684C32.5 15.7676 32.0125 16.25 31.4184 16.25H20.5816ZM11.375 11.375C11.375 10.0821 11.8886 8.84209 12.8029 7.92785C13.7171 7.01361 14.9571 6.5 16.25 6.5C17.5429 6.5 18.7829 7.01361 19.6971 7.92785C20.6114 8.84209 21.125 10.0821 21.125 11.375C21.125 12.6679 20.6114 13.9079 19.6971 14.8221C18.7829 15.7364 17.5429 16.25 16.25 16.25C14.9571 16.25 13.7171 15.7364 12.8029 14.8221C11.8886 13.9079 11.375 12.6679 11.375 11.375ZM6.5 24.6441C6.5 20.9066 9.53164 17.875 13.2691 17.875H19.2309C22.9684 17.875 26 20.9066 26 24.6441C26 25.3906 25.3957 26 24.6441 26H7.85586C7.10938 26 6.5 25.3957 6.5 24.6441Z" fill="#FF7900"/></g><defs><clipPath id="clip0_865_2062"><path d="M0 0H32.5V26H0V0Z" fill="white"/></clipPath></defs></svg>
    },
    { 
      title: "Taux de satisfaction", 
      value: 10, 
      subtitle: "↑  -2 événements", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="29" height="25" viewBox="0 0 29 25" fill="none"><g clip-path="url(#clip0_1137_10875)"><path d="M14.8438 11.7188V0.810547C14.8438 0.371094 15.1855 0 15.625 0C21.665 0 26.5625 4.89746 26.5625 10.9375C26.5625 11.377 26.1914 11.7188 25.752 11.7188H14.8438ZM1.5625 13.2812C1.5625 7.3584 5.96191 2.45605 11.6699 1.6748C12.1191 1.61133 12.5 1.97266 12.5 2.42676V14.0625L20.1416 21.7041C20.4688 22.0312 20.4443 22.5684 20.0684 22.832C18.1543 24.1992 15.8105 25 13.2812 25C6.81152 25 1.5625 19.7559 1.5625 13.2812ZM27.2656 14.0625C27.7197 14.0625 28.0762 14.4434 28.0176 14.8926C27.6416 17.6221 26.3281 20.0488 24.4092 21.8408C24.1162 22.1143 23.6572 22.0947 23.374 21.8066L15.625 14.0625H27.2656Z" fill="#FF7900"/></g><defs><clipPath id="clip0_1137_10875"><path d="M0 0H28.125V25H0V0Z" fill="white"/></clipPath></defs></svg>
    }
  ];

  const handleShowDetails = (formation: FormationItem) => {
    setSelectedFormation(formation);
  };

  const fabLabs = [
    { name: "École du Code", value: 4856, subtitle: "Développeurs", color: "bg-gray-100" },
    { name: "Fablab", value: 12, subtitle: "Projets Maker", color: "bg-gray-100" },
    { name: "Orange Fab", value: "07", subtitle: "Startups", color: "bg-gray-100" },
  ];

  // If loading is true, you could show a loading indicator, but to preserve the UI,
  // we'll just continue with the original UI and let the data update when it's ready

  // If there's an error, we could show an error message, but again to preserve the UI,
  // we'll just continue with the original UI and use the static data

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Ecole du code</h1>
          <div className="flex items-center gap-x-4">
            <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
              </svg>
              Filtres
            </Button>
            <Button variant="ghost" className="bg-black text-white flex items-center gap-2 ">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8306 6.33861C14.8303 5.8435 15.0633 5.37732 15.4594 5.08056V6.33861C15.4594 6.85963 15.882 7.28223 16.4031 7.28223C16.9244 7.28223 17.347 6.85963 17.347 6.33861L17.3467 6.02418H17.347V5.09305C17.7425 5.38464 17.9758 5.84715 17.9758 6.33861C17.9758 7.20728 17.2717 7.91111 16.4031 7.91111C15.535 7.91111 14.8306 7.20728 14.8306 6.33861ZM6.02415 6.33861C6.02385 5.8435 6.25693 5.37732 6.65303 5.08056V6.33861C6.65303 6.85963 7.07563 7.28223 7.59695 7.28223C8.11797 7.28223 8.54026 6.85963 8.54026 6.33861V6.02418H8.54057V5.08086C9.23525 5.60188 9.37602 6.58754 8.8547 7.28254C8.33338 7.97692 7.34741 8.11768 6.65303 7.59636C6.25693 7.29929 6.02415 6.83343 6.02415 6.33861ZM20.4919 20.4919H4.45164C3.93063 20.4919 3.50803 20.0693 3.50803 19.5483V9.79831H19.5483C20.0693 9.79831 20.4919 10.2206 20.4919 10.7419V20.4919ZM19.8631 4.13693H17.347V3.18082C17.347 2.6598 16.9244 2.25 16.403 2.25C15.882 2.25 15.4594 2.6723 15.4594 3.19331V4.13693H8.54058L8.54027 3.19331C8.54027 2.6723 8.11798 2.25 7.59696 2.25C7.07564 2.25 6.65304 2.6723 6.65304 3.19331V4.13693H2.25V19.8628C2.25 20.9051 3.09459 21.75 4.13693 21.75H21.75V6.02416C21.75 4.98183 20.9051 4.13693 19.8631 4.13693Z" fill="white"/>
            </svg>
            Ce mois ci
            </Button>
            <Link to="/CalendrierManager" className="bg-orange-500 text-white px-4 py-2 rounded-[4px] shadow-md hover:bg-orange-600">
            Calendrier Formations
            </Link>
          </div>
        </div>
        {/* Stats Cards and Actions Rapides */}
        <div className="flex items-start justify-between mb-6">
          {/* Stats Cards in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow mr-4">
            {stats.slice(0, 3).map((stat, index) => (
              <div key={index} className="bg-white p-4 rounded-[4px] border border-gray-200 flex items-start">
                <div className="bg-[#FF79001A] p-3 rounded-full flex items-center justify-center mr-3">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm font-inter ${
                    index < 1 ? "text-gray-500" : index === 2 ? "text-[#10B981]" : "text-[#10B981]"
                  }`}>
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Actions Rapides */}
          <div className="flex-shrink-0">
            {renderActionsRapides()}
          </div>
        </div>
        {/* Main Tabs */}
        <Tabs defaultValue="formations" className="mb-6" onValueChange={setActiveTab}>
          {/* Formations Tab Content */}
          <TabsContent value="formations" className="space-y-6">
           
            {/* Formations en cours */}
            <Card className="border-gray-200 rounded-md shadow-sm">
              <CardContent className="p-0">
                <FormationsTable
                  onShowDetails={handleShowDetails}
                  formations={mappedFormations} // Pass the mapped formations from EdcContext
                />
              </CardContent>
            </Card>

            {/* Evaluations */}
            <Card className="border-gray-200 rounded-md shadow-sm">
              <CardContent className="p-0">
                <FormateurList 
                  formateurs={formateurData} // Pass the mapped formateurs from EdcContext
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Ecolecode;