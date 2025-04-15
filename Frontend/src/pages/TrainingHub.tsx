import * as React from 'react';
import { ChevronRight, Briefcase, GitBranch, Image as ImageIcon, Link2, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import FeaturedCarousel from './FeaturedCarousel';

interface Training {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

const TrainingHub: React.FC = () => {
  // Données pour les formations
  const trainings: Training[] = [
    {
      id: 1,
      title: "Management",
      description: "Formation complète sur les méthodes de management moderne et leadership",
      icon: <Briefcase className="w-10 h-10 text-orange" />,
      badge: "Populaire"
    },
    {
      id: 2,
      title: "Workflow",
      description: "Optimisation des processus métier et automatisation des workflows",
      icon: <GitBranch className="w-10 h-10 text-orange" />
    },
    {
      id: 3,
      title: "Pictoria AI",
      description: "Intelligence artificielle appliquée au traitement d'images",
      icon: <ImageIcon className="w-10 h-10 text-orange" />,
      badge: "Nouveau"
    },
    {
      id: 4,
      title: "ShortnerLink & Talend",
      description: "Gestion de données et intégration avec les outils Talend",
      icon: <Database className="w-10 h-10 text-orange" />
    }
  ];

  // Données pour le carrousel
  const carouselItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      title: "Management Digital",
      description: "Découvrez les dernières techniques de management à l'ère numérique"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      title: "Workflow Automation",
      description: "Transformez vos processus avec des solutions d'automatisation innovantes"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      title: "Intelligence Artificielle",
      description: "Explorez les applications concrètes de l'IA dans votre entreprise"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      title: "Data & Integration",
      description: "Maîtrisez la gestion et l'intégration des données avec Talend"
    }
  ];

  return (
<div className="min-h-[300px] max-h-[1600px] max-w-[1300px] mx-auto bg-black text-white px-4">
      <header className="py-6 border-b border-gray-800">
        <div className="container px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="/lovable-uploads/0845f330-5101-44e3-b7d9-0c16201a032d.png" alt="Orange Logo" className="h-8 mr-3" />
              <h1 className="text-2xl font-bold">Orange Formation Hub</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-orange hover:bg-orange-700 text-white px-4 py-2 rounded-full transition-colors">
                Mon espace
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container px-4 py-8">
        {/* Carrousel de formations */}
        <FeaturedCarousel items={carouselItems} />
        
        {/* Section de formations en vedette */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              Formations en vedette
              <ChevronRight className="ml-2 text-orange" />
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainings.map((training) => (
              <Card key={training.id} className="group relative bg-gray-900 border-gray-800 hover:border-orange transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className="relative">
                    {training.badge && (
                      <span className="absolute -top-6 -right-6 bg-orange text-black text-xs font-bold px-8 py-1 rotate-45">
                        {training.badge}
                      </span>
                    )}
                    <div className="mb-4">{training.icon}</div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-orange transition-colors">{training.title}</h3>
                    <p className="text-gray-400">{training.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-orange">4.8 ★★★★☆</span>
                      <button className="bg-transparent hover:bg-orange-900 border border-orange text-orange hover:text-white px-4 py-1 rounded-full text-sm transition-colors">
                        S'inscrire
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Section de parcours complets */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              Parcours de formation complets
              <ChevronRight className="ml-2 text-orange" />
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold mb-3">Pack Management</h3>
              <p className="text-gray-400 mb-4">Formation complète pour développer vos compétences de manager</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-orange">3 modules</span>
                <Link2 className="text-gray-400" size={16} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold mb-3">Pack Tech IA</h3>
              <p className="text-gray-400 mb-4">Maîtrisez l'IA et ses applications dans différents domaines</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-orange">4 modules</span>
                <Link2 className="text-gray-400" size={16} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold mb-3">Pack Data & Process</h3>
              <p className="text-gray-400 mb-4">Optimisez vos processus et gérez vos données efficacement</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-orange">5 modules</span>
                <Link2 className="text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </section>
        
        {/* Section tendances */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              Tendances actuelles
              <ChevronRight className="ml-2 text-orange" />
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-orange/20 to-transparent p-6 rounded-xl border border-orange/30">
              <h3 className="text-xl font-bold mb-2">Nouveau: Programme IA 2025</h3>
              <p className="text-gray-300 mb-4">
                Découvrez notre nouveau programme de formation complet sur l'Intelligence Artificielle
                et ses applications pratiques dans votre métier.
              </p>
              <button className="bg-orange hover:bg-orange-700 text-white px-4 py-2 rounded-full text-sm transition-colors">
                En savoir plus
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-orange/20 to-transparent p-6 rounded-xl border border-orange/30">
              <h3 className="text-xl font-bold mb-2">Webinaire: Management Agile</h3>
              <p className="text-gray-300 mb-4">
                Participez à notre prochain webinaire sur les méthodes agiles 
                appliquées au management d'équipe.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-white/70">Date: 20 Avril 2025</span>
                <button className="bg-orange hover:bg-orange-700 text-white px-4 py-2 rounded-full text-sm transition-colors">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-gray-800 py-8 mt-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/lovable-uploads/0845f330-5101-44e3-b7d9-0c16201a032d.png" alt="Orange Logo" className="h-6 mr-2" />
              <span className="text-sm text-gray-400">© 2025 Orange. Tous droits réservés.</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-orange">Contact</a>
              <a href="#" className="text-sm text-gray-400 hover:text-orange">Confidentialité</a>
              <a href="#" className="text-sm text-gray-400 hover:text-orange">Conditions</a>
              <a href="#" className="text-sm text-gray-400 hover:text-orange">Aide</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TrainingHub;