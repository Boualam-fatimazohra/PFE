import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FormationsFablab from "./FormationsFablab";
import ProjetsFablab from "./ProjetsFablab";
import { EquipementFab } from "./equipementFab";

// Static Data Models

interface Equipement {
  id: string;
  nom: string;
  image:string;
  etat: 'Disponible' | 'En maintenance';
  
}


const FablabSolidaire = () => {
  const navigate = useNavigate();

  const stats = [
    { title: "Participants actifs", value: 210, icon: <svg xmlns="http://www.w3.org/2000/svg" width="33" height="26" viewBox="0 0 33 26" fill="none"><g clip-path="url(#clip0_865_2062)"><path d="M7.3125 0C8.38994 0 9.42325 0.428012 10.1851 1.18988C10.947 1.95175 11.375 2.98506 11.375 4.0625C11.375 5.13994 10.947 6.17325 10.1851 6.93512C9.42325 7.69699 8.38994 8.125 7.3125 8.125C6.23506 8.125 5.20175 7.69699 4.43988 6.93512C3.67801 6.17325 3.25 5.13994 3.25 4.0625C3.25 2.98506 3.67801 1.95175 4.43988 1.18988C5.20175 0.428012 6.23506 0 7.3125 0ZM26 0C27.0774 0 28.1108 0.428012 28.8726 1.18988C29.6345 1.95175 30.0625 2.98506 30.0625 4.0625C30.0625 5.13994 29.6345 6.17325 28.8726 6.93512C28.1108 7.69699 27.0774 8.125 26 8.125C24.9226 8.125 23.8892 7.69699 23.1274 6.93512C22.3655 6.17325 21.9375 5.13994 21.9375 4.0625C21.9375 2.98506 22.3655 1.95175 23.1274 1.18988C23.8892 0.428012 24.9226 0 26 0ZM0 15.1684C0 12.1773 2.42734 9.75 5.41836 9.75H7.58672C8.39414 9.75 9.16094 9.92773 9.85156 10.2426C9.78555 10.6082 9.75508 10.9891 9.75508 11.375C9.75508 13.3148 10.6082 15.0566 11.9539 16.25C11.9437 16.25 11.9336 16.25 11.9184 16.25H1.08164C0.4875 16.25 0 15.7625 0 15.1684ZM20.5816 16.25C20.5715 16.25 20.5613 16.25 20.5461 16.25C21.8969 15.0566 22.7449 13.3148 22.7449 11.375C22.7449 10.9891 22.7094 10.6133 22.6484 10.2426C23.3391 9.92266 24.1059 9.75 24.9133 9.75H27.0816C30.0727 9.75 32.5 12.1773 32.5 15.1684C32.5 15.7676 32.0125 16.25 31.4184 16.25H20.5816ZM11.375 11.375C11.375 10.0821 11.8886 8.84209 12.8029 7.92785C13.7171 7.01361 14.9571 6.5 16.25 6.5C17.5429 6.5 18.7829 7.01361 19.6971 7.92785C20.6114 8.84209 21.125 10.0821 21.125 11.375C21.125 12.6679 20.6114 13.9079 19.6971 14.8221C18.7829 15.7364 17.5429 16.25 16.25 16.25C14.9571 16.25 13.7171 15.7364 12.8029 14.8221C11.8886 13.9079 11.375 12.6679 11.375 11.375ZM6.5 24.6441C6.5 20.9066 9.53164 17.875 13.2691 17.875H19.2309C22.9684 17.875 26 20.9066 26 24.6441C26 25.3906 25.3957 26 24.6441 26H7.85586C7.10938 26 6.5 25.3957 6.5 24.6441Z" fill="#FF7900"/></g><defs><clipPath id="clip0_865_2062"><path d="M0 0H32.5V26H0V0Z" fill="white"/></clipPath></defs></svg> },
    { title: "Projets en Cours", value: 10, icon: (<svg xmlns="http://www.w3.org/2000/svg" width="33" height="26" viewBox="0 0 62 62" fill="none"><mask id="mask0_1488_2668" maskUnits="userSpaceOnUse" x="0" y="0" width="62" height="62"><rect width="62" height="62" rx="31" fill="#CCCCCC" /></mask><g mask="url(#mask0_1488_2668)"><rect width="62" height="62" rx="31" fill="#FFF2E6" /><g transform="translate(30, 30) scale(1.9) translate(-30, -30)"><path d="M38.5 41.5C39.1 39.5 40.2 37.5 41.2 35.5C41.5 35 41.8 34.5 42.1 34C43.3 32 44 29.8 44 27.5C44 22 39.7 17.5 34.5 17.5C29.3 17.5 25 22 25 27.5C25 29.8 25.7 32 26.9 34C27.2 34.5 27.5 35 27.8 35.5C28.8 37.5 29.8 39.5 30.4 41.5H38.5V41.5ZM34.5 49C37 49 39.1 46.8 39.1 44.3V43.4H29.9V44.3C29.9 46.8 32 49 34.5 49ZM29.9 27.5C29.9 28 29.5 28.5 29 28.5C28.5 28.5 28.1 28 28.1 27.5C28.1 24 30.8 21.5 34.5 21.5C35 21.5 35.4 22 35.4 22.5C35.4 23 35 23.5 34.5 23.5C32 23.5 29.9 25.6 29.9 27.5Z" fill="#FF7900"/></g></g></svg>)},
    { title: "Ateliers Planifiés", value: 9, icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="22" viewBox="0 0 22 22" fill="none"><g clip-path="url(#clip0_865_2094)"><path d="M13.7501 1.375C13.402 1.375 13.0583 1.43516 12.7317 1.55117L0.678957 5.90391C0.270754 6.0543 5.1035e-05 6.44102 5.1035e-05 6.875C5.1035e-05 7.30898 0.270754 7.6957 0.678957 7.84609L3.16685 8.74414C2.46216 9.85273 2.06255 11.1633 2.06255 12.5426V13.75C2.06255 14.9703 1.59849 16.2293 1.10435 17.2219C0.825051 17.7805 0.507082 18.3305 0.137551 18.8375C5.10365e-05 19.0223 -0.0386208 19.2629 0.0387229 19.482C0.116067 19.7012 0.296535 19.8645 0.519973 19.9203L3.26997 20.6078C3.45044 20.6551 3.6438 20.6207 3.80279 20.5219C3.96177 20.423 4.07349 20.2598 4.10786 20.075C4.47739 18.2359 4.29263 16.5859 4.01763 15.4043C3.88013 14.7941 3.69536 14.1711 3.43755 13.5996V12.5426C3.43755 11.2449 3.87583 10.0203 4.63638 9.04062C5.19068 8.37461 5.90825 7.8375 6.75044 7.50664L13.4965 4.85547C13.8489 4.71797 14.2485 4.88984 14.386 5.24219C14.5235 5.59453 14.3516 5.99414 13.9993 6.13164L7.25318 8.78281C6.72036 8.99336 6.252 9.31563 5.86958 9.71094L12.7274 12.1859C13.054 12.302 13.3977 12.3621 13.7458 12.3621C14.0938 12.3621 14.4376 12.302 14.7641 12.1859L26.8211 7.84609C27.2293 7.7 27.5 7.30898 27.5 6.875C27.5 6.44102 27.2293 6.0543 26.8211 5.90391L14.7684 1.55117C14.4418 1.43516 14.0981 1.375 13.7501 1.375ZM5.50005 17.5312C5.50005 19.048 9.19536 20.625 13.7501 20.625C18.3047 20.625 22 19.048 22 17.5312L21.3426 11.2836L15.2325 13.4922C14.7555 13.6641 14.2528 13.75 13.7501 13.75C13.2473 13.75 12.7403 13.6641 12.2676 13.4922L6.15747 11.2836L5.50005 17.5312Z" fill="#FF7900"/></g><defs><clipPath id="clip0_865_2094"><path d="M0 0H27.5V22H0V0Z" fill="white"/></clipPath></defs></svg>},
    { title: "Prototype Actifs", value: 20, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><g clip-path="url(#clip0_865_2107)"><path d="M7.5 0C8.32969 0 9 0.670312 9 1.5V3H15V1.5C15 0.670312 15.6703 0 16.5 0C17.3297 0 18 0.670312 18 1.5V3H20.25C21.4922 3 22.5 4.00781 22.5 5.25V7.5H1.5V5.25C1.5 4.00781 2.50781 3 3.75 3H6V1.5C6 0.670312 6.67031 0 7.5 0ZM1.5 9H22.5V21.75C22.5 22.9922 21.4922 24 20.25 24H3.75C2.50781 24 1.5 22.9922 1.5 21.75V9ZM15.7969 14.2969C16.2375 13.8562 16.2375 13.1438 15.7969 12.7078C15.3562 12.2719 14.6438 12.2672 14.2078 12.7078L12.0047 14.9109L9.80156 12.7078C9.36094 12.2672 8.64844 12.2672 8.2125 12.7078C7.77656 13.1484 7.77187 13.8609 8.2125 14.2969L10.4156 16.5L8.2125 18.7031C7.77187 19.1437 7.77187 19.8562 8.2125 20.2922C8.65312 20.7281 9.36563 20.7328 9.80156 20.2922L12.0047 18.0891L14.2078 20.2922C14.6484 20.7328 15.3609 20.7328 15.7969 20.2922C16.2328 19.8516 16.2375 19.1391 15.7969 18.7031L13.5938 16.5L15.7969 14.2969Z" fill="#FF7900"/></g><defs><clipPath id="clip0_865_2107"><path d="M0 0H24V24H0V0Z" fill="white"/></clipPath></defs></svg> },
  ];
 const equipements: Equipement[] = [
    { id: "1", nom: "Imprimante Ultimaker S5", etat: "Disponible",image:"https://s3-alpha-sig.figma.com/img/5ad0/64a0/4ee203edabf0bc43cd0ce02e3edbd95b?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=BF~48qHiygqJXcRl4Z97IwDpVmTzzdTciiPJmcfwf9jU-hHMKbHjn2jkq2igjft~E1gNFlC7rZkSG94yJ-Ln~YbcVLdxSWefi8~h8DdE-GITOZvS0fITeo53u~lIzWwzuWpaZBFisS54ANhdO3r1ekKsfu56CLqorx39SSLCwCxM3UrKyksVMH-DQ4c6MRtrwxBuhu4f5WTfOd80guPutxd8z96oAEdvBPCd6DtSuvN-vLJk98X5LWYlD7L5FCgu7v9WJGLeFjH6lXliRMJt9fzH0fKOcuKTwsGCh~i~qniG0TMxeOfEbUVu2-a57qbmraTJG89UvotJdd92Er~8GA__" },
    { id: "2", nom: "Imprimante 3D S5", etat: "En maintenance", image:"https://s3-alpha-sig.figma.com/img/5ad0/64a0/4ee203edabf0bc43cd0ce02e3edbd95b?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=BF~48qHiygqJXcRl4Z97IwDpVmTzzdTciiPJmcfwf9jU-hHMKbHjn2jkq2igjft~E1gNFlC7rZkSG94yJ-Ln~YbcVLdxSWefi8~h8DdE-GITOZvS0fITeo53u~lIzWwzuWpaZBFisS54ANhdO3r1ekKsfu56CLqorx39SSLCwCxM3UrKyksVMH-DQ4c6MRtrwxBuhu4f5WTfOd80guPutxd8z96oAEdvBPCd6DtSuvN-vLJk98X5LWYlD7L5FCgu7v9WJGLeFjH6lXliRMJt9fzH0fKOcuKTwsGCh~i~qniG0TMxeOfEbUVu2-a57qbmraTJG89UvotJdd92Er~8GA__" },
    { id: "3", nom: "Imprimante Ultimaker S5", etat: "Disponible", image:"https://s3-alpha-sig.figma.com/img/5ad0/64a0/4ee203edabf0bc43cd0ce02e3edbd95b?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=BF~48qHiygqJXcRl4Z97IwDpVmTzzdTciiPJmcfwf9jU-hHMKbHjn2jkq2igjft~E1gNFlC7rZkSG94yJ-Ln~YbcVLdxSWefi8~h8DdE-GITOZvS0fITeo53u~lIzWwzuWpaZBFisS54ANhdO3r1ekKsfu56CLqorx39SSLCwCxM3UrKyksVMH-DQ4c6MRtrwxBuhu4f5WTfOd80guPutxd8z96oAEdvBPCd6DtSuvN-vLJk98X5LWYlD7L5FCgu7v9WJGLeFjH6lXliRMJt9fzH0fKOcuKTwsGCh~i~qniG0TMxeOfEbUVu2-a57qbmraTJG89UvotJdd92Er~8GA__" },
    { id: "4", nom: "Imprimante Ultimaker S5", etat: "Disponible" , image:"https://s3-alpha-sig.figma.com/img/5ad0/64a0/4ee203edabf0bc43cd0ce02e3edbd95b?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=BF~48qHiygqJXcRl4Z97IwDpVmTzzdTciiPJmcfwf9jU-hHMKbHjn2jkq2igjft~E1gNFlC7rZkSG94yJ-Ln~YbcVLdxSWefi8~h8DdE-GITOZvS0fITeo53u~lIzWwzuWpaZBFisS54ANhdO3r1ekKsfu56CLqorx39SSLCwCxM3UrKyksVMH-DQ4c6MRtrwxBuhu4f5WTfOd80guPutxd8z96oAEdvBPCd6DtSuvN-vLJk98X5LWYlD7L5FCgu7v9WJGLeFjH6lXliRMJt9fzH0fKOcuKTwsGCh~i~qniG0TMxeOfEbUVu2-a57qbmraTJG89UvotJdd92Er~8GA__" }
  ];
 const FilterButton = ({ label, active, onClick }) => (
  <button 
  className={`px-4 py-1 text-sm rounded-[4px] ${active ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}
  onClick={onClick}
>
  {label}
</button>

  );

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Fablab Solidaire</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
                </svg>
                Filtres
              </Button>
            </div>
            <Button
              variant="ghost"
              className="bg-black text-white flex items-center gap-2"
              onClick={() => navigate('/manager/calendriermanager')}>  
              Ce mois ci    
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8306 6.33861C14.8303 5.8435 15.0633 5.37732 15.4594 5.08056V6.33861C15.4594 6.85963 15.882 7.28223 16.4031 7.28223C16.9244 7.28223 17.347 6.85963 17.347 6.33861L17.3467 6.02418H17.347V5.09305C17.7425 5.38464 17.9758 5.84715 17.9758 6.33861C17.9758 7.20728 17.2717 7.91111 16.4031 7.91111C15.535 7.91111 14.8306 7.20728 14.8306 6.33861ZM6.02415 6.33861C6.02385 5.8435 6.25693 5.37732 6.65303 5.08056V6.33861C6.65303 6.85963 7.07563 7.28223 7.59695 7.28223C8.11797 7.28223 8.54026 6.85963 8.54026 6.33861V6.02418H8.54057V5.08086C9.23525 5.60188 9.37602 6.58754 8.8547 7.28254C8.33338 7.97692 7.34741 8.11768 6.65303 7.59636C6.25693 7.29929 6.02415 6.83343 6.02415 6.33861ZM20.4919 20.4919H4.45164C3.93063 20.4919 3.50803 20.0693 3.50803 19.5483V9.79831H19.5483C20.0693 9.79831 20.4919 10.2206 20.4919 10.7419V20.4919ZM19.8631 4.13693H17.347V3.18082C17.347 2.6598 16.9244 2.25 16.403 2.25C15.882 2.25 15.4594 2.6723 15.4594 3.19331V4.13693H8.54058L8.54027 3.19331C8.54027 2.6723 8.11798 2.25 7.59696 2.25C7.07564 2.25 6.65304 2.6723 6.65304 3.19331V4.13693H2.25V19.8628C2.25 20.9051 3.09459 21.75 4.13693 21.75H21.75V6.02416C21.75 4.98183 20.9051 4.13693 19.8631 4.13693Z" fill="white"/>
              </svg>
            </Button>
            <Link to="/manager/GestionFormationManager" className="bg-orange-500 text-white px-4 py-2 rounded-[4px] shadow-md hover:bg-orange-600">
              Calendrier Formations
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-[4px] border border-gray-200 flex items-start">
              <div className="bg-[#FF79001A] p-3 rounded-full flex items-center justify-center mr-3">
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold font-inter" style={{color: '#595959', fontSize: '20px', fontStyle: 'normal', fontWeight: 700, lineHeight: '26px'}}>
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex justify-between space-x-4">
          <FormationsFablab />
          
          {/* Section Accès */}
               {/* Right Column - Access Section */}
               <div className="lg:w-[24%] bg-black text-white rounded-[4px] shadow-lg overflow-hidden h-[364px]">
            <div className="p-4 bg-black text-white font-bold text-left rounded-[4px] w-full text-xl">
              Accès
            </div>
            <div className="space-y-2 p-2">
              <a href="#" className="flex items-center bg-white text-black rounded-[4px] hover:bg-gray-100 p-2">
                <div className="mr-2 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M3 4C3 2.93913 3.42143 1.92172 4.17157 1.17157C4.92172 0.421427 5.93913 0 7 0C8.06087 0 9.07828 0.421427 9.82843 1.17157C10.5786 1.92172 11 2.93913 11 4C11 5.06087 10.5786 6.07828 9.82843 6.82843C9.07828 7.57857 8.06087 8 7 8C5.93913 8 4.92172 7.57857 4.17157 6.82843C3.42143 6.07828 3 5.06087 3 4ZM0 15.0719C0 11.9937 2.49375 9.5 5.57188 9.5H7.58672C8.39414 9.5 9.16094 9.92773 9.85156 10.2426C9.78555 10.6082 9.75508 10.9891 9.75508 11.375C9.75508 13.3148 10.6082 15.0566 11.9539 16.25C11.9437 16.25 11.9336 16.25 11.9184 16.25H1.08164C0.4875 16.25 0 15.7625 0 15.0719ZM15.5816 16.25C15.5715 16.25 15.5613 16.25 15.5461 16.25C16.8969 15.0566 17.7449 13.3148 17.7449 11.375C17.7449 10.9891 17.7094 10.6133 17.6484 10.2426C18.3391 9.92266 19.1059 9.75 19.9133 9.75H22.0816C25.0727 9.75 27.5 11.1773 27.5 14.1684C27.5 14.7676 27.0125 16.25 26.4184 16.25H15.5816ZM11.375 11.375C11.375 10.0821 11.8886 8.84209 12.8029 7.92785C13.7171 7.01361 14.9571 6.5 16.25 6.5C17.5429 6.5 18.7829 7.01361 19.6971 7.92785C20.6114 8.84209 21.125 10.0821 21.125 11.375C21.125 12.6679 20.6114 13.9079 19.6971 14.8221C18.7829 15.7364 17.5429 16.25 16.25 16.25C14.9571 16.25 13.7171 15.7364 12.8029 14.8221C11.8886 13.9079 11.375 12.6679 11.375 11.375ZM6.5 24.6441C6.5 20.9066 9.53164 17.875 13.2691 17.875H19.2309C22.9684 17.875 26 20.9066 26 24.6441C26 25.3906 25.3957 26 24.6441 26H7.85586C7.10938 26 6.5 25.3957 6.5 24.6441Z" fill="black"/></svg>
                </div>
                Gestion des Réservations
              </a>
              <Link
                to="/manager/GestionEquipement"
  className="flex items-center bg-white text-black rounded-[4px] hover:bg-gray-100"
  style={{ padding: '0.40rem' }}
>
  <div className="mr-3 text-blue-500">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2.45714 0.156626C2.16026 -0.0746243 1.73839 -0.0464993 1.46964 0.219126L0.219636 1.46913C-0.0459894 1.73475 -0.0741144 2.15663 0.154011 2.45663L2.65401 5.70663C2.79464 5.891 3.01651 6.00038 3.24776 6.00038H4.93839L8.34464 9.40663C7.88526 10.3129 8.03214 11.4504 8.79151 12.2066L12.2915 15.7066C12.6821 16.0973 13.3165 16.0973 13.7071 15.7066L15.7071 13.7066C16.0978 13.316 16.0978 12.6816 15.7071 12.291L12.2071 8.791C11.4509 8.03475 10.3134 7.88475 9.40714 8.34413L6.00089 4.93788V3.25038C6.00089 3.016 5.89151 2.79725 5.70714 2.65663L2.45714 0.156626ZM0.622761 12.3785C0.225886 12.7754 0.000885559 13.316 0.000885559 13.8785C0.000885559 15.0504 0.950886 16.0004 2.12276 16.0004C2.68526 16.0004 3.22589 15.7754 3.62276 15.3785L7.30401 11.6973C7.06026 11.0441 7.02276 10.3348 7.19151 9.66288L5.26339 7.73475L0.622761 12.3785ZM16.0009 4.50038C16.0009 4.17225 15.9665 3.8535 15.9009 3.54725C15.8259 3.19725 15.3978 3.10663 15.1446 3.35975L13.1478 5.35663C13.054 5.45038 12.9259 5.5035 12.7946 5.5035H11.0009C10.7259 5.5035 10.5009 5.2785 10.5009 5.0035V3.20663C10.5009 3.07538 10.554 2.94725 10.6478 2.8535L12.6446 0.856626C12.8978 0.603501 12.8071 0.175376 12.4571 0.100376C12.1478 0.0347507 11.829 0.000375663 11.5009 0.000375663C9.01651 0.000375663 7.00089 2.016 7.00089 4.50038V4.52538L9.66651 7.191C10.7915 6.90663 12.0353 7.20663 12.9165 8.08788L13.4071 8.5785C14.9384 7.85975 16.0009 6.3035 16.0009 4.50038ZM1.75089 13.5004C1.75089 13.3015 1.8299 13.1107 1.97056 12.97C2.11121 12.8294 2.30197 12.7504 2.50089 12.7504C2.6998 12.7504 2.89056 12.8294 3.03122 12.97C3.17187 13.1107 3.25089 13.3015 3.25089 13.5004C3.25089 13.6993 3.17187 13.8901 3.03122 14.0307C2.89056 14.1714 2.6998 14.2504 2.50089 14.2504C2.30197 14.2504 2.11121 14.1714 1.97056 14.0307C1.8299 13.8901 1.75089 13.6993 1.75089 13.5004Z" fill="black"/>
    </svg>
  </div>
  Gestion des Équipements
</Link>
    <Link
  to="/manager/GestionProjetFab"
  className="flex items-center bg-white text-black rounded-[4px] hover:bg-gray-100"
  style={{ padding: '0.40rem' }}
>
  <div className="mr-3 text-blue-500">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
      <path d="M0 1.5C0 0.671875 0.671875 0 1.5 0H4.5C5.32812 0 6 0.671875 6 1.5V2H12V1.5C12 0.671875 12.6719 0 13.5 0H16.5C17.3281 0 18 0.671875 18 1.5V4.5C18 5.32812 17.3281 6 16.5 6H13.5C12.6719 6 12 5.32812 12 4.5V4H6V4.5C6 4.55312 5.99687 4.60625 5.99062 4.65625L8.5 8H11.5C12.3281 8 13 8.67188 13 9.5V12.5C13 13.3281 12.3281 14 11.5 14H8.5C7.67188 14 7 13.3281 7 12.5V9.5C7 9.44687 7.00313 9.39375 7.00938 9.34375L4.5 6H1.5C0.671875 6 0 5.32812 0 4.5V1.5Z" fill="black" />
    </svg>
  </div>
  Suivi des Projets
</Link>
   
    <Link 
  to="/manager/GestionEncadrantFab" 
  className="p-1.4 flex items-center bg-white text-black rounded-[4px] hover:bg-gray-100"
  style={{ padding: '0.40rem' }}
>
  <div className="mr-3 text-blue-500">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none">
<path d="M6 2.5C6 1.12109 7.07625 0 8.4 0H21.6C22.9238 0 24 1.12109 24 2.5V13.75C24 15.1289 22.9238 16.25 21.6 16.25H12.63C12.1875 15.2539 11.5087 14.3945 10.665 13.75H14.4V12.5C14.4 11.8086 14.9363 11.25 15.6 11.25H18C18.6638 11.25 19.2 11.8086 19.2 12.5V13.75H21.6V2.5H8.4V4.41797C7.695 3.99219 6.87375 3.75 6 3.75V2.5ZM6 5C6.47276 5 6.94089 5.097 7.37766 5.28545C7.81443 5.47391 8.21129 5.75013 8.54558 6.09835C8.87988 6.44657 9.14505 6.85997 9.32597 7.31494C9.50688 7.76991 9.6 8.25754 9.6 8.75C9.6 9.24246 9.50688 9.73009 9.32597 10.1851C9.14505 10.64 8.87988 11.0534 8.54558 11.4017C8.21129 11.7499 7.81443 12.0261 7.37766 12.2145C6.94089 12.403 6.47276 12.5 6 12.5C5.52724 12.5 5.05911 12.403 4.62234 12.2145C4.18557 12.0261 3.78871 11.7499 3.45442 11.4017C3.12012 11.0534 2.85495 10.64 2.67403 10.1851C2.49312 9.73009 2.4 9.24246 2.4 8.75C2.4 8.25754 2.49312 7.76991 2.67403 7.31494C2.85495 6.85997 3.12012 6.44657 3.45442 6.09835C3.78871 5.75013 4.18557 5.47391 4.62234 5.28545C5.05911 5.097 5.52724 5 6 5ZM4.99875 13.75H6.9975C9.76125 13.75 12 16.082 12 18.957C12 19.5312 11.5538 20 10.9987 20H1.00125C0.44625 20 0 19.5352 0 18.957C0 16.082 2.23875 13.75 4.99875 13.75Z" fill="black"/>
</svg> 
  </div>
  Gestion des Encadrants
</Link>

    <a href="#" className="p-1.4 flex items-center bg-white text-black rounded-[4px] hover:bg-gray-100"style={{ padding: '0.40rem' }}>
      <div className="mr-3 text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path d="M5 0C3.62109 0 2.5 1.12109 2.5 2.5V6.25H5V2.5H13.8555L15 3.64453V6.25H17.5V3.64453C17.5 2.98047 17.2383 2.34375 16.7695 1.875L15.625 0.730469C15.1562 0.261719 14.5195 0 13.8555 0H5ZM15 13.75V15V17.5H5V15V14.375V13.75H15ZM17.5 15H18.75C19.4414 15 20 14.4414 20 13.75V10C20 8.62109 18.8789 7.5 17.5 7.5H2.5C1.12109 7.5 0 8.62109 0 10V13.75C0 14.4414 0.558594 15 1.25 15H2.5V17.5C2.5 18.8789 3.62109 20 5 20H15C16.3789 20 17.5 18.8789 17.5 17.5V15ZM16.875 9.6875C17.1236 9.6875 17.3621 9.78627 17.5379 9.96209C17.7137 10.1379 17.8125 10.3764 17.8125 10.625C17.8125 10.8736 17.7137 11.1121 17.5379 11.2879C17.3621 11.4637 17.1236 11.5625 16.875 11.5625C16.6264 11.5625 16.3879 11.4637 16.2121 11.2879C16.0363 11.1121 15.9375 10.8736 15.9375 10.625C15.9375 10.3764 16.0363 10.1379 16.2121 9.96209C16.3879 9.78627 16.6264 9.6875 16.875 9.6875Z" fill="black"/>
</svg> 
      </div>
      Gestion des Consommables
    </a>
    <Link 
  to="/manager/CalendrierFablab" 
  className="p-1.4 flex items-center bg-white text-black rounded-[4px] hover:bg-gray-100"
  style={{ padding: '0.40rem' }}
>
  <div className="mr-3 text-blue-500">
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
<path d="M3.85714 1.25V2.5H1.92857C0.863839 2.5 0 3.33984 0 4.375V6.25H18V4.375C18 3.33984 17.1362 2.5 16.0714 2.5H14.1429V1.25C14.1429 0.558594 13.5683 0 12.8571 0C12.146 0 11.5714 0.558594 11.5714 1.25V2.5H6.42857V1.25C6.42857 0.558594 5.85402 0 5.14286 0C4.4317 0 3.85714 0.558594 3.85714 1.25ZM18 7.5H0V18.125C0 19.1602 0.863839 20 1.92857 20H16.0714C17.1362 20 18 19.1602 18 18.125V7.5ZM9 9.6875C9.53438 9.6875 9.96429 10.1055 9.96429 10.625V12.8125H12.2143C12.7487 12.8125 13.1786 13.2305 13.1786 13.75C13.1786 14.2695 12.7487 14.6875 12.2143 14.6875H9.96429V16.875C9.96429 17.3945 9.53438 17.8125 9 17.8125C8.46562 17.8125 8.03571 17.3945 8.03571 16.875V14.6875H5.78571C5.25134 14.6875 4.82143 14.2695 4.82143 13.75C4.82143 13.2305 5.25134 12.8125 5.78571 12.8125H8.03571V10.625C8.03571 10.1055 8.46562 9.6875 9 9.6875Z" fill="black"/>
</svg> 
  </div>
  Planifier une formation
</Link>

  </div>
</div>
        </div>

        {/* Projets et Équipements */}
        <div className="flex flex-wrap gap-6">
          <ProjetsFablab />
          <EquipementFab equipements={equipements} />        
        </div>
      </div>
    </div>
  );
};

export default FablabSolidaire;