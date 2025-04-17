import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Briefcase, GitBranch, Image as ImageIcon, Database, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import FeaturedCarousel from './FeaturedCarousel';
import { useAuth } from '@/contexts/AuthContext';
import Logo from "@/assets/images/login_logo.png";

interface Training {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  appId: string;
}

const TrainingHub: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // État pour contrôler la visibilité du carousel - initialement visible
  const [showCarousel, setShowCarousel] = React.useState(true);
  const [showAllApps, setShowAllApps] = React.useState(false);

  // Données pour les formations
  const trainings: Training[] = [
    {
      id: 1,
      title: "Management",
      description: "Formation complète sur les méthodes de management moderne et leadership",
      icon: <Briefcase className="w-10 h-10 text-orange" />,
      badge: "Populaire",
      appId: "management"
    },
    {
      id: 2,
      title: "Workflow",
      description: "Optimisation des processus métier et automatisation des workflows",
      icon: <GitBranch className="w-10 h-10 text-orange" />,
      appId: "workflow"
    },
    {
      id: 3,
      title: "Pictoria AI",
      description: "Intelligence artificielle appliquée au traitement d'images",
      icon: <ImageIcon className="w-10 h-10 text-orange" />,
      badge: "Nouveau",
      appId: "pictoria"
    },
    {
      id: 4,
      title: "ShortnerLink & Talend",
      description: "Gestion de données et intégration avec les outils Talend",
      icon: <Database className="w-10 h-10 text-orange" />,
      appId: "shortner"
    },
    {
      id: 5,
      title: "AiInterview",
      description: "Gestion de données et intégration avec les outils Talend",
      icon: <Database className="w-10 h-10 text-orange" />,
      appId: "AiInterview"
    },
    {
      id: 6,
      title: "Scheduller ",
      description: "Gestion de données et intégration avec les outils Talend",
      icon: <Database className="w-10 h-10 text-orange" />,
      appId: "Scheduller"
    },
    {
      id: 7,
      title: "PairFinder",
      description: "Gestion de données et intégration avec les outils Talend",
      icon: <Database className="w-10 h-10 text-orange" />,
      appId: "PairFinder"
    },
    {
      id: 8,
      title: "Stream",
      description: "Gestion de données et intégration avec les outils Talend",
      icon: <Database className="w-10 h-10 text-orange" />,
      appId: "Stream"
    }
  ];

  // Données pour le carrousel
  const carouselItems = [
    {
      id: 1,
      image: "http://localhost:8080/src/assets/images/odc_workflow.png",
      title: "ShortnerLink",
      description: "Découvrez les dernières techniques de management à l'ère numérique",
      appId: "management"
    },
    {
      id: 2,
      image: "http://localhost:8080/src/assets/images/odc_workflow.png",
      title: "Orange degital Workflow",
      description: "Transformez vos processus avec des solutions d'automatisation innovantes",
      appId: "workflow"
    },
    {
      id: 3,
      image: "http://localhost:8080/src/assets/images/odc_workflow.png",
      title: "Pictoria AI",
      description: "Explorez les applications concrètes de l'IA dans votre entreprise",
      appId: "pictoria"
    },
    {
      id: 4,
      image: "http://localhost:8080/src/assets/images/odc_workflow.png",
      title: "presentation generation",
      description: "Maîtrisez la gestion et l'intégration des données avec Talend",
      appId: "shortner"
    },
    {
      id: 5,
      image: "http://localhost:8080/src/assets/images/odc_workflow.png",
      title: "AiInterview generation",
      description: "Passer votre entretin avec notre AI",
      appId: "AiInterview"
    },
    {
      id: 6,
      image: "http://localhost:8080/src/assets/images/odc_workflow.png",
      title: "Scheduller",
      description: "Passer votre entretin avec notre AI",
      appId: "Scheduller"
    },
    {
      id: 7,
      image: "http://localhost:8080/src/assets/images/odc_workflow.png",
      title: "PairFinder",
      description: "Passer votre entretin avec notre AI",
      appId: "PairFinder"
    },
    {
      id: 8,
      image: "http://localhost:8080/src/assets/images/odc_workflow.png",
      title: "Stream",
      description: "Passer votre entretin avec notre AI",
      appId: "Stream"
    }
  ];

  // Fonction pour basculer l'affichage du carousel et afficher toutes les apps
  const toggleShowAll = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowCarousel(false);
    setShowAllApps(true);
  };
  
  // Gérer le clic sur une formation/application
  const handleAppClick = (appId: string) => {
    if (!user || !user.role) {
      navigate("/");
      return;
    }
    navigate(`/AppDescription/${appId}`);
  };

  // Gérer le clic sur une formation du carousel
  const handleCarouselAppClick = (appId: string) => {
    if (!user || !user.role) {
      navigate("/");
      return;
    }
    navigate(`/AppDescription/${appId}`);
  };

  // Filtrer les applications à afficher (4 premières si showAllApps est false)
  const displayedApps = showAllApps ? trainings : trainings.slice(0, 4);

  return (
    <div className="min-h-[300px] max-h-[1600px] max-w-[1300px] mx-auto bg-[#0A0A0A] text-white px-4">
      <header className="py-6 border-b border-gray-800">
        <div className="container px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold">Orange AppHub</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Rechercher une formation..."
                  className="bg-gray-900 border border-gray-700 rounded-full py-2 px-4 pl-10 w-64 focus:outline-none focus:border-orange"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button className="bg-orange hover:bg-orange-700 text-black font-medium px-4 py-2 rounded-full transition-colors">
                Mon espace
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container px-4 py-8">
        {/* Section de formations en vedette avec toggle */}
        <div className="mb-10">
         
          
          {/* Carrousel de formations - afficher uniquement si showCarousel est true */}
          {showCarousel && (
            <FeaturedCarousel 
              items={carouselItems} 
              onItemClick={handleCarouselAppClick}
            />
          )}
        </div>
        
        {/* Essential Applications Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              Essential Applications
              <ChevronRight className="ml-2 text-orange" />
            </h2>
            {!showAllApps && (
              <a href="#" className="text-orange hover:underline text-sm" onClick={toggleShowAll}>
                Voir tout
              </a>
              
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedApps.map((app) => (
              <div 
                key={app.id}
                className="flex items-start space-x-4 cursor-pointer hover:bg-gray-900 p-4 rounded-lg transition-colors" 
                onClick={() => handleAppClick(app.appId)}
              >
                <div className="relative text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange">
                  <img src={Logo} alt="Orange logo" className="w-16 h-16 object-contain" />
                  <div className="absolute inset-0 overflow-hidden">
                    {app.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{app.title}</h3>
                    <div className="flex items-center">
                      <span className="mr-2">4.5</span>
                      <svg className="w-4 h-4 text-orange fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-400 mt-1">{app.title.includes('AI') ? 'AI & Machine Learning' : 
                    app.title.includes('Management') ? 'Management' : 
                    app.title.includes('Workflow') ? 'Productivity' : 'Data Integration'}</p>
                  <p className="mt-3">{app.description}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-orange">Free</span>
                    {app.badge && (
                      <span className="bg-orange text-black text-xs px-2 py-1 rounded-full">
                        {app.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TrainingHub;