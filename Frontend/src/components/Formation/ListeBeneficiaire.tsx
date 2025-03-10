import * as React from "react";
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useFormations } from '../../contexts/FormationContext';

interface BeneficiairesListeProps {
  formationId: string;
}

// Mise à jour des interfaces pour correspondre à la structure de l'API
interface Beneficiaire {
  _id?: string;
  nom: string;
  prenom: string;
  email: string;
  genre: string;
  pays: string;
  specialite: string;
  etablissement: string;
  profession: string;
  isBlack: boolean;
  isSaturate: boolean;
  dateNaissance?: string;
  telephone?: number;
  niveau?: string;
  situationProfessionnel?: string;
  nationalite?: string;
  region?: string;
  categorieAge?: string;
}

interface BeneficiaireInscription {
  _id: string;
  confirmationAppel: boolean;
  confirmationEmail: boolean;
  horodateur: string;
  formation: string;
  beneficiaire: Beneficiaire;
}

const BeneficiairesListe: React.FC<BeneficiairesListeProps> = ({ formationId }) => { 
  const { getBeneficiaireFormation } = useFormations();  
  const [inscriptions, setInscriptions] = React.useState<BeneficiaireInscription[]>([]);
  const [search, setSearch] = React.useState("");
  const [selectAll, setSelectAll] = React.useState(false);
  const [selectedBeneficiaires, setSelectedBeneficiaires] = React.useState<number[]>([]);
  const [expandedRow, setExpandedRow] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 11;

  // Extraction des bénéficiaires à partir des inscriptions
  const beneficiaires = inscriptions.map(inscription => inscription.beneficiaire);
  
  // Filtrage avec vérification de sécurité
  const filteredBeneficiaires = beneficiaires.filter(b =>
    b && b.nom && typeof b.nom === 'string' 
      ? b.nom.toLowerCase().includes(search.toLowerCase()) 
      : false
  );

  // Calcul pour la pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedBeneficiaires = filteredBeneficiaires.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredBeneficiaires.length / itemsPerPage);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBeneficiaires([]);
    } else {
      setSelectedBeneficiaires(displayedBeneficiaires.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOne = (index: number) => {
    let newSelected = [...selectedBeneficiaires];
    if (newSelected.includes(index)) {
      newSelected = newSelected.filter(i => i !== index);
    } else {
      newSelected.push(index);
    }
    setSelectedBeneficiaires(newSelected);
    setSelectAll(newSelected.length === displayedBeneficiaires.length);
  };

  // Fonctions de navigation pour la pagination
  const goToPage = (page: number) => {
    setCurrentPage(page);
    setExpandedRow(null);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setExpandedRow(null);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setExpandedRow(null);
    }
  };

  const toggleRowExpansion = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };
  
  React.useEffect(() => {
    const fetchBeneficiaires = async () => {
      try {
        setLoading(true);
        console.log("ID Formation envoyé:", formationId);
        const data = await getBeneficiaireFormation(formationId);
        console.log("Réponse API:", data);
        
        // Adaptation pour gérer à la fois un tableau d'objets avec beneficiaire niché
        // ou un seul objet avec beneficiaire niché
        const formattedData = Array.isArray(data) ? data : [data];
        setInscriptions(formattedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
        console.error("Erreur complète:", err); 
      } finally {
        setLoading(false);
      }
    };

    if (formationId) {
      fetchBeneficiaires();
    }
  }, [formationId, getBeneficiaireFormation]);

  // Ajout d'un indicateur de chargement
  if (loading) {
    return <div className="p-6 text-center">Chargement en cours...</div>;
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600">
        Erreur : {error}
        <button 
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Message si aucun bénéficiaire n'est trouvé
  if (beneficiaires.length === 0) {
    return (
      <div className="bg-white border border-[#DDD] p-6">
        <h2 className="text-2xl font-bold mb-6">Liste des bénéficiaires</h2>
        <div className="my-8 p-12 flex flex-col items-center justify-center">
        <div className="mb-6 text-center">
        <svg width="406" height="258" viewBox="0 0 406 258" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M120.528 35.3471C120.589 34.7152 120.125 34.1531 119.492 34.0917C118.859 34.0303 118.297 34.4927 118.236 35.1246L117.471 43.1339C117.411 43.7659 117.875 44.3279 118.508 44.3894C119.141 44.4508 119.703 43.9883 119.763 43.3564L120.528 35.3471Z" fill="#FF7900"/>
          <path d="M108.916 37.8602C108.512 37.3699 107.786 37.2995 107.296 37.7029C106.806 38.1063 106.736 38.8307 107.141 39.321L112.272 45.535C112.677 46.0253 113.403 46.0957 113.893 45.6923C114.383 45.2889 114.452 44.5644 114.048 44.0742L108.916 37.8602Z" fill="#FF7900"/>
          <path d="M236.582 43.7337C238.077 43.7337 239.288 44.9496 239.288 46.4495C239.288 47.9494 238.077 49.1653 236.582 49.1653C235.087 49.1653 233.875 47.9494 233.875 46.4495C233.875 44.9496 235.087 43.7337 236.582 43.7337Z" fill="#FF7900"/>
          <path d="M286.718 41.5317C270.901 41.5317 258.078 54.3506 258.078 70.1612C258.078 76.6461 260.236 82.625 263.872 87.4276C262.944 90.5569 261.11 93.5086 260.2 94.8535C259.987 95.1731 260.236 95.5948 260.618 95.5637C262.349 95.4173 266.106 94.8447 268.952 92.612C273.836 96.4781 280.004 98.7951 286.718 98.7951C302.535 98.7951 315.358 85.9762 315.358 70.1656C315.358 54.355 302.535 41.5361 286.718 41.5361V41.5317Z" fill="#FF7900"/>
          <path d="M289.542 62.0701L288.097 74.851C287.999 75.7356 287.275 76.4069 286.422 76.4069C285.57 76.4069 284.85 75.7401 284.747 74.8554L283.269 62.0701C283.26 61.999 283.256 61.9279 283.256 61.8612V55.8775C283.256 54.9039 284.01 54.1171 284.944 54.1171H287.863C288.796 54.1171 289.55 54.9039 289.55 55.8775V61.8612C289.55 61.9279 289.55 61.999 289.538 62.0657L289.542 62.0701ZM289.388 81.9194C289.388 83.5953 288.089 84.9512 286.482 84.9512H286.303C284.696 84.9512 283.397 83.5953 283.397 81.9194C283.397 80.2434 284.696 78.8875 286.303 78.8875H286.482C288.089 78.8875 289.388 80.2434 289.388 81.9194Z" fill="white"/>
          <path d="M102.707 47.9504C102.074 47.889 101.512 48.3514 101.452 48.9834C101.392 49.6153 101.856 50.1774 102.489 50.2388L110.51 51.0174C111.143 51.0788 111.705 50.6163 111.765 49.9844C111.826 49.3525 111.362 48.7904 110.729 48.729L102.707 47.9504Z" fill="#FF7900"/>
          <g clip-path="url(#clip0_411_5879)">
          <path d="M268.715 208.483C235.6 227.6 181.737 227.499 148.414 208.263C115.09 189.026 114.92 157.94 148.036 138.823C181.152 119.706 235.014 119.806 268.338 139.043C301.661 158.28 301.831 189.366 268.715 208.483Z" fill="#555555"/>
          <path d="M148.036 156.877C181.152 137.759 235.014 137.86 268.338 157.097C281.065 164.447 288.94 173.521 291.986 183.004C296.972 167.593 289.078 151.024 268.338 139.049C235.014 119.813 181.152 119.718 148.036 138.829C127.572 150.64 119.836 167.027 124.765 182.362C127.786 173.017 135.535 164.094 148.042 156.877H148.036Z" fill="black"/>
          <path d="M214.865 192.757L221.348 190.417L217.357 216.512L210.874 218.853L214.865 192.757Z" fill="#CCCCCC"/>
          <path d="M220.297 157.273L226.781 154.932L222.79 181.028L216.307 183.362L220.297 157.273Z" fill="#CCCCCC"/>
          <path d="M217.358 216.506L226.372 221.704C223.35 222.075 220.291 222.346 217.219 222.516L210.868 218.847L217.358 216.5V216.506Z" fill="#F4F4F4"/>
          <path d="M225.73 121.776L232.213 119.435L228.216 145.537L221.739 147.878L225.73 121.776Z" fill="#CCCCCC"/>
          <path d="M216.307 183.362L222.79 181.028L266.204 206.085L259.72 208.426L216.307 183.362Z" fill="#F4F4F4"/>
          <path d="M223.117 84.8631L229.601 82.5285L237.192 86.9082L230.708 89.2428L223.117 84.8631Z" fill="#F4F4F4"/>
          <path d="M230.708 89.2428L237.192 86.9082L233.648 110.053L227.165 112.387L230.708 89.2428Z" fill="#CCCCCC"/>
          <path d="M221.739 147.878L228.216 145.537L271.636 170.595L265.152 172.935L221.739 147.878Z" fill="#F4F4F4"/>
          <path d="M227.165 112.387L233.648 110.053L277.068 135.11L270.585 137.451L227.165 112.387Z" fill="#F4F4F4"/>
          <path d="M274.128 114.307L280.612 111.966L288.209 116.352L281.726 118.693L274.128 114.307Z" fill="#F4F4F4"/>
          <path d="M274.128 114.307L271.441 131.857L270.585 137.438L227.165 112.387L230.708 89.2428L223.123 84.8631L217.005 124.828L202.043 222.591C207.098 222.818 212.177 222.792 217.219 222.509L210.868 218.841L214.865 192.751L220.492 195.998L253.917 215.285C258.87 213.492 263.566 211.371 267.909 208.923L277.635 145.374L281.72 118.674L274.128 114.3V114.307ZM225.729 121.776L231.357 125.023L234.945 127.1L269.143 146.827L266.008 167.348L265.152 172.929L221.732 147.878L225.138 125.577L225.723 121.776H225.729ZM216.306 183.369L220.291 157.279L225.918 160.526L263.705 182.33L260.57 202.838L259.714 208.42L216.306 183.369Z" fill="#DDDDDD"/>
          <path d="M288.209 116.352L283.01 150.338L274.695 204.651C272.844 205.972 270.849 207.243 268.728 208.477C268.457 208.634 268.186 208.779 267.916 208.936L277.641 145.386L281.726 118.686L288.216 116.352H288.209Z" fill="#CCCCCC"/>
          <path d="M194.452 222.044C182.511 220.867 170.916 218.211 160.537 214.083C160.329 198.471 160.895 177.34 160.895 177.013C160.908 176.239 160.845 175.459 160.581 174.723C160.423 174.282 160.165 173.879 159.85 173.508C158.61 172.029 156.407 170.985 155.085 169.852C153.688 168.644 152.48 167.253 151.34 165.8C150.856 165.17 150.383 164.541 149.918 163.899C149.08 162.754 148.193 161.426 147.186 160.231C147.123 160.155 147.066 160.08 146.997 160.01C146.021 158.871 144.926 157.871 143.642 157.279C143.101 156.411 142.861 154.989 143.485 154.177C143.717 153.856 144.083 153.68 144.429 153.485C145.304 152.981 146.084 152.333 146.783 151.603C146.903 151.484 147.022 151.358 147.129 151.232C147.645 150.659 148.111 150.049 148.552 149.413C149.32 148.319 149.993 147.142 150.553 145.921C150.585 145.871 150.604 145.814 150.629 145.764C150.78 145.436 150.918 145.109 151.051 144.776C151.743 143.058 152.221 141.264 152.461 139.446C152.498 139.163 152.524 138.873 152.549 138.584C152.574 138.338 152.587 138.099 152.593 137.866C152.618 137.369 152.624 136.872 152.605 136.381C152.561 134.846 152.322 133.323 151.863 131.838C151.579 130.913 151.221 130.019 150.83 129.138C150.553 128.497 150.258 127.855 149.962 127.213C149.905 127.1 149.848 126.974 149.798 126.86C149.723 126.697 149.641 126.527 149.559 126.363C149.446 126.131 149.332 125.891 149.225 125.646C149.036 125.256 148.885 124.853 148.778 124.463C148.564 123.626 148.514 122.94 147.885 122.261C148.168 121.971 148.539 121.789 148.936 121.663C149.118 121.606 149.301 121.549 149.49 121.512C149.899 121.411 150.302 121.323 150.717 121.254C152.272 120.977 153.845 120.882 155.432 120.92C156.842 120.952 158.264 121.09 159.681 121.298C161.846 121.619 164.005 122.097 166.114 122.625C167.605 122.984 168.902 123.5 170.262 124.211C171.036 124.627 171.829 125.036 172.49 125.621C173.378 126.401 173.988 127.402 174.46 128.49C174.989 129.692 175.341 131.001 175.732 132.203C175.732 132.216 175.732 132.234 175.744 132.241C176.493 134.544 177.217 136.866 177.929 139.182C179.326 143.712 180.604 148.205 182.064 152.717C183.556 157.298 184.96 161.917 186.212 166.567C186.716 168.461 187.339 171.771 188.006 175.874C190.631 191.757 194.024 219.42 194.427 221.817C194.439 221.893 194.452 221.962 194.458 222.031L194.452 222.044Z" fill="#F1D0B3"/>
          <path d="M158.881 64.3175L160.385 172.262C160.392 172.923 159.97 173.584 159.114 174.1C157.389 175.138 154.557 175.188 152.788 174.2C151.894 173.703 151.447 173.042 151.435 172.375L149.93 64.4308C149.936 65.0978 150.39 65.7585 151.284 66.2557C153.052 67.2373 155.885 67.1933 157.61 66.155C158.466 65.639 158.887 64.9719 158.881 64.3175Z" fill="black"/>
          <path d="M157.528 62.4926C159.296 63.4743 159.334 65.1166 157.61 66.1549C155.885 67.1932 153.052 67.2436 151.283 66.2556C149.515 65.274 149.477 63.6316 151.202 62.5933C152.926 61.555 155.759 61.5046 157.528 62.4926Z" fill="#F4F4F4"/>
          <path d="M181.158 85.2973C182.562 86.0776 183.726 88.0157 183.745 89.6266L184.324 133.468C184.343 135.079 183.223 135.746 181.813 134.965L120.887 101.086C119.484 100.305 118.313 98.3609 118.288 96.7499L117.709 52.9088C117.69 51.2916 118.823 50.6372 120.233 51.4175L181.164 85.2973H181.158Z" fill="#CCCCCC"/>
          <path d="M132.249 77.0222C132.438 75.8266 132.753 74.8827 133.193 74.1276C133.634 73.3725 134.138 72.8691 134.704 72.6803C135.334 72.4915 136.026 72.5544 136.781 72.9949C137.537 73.4354 138.292 74.1276 138.922 75.0086C139.551 75.8896 140.055 76.9593 140.495 78.2179C140.936 79.4135 141.25 80.7979 141.502 82.2452C141.754 83.6925 141.88 85.2027 141.88 86.7759C141.88 88.3491 141.817 89.6705 141.565 90.8661C141.376 92.0618 141.062 93.0057 140.621 93.7608C140.18 94.5159 139.677 94.9564 139.047 95.2081C138.418 95.3969 137.726 95.271 136.97 94.8305C136.215 94.3901 135.459 93.6979 134.83 92.8169C134.201 91.9359 133.697 90.8661 133.256 89.6076C132.816 88.412 132.501 87.0905 132.249 85.6432C131.997 84.1959 131.872 82.7486 131.872 81.2383C131.872 79.7281 131.935 78.3437 132.186 77.0852L132.249 77.0222ZM134.326 85.014C134.452 85.8949 134.578 86.713 134.83 87.531C135.082 88.2862 135.334 88.9783 135.711 89.6076C136.089 90.174 136.467 90.6144 136.97 90.9291C137.474 91.2437 137.914 91.2437 138.229 91.0549C138.607 90.8661 138.859 90.4886 139.047 89.9222C139.236 89.3559 139.425 88.7266 139.488 87.9715C139.551 87.2164 139.614 86.3983 139.614 85.5174C139.614 84.6364 139.551 83.6925 139.425 82.7486C139.299 81.8676 139.173 80.9866 138.922 80.1686C138.67 79.3505 138.418 78.6583 138.04 78.092C137.663 77.5257 137.285 77.0852 136.781 76.7705C136.278 76.4559 135.837 76.4559 135.522 76.6447C135.208 76.8335 134.893 77.211 134.704 77.7774C134.515 78.3437 134.326 78.973 134.264 79.791C134.201 80.6091 134.138 81.4271 134.138 82.371C134.138 83.3149 134.201 84.133 134.326 85.014Z" fill="#555555"/>
          <path d="M143.265 87.0276C143.453 86.1466 143.705 85.4544 144.02 84.951C144.335 84.4476 144.712 84.1329 145.216 84.0071C145.656 83.8812 146.223 84.0071 146.789 84.3217C147.356 84.6364 147.923 85.1398 148.363 85.769C148.867 86.3983 149.244 87.1534 149.622 88.0344C149.937 88.9154 150.251 89.9222 150.44 90.992C150.629 92.0617 150.755 93.2573 150.755 94.4529C150.755 95.6486 150.755 96.7183 150.566 97.5993C150.377 98.4803 150.126 99.1725 149.811 99.6759C149.496 100.179 149.118 100.494 148.615 100.62C148.174 100.746 147.608 100.62 147.041 100.305C146.475 99.9905 145.908 99.4871 145.468 98.8578C144.964 98.2286 144.586 97.4734 144.209 96.5925C143.894 95.7115 143.579 94.7047 143.39 93.6349C143.202 92.5651 143.076 91.4325 143.076 90.1739C143.076 88.9154 143.076 87.9086 143.327 87.0276H143.265ZM145.216 93.1315C145.279 93.7607 145.405 94.3271 145.531 94.8305C145.656 95.3968 145.845 95.8373 146.097 96.2149C146.349 96.5925 146.601 96.9071 146.978 97.0959C147.356 97.2847 147.608 97.2846 147.86 97.1588C148.111 97.0329 148.3 96.7812 148.426 96.3408C148.552 95.9632 148.678 95.5227 148.678 94.9564C148.678 94.39 148.741 93.8237 148.678 93.1944C148.615 92.5651 148.678 91.9988 148.552 91.3695C148.489 90.7403 148.363 90.1739 148.237 89.6705C148.111 89.1671 147.923 88.6637 147.671 88.2861C147.419 87.8456 147.167 87.5939 146.789 87.4051C146.412 87.2164 146.16 87.2164 145.908 87.4051C145.656 87.531 145.531 87.8456 145.405 88.2232C145.279 88.6007 145.153 89.0412 145.153 89.6076C145.153 90.1739 145.09 90.7403 145.153 91.3695C145.216 91.9988 145.153 92.5651 145.279 93.1944L145.216 93.1315Z" fill="#555555"/>
          <path d="M153.839 88.6637V90.6144H153.902C154.154 89.9222 154.469 89.4817 154.847 89.3559C155.224 89.1671 155.665 89.23 156.106 89.4817C156.546 89.7334 157.176 90.2998 157.616 90.992C158.057 91.6842 158.435 92.5022 158.686 93.3832C159.001 94.2642 159.19 95.271 159.379 96.3408C159.505 97.4105 159.631 98.4803 159.631 99.55C159.631 100.62 159.631 101.501 159.505 102.382C159.379 103.263 159.19 103.955 158.938 104.584C158.686 105.151 158.372 105.528 157.931 105.78C157.553 105.969 157.05 105.906 156.483 105.654C155.917 105.402 155.602 104.962 155.224 104.332C154.847 103.703 154.469 103.011 154.217 102.067L154.343 109.304L152.266 108.171L151.888 87.5939L153.839 88.6637ZM156.735 102.256C156.987 102.13 157.113 101.878 157.239 101.501C157.364 101.123 157.427 100.683 157.49 100.116C157.49 99.55 157.553 98.9837 157.49 98.3544C157.427 97.7252 157.49 97.0959 157.364 96.5295C157.302 95.9003 157.176 95.3339 157.05 94.7676C156.924 94.2013 156.735 93.7608 156.483 93.3203C156.231 92.8798 155.98 92.6281 155.665 92.4393C155.35 92.2505 155.035 92.2505 154.847 92.4393C154.595 92.6281 154.469 92.8798 154.343 93.2573C154.217 93.6349 154.154 94.0754 154.091 94.6417C154.091 95.2081 154.028 95.7744 154.091 96.4037C154.154 97.033 154.091 97.5993 154.217 98.2286C154.28 98.8578 154.406 99.4242 154.532 99.9276C154.658 100.431 154.847 100.934 155.098 101.312C155.35 101.69 155.602 102.004 155.917 102.193C156.231 102.382 156.546 102.382 156.735 102.193V102.256Z" fill="#555555"/>
          <path d="M162.652 104.899C162.778 105.276 162.904 105.591 163.03 105.906C163.155 106.22 163.344 106.472 163.533 106.661C163.722 106.85 163.911 107.038 164.1 107.164C164.288 107.29 164.414 107.29 164.54 107.29C164.729 107.29 164.855 107.29 164.981 107.227C165.107 107.164 165.233 107.038 165.296 106.787C165.359 106.598 165.421 106.283 165.421 105.906C165.421 105.276 165.17 104.71 164.792 104.144C164.351 103.577 163.785 102.948 163.03 102.256C162.715 101.941 162.463 101.627 162.148 101.249C161.834 100.872 161.582 100.494 161.393 100.053C161.141 99.613 160.952 99.1096 160.826 98.6061C160.701 98.0398 160.575 97.4735 160.575 96.7813C160.575 95.7744 160.575 95.0193 160.826 94.5159C161.015 94.0125 161.267 93.6349 161.519 93.4461C161.834 93.2574 162.148 93.1944 162.526 93.2574C162.904 93.3203 163.281 93.4461 163.722 93.6978C164.163 93.9496 164.54 94.2013 164.918 94.5788C165.296 94.9564 165.673 95.3969 165.925 95.9632C166.24 96.5296 166.492 97.1588 166.68 97.851C166.869 98.6061 167.058 99.4242 167.058 100.431L165.107 99.3613C165.107 98.5432 164.918 97.9139 164.603 97.4735C164.351 97.033 164.037 96.7183 163.659 96.5296C163.281 96.3408 163.407 96.4037 163.281 96.3408C163.155 96.3408 163.03 96.3408 162.904 96.3408C162.778 96.3408 162.715 96.4666 162.652 96.5925C162.589 96.7183 162.526 96.9701 162.526 97.2847C162.526 97.5993 162.589 97.9769 162.778 98.2915C162.904 98.6061 163.092 98.9208 163.344 99.1725C163.533 99.4242 163.785 99.7388 164.1 99.9905C164.351 100.242 164.666 100.557 164.981 100.872C165.296 101.186 165.61 101.501 165.862 101.878C166.177 102.256 166.429 102.633 166.617 103.074C166.869 103.514 167.058 104.018 167.184 104.584C167.31 105.151 167.436 105.78 167.436 106.472C167.436 107.479 167.436 108.297 167.184 108.863C166.995 109.43 166.743 109.87 166.429 110.059C166.114 110.248 165.736 110.373 165.359 110.311C164.981 110.248 164.54 110.122 164.1 109.87C163.659 109.618 163.218 109.304 162.841 108.863C162.4 108.423 162.022 107.919 161.708 107.353C161.393 106.724 161.078 106.032 160.889 105.276C160.638 104.458 160.512 103.577 160.512 102.508L162.463 103.577C162.463 104.018 162.526 104.458 162.652 104.836V104.899Z" fill="#555555"/>
          <path d="M140.438 153.327C140.419 154.435 140.734 155.549 141.376 156.449C142.377 157.858 143.982 158.645 145.543 159.268C146.33 159.582 146.953 160.08 147.765 160.344C148.659 160.64 149.591 160.791 150.522 160.872C152.134 161.017 153.833 160.929 155.256 160.155C157.125 159.136 158.252 156.895 157.95 154.787C157.912 154.536 157.862 154.271 157.95 154.026C158.038 153.774 158.258 153.604 158.46 153.428C160.361 151.754 160.82 148.671 159.492 146.519C159.366 146.311 159.221 146.097 159.228 145.858C159.228 145.644 159.36 145.449 159.46 145.26C160.153 143.989 159.895 142.278 158.862 141.264C159.674 140.862 160.153 139.962 160.266 139.062C160.379 138.162 160.191 137.25 159.983 136.369C158.969 132.02 157.452 127.603 154.305 124.438C153.034 123.154 151.46 122.097 149.685 121.77C148.294 121.518 146.764 121.77 145.606 122.594C144.36 123.481 143.617 124.778 143.604 126.351C143.592 127.439 143.825 128.408 144.108 129.453C144.127 129.51 144.139 129.579 144.121 129.636C144.083 129.736 143.957 129.768 143.85 129.787C142.194 130.076 140.677 131.077 139.765 132.486C138.625 134.235 138.38 136.715 139.431 138.552C139.96 139.471 140.703 140.245 141.496 140.943C141.584 141.019 141.685 141.145 141.622 141.246C141.596 141.283 141.552 141.308 141.508 141.327C140.218 141.95 139.488 143.618 139.349 144.977C139.249 145.99 139.412 147.041 139.903 147.935C140.394 148.828 141.225 149.546 142.201 149.822C141.678 150.062 141.301 150.54 141.03 151.05C140.652 151.754 140.463 152.547 140.445 153.346L140.438 153.327Z" fill="#F1D0B3"/>
          <path d="M140.438 153.327C140.419 154.435 140.734 155.549 141.376 156.449C142.503 158.034 144.272 159.224 146.084 159.872C147.494 160.375 149.043 160.74 150.528 160.872C152.14 161.017 153.839 160.929 155.262 160.155C157.131 159.136 158.258 156.895 157.956 154.787C157.918 154.536 157.868 154.271 157.956 154.026C158.044 153.774 158.264 153.604 158.466 153.428C160.367 151.754 160.826 148.671 159.498 146.519C159.372 146.311 159.228 146.097 159.234 145.858C159.234 145.644 159.366 145.449 159.467 145.26C160.159 143.989 159.901 142.278 158.869 141.264C159.681 140.862 160.159 139.962 160.272 139.062C160.386 138.162 160.197 137.25 159.989 136.369C158.976 132.02 157.459 127.603 154.312 124.438C153.04 123.154 151.466 122.097 149.691 121.77C148.3 121.518 146.771 121.77 145.612 122.594C144.366 123.481 143.623 124.778 143.611 126.351C143.598 127.439 143.831 128.408 144.114 129.453C144.133 129.51 144.146 129.579 144.127 129.636C144.089 129.736 143.963 129.768 143.856 129.787C142.201 130.076 140.684 131.077 139.771 132.486C138.632 134.235 138.386 136.715 139.437 138.552C139.966 139.471 140.709 140.245 141.502 140.943C141.59 141.019 141.691 141.145 141.628 141.246C141.603 141.283 141.559 141.308 141.515 141.327C140.224 141.95 139.494 143.618 139.356 144.977C139.255 145.99 139.419 147.041 139.91 147.935C140.4 148.828 141.231 149.546 142.207 149.822C141.685 150.062 141.307 150.54 141.036 151.05C140.659 151.754 140.47 152.547 140.451 153.346L140.438 153.327Z" fill="#F1D0B3"/>
          <path d="M140.377 136.781C141.555 137.64 142.992 137.957 144.39 138.174C145.883 138.411 147.461 138.548 148.865 137.932C149.203 137.783 149.546 137.59 149.907 137.646C150.116 137.677 150.307 137.795 150.493 137.901C151.468 138.473 152.488 138.946 153.542 139.313C154.072 139.499 154.669 139.648 155.165 139.369C155.734 140.308 156.45 141.141 157.267 141.819C157.008 145.19 157.938 148.81 159.296 151.814C159.595 152.473 159.933 153.126 160.451 153.592C160.975 154.059 161.635 154.283 162.289 154.451C163.776 154.836 165.36 154.985 166.808 154.463C168.753 153.76 170.229 151.913 171.018 149.83C172.196 146.726 171.987 143.169 171.165 139.928C170.821 138.585 170.359 137.235 169.513 136.19C168.82 135.338 167.918 134.735 167.022 134.15C164.717 132.633 162.413 131.115 160.108 129.598C157.025 127.57 153.649 125.462 150.082 125.916C149.744 125.959 149.4 126.028 149.101 126.214C148.746 126.438 148.498 126.812 148.228 127.147C146.633 129.144 144.204 130.089 141.82 130.512C140.524 130.742 138.726 131.439 138.501 133.162C138.32 134.561 139.374 136.047 140.372 136.775L140.377 136.781Z" fill="#F1D0B3"/>
          </g>
          <path d="M85.3467 79.0393C87.4021 79.0393 89.0683 80.7112 89.0683 82.7735C89.0683 84.8359 87.4021 86.5078 85.3467 86.5078C83.2913 86.5078 81.625 84.8359 81.625 82.7735C81.625 80.7112 83.2913 79.0393 85.3467 79.0393Z" fill="#CCCCCC"/>
          <path d="M310.339 143.539C311.833 143.539 313.045 144.755 313.045 146.255C313.045 147.755 311.833 148.971 310.339 148.971C308.844 148.971 307.632 147.755 307.632 146.255C307.632 144.755 308.844 143.539 310.339 143.539Z" fill="#CCCCCC"/>
          <path d="M281.674 214.829C284.156 214.829 286.167 216.847 286.167 219.337C286.167 221.826 284.156 223.844 281.674 223.844C279.193 223.844 277.182 221.826 277.182 219.337C277.182 216.847 279.193 214.829 281.674 214.829Z" fill="#CCCCCC"/>
          <path d="M113.428 216.866C114.923 216.866 116.135 218.082 116.135 219.582C116.135 221.082 114.923 222.298 113.428 222.298C111.934 222.298 110.722 221.082 110.722 219.582C110.722 218.082 111.934 216.866 113.428 216.866Z" fill="#CCCCCC"/>
          <defs>
          <clipPath id="clip0_411_5879">
          <rect width="175.738" height="171.784" fill="white" transform="translate(117.708 50.9707)"/>
          </clipPath>
          </defs>
          </svg>

        </div>
        <p className="mb-6 text-center text-gray-700 text-lg">
          Vous n'avez aucune base de données pour cette formation
        </p>
      </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white border border-[#DDD] p-6">
      <h2 className="text-2xl font-bold mb-6">Liste des bénéficiaires</h2>

      <div className="flex items-center mb-6 gap-3">
        <div className="relative flex-grow mr-4">
          <input
            type="text"
            placeholder="Rechercher un bénéficiaire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-[#DDD] outline-none text-[#666] placeholder:text-[#999] text-sm rounded"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FF7900] rounded-full p-1.5">
            <Search className="h-4 w-4 text-white" />
          </div>
        </div>

        <Button variant="ghost" className="text-[#333] flex items-center gap-2 mr-2">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3C0 2.44772 0.447715 2 1 2H19C19.5523 2 20 2.44772 20 3V5C20 5.26522 19.8946 5.51957 19.7071 5.70711L13 12.4142V19C13 19.5523 12.5523 20 12 20H8C7.44772 20 7 19.5523 7 19V12.4142L0.292893 5.70711C0.105357 5.51957 0 5.26522 0 5V3Z" fill="#000"/>
          </svg>
          Filtres
        </Button>

        <Button variant="outline" className="border-[#999999] text-[#999999] font-normal text-sm whitespace-nowrap mr-1">
          Importer
        </Button>

        <Button variant="outline" className="border-[#FF7900] text-[#FF7900] flex items-center gap-2 text-sm mr-1">
          Exporter
          <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M17.0196 12.88V17.02H5.9796V12.88H3.6796V17.48C3.6796 18.4962 4.50339 19.32 5.5196 19.32H17.4796C18.4958 19.32 19.3196 18.4962 19.3196 17.48V12.88H17.0196ZM14.2596 10.58V5.06002C14.2596 4.69402 14.1142 4.34301 13.8554 4.08421C13.5966 3.82541 13.2456 3.68002 12.8796 3.68002H10.1196C9.35744 3.68002 8.7396 4.29787 8.7396 5.06002V10.58H5.9796L8.7396 13.3213L10.7794 15.3471C11.1725 15.7376 11.8267 15.7376 12.2198 15.3471L14.2596 13.3213L17.0196 10.58H14.2596Z" fill="#FF7900"/>
          </svg>
        </Button>

        <Button variant="ghost" className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M20.9998 19.8H2.9998C2.33706 19.8 1.7998 19.2627 1.7998 18.6V12.6C1.7998 11.9372 2.33706 11.4 2.9998 11.4H5.3998V4.19995H13.7998L18.5998 8.99995V11.4H20.9998C21.6625 11.4 22.1998 11.9252 22.1998 12.588V18.6C22.1998 19.2627 21.6625 19.8 20.9998 19.8ZM11.9998 18.6C12.3312 18.6 12.5998 18.3313 12.5998 18C12.5998 17.6686 12.3312 17.4 11.9998 17.4C11.6684 17.4 11.3998 17.6686 11.3998 18C11.3998 18.3313 11.6684 18.6 11.9998 18.6ZM6.5998 14.4H17.3998V9.59995H14.3998C13.7371 9.59995 13.1998 9.06269 13.1998 8.39995V5.39995H6.5998V14.4Z" fill="#999999"/>
          </svg>
        </Button> 
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F5F5F5]">
            <th className="p-3 text-left">
              <input 
                type="checkbox" 
                className="border border-[#DDD] w-4 h-4" 
                checked={selectAll} 
                onChange={handleSelectAll} 
              />
            </th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Nom</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Prénom</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Email</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">Genre</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">isBlack</th>
            <th className="p-3 text-left font-semibold text-[#333] text-sm font-bold">isSaturate</th>
            <th className="p-3 font-bold"></th>
          </tr>
        </thead>
        <tbody>
          {displayedBeneficiaires.map((beneficiaire, index) => (
            <React.Fragment key={index}>
              <tr className="border-t border-[#DDD] hover:bg-[#F5F5F5]">
                <td className="p-3">
                  <input 
                    type="checkbox" 
                    className="border border-[#DDD] w-4 h-4"
                    checked={selectedBeneficiaires.includes(index)}
                    onChange={() => handleSelectOne(index)}
                  />
                </td>
                <td className="p-3 text-[#333] text-sm">{beneficiaire.nom || '-'}</td>
                <td className="p-3 text-[#333] text-sm">{beneficiaire.prenom || '-'}</td>
                <td className="p-3 text-[#333] text-sm">{beneficiaire.email || '-'}</td>
                <td className="p-3 text-[#333] text-sm">{beneficiaire.genre || '-'}</td>
                <td className={`p-3 text-sm ${beneficiaire.isBlack ? "text-red-500" : "text-green-500"}`}>
                  {beneficiaire.isBlack ? "Oui" : "Non"}
                </td>
                <td className={`p-3 text-sm ${beneficiaire.isSaturate ? "text-red-500" : "text-green-500"}`}>
                  {beneficiaire.isSaturate ? "Oui" : "Non"}
                </td>
                <td className="p-3">
                  <button 
                    className="flex items-center gap-2 text-sm text-[#333] font-bold"
                    onClick={() => toggleRowExpansion(index)}
                  >
                    {expandedRow === index ? "Voir moins" : "Voir plus"}
                    <svg 
                      width="8" 
                      height="12" 
                      viewBox="0 0 8 12" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transform transition-transform ${expandedRow === index ? "rotate-90" : ""}`}
                    >
                      <path fillRule="evenodd" clipRule="evenodd" d="M1.77778 12L8 6L1.77778 0L0 1.71343L4.44533 6L0 10.2849L1.77778 12Z" fill="black"/>
                      <mask id="mask0_717_3240" maskUnits="userSpaceOnUse" x="0" y="0" width="8" height="12">
                        <path fillRule="evenodd" clipRule="evenodd" d="M1.77778 12L8 6L1.77778 0L0 1.71343L4.44533 6L0 10.2849L1.77778 12Z" fill="white"/>
                      </mask>
                      <g mask="url(#mask0_717_3240)"></g>
                    </svg>
                  </button>
                </td>
              </tr>
              {expandedRow === index && (
                <tr className="border-t border-[#DDD] bg-[#F9F9F9]">
                  <td colSpan={8} className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-sm mb-2">Pays</p>
                        <p className="text-sm text-[#333]">{beneficiaire.pays || '-'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-2">Spécialité</p>
                        <p className="text-sm text-[#333]">{beneficiaire.specialite || '-'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-2">Établissement</p>
                        <p className="text-sm text-[#333]">{beneficiaire.etablissement || '-'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-2">Profession</p>
                        <p className="text-sm text-[#333]">{beneficiaire.profession || '-'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-2">Nationalité</p>
                        <p className="text-sm text-[#333]">{beneficiaire.nationalite || '-'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-2">Niveau</p>
                        <p className="text-sm text-[#333]">{beneficiaire.niveau || '-'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-2">Situation professionnelle</p>
                        <p className="text-sm text-[#333]">{beneficiaire.situationProfessionnel || '-'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-2">Région</p>
                        <p className="text-sm text-[#333]">{beneficiaire.region || '-'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-2">Catégorie d'âge</p>
                        <p className="text-sm text-[#333]">{beneficiaire.categorieAge || '-'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-2">Date de naissance</p>
                        <p className="text-sm text-[#333]">
                          {beneficiaire.dateNaissance 
                            ? new Date(beneficiaire.dateNaissance).toLocaleDateString() 
                            : '-'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      
      {/* Pagination - Centrée */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center mt-6">
          <div className="text-sm text-[#666] mb-2">
            Affichage de {startIndex + 1} à {Math.min(endIndex, filteredBeneficiaires.length)} sur {filteredBeneficiaires.length} bénéficiaires
          </div>
          <div className="flex items-center gap-2">
            {/* Bouton précédent */}
            <button 
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-8 h-8 rounded ${currentPage === 1 ? 'text-[#999] cursor-not-allowed' : 'text-[#333] hover:bg-[#F5F5F5]'}`}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-180">
                <path fillRule="evenodd" clipRule="evenodd" d="M1.77778 12L8 6L1.77778 0L0 1.71343L4.44533 6L0 10.2849L1.77778 12Z" fill="currentColor"/>
              </svg>
            </button>
            
            {/* Numéros de page */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`flex items-center justify-center w-8 h-8 rounded ${
                  currentPage === page 
                    ? 'bg-[#FF7900] text-white' 
                    : 'text-[#333] hover:bg-[#F5F5F5]'
                }`}
              >
                {page}
              </button>
            ))}
            
            {/* Bouton suivant */}
            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-8 h-8 rounded ${currentPage === totalPages ? 'text-[#999] cursor-not-allowed' : 'text-[#333] hover:bg-[#F5F5F5]'}`}
            >
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M1.77778 12L8 6L1.77778 0L0 1.71343L4.44533 6L0 10.2849L1.77778 12Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiairesListe;