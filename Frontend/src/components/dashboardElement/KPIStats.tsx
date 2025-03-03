import { Card, CardContent } from "@/components/ui/card";
import BarChart from "recharts/lib/chart/BarChart";
import Bar from "recharts/lib/cartesian/Bar";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import Tooltip from "recharts/lib/component/Tooltip";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";

const data = [
  { categorie: "Chercheurs d'emploi", taux: 65 },
  { categorie: "Participation Genre (H/F)", taux: 52 },
  { categorie: "Mobilité Réduite", taux: 18 }
];

const KPIStats = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Indicateurs de Performance (KPI)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categorie" />
            <YAxis allowDecimals={false} type="number" />
            <Tooltip />
            <Bar dataKey="taux" fill="#8884d8" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default KPIStats;
