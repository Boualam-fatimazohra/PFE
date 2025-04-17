import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Projet {
  id: string;
  titre: string;
  image: string;
  status: 'En Cours' | 'À venir' | 'Terminée';
  participants: number;
  progress: number;
}

const ProjetsFablab = () => {
  const [projetFilter, setProjetFilter] = useState('En cours');
  const [currentPage, setCurrentPage] = useState(1);
  const projetsPerPage = 4;
  
  const projets: Projet[] = [
    { 
      id: "1", 
      titre: "Projet AI Robot", 
      image:"https://s3-alpha-sig.figma.com/img/242f/7d20/1b67d698f3b227d4459533493b267b9a?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=DSqobCR8epEIf3ccI-GNVC2fVDwdIMSlsYN1r4DQ0ENhdEuAj9RYkk02tcs7w7CXD74niOMmQrbPZpUusJf-8FPc5MrjnvFH747242-pd1T-tyBrf0jQut40AzzhtIjfuV2Y49b7rTaG3ask7eanWTIcuPlG90NqCOvI~4UcCkQMZfE09rkoGeM072341ojTrQASqjjw6zel2zFELy36ClMBKDulvUBqtT~ekPpz-NlW2ER168iUE~KG5QrPf9jvG90RWNnGgnefHDB~k5zoed-bKK8s-XeqSM6hfjojH-Pd5-1LatcnOYJfTGfjXb75OiD4Jax2qlLMjxhJaiyapQ__",
      status: "En Cours",
      participants: 5,
      progress: 75
    },
    { 
      id: "2", 
      titre: "Projet Farm Boot", 
      image: "https://s3-alpha-sig.figma.com/img/f6fe/6f5b/86516e02f50a234d6140a881f8b431cb?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=DHnb3vKDaltaBg6zZWJd6cp7nCskm-vouaE8OFmPBCnVaQ~WDHJEGux1LVqGEAklKrBHmm7q9HTFP6DQ5Y3eIfFzJlVAiPFmd5Zk-~gEbCBPMXrU78LYURuT9NGGUIRGPfkrWiMHntBmqgxUgA4X7WADIbzudZjZHNzMaLjNnuNy12pDG0u1MX1Iq7MD0n3EsoLu-bxHyRdLDVAOVvMjyoso1iekzyWQxuie40may6PSkHv9VHn9XyPIEiOOvR9FBl7JRWaetz-X-pPek-D~26MwaSa-tmRfurMFOAvE0WLy4Tf2tKOCdYIPXn~snrwip26nnNMIbNx-C2O1XxgkyA__", 
      status: "En Cours",
      participants: 3,
      progress: 91
    },
    { 
      id: "3", 
      titre: "Projet Atlas ODC", 
      image: "https://s3-alpha-sig.figma.com/img/3c3c/e55d/c05d5f1f93c0227f40ae6209b0abe810?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=rrJ3ztJSY9bbJYZToIFxHuKd9AoZkUaLqyGvMbDJcCROowVLXD8U2wZIrM7PCZCNAcS0WPtxa61SZm07sC23QLbfPNHAaFw-o-Y~d2CEx1L8jnogQvSWPNgf0rmOJw6g-EUduCtg~0soctjPvSmEM8mTRZq6H8EFwNAlkwAhqM8HwB3VoJjc71v18Ee4-N4WLNhhTyeRokIQft3tog8LStB4DLx6dkeW0HtTiJYeFjiMyc6al4tw-VCgJ69t7BRCoycCHupibs0Fcm5V0pLO5hXMBmwFGOdXESbyvV72KDb~6GUpNt2O5j18gEL5U56SN5kO4tlfsezQH1CbQBHSFg__", 
      status: "En Cours",
      participants: 9,
      progress: 17
    },
    { 
      id: "4", 
      titre: "Projet Aerok", 
      image: "https://s3-alpha-sig.figma.com/img/a86a/ff57/1852d502bc5a8bdff7d9c5e8234900f6?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=ZLRpSyMVpgSLsf4JPxzgtlJf8FQu1K6TR6~yODp49uEApbgCBYDYT1L97rx3GospMMPZpZQ6G0Fb3gEVccf9WTY93mJTeVVWEoKVowr5O7XcbXgQhHUmQJ6Aj3dUo6ruY7LwSVTXXq8cJAOshhe1GwjvO-4KAoF1MUxBLbn0OaLdKPF2P6UWaNpypLeqyMDp1L7NYkmBQ5E4qBPdq4p~Vxpy1sHa0w2xM~XN3SC5p7Np2P77jkFwcQ~O~SgbUgZj5spcoDSIRGGT9TvnjhfaBKRfAi7bupxZG0GiGjXgMDY2naPhYhMhBAgv7ec9RgiZjXtVpTWlF-aCDD81tmI32w__", 
      status: "En Cours",
      participants: 5,
      progress: 65
    }
  ];

  const currentProjets = projets.slice(
    (currentPage - 1) * projetsPerPage,
    currentPage * projetsPerPage
  );

  const FilterButton = ({ label, active, onClick }) => (
    <button 
      className={`px-4 py-1 text-sm rounded-[4px] ${active ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const ProgressBar = ({ percentage, color = "bg-green-500" }) => (
    <div className="w-full bg-green-100 rounded-full h-2 mb-2">
      <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );

  return (
    <div className="flex-1 max-w-[800px] bg-white rounded-[4px] p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Projets Fablab</h2>
        <Link
      to="/manager/GestionProjetFab"
      className="bg-orange-500 text-white px-4 py-1 rounded-[4px]"
    >
      Découvrir
    </Link>
      </div>
      
      <div className="flex mb-3 gap-2" style={{ width: '50%', height:'7%' }}>
        <FilterButton 
          label="En cours" 
          active={projetFilter === 'En cours'} 
          onClick={() => setProjetFilter('En cours')} 
        />
        <FilterButton 
          label="À venir"
          active={projetFilter === 'À venir'} 
          onClick={() => setProjetFilter('À venir')} 
        />
        <FilterButton 
          label="Terminée" 
          active={projetFilter === 'Terminée'} 
          onClick={() => setProjetFilter('Terminée')} 
        />
        <Button variant="ghost" className="text-[#333] flex items-center gap-2 font-bold rounded-[4px]">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
          </svg>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {currentProjets.map((projet) => (
          <div key={projet.id} className="border border-gray-200 rounded-[4px] p-3">
            <div className="flex items-center mb-2">
              <div className="w-20 h-20 bg-gray-200 rounded-[4px] mr-3 overflow-hidden">
                <img src={projet.image} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium">{projet.titre}</h3>
                <div className="p-2 rounded-full mb-1" style={{
                  display: 'flex',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#FF7A00',
                  textAlign: 'center',
                  fontFeatureSettings: "'dlig' on",
                  fontFamily: 'Inter',
                  fontSize: '13px',
                  fontStyle: 'normal',
                  fontWeight: '300',
                  lineHeight: '10px',
                  width: '10px',
                  height: '19px',
                  minWidth: '84px',
                  maxWidth: '480px',
                  padding: '0px 16px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  borderRadius: '12px',
                  background: 'rgba(255, 122, 0, 0.10)'
                }}>
                  {projet.status}
                </div>
                <div style={{
                  color: 'var(--Neutral-500, #666)',
                  fontFeatureSettings: "'dlig' on",
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: '500',
                  lineHeight: '21px'
                }}>
                  {projet.participants} participants
                </div>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1 text-gray-600">
                <span>Progress</span>
                <span>{projet.progress}%</span>
              </div>
              <ProgressBar percentage={projet.progress} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4 gap-2">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
          className="px-3 py-1 bg-white rounded-[4px] text-sm border border-gray-200 disabled:opacity-50"
        >
          Précédent
        </button>
        
        {Array.from({ length: Math.ceil(projets.length / projetsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded-[4px] text-sm ${
              currentPage === index + 1 
                ? 'bg-gray-100 text-black border border-gray-200' 
                : 'bg-white border border-gray-200 rounded-[4px]'
            }`}
          >
            {index + 1}
          </button>
        ))}
        
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(projets.length / projetsPerPage)))}
          disabled={currentPage === Math.ceil(projets.length / projetsPerPage)}
          className="px-3 py-1 bg-white rounded-[4px] text-sm border border-gray-200 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default ProjetsFablab;