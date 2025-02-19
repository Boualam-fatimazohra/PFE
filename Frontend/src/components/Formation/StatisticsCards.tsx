import * as React from "react";

interface StatCard {
  label: string;
  value: string;
}

interface StatisticsCardsProps {
  cards: StatCard[];
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 border border-[#999]">
          <p className="text-[#595959] text-xl mb-3">{card.label}</p>
          <p className="text-[34px] font-bold leading-none tracking-[-1px]">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;