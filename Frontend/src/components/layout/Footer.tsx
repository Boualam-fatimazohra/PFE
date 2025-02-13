import { useLocation } from "react-router-dom";

export function Footer() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/"; // Vérifie si on est sur la page de login

  if (isLoginPage) return null; // ❌ Ne pas afficher le footer sur la page login

  return (
    <footer className="fixed bottom-0 w-full bg-black border-t border-gray-200 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <span className="text-sm text-white">© Orange 2025</span>
            <a href="#" className="text-sm text-white hover:text-orange-500">
              Accessibility statement
            </a>
            <a href="#" className="text-sm text-white hover:text-orange-500">
              Contact
            </a>
          </div>
          <button className="flex items-center space-x-2 text-sm text-white hover:text-orange-500">
            <span>Déconnexion</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
