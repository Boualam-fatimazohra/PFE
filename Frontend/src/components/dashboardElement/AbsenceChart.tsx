import { Card, CardContent } from "@/components/ui/card";
import BarChart from "recharts/lib/chart/BarChart";
import Bar from "recharts/lib/cartesian/Bar";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import Tooltip from "recharts/lib/component/Tooltip";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";
import Line from  "recharts/lib/component/ResponsiveContainer";
import LineChart from  "recharts/lib/component/ResponsiveContainer";
const data = [
  { mois: "Jan", taux: 5 },
  { mois: "Fév", taux: 7 },
  { mois: "Mar", taux: 4 },
  { mois: "Avr", taux: 6 },
  { mois: "Mai", taux: 8 },
  { mois: "Juin", taux: 10 },
  { mois: "Juil", taux: 12 },
  { mois: "Août", taux: 9 },
  { mois: "Sept", taux: 6 },
  { mois: "Oct", taux: 5 },
  { mois: "Nov", taux: 4 },
  { mois: "Déc", taux: 3 }
];

const AbsenceChart = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Taux de Déperdition par Mois</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="taux" stroke="#ff7300" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AbsenceChart;
