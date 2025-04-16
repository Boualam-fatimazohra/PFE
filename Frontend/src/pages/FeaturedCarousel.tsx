import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description: string;
  appId: string;
}

interface FeaturedCarouselProps {
  items: CarouselItem[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ items }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const next = () => {
    setCurrent((current + 1) % items.length);
  };
  
  const prev = () => {
    setCurrent((current - 1 + items.length) % items.length);
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 5000);
    
    return () => clearInterval(timer);
  }, [current, items.length]);

  // Handle redirect when clicking on a carousel item
  const handleCarouselClick = (appId: string) => {
    if (!user || !user.role) {
      // If user is not logged in, redirect to login page
      navigate("/");
      return;
    }

    // Define paths based on role and application
    const roleRoutes: Record<string, Record<string, string>> = {
      Formateur: {
        workflow: "/formateur/DashboardFormateur",
        management: "/formateur/DashboardFormateur",
        pictoria: "/formateur/DashboardFormateur",
        shortner: "/formateur/DashboardFormateur"
      },
      Manager: {
        workflow: "/manager/DashboardManager",
        management: "/manager/DashboardManager",
        pictoria: "/manager/DashboardManager",
        shortner: "/manager/DashboardManager"
      },
      Coordinateur: {
        workflow: "/coordinateur/DashboardCoordinateur",
        management: "/coordinateur/DashboardCoordinateur",
        pictoria: "/coordinateur/DashboardCoordinateur",
        shortner: "/coordinateur/DashboardCoordinateur"
      },
      Technicien: {
        workflow: "/technicien/workflow",
        management: "/technicien/management",
        pictoria: "/technicien/pictoria",
        shortner: "/technicien/shortner"
      }
    };

    const route = roleRoutes[user.role]?.[appId] || "/";
    navigate(route);
  };
  
  return (
    <div className="relative overflow-hidden rounded-xl h-[350px] my-6">
      <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}>
        {items.map((item) => (
          <div key={item.id} className="min-w-full h-full relative">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-8">
              <h2 className="text-white text-3xl font-bold">{item.title}</h2>
              <p className="text-white/80 mt-2 max-w-md">{item.description}</p>
              <button 
                className="mt-4 bg-orange hover:bg-orange-700 text-orange-700 font-medium py-2 px-6 rounded-full w-fit transition-colors"
                onClick={() => handleCarouselClick(item.appId)}
              >
                Activer
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === current ? "bg-orange w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;