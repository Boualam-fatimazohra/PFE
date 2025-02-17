// src/components/dashboardElement/CourseHeader.jsx
import * as React from "react";

interface CourseHeaderProps {
  title: string;
  subtitle: string;
  status: "en-cours" | "termine" | "annule";
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  subtitle,
  status,
}) => {
  const getStatusLabel = () => {
    switch (status) {
      case "en-cours":
        return "En Cours";
      case "termine":
        return "Terminé";
      case "annule":
        return "Annulé";
      default:
        return "";
    }
  };

  return (
    <div className="bg-[rgba(244,244,244,1)] flex w-[1300px] max-w-full items-stretch gap-[19px] flex-wrap mt-[17px] pr-20 max-md:pr-5">
      <div className="bg-[rgba(255,121,0,1)] flex w-3 shrink-0 h-[117px]" />
      <div className="my-auto max-md:max-w-full">
        <div className="flex w-[211px] max-w-full items-stretch gap-[11px]">
          <div className="text-black text-2xl font-bold grow shrink w-[99px]">
            {title}
          </div>
          <div className="bg-[rgba(255,122,0,0.1)] flex min-w-[84px] min-h-6 items-center overflow-hidden text-[13px] text-[rgba(255,122,0,1)] font-medium text-center leading-loose justify-center my-auto pl-3.5 pr-[13px] rounded-xl">
            <div className="self-stretch w-[57px] overflow-hidden my-auto">
              {getStatusLabel()}
            </div>
          </div>
        </div>
        <div className="text-[#666] text-2xl font-semibold max-md:max-w-full">
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
