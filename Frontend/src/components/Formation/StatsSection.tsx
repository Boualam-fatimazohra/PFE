// src/components/dashboardElement/StatsSection.jsx
import * as React from "react";

interface StatsSectionProps {
  completion: string;
  satisfaction: string;
  hours: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  completion,
  satisfaction,
  hours,
}) => {
  return (
    <div className="bg-white w-6/12 ml-5 max-md:w-full max-md:ml-0">
      <div className="border border-[color:var(--Neutral-400,#999)] bg-white w-full pt-[15px] pb-[47px] px-3 border-solid">
        <div className="flex w-full items-stretch gap-5 font-bold flex-wrap justify-between">
          <div className="text-black text-2xl leading-none my-auto">
            Rapport & Statistiques
          </div>
          <button className="self-stretch bg-[#FF7900] min-h-10 gap-[5px] overflow-hidden text-sm text-white text-center leading-none px-5">
            Générer Lien
          </button>
        </div>
        <div className="mt-[25px]">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
            <div className="w-[33%] max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(242,242,242,1)] min-w-[158px] grow text-[rgba(20,20,20,1)] w-full p-6 rounded-xl">
                <div className="w-full text-base font-medium">
                  Taux de completion
                </div>
                <div className="text-black text-[34px] font-bold whitespace-nowrap leading-none mt-8">
                  {completion}
                </div>
              </div>
            </div>
            <div className="w-[33%] ml-5 max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(242,242,242,1)] min-w-[158px] grow text-[rgba(20,20,20,1)] w-full p-6 rounded-xl">
                <div className="w-full text-base font-medium">
                  Taux Satisfaction
                </div>
                <div className="text-black text-[34px] font-bold whitespace-nowrap leading-none mt-8">
                  {satisfaction}
                </div>
              </div>
            </div>
            <div className="w-[33%] ml-5 max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(242,242,242,1)] min-w-[158px] grow text-[rgba(20,20,20,1)] whitespace-nowrap w-full p-6 rounded-xl">
                <div className="w-full text-base font-medium">Heurs</div>
                <div className="text-black text-[34px] font-bold leading-none mt-8">
                  {hours}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
