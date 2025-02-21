import { Link } from "react-router-dom";
import Logo from "@/assets/images/login_logo.png";

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-black p-2 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2">
            <img src={Logo} alt="Orange logo" className="w-9 h-9" />
          </div>
          <div className="text-white">
            <div className="text-large font-max font-bold font-inter">Orange</div>
            <div className="text-xm font-bold font-inter">Digital Center Maroc</div>
          </div>
        </div>
        <Link to="/" className="border border-white text-white px-3 py-1 text-xs hover:bg-white hover:text-black transition-colors font-inter">
          Retour Accueil
        </Link>
      </div>
    </header>
  );
}
