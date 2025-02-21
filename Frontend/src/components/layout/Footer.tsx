import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-black py-2 fixed bottom-0 w-full">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-5">
            <span className="text-xm text-white">© Orange 2025</span>
            <Link to="/accessibility" className="text-xm text-white hover:text-orange-500">
              Accessibility statement
            </Link>
            <Link to="/contact" className="text-xm text-white hover:text-orange-500">
              Contact
            </Link>
          </div>
          <Link to="/external" className="flex items-center space-x-1 text-xm text-white hover:text-orange-500">
            <span>Link</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
