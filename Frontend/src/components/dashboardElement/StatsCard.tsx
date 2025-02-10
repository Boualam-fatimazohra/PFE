import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export const StatsCard = ({ title, value, icon }: StatsCardProps) => (
  <Card>
    <CardContent className="flex items-center space-x-4 p-6">
      <div className="w-12 h-12 bg-gray-200 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);