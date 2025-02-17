import * as React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseHeader from "@/components/Formation/CoursHeader";
import StatisticsCards from "@/components/Formation/StatisticsCards";
import DocumentsSection from "@/components/Formation/DocumentsSection";
import StatsSection from "@/components/Formation/StatsSection";
import ParticipantsSection from "@/components/Formation/ParticipantsSection";

const DetailsFormation = () => {
  const statsCards = [
    { label: "Total Bénéficiaires", value: "250" },
    { label: "Total Formations", value: "64" },
    { label: "Prochain event", value: "07" },
    { label: "Satisfaction ", value: "95%" },
  ];

  const documents = [
    { title: "Programme du formation", date: "25/02/2025" },
    { title: "Présentation Jour 01", date: "25/02/2025" },
    { title: "Exercices Pratiques", date: "25/02/2025" },
  ];

  const participants = [
    {
      date: "26/05/2024",
      time: "14h00-16h00",
      lastName: "Bikarrane",
      firstName: "Mohamed",
      email: "mohamed.bika@gmail.com",
      gender: "Homme",
      phone: "06445454512",
      status: "present" as const,
    },
    {
      date: "27/05/2024",
      time: "10h00-12h00",
      lastName: "Lahmidi",
      firstName: "Fatima",
      email: "fatima.lahmidi@gmail.com",
      gender: "Femme",
      phone: "06565656565",
      status: "absent" as const,
    },
  ];

  return (
    <div>
      <div className="flex w-full max-w-[1358px] items-stretch gap-5 flex-wrap justify-between mt-10">
        <div className="flex flex-col overflow-hidden text-sm text-black font-bold whitespace-nowrap leading-none pl-[55px]">
          <Button variant="link" className="flex items-center gap-1 pt-2 pb-2.5">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/5e6379252813464dcb43589db855cc4182d67eba3ef907ba443230f644e5b96e"
              className="w-[18px] h-[18px]"
              alt="Back"
            />
            Retour
          </Button>
        </div>
        <div className="flex items-stretch gap-[7px] my-auto">
          <div className="text-[#595959] text-sm font-normal leading-none grow shrink basis-auto">
            Données actualisées le 20/10/2025 à 8H02
          </div>
          <Button className="flex items-center gap-2" variant="outline">
            <span>Actualiser</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/c3fc36ef-95bc-44c2-aabe-531033eaf72f"
              className="w-4 h-4 object-contain"
              alt="Refresh"
            />
          </Button>
        </div>
      </div>

      <CourseHeader
        title="Formation"
        subtitle="AWS : Développement, déploiement et gestion"
        status="en-cours"
      />

      <StatisticsCards cards={statsCards} />

      <div className="w-full max-w-[1300px] mt-5">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          <DocumentsSection documents={documents} />
          <StatsSection completion="-" satisfaction="-" hours="-" />
        </div>
      </div>

      <ParticipantsSection participants={participants} />
    </div>
  );
};

export default DetailsFormation;
