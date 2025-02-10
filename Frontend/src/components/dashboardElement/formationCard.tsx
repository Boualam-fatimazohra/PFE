import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const formationCard = () => {
  return (
    <div>
      {/* Mes Formations */}
      <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Mes Formations</h2>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors">
                    Découvrir
                  </button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: "25/02/2025", status: "En Cours" },
                      { date: "25/02/2025", status: "Terminer" },
                      { date: "25/02/2025", status: "Replanifier" },
                      { date: "25/02/2025", status: "En Cours" },
                      { date: "25/02/2025", status: "En Cours" },
                    ].map((formation, index) => (
                      <TableRow key={index}>
                        <TableCell>Conception d'application mobile</TableCell>
                        <TableCell>{formation.date}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            formation.status === "En Cours" ? "bg-orange-100 text-orange-700" :
                            formation.status === "Terminer" ? "bg-green-100 text-green-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {formation.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <button className="bg-black text-white px-3 py-1 rounded-md text-sm">
                            Accéder
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
    </div>
  )
}

export default formationCard
