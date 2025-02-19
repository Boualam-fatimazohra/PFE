// src/components/dashboardElement/ParticipantsSection.jsx
import * as React from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/dashboardElement/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Participant {
  date: string;
  time: string;
  lastName: string;
  firstName: string;
  email: string;
  gender: string;
  phone: string;
  status: "present" | "absent" | "abandonner";
}

interface ParticipantsSectionProps {
  participants: Participant[];
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({
  participants,
}) => {
  const getStatusStyle = (status: Participant["status"]) => {
    switch (status) {
      case "present":
        return "text-[rgba(0,195,31,1)]";
      case "absent":
        return "text-[rgba(255,72,21,1)]";
      case "abandonner":
        return "text-[rgba(255,205,11,1)]";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: Participant["status"]) => {
    switch (status) {
      case "present":
        return "Présent (e)";
      case "absent":
        return "Absent (e)";
      case "abandonner":
        return "Abandonner";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white w-full max-w-[1300px] mt-[31px]">
      <div className="border border-[color:var(--Neutral-400,#999)] bg-white flex w-full flex-col items-stretch pt-[19px] pb-[35px] border-solid">
        <div className="flex w-full flex-col items-stretch px-3">
          <div className="text-black text-2xl font-bold leading-none">
            Listes des participants
          </div>

          <div className="flex w-full items-center gap-[15px] flex-wrap mt-[19px]">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-[65%]">
              <input
                type="text"
                placeholder="Recherche une formation"
                className="flex-1 px-4 py-2 text-sm text-gray-700 outline-none"
              />
              <button className="bg-[rgba(255,121,0,1)] flex items-center justify-center w-[40px] h-[30px] rounded-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/abf956bd17d3e0722e44e6a409ac0d5f10ad9f6bf05e0122589db10f92934e48"
                  className="w-5 h-5"
                  alt="Search"
                />
              </button>
            </div>

            <Button className="self-stretch text-base text-black font-bold whitespace-nowrap leading-none my-auto flex items-center gap-2.5 py-[9px] px-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/c6e5be70a32aa27c9cc42bd80f61c5442d30a3c5796f60dd048c8bd667133730"
                className="w-5 h-5"
                alt="Filter"
              />
              Filtres
            </Button>

            <div className="self-stretch flex items-stretch gap-1.5 my-auto">
              <Button variant="outline">
                Importer
              </Button>
              <Button className="flex items-center gap-1">
                Exporter
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/1f6c107634d75f0fdc65b6493ffc17082465e7faf44580782a7d93fcead64d20"
                  className="w-[19px] h-[19px]"
                  alt="Export"
                />
              </Button>
              <Button>
                <Printer className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="bg-[rgba(235,235,235,1)] w-full text-base text-black font-bold leading-none mt-[18px] pr-20 pt-3">
            <div className="flex w-full max-w-[1020px] items-stretch gap-5 justify-between">
              <div className="flex items-stretch gap-[27px]">
                <input
                  type="checkbox"
                  className="border border-[color:var(--Neutral-400,#999)] w-3.5 h-3.5 my-auto rounded-sm border-solid"
                />
                <div>Date & Heure</div>
              </div>
              <div className="flex items-stretch gap-[40px_65px] whitespace-nowrap">
                <div>Nom</div>
                <div>Prénom</div>
                <div>Email</div>
              </div>
              <div className="flex items-stretch gap-[40px_67px] whitespace-nowrap">
                <div>Genre</div>
                <div>Téléphone</div>
                <div>Status</div>
              </div>
            </div>
          </div>

          {participants.map((participant, index) => (
            <div
              key={index}
              className="flex w-full items-center gap-[40px_68px] text-sm leading-none flex-wrap mt-[9px]"
            >
              <div className="self-stretch flex flex-col items-stretch whitespace-nowrap">
                <div className="flex items-stretch gap-5 text-black font-semibold justify-between">
                  <input
                    type="checkbox"
                    className="border border-[color:var(--Neutral-400,#999)] w-3.5 h-3.5 mt-1.5 rounded-sm border-solid"
                  />
                  <div>{participant.date}</div>
                </div>
                <div className="text-[rgba(85,85,85,1)] font-normal">
                  {participant.time}
                </div>
              </div>
              <div className="text-black font-normal self-stretch my-auto">
                {participant.lastName}
              </div>
              <div className="text-black font-normal self-stretch my-auto">
                {participant.firstName}
              </div>
              <div className="text-black font-normal self-stretch grow shrink w-[165px] my-auto">
                {participant.email}
              </div>
              <div className="text-black font-normal self-stretch my-auto">
                {participant.gender}
              </div>
              <div className="text-black font-normal self-stretch my-auto">
                {participant.phone}
              </div>
              <div
                className={`font-bold self-stretch my-auto ${getStatusStyle(participant.status)}`}
              >
                {getStatusLabel(participant.status)}
              </div>
              <button className="bg-blend-normal bg-white flex items-center gap-[11px] text-black font-semibold leading-loose pl-[9px] pr-6 py-[9px]">
                <span>Voir plus</span>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/3f6b2158bf8e84c144c9e124c49be20b1b1032221c399922e5ea5efa623b4ca2"
                  className="w-2 h-3"
                  alt="See more"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsSection;
