
import { Card, CardContent } from "@/components/ui/card";
import { Search} from "lucide-react";

export default function KitFormateur() {
  return (
    <div>
      <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Kit Formateur</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  "Formation support",
                  "Droit d'image",
                  "Certifications",
                  "Règlement Intérieur"
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{item}</h3>
                      <Search size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Get help with a specific reservation</p>
                    <button className="bg-black text-white px-3 py-1 rounded-md text-sm">
                      Accéder
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
    </div>
  )
}
