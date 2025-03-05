import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export const StatsCard = ({ title, value, icon }: StatsCardProps) => (
  <Card className="rounded-[4px] border border-[#999999]"> {/* Supprime l'arrondi des cartes */}
    <CardContent className="flex items-center space-x-4 p-6">
      <div className="w-12 h-12 bg-[#CCCCCC] rounded-full">{icon}</div> {/* Garde le cercle */}
      <div>
        <p className="text-lg text-[#595959] font-bold">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

