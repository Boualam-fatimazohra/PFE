// src/components/dashboardElement/StatisticsCards.jsx
import * as React from "react";

interface StatItem {
  label: string;
  value: string | number;
}

interface StatisticsCardsProps {
  cards: StatItem[];
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ cards }) => {
  return (
    <div className="w-full max-w-[1300px] mt-[22px] max-md:max-w-full">
      <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
        {cards.map((card, index) => (
          <div key={index} className="w-3/12 max-md:w-full max-md:ml-0">
            <div className="items-center border border-[color:var(--Neutral-400,#999)] bg-white flex min-h-[102px] grow gap-4 font-bold w-full px-3 py-[15px] border-solid max-md:mt-2.5">
              <div className="self-stretch w-[163px] my-auto">
                <div className="text-[#595959] text-xl leading-[1.3]">
                  {card.label}
                </div>
                <div className="text-black text-[34px] leading-none tracking-[-1px] mt-3">
                  {card.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsCards;
