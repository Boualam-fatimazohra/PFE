import { Bell, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  return (
    <header className="w-full bg-[#000000e6] border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[40px]">
          <div className="flex items-center space-x-8">
            {/* Logo et liens de navigation */}
            <div className="flex items-center">
              <div className="h-full w-1 bg-orange-500 mr-3" />
              <Link to="/dashboard" className="text-orange-500 font-medium">
                Dashboard
              </Link>
            </div>
            
            <nav className="flex items-center space-x-6">
              {["Page Link", "Page Link", "Page Link", "Page Link", "Page Link"].map((link, index) => (
                <Link
                  key={index}
                  to="#"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <button className="relative text-gray-300 hover:text-white">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-2">
              <UserCircle size={20} className="text-gray-300" />
              <span className="text-sm">
                <span className="text-gray-400">Bonjour, </span>
                <span className="text-orange-500">Mohamed Bikarrane</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}