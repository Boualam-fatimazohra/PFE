import * as React from "react";
import { Printer } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[rgba(253,253,253,1)]">
      <main className="flex-1 flex flex-col items-center">
        {children}
      </main>
      
    </div>
  );
};





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

interface StatCard {
  label: string;
  value: string | number;
}

interface StatisticsCardsProps {
  cards: StatCard[];
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

interface Document {
  name: string;
  date: string;
}

interface DocumentsSectionProps {
  documents: Document[];
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents }) => {
  return (
    <div className="bg-white w-6/12 max-md:w-full">
      <div className="border border-[color:var(--Neutral-400,#999)] bg-white w-full pt-[15px] pb-[27px] px-3 border-solid">
        <div className="flex w-full items-stretch gap-5 font-bold flex-wrap justify-between">
          <div className="text-black text-2xl leading-none my-auto">
            Kit Formations
          </div>
          <button className="self-stretch bg-black min-h-10 gap-[5px] overflow-hidden text-sm text-white whitespace-nowrap text-center leading-none px-5">
            Importer
          </button>
        </div>

        {documents.map((doc, index) => (
          <React.Fragment key={index}>
            <div className="border-t-[color:var(--Neutral-200,#DDD)] border-b-[color:var(--Neutral-200,#DDD)] flex w-full items-center gap-[40px_100px] flex-wrap mt-[25px] py-1.5 border-t border-solid border-b">
              <div className="text-[#333] text-base font-semibold leading-none self-stretch grow shrink w-[178px] my-auto">
                {doc.name}
              </div>
              <div className="text-[#595959] text-[13px] font-semibold leading-loose self-stretch my-auto">
                {doc.date}
              </div>
              <div className="self-stretch flex items-stretch gap-2.5">
                <button className="p-2">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/b1d8dbe1266382def8285a9d3331a9bd6047a1d72c58c928c6934eb61deb81ec"
                    className="w-6 h-6"
                    alt="View"
                  />
                </button>
                <button className="p-2">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/b4ab927c22bfd6ae28b7074e12d10c0a8a11127c57e1eb08e72136ec9e01b952"
                    className="w-6 h-6"
                    alt="Download"
                  />
                </button>
                <button className="p-2">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/e678b81cd4194c7e1aaf86995b3d8eae8f8beeebe8486169552b224c44c98331"
                    className="w-6 h-6"
                    alt="Delete"
                  />
                </button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

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
                <div className="w-full text-[34px] font-bold whitespace-nowrap leading-none mt-8">
                  {completion}
                </div>
              </div>
            </div>
            <div className="w-[33%] ml-5 max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(242,242,242,1)] min-w-[158px] grow text-[rgba(20,20,20,1)] w-full p-6 rounded-xl">
                <div className="w-full text-base font-medium">
                  Taux Satisfaction
                </div>
                <div className="w-full text-[34px] font-bold whitespace-nowrap leading-none mt-8">
                  {satisfaction}
                </div>
              </div>
            </div>
            <div className="w-[33%] ml-5 max-md:w-full max-md:ml-0">
              <div className="bg-[rgba(242,242,242,1)] min-w-[158px] grow text-[rgba(20,20,20,1)] whitespace-nowrap w-full p-6 rounded-xl">
                <div className="w-full text-base font-medium">Heurs</div>
                <div className="w-full text-[34px] font-bold leading-none mt-8">
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


            <button className="self-stretch text-base text-black font-bold whitespace-nowrap leading-none my-auto flex items-center gap-2.5 py-[9px] px-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/c6e5be70a32aa27c9cc42bd80f61c5442d30a3c5796f60dd048c8bd667133730"
                className="w-5 h-5"
                alt="Filter"
              />
              Filtres
            </button>

            <div className="self-stretch flex items-stretch gap-1.5 my-auto">
  <button className="border border-[color:var(--Neutral-400,#999)] text-sm text-[#999] font-bold whitespace-nowrap leading-none px-5 py-2 border-solid">
    Importer
  </button>
  <button className="border border-[color:var(--Primary-Core,#FF7900)] flex items-center gap-1 px-4 py-2 border-solid text-[#FF7900] text-sm font-bold">
    Exporter
    <img
      src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/1f6c107634d75f0fdc65b6493ffc17082465e7faf44580782a7d93fcead64d20"
      className="w-[19px] h-[19px]"
      alt="Export"
    />
  </button>
  <button className=" px-4 py-2 border-solid text-[#918c8c] text-sm font-bold">
 
  <Printer className="w-5 h-5" />
</button>

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

const DetailsFormation = () => {
  const statsCards = [
    { label: "Total Bénéficiar", value: "250" },
    { label: "Total Formations", value: "64" },
    { label: "Prochain event", value: "07" },
    { label: "Satisfaction ", value: "95%" },
  ];

  const documents = [
    { name: "Programme du formation", date: "25/02/2025" },
    { name: "Présentation Jour 01", date: "25/02/2025" },
    { name: "Exercices Pratiques", date: "25/02/2025" },
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
    <Layout>
      <div className="flex w-full max-w-[1358px] items-stretch gap-5 flex-wrap justify-between mt-10">
        <div className="flex flex-col overflow-hidden text-sm text-black font-bold whitespace-nowrap leading-none pl-[55px]">
          <button className="flex items-center gap-1 pt-2 pb-2.5">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/5e6379252813464dcb43589db855cc4182d67eba3ef907ba443230f644e5b96e"
              className="w-[18px] h-[18px]"
              alt="Back"
            />
            Retour
          </button>
        </div>
        <div className="flex items-stretch gap-[7px] my-auto">
       
          <div className="text-[#595959] text-sm font-normal leading-none grow shrink basis-auto">
            Données actualisées le 20/10/2025 à 8H02
          </div>
          <button className="flex items-center gap-2 bg-white text-base text-black font-semibold whitespace-nowrap leading-none px-[30px] py-2 hover:bg-gray-50">
            <span>Actualiser</span>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/c3fc36ef-95bc-44c2-aabe-531033eaf72f"
              className="w-4 h-4 object-contain"
              alt="Refresh"
            />
          </button>
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
    </Layout>
  );
};

export default DetailsFormation;