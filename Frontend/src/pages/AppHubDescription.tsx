import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ExternalLink, Download, Star } from 'lucide-react';
import Logo from "@/assets/images/login_logo.png";
import { useAuth } from '@/contexts/AuthContext';

// Interface pour les données d'application
interface AppData {
  title: string;
  description: string;
  longDescription: string;
  category: string;
  rating: number;
  features: string[];
  image: string;
  externalUrl?: string; // Ajout d'un champ pour les URLs externes
}

const AppDescription: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const { user } = useAuth();
  
  // État pour le statut d'activation
  const [isActivated, setIsActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Données fictives pour les applications
  // Dans une application réelle, ces données proviendraient d'une API
  const appData: Record<string, AppData> = {
    management: {
      title: "Management",
      description: "Développez vos compétences en gestion d'équipe et leadership stratégique",
      longDescription: "L'application Management est conçue pour accompagner les managers, coordinateurs et formateurs dans le développement de leurs compétences en leadership, gestion de projet et organisation d'équipe. Elle propose des ressources interactives pour renforcer l'efficacité managériale et la collaboration.",
      category: "Management",
      rating: 4.5,
      features: [
        "Modules interactifs sur le leadership",
        "Gestion des conflits en entreprise",
        "Techniques de motivation d'équipe",
        "Planification stratégique",
        "Évaluation de performance"
      ],
      image: Logo
    },
    workflow: {
      title: "Workflow",
      description: "Supervisez et suivez l’avancement des formations en temps réel",
      longDescription: "L’application Workflow est dédiée à l’organisation des parcours de formation. Elle permet aux formateurs, coordinateurs et managers de planifier, suivre et piloter les sessions de formation avec une vue complète sur le déroulement, les participants et les livrables attendus.",
      category: "Productivity",
      rating: 4.5,
      features: [
        "Création de workflow par drag-and-drop",
        "Automatisation des tâches récurrentes",
        "Intégration avec les systèmes existants",
        "Rapports de performance en temps réel",
        "Notifications et alertes configurables"
      ],
      image: Logo
    },
    pictoria: {
      title: "Pictoria AI",
      description: "Générez automatiquement des contenus visuels adaptés aux formations",
      longDescription: "Pictoria AI est un outil intelligent conçu pour les formateurs et coordinateurs afin de créer des supports de cours visuellement attractifs. Grâce à l’intelligence artificielle, il permet la génération, l’optimisation et la personnalisation d’images pédagogiques.",
      category: "AI & Machine Learning",
      rating: 3.4,
      features: [
        "Reconnaissance d'objets et de visages",
        "Retouche automatique d'images",
        "Classification et organisation de photos",
        "Optimisation d'images pour le web",
        "Génération de contenu visuel"
      ],
      image: Logo,
      externalUrl: "https://pictoria-kappa.vercel.app/dashboard"
    },
    shortner: {
      title: "ShortnerLink & Talend",
      description: "Simplifiez le partage et le suivi de vos ressources pédagogiques",
      longDescription: "ShortnerLink est destiné aux techniciens et coordinateurs pour gérer, raccourcir et tracer les liens des supports pédagogiques et administratifs. Compatible avec Talend, il facilite également l'intégration de données et le reporting des liens utilisés en formation.",
      category: "Data Integration",
      rating: 4.5,
      features: [
        "Raccourcissement d'URL personnalisable",
        "Statistiques de clics en temps réel",
        "Intégration avec Talend Data Integration",
        "Gestion des accès et sécurité",
        "API complète pour les développeurs"
      ],
      image: Logo,
      externalUrl: "https://url-shortener-sage-seven.vercel.app/"
    },
    AiInterview: {
      title: "AI Interview",
      description: "Préparez vos entretiens avec une IA simulant des recruteurs",
      longDescription: "AI Interview est une solution innovante permettant aux apprenants de s’entraîner aux entretiens d’embauche avec une IA. Elle simule différents scénarios et fournit des retours constructifs, idéale pour les formateurs et les participants à des programmes d’employabilité.",
      category: "AI & Training",
      rating: 4.5,
      features: [
        "Simulation d'entretiens en conditions réelles",
        "Analyse des réponses via IA",
        "Retour personnalisé sur la posture et les réponses",
        "Banque de questions paramétrable",
        "Entraînement en autonomie ou accompagné"
      ],
      image: Logo,
      externalUrl: "https://interview-blush-eight.vercel.app/"
    },
    Scheduller: {
      title: "Scheduler",
      description: "Planifiez les créneaux de formation et synchronisez les agendas",
      longDescription: "Scheduler est un outil de planification intelligent dédié à la coordination des formations. Il permet aux formateurs, coordinateurs et techniciens de proposer, gérer et valider les créneaux horaires de façon fluide et collaborative.",
      category: "Planning & Coordination",
      rating: 4.5,
      features: [
        "Proposition de créneaux dynamiques",
        "Gestion des disponibilités des formateurs",
        "Validation automatique ou manuelle",
        "Calendrier partagé synchronisé",
        "Notifications et rappels"
      ],
      image: Logo,
      externalUrl: "https://shedulrr-gfvggh.vercel.app/availability"
    },
    PairFinder: {
        title: "PairFinder",
        description: "Mise en relation intelligente basée sur les compétences et besoins",
        longDescription: "PairFinder est une application conçue pour mettre en relation des collaborateurs en fonction de leurs compétences, centres d'intérêt ou objectifs. Elle facilite le travail collaboratif et le mentorat à l’intérieur des équipes.",
        category: "Collaboration",
        rating: 4.2,
        features: [
          "Matching intelligent de profils",
          "Interface intuitive de mise en relation",
          "Système de filtres personnalisés",
          "Suggestions basées sur l’IA",
          "Suivi des interactions"
        ],
        image: Logo,
        externalUrl: "https://pair-finder-jade.vercel.app/"
      },
    
      Stream: {
        title: "Stream",
        description: "Plateforme de streaming interne pour la formation et la communication",
        longDescription: "Stream est une plateforme de streaming vidéo destinée aux entreprises, idéale pour diffuser des formations, des annonces ou des événements internes. Elle favorise l’apprentissage et la communication visuelle.",
        category: "Communication",
        rating: 4.6,
        features: [
          "Diffusion de contenu vidéo en direct ou à la demande",
          "Organisation par catégories et thèmes",
          "Interface simple et responsive",
          "Contrôle d’accès sécurisé",
          "Intégration facile dans l’écosystème interne"
        ],
        image: Logo,
        externalUrl: "https://odc-stream.vercel.app/"
      }    
  };
  
  
  // Récupérer les données de l'application actuelle
  const currentApp = id ? appData[id] : null;
  
  // Vérifier si l'application est déjà activée au chargement du composant
  useEffect(() => {
    if (id && user) {
      // Créer une clé unique pour chaque utilisateur et application
      const activationKey = `app_${id}_activated_${user.userId}`;
      const isAppActivated = localStorage.getItem(activationKey) === 'true';
      setIsActivated(isAppActivated);
    }
  }, [id, user]);
  
  // Simuler l'activation de l'application
  const handleActivate = () => {
    setIsLoading(true);
    // Simuler un délai d'activation
    setTimeout(() => {
      setIsActivated(true);
      // Sauvegarder l'état d'activation dans localStorage
      if (id && user) {
        const activationKey = `app_${id}_activated_${user.userId}`;
        localStorage.setItem(activationKey, 'true');
      }
      setIsLoading(false);
    }, 1500);
  };
  
  // Rediriger vers l'application après l'activation
  const handleOpenApp = () => {
    if (!user || !user.role || !id || !currentApp) {
      navigate("/");
      return;
    }

    // Si l'application a une URL externe, rediriger directement vers cette URL
    if (currentApp.externalUrl) {
      window.location.href = currentApp.externalUrl;
      return;
    }

    // Sinon, utiliser les routes internes basées sur le rôle
    const roleRoutes: Record<string, Record<string, string>> = {
      Formateur: {
        workflow: "/formateur/DashboardFormateur",
        management: "/formateur/DashboardFormateur"
      },
      Manager: {
        workflow: "/manager/DashboardManager",
        management: "/manager/DashboardManager"
      },
      Coordinateur: {
        workflow: "/coordinateur/DashboardCoordinateur",
        management: "/coordinateur/DashboardCoordinateur"
      },
      Technicien: {
        workflow: "/technicien/workflow",
        management: "/technicien/management"
      }
    };

    const route = roleRoutes[user.role]?.[id] || "/";
    navigate(route);
  };

  // Revenir à la page précédente
  const handleGoBack = () => {
    navigate(-1);
  };

  if (!currentApp) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <p>Application non trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="py-6 border-b border-gray-800">
        <div className="container px-4 mx-auto">
          <div className="flex items-center">
            <button 
              className="flex items-center text-gray-400 hover:text-white mr-4"
              onClick={handleGoBack}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Retour
            </button>
            <h1 className="text-2xl font-bold">Orange AppHub</h1>
          </div>
        </div>
      </header>
      
      <main className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne de gauche - Image et bouton */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6 flex flex-col items-center">
              <div className="relative w-40 h-40 mb-6">
                <img src={currentApp.image} alt={currentApp.title} className="w-full h-full object-contain" />
              </div>
              
              {!isActivated ? (
                <button 
                  className={`w-full py-3 px-4 rounded-lg font-medium ${isLoading ? 'bg-orange-700' : 'bg-orange-500 hover:bg-orange-700'} text-black transition-colors flex items-center justify-center`}
                  onClick={handleActivate}
                  disabled={isLoading}
                >
                  {isLoading ? 'Activation en cours...' : 'Activer l\'application'}
                </button>
              ) : (
                <button 
                  className="w-full py-3 px-4 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white transition-colors flex items-center justify-center"
                  onClick={handleOpenApp}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Ouvrir l'application
                </button>
              )}
              
              <div className="flex items-center mt-6">
                <span className="text-2xl font-bold mr-2">{currentApp.rating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(currentApp.rating) ? 'text-orange fill-orange' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Colonne de droite - Description et détails */}
          <div className="md:col-span-2">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold">{currentApp.title}</h2>
                  <p className="text-gray-400">{currentApp.category}</p>
                </div>
                <span className="bg-orange text-black text-sm px-3 py-1 rounded-full">Free</span>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-300">{currentApp.longDescription}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Fonctionnalités</h3>
                <ul className="space-y-2">
                  {currentApp.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-orange rounded-full mt-2 mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppDescription;