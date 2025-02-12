import { Bell, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  return (
    <header className="fixed top-0 w-full bg-black text-white border-b border-gray-800 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-[60px]">
          {/* Left: Dashboard Link */}
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-orange-500 font-medium">
              Dashboard
            </Link>
            {/* Navigation Links */}
            <nav className="flex items-center space-x-6">
              {["Page Link", "Page Link", "Page Link", "Page Link", "Page Link"].map((link, index) => (
                <Link
                  key={index}
                  to="#"
                  className="text-gray-300 hover:text-orange-500 text-sm transition-colors"
                >
                  {link}
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
                <span className="text-orange-500">Mohamed Bikarrane</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}