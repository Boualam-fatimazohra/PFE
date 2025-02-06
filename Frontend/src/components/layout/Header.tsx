import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-orange-500 rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-orange-500">Orange</span>
              <span className="text-sm text-gray-600">Digital Center Maroc</span>
            </div>
          </div>
          <div className="flex items-center">
            <button className="px-6 py-2 text-orange-500 hover:text-orange-600 transition-colors">
              Connexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
