import { Bell, UserCircle } from "lucide-react";
   import { Link, useNavigate, useLocation } from "react-router-dom";
   import { useEffect, useState } from "react";
   // import { logout } from "@/services/authService";

   export function DashboardHeader() {
   const [user, setUser] = useState(null);
   const navigate = useNavigate();
   const location = useLocation(); 

   useEffect(() => {
   const storedRole = localStorage.getItem("userRole");
   const storedFirstName = localStorage.getItem("nom");
   const storedLastName = localStorage.getItem("prenom");
   if (storedFirstName && storedLastName) {
   setUser({ nom: storedFirstName, prenom: storedLastName, role: storedRole || "Formateur" });
   } else {
   console.warn("User data not found in localStorage");
   setUser(null);
   }
   }, []);

   const handleLogout = async () => {
   try {
   console.log("Attempting to logout");
   // await logout();
   localStorage.removeItem('userRole');
   localStorage.removeItem('nom');
   localStorage.removeItem('prenom');
   navigate('/');
   console.log("Logout successful, navigating to /");
   } catch (error) {
   console.error("Logout error:", error);
   }
   };

   let navigationLinks = [];
   if (user?.role === "Formateur") {
   navigationLinks = [
   { name: "Dashboard", path: "/formateur/dashboardFormateur" },
   { name: "Mes Formations", path: "/formateur/mesformation" },
   { name: "Page Link", path: "/page-link" },
   { name: "Page Link", path: "/page-link-2" },
   { name: "Page Link", path: "/page-link-3" },
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
   {/* Left: Dashboard Link */}
   <div className="flex items-center space-x-8">
   
   {/* Navigation Links */}
   <nav className="flex items-center space-x-6">
   {navigationLinks.map((link, index) => (
   <Link
   key={index}
   to={link.path}
   className={`text-sm transition-colors ${
   location.pathname === link.path
   ? "text-orange-500 font-medium border-b-2 border-orange-500"
   : "text-gray-300 hover:text-orange-500"
   }`}
   >
   {link.name}
   </Link>
   ))}
   </nav>
   </div>

   {/* Right: Notifications and User Info */}
   <div className="flex items-center space-x-6">
   <button className="relative text-gray-300 hover:text-orange-500">
   <Bell size={20} />
   </button>
   <div className="flex items-center space-x-2">
   <UserCircle size={20} className="text-gray-300" />
   <span className="text-sm">
   <span className="text-gray-400">Bonjour, </span>
   {user ? (
   <span className="text-orange-500">{`${user.nom} ${user.prenom}`}</span>
   ) : (
   <span className="text-orange-500">N/A</span>
   )}
   </span>
   </div>
   <button onClick={handleLogout} className="text-sm text-gray-300 hover:text-orange-500">
   Logout
   </button>
   </div>
   </div>
   </div>
   </header>
   );
   }
