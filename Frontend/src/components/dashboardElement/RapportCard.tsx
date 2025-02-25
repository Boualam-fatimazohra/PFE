import { Card, CardContent } from "@/components/ui/card";


export default function RapportCard() {
  return (
    <div>
      <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Rapport & Statistiques</h2>
                <button className="rounded-none bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                  Générer Rapport
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Taux de completion</p>
                  <p className="text-4xl font-bold">85%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Taux Satisfaction</p>
                  <p className="text-4xl font-bold">87%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Heures</p>
                  <p className="text-4xl font-bold">451 H</p>
                </div>
              </div>
            </CardContent>
          </Card>

    </div>
  )
}
