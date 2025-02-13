import * as React from "react";

export const FormationAvenir = () => {
  return (
    <>
      <div className="flex w-full max-w-[1358px] items-stretch gap-5 flex-wrap justify-between mt-10 max-md:max-w-full">
        <div className="flex flex-col overflow-hidden text-sm text-black font-bold whitespace-nowrap leading-none pl-[55px]">
          <div className="flex">
            <div className="flex items-center gap-1 pt-2 pb-2.5">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/5e6379252813464dcb43589db855cc4182d67eba3ef907ba443230f644e5b96e"
                className="aspect-[1] object-contain w-[18px] self-stretch shrink-0 my-auto"
                alt="Back arrow"
              />
              <div className="self-stretch gap-[3px] my-auto text-gray-700">Retour</div>
            </div>
          </div>
        </div>
        <div className="flex items-stretch gap-[7px] my-auto">
          <div className="text-gray-500 text-sm font-normal leading-none grow shrink basis-auto">
            Données actualisées le 20/10/2025 à 8H02
          </div>
          <div className="flex flex-col relative aspect-[4.909] w-[108px] text-base text-black font-semibold whitespace-nowrap leading-none px-[30px] bg-gray-200 rounded-lg shadow-md">
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/605203f2-edcb-45e7-b932-45a123fc1375"
              className="absolute h-full w-full object-cover inset-0 rounded-lg"
              alt="Refresh button"
            />
            Actualiser
          </div>
        </div>
      </div>

      <div className="bg-[#F4F4F4] flex w-[1300px] max-w-full items-stretch gap-[19px] flex-wrap mt-[17px] pr-20 max-md:pr-5">
        <div className="bg-orange-500 flex w-3 shrink-0 h-[117px]" />
        <div className="my-auto max-md:max-w-full">
          <div className="flex w-[211px] max-w-full items-stretch gap-[11px]">
            <div className="text-black text-2xl font-bold grow shrink w-[99px]">
              Formation
            </div>
            <div className="bg-purple-100 flex min-w-[84px] min-h-6 items-center overflow-hidden text-[13px] text-purple-600 font-medium text-center leading-loose justify-center my-auto px-4 rounded-xl">
              <div className="self-stretch w-11 overflow-hidden my-auto">A venir</div>
            </div>
          </div>
          <div className="text-gray-700 text-2xl font-semibold max-md:max-w-full">
            AWS : Développement, déploiement et gestion
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1300px] mt-[22px] max-md:max-w-full">
        <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
          {["Total Bénéficiaires", "Total Formations", "Prochain événement", "Satisfaction moyenne"].map((label, index) => (
            <div key={index} className="w-3/12 bg-white shadow-md p-4 rounded-lg text-center border border-gray-200 max-md:w-full">
              <div className="text-gray-500 text-sm">{label}</div>
              <div className="text-xl font-bold text-black">-</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center mt-10">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/32942b86facf465bad688d8f78f5f3fb/d383d3334b3208e0daf239faa8e943e901e9c3a33b577eca85aa726897409666"
          alt="No data"
          className="w-32 h-32"
        />
        <h2 className="text-lg font-semibold text-gray-800 mt-4">Vous n'avez aucun résultat</h2>
        <p className="text-gray-600">pour cette formation</p>
      </div>
    </>
  );
};
