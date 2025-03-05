import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Filter } from "lucide-react";

const KPIStats = () => {
  const [timePeriod, setTimePeriod] = useState("ce-mois-ci");

  return (
<Card className="w-[700px] h-[400px] max-w-md p-8 rounded-none">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">KPI’s</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-sm font-medium border border-gray-300 px-3 py-1.5 rounded">
              <Filter className="w-4 h-4" />
              Filtres
            </button>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
            >
              <option value="ce-mois-ci">Ce mois-ci</option>
              <option value="mois-dernier">Mois dernier</option>
            </select>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="relative flex flex-col items-center justify-center">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="10"
              strokeDasharray="62.8 251.2"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#22C55E"
              strokeWidth="10"
              strokeDasharray="62.8 251.2"
              strokeDashoffset="-62.8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#EAB308"
              strokeWidth="10"
              strokeDasharray="62.8 251.2"
              strokeDashoffset="-125.6"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#EF4444"
              strokeWidth="10"
              strokeDasharray="62.8 251.2"
              strokeDashoffset="-188.4"
            />
          </svg>

          {/* Centre du graphique */}
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold">2,162</span>
            <span className="text-sm text-gray-500">Total Participants</span>
          </div>
        </div>

        {/* Légende */}
        <div className="flex justify-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">Data 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">Data 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-600">Data 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-600">Data 1</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIStats;
