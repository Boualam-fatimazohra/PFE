import { Bell, UserCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "@/services/authServices";

export function DashboardHeader() {
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  let navigationLinks = [];
  if (user?.role === "Formateur") {
    navigationLinks = [
      { name: "Dashboard", path: "/formateur/dashboardFormateur" },
      { name: "Mes Formations", path: "/formateur/mesformation" },
      { name: "Calendrier", path: "/CalendarView" },
      { name: "Mes Bénéficiaires", path: "/beneficiaires" },
      { name: "Evaluation", path: "/formulaire-evaluation" },
    ];
  } else if (user?.role === "Manager") {
    navigationLinks = [
      { name: "Dashboard", path: "/manager/dashboardManager" },
      { name: "Page Link", path: "/page-link" },
      { name: "Page Link", path: "/page-link-2" },
      { name: "Page Link", path: "/page-link-3" },
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

  return (
    <header className="fixed top-0 w-full bg-black text-white border-b border-gray-800 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-[60px]">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="30" fill="#FF7900"/>
              <rect x="4.28699" y="21.429" width="21.429" height="4.287" fill="white"/>
            </svg>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-6 relative">
              {navigationLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className={`relative text-sm transition-colors font-medium ${
                    location.pathname === link.path
                      ? "text-orange-500 after:absolute after:bottom-[-22px] after:left-0 after:w-full after:h-[3px] after:bg-orange-500"
                      : "text-gray-300 hover:text-orange-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Notifications, User Info, and Menu */}
          <div className="flex items-center space-x-6">
            {/* Messages Icon */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M26 11.0009C23.75 11.0009 21.7045 11.5841 20 12.6239C18.2955 11.5841 16.25 11 14 11H7.25V26.135C7.25 26.885 7.85 27.4991 8.6 27.4991L14 27.5C15.2 27.5 16.3447 27.7029 17.3608 28.1327C18.1191 28.4534 19.4461 29.4085 19.4461 29.4085C19.7 29.585 19.7822 29.645 20 29.645C20.2178 29.645 20.3 29.585 20.5539 29.4085C20.5539 29.4085 21.8809 28.4534 22.6392 28.1327C23.6553 27.7029 24.8 27.4991 26 27.4991L31.4 27.4981C31.7599 27.4967 32.1044 27.3521 32.3576 27.0965C32.6108 26.8408 32.752 26.4949 32.75 26.135V10.9991L26 11.0009Z" fill="white"/>
            </svg>

            {/* Notifications Icon */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27.2 24.2L28.4576 26.2913C28.5688 26.4767 28.5717 26.7076 28.4652 26.8957C28.3587 27.0838 28.1592 27.2001 27.943 27.2H12.057C11.8408 27.2001 11.6413 27.0838 11.5348 26.8957C11.4283 26.7076 11.4312 26.4767 11.5424 26.2913L12.8 24.2V18.2C12.8 14.8451 15.093 12.0265 18.1994 11.2272V11C18.203 10.0081 19.0081 9.20596 20 9.20596C20.9919 9.20596 21.797 10.0081 21.8006 11V11.232C24.9004 12.0447 27.2 14.9 27.2 18.248V24.2Z" fill="white"/>
              <path d="M21.6975 29.4972C21.2473 29.9473 20.6367 30.2001 20.0001 30.2C19.3634 30.2001 18.7528 29.9473 18.3026 29.4972C17.8524 29.0472 17.5994 28.4366 17.5992 27.8H22.4009C22.4008 28.4366 22.1478 29.0472 21.6975 29.4972Z" fill="white"/>
              <rect x="21" y="1" width="19" height="19" rx="9.5" fill="#4170D8"/>
              <path d="M29.9884 5.004C31.5564 5.004 33.2784 5.97 33.2784 7.72C33.2784 8.686 32.7884 9.47 31.9064 9.722V9.75C32.9984 9.988 33.6424 10.884 33.6424 11.976C33.6424 14.006 31.9344 15.196 30.0024 15.196C27.7764 15.196 26.3624 13.852 26.3624 11.738V11.626H28.2524C28.3084 12.858 28.9524 13.558 29.9744 13.558C30.8984 13.558 31.5704 12.928 31.5704 12.018C31.5704 10.884 30.8424 10.562 29.6104 10.562H29.3024V9.162H29.6664C30.7864 9.162 31.3884 8.714 31.3884 7.944C31.3884 7.118 30.7444 6.642 30.0024 6.642C29.2604 6.642 28.4904 7.076 28.4904 8.392H26.6004C26.6704 6.334 28.0004 5.004 29.9884 5.004Z" fill="white"/>
            </svg>

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
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-500 px-3 py-2 rounded-lg transition-colors duration-200"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {/* <span className="text-white text-sm font-medium">Menu</span> */}
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
  );
}