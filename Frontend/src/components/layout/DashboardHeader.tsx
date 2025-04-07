import { Bell, UserCircle, X, Sparkles, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { logout } from "../../services/authServices";
import Chatbot from "@/pages/Chatbot"; // Import the Chatbot component
import NotificationButton from "../notification/NotificationButton";
import { NotificationProvider } from "@/contexts/NotificationContext";
import NotificationBell from "../notification/NotificationBell";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import axios from "axios";

export function DashboardHeader() {
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isEcoleCodeDropdownOpen, setIsEcoleCodeDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/notifications', {
          withCredentials: true
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Set up socket connection
    const socket = io('http://localhost:5000', { withCredentials: true });
    
    socket.on('connect', () => {
      console.log('Connected to socket server');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      socket.emit('join', { userId: user.userId, role: user.role });
    });
    
    socket.on('notification', () => {
      // Refresh notifications when new one arrives
      fetchNotifications();
      // Show a browser notification
      toast.info("Nouvelle notification reçue");
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem("user"); // Récupère la donnée sous forme de string
    if (userString) {
      try {
        const user = JSON.parse(userString); // Convertit la string en objet
        const storedRole = user.role;
        const storedFirstName = user.prenom;
        const storedLastName = user.nom;
        
        if (storedFirstName && storedLastName) {
          setUser({ nom: storedFirstName, prenom: storedLastName, role: storedRole || "Formateur" });
        } else {
          console.warn("Données utilisateur incomplètes dans localStorage");
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur lors du parsing de user depuis localStorage", error);
        setUser(null);
      }
    } else {
      console.warn("Aucun utilisateur trouvé dans localStorage");
      setUser(null);
    }
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful****************");
     navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleChatbot = () => {
    const newChatbotState = !isChatbotOpen;
    setIsChatbotOpen(newChatbotState);
    
    // Dispatch custom event to notify dashboard of chatbot state change
    window.dispatchEvent(
      new CustomEvent('chatbotToggled', { 
        detail: { isOpen: newChatbotState } 
      })
    );
  };

  // Function to handle clicking on "Ecole du code" menu item
  const handleEcoleCodeClick = (path) => {
    navigate(path);
    // Always close the dropdown when clicking an item
    setIsEcoleCodeDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isEcoleCodeDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsEcoleCodeDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isEcoleCodeDropdownOpen]);

  // Cette partie a été modifiée pour ne pas montrer automatiquement le dropdown
  useEffect(() => {
    // On ne met pas de code ici pour afficher automatiquement le dropdown
  }, [location.pathname]);

  let navigationLinks = [];
  if (user?.role === "Formateur") {
    navigationLinks = [
      { name: "Dashboard", path: "/formateur/dashboardFormateur" },
      { name: "Mes Formations", path: "/formateur/mesformation", additionalPaths: ["/formateur/formationModal"] },
      { name: "Calendrier", path: "/formateur/CalendarView" , additionalPaths: ["/formateur/CreatEvent"]},
      { name: "Mes Bénéficiaires", path: "/formateur/BeneficiairesList" },
      { name: "Evaluation", path: "/formateur/EvaluationDashboard"},
    ];
  } else if (user?.role === "Manager") {
    navigationLinks = [
      { name: "Dashboard", path: "/manager/dashboardManager" },
      { 
        name: "Ecole du code", 
        path: "/manager/Ecolcode",
        hasDropdown: true,
        dropdownItems: [
          { name: "Gestion des Formateurs", path: "/manager/GestionFormateurManager" },
          { name: "Gestion des Formations", path: "/manager/GestionFormation" },
          { name: "Ajouter un Formateur", path: "/manager/AjoutFormateur" }
        ]
      },
      { name: "Fablab Solidaire", path: "/manager/FablabSolidaire" },
      { name: "Orange Fab", path: "/manager/OrangeFab" },
      { name: "Coordination", path: "/manager/Coordination" },
      { name: "Événements", path: "/page-link-3" },
    ];
  } else if (user?.role === "Coordinateur") {
    navigationLinks = [
      { name: "Dashboard", path: "/coordinateur/dashboardCoordinateur" },
      { name: "Page Link", path: "/page-link" },
      { name: "Page Link", path: "/page-link-2" },
      { name: "Page Link", path: "/page-link-3" },
    ];
  } else if (user?.role === "Technicien") {
    navigationLinks = [
      { name: "Dashboard", path: "/technicien/dashboardTechnicien" },
      { name: "Page Link", path: "/page-link" },
      { name: "Page Link", path: "/page-link-2" },
      { name: "Page Link", path: "/page-link-3" },
    ];
  }

  // Function to check if a link should be highlighted
  const isLinkActive = (link) => {
    // Exact match
    if (location.pathname === link.path) {
      return true;
    }
    
    // Check additional paths if defined
    if (link.additionalPaths && link.additionalPaths.includes(location.pathname)) {
      return true;
    }

    // Check dropdown items if they exist
    if (link.hasDropdown && link.dropdownItems) {
      return link.dropdownItems.some(item => item.path === location.pathname);
    }

    return false;
  };

  // Fonction pour vérifier si l'utilisateur est sur une page Dashboard
  const isOnDashboard = () => {
    return location.pathname.includes('/dashboard') || 
           location.pathname === '/formateur/dashboardFormateur' || 
           location.pathname === '/manager/dashboardManager' || 
           location.pathname === '/coordinateur/dashboardCoordinateur' || 
           location.pathname === '/technicien/dashboardTechnicien';
  };

  // Check if current page is Ecole du code or one of its sub-pages
  const isOnEcoleCodePage = () => {
    const ecoleCodeLink = navigationLinks.find(link => link.name === "Ecole du code");
    if (!ecoleCodeLink) return false;
    
    if (location.pathname === ecoleCodeLink.path) return true;
    
    if (ecoleCodeLink.dropdownItems) {
      return ecoleCodeLink.dropdownItems.some(item => item.path === location.pathname);
    }
    
    return false;
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-black text-white border-b border-gray-800 z-40">
        <div className="container mx-auto px-4 max-w-9xl">
          <div className="flex items-center justify-between h-[60px]">
            {/* Left: Logo + Navigation */}
            <div className="flex items-center space-x-8 mr-auto">
              {/* Logo with ml-5 to match footer's left alignment */}
              <div className="ml-9">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="30" height="30" fill="#FF7900"/>
                  <rect x="4.28699" y="21.429" width="21.429" height="4.287" fill="white"/>
                </svg>
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center space-x-7 relative">
                {navigationLinks.map((link, index) => (
                  <div key={index} className="relative ecole-code-dropdown" ref={link.hasDropdown ? dropdownRef : null}>
                    {link.hasDropdown ? (
                      <div>
                        <Link
                          to={link.path}
                          className={`flex items-center relative text-sm transition-colors font-medium ${
                            isLinkActive(link)
                              ? "text-orange-500"
                              : "text-gray-300 hover:text-orange-500"
                          }`}
                          onClick={(e) => {
                            // Laisse la navigation se produire mais ouvre le dropdown
                            e.preventDefault(); // On empêche la navigation par défaut
                            navigate(link.path); // On navigue programmatiquement
                            setIsEcoleCodeDropdownOpen(!isEcoleCodeDropdownOpen); // On bascule l'état du dropdown
                          }}
                        >
                          {link.name}
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </Link>
                        
                        {/* Le dropdown s'affiche seulement si isEcoleCodeDropdownOpen est true */}
                        {isEcoleCodeDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-black border border-gray-700 rounded-md shadow-lg z-50">
                            {link.dropdownItems.map((item, itemIndex) => (
                              <Link
                                key={itemIndex}
                                to={item.path}
                                className={`block px-4 py-2 text-sm ${
                                  location.pathname === item.path 
                                    ? "text-orange-500 bg-gray-900" 
                                    : "text-gray-300 hover:bg-gray-800 hover:text-orange-500"
                                }`}
                                onClick={() => setIsEcoleCodeDropdownOpen(false)} // Ferme le dropdown lors du clic
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                        
                        {/* Orange line for active link */}
                        {isLinkActive(link) && (
                          <div className="absolute bottom-[-22px] left-0 w-full h-[3px] bg-orange-500"></div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={link.path}
                        className={`relative text-sm transition-colors font-medium ${
                          isLinkActive(link)
                            ? "text-orange-500 after:absolute after:bottom-[-22px] after:left-0 after:w-full after:h-[3px] after:bg-orange-500"
                            : "text-gray-300 hover:text-orange-500"
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Right: Try AI button, Notifications, User Info, and Menu */}
            <div className="flex items-center space-x-6">
             {/* Try AI Button - Uniquement visible sur les pages Dashboard */}
             {isOnDashboard() && (
                <button
                  onClick={toggleChatbot}
                  className={`flex items-center space-x-1 ${
                    isChatbotOpen 
                      ? "bg-orange-500 hover:bg-orange-600" 
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  } text-white px-3 py-2 rounded-full text-sm font-medium transition-all`}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  <span>Try AI</span>
                </button>
             )}

              {/* Notifications Icon */}
              <NotificationProvider>
                <NotificationBell />
              </NotificationProvider>


              {/* User Info */}
              <div className="flex items-center space-x-2">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M15 13.05C17.9823 13.05 20.4 10.6323 20.4 7.65C20.4 4.66766 17.9823 2.25 15 2.25C12.0177 2.25 9.6 4.66766 9.6 7.65C9.6 10.6323 12.0177 13.05 15 13.05ZM19.731 12.6723C17.074 15.1758 12.9265 15.1759 10.2693 12.6725C8.14668 13.8294 6.80497 16.0332 6.75192 18.45H6.75V24.75C6.75 26.4069 8.09315 27.75 9.75 27.75H23.25V18.6C23.2508 16.1288 21.9009 13.8548 19.731 12.6723Z" fill="white"/>
                </svg>

                <span className="text-sm">
                  {user ? (
                    <div>
                      <div className="text-large font-max font-bold font-inter text-white">Bonjour,</div>
                      <div className="text-xm font-bold font-inter text-[#FF7900]">{`${user.nom} ${user.prenom}`}</div>
                    </div>
                  ) : (
                    <span className="text-orange-500">N/A</span>
                  )}
                </span>
              </div>
              
              {/* Menu Button */}
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-black hover:bg-white px-3 py-2 rounded-lg transition-colors duration-200 ml-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 9l7 7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    <Link
                      to="/Drive"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Drive
                    </Link>
                    <Link
                      to="/Paramétres"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Paramétres
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chatbot Panel */}
      {isChatbotOpen && (
        <div className="fixed top-[1.8cm] bottom-[1cm] right-0 w-1/4 bg-white shadow-xl z-50 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-medium">Ask our AI anything</h2>
            </div>
            <button onClick={toggleChatbot} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <Chatbot />
          </div>
        </div>
      )}
    </>
  );
}