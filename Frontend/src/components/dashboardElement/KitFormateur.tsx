import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function KitFormateur() {
  const sections = [
    {
      title: "Formation Support",
      description: "Outils et supports pour vos formations.",
    },
    {
      title: "Droit d'image",
      description: "Règles d’usage et de protection des images",
    },
    {
      title: "Certifications",
      description: "Détails sur les certifications et leur obtention.",
    },
    {
      title: "Règlement Intérieur",
      description: "Consultez les règles et directives à respecter.",
    },
  ];

  return (
    <div>
      <Card className="border-[#999999] rounded-[4px]">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold font-inter mb-6">Kit Formateur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{section.title}</h3>
                  <Search size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-4">{section.description}</p>
                <button className="rounded-[4px] bg-black text-white px-3 py-1 text-sm">
                  Accéder
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
