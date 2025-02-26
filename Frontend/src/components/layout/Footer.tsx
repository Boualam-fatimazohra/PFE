import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-black py-2 fixed bottom-0 w-full">
      <div className="container mx-auto px-4 max-w-9xl">
        <div className="flex justify-between items-center w-full">
          {/* Texte à gauche avec même alignement que le logo du header */}
          <span className="text-xm text-white ml-9">© Orange 2025</span>

          {/* Liens à droite avec même espacement que dans le header */}
          <div className="flex space-x-7">
            <Link to="/accessibility" className="text-xm text-white hover:text-orange-500">
              Accessibility statement
            </Link>
            <Link to="/contact" className="text-xm text-white hover:text-orange-500">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}