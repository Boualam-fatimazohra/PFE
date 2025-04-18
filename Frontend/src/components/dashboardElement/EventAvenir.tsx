import * as React from "react";
import { useState, useEffect } from "react";
import apiClient from '@/services/apiClient'; // Ajustez le chemin selon votre structure de projet

const EventAvenir = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 5;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Option 1: Filtrage côté serveur (recommandé si l'API le supporte)
        // const response = await apiClient.get('/evenement/getEvenements?dateDebut_gte=' + new Date().toISOString());
        
        // Option 2: Filtrage côté client
        const response = await apiClient.get('/evenement/getEvenements');
        const currentDate = new Date();
        
        // Filtrer les événements pour ne garder que ceux avec dateDebut supérieure à la date actuelle
        const futureEvents = response.data.evenements.filter(event => {
          const eventDate = new Date(event.dateDebut);
          return eventDate >= currentDate;
        });
        
        const formattedEvents = futureEvents.map(event => ({
          id: event._id,
          title: event.titre,
          date: formatDate(event.dateDebut),
          time: `${event.heureDebut}-${event.heureFin}`,
          location: event.categorie || "Non spécifié",
          icon: <svg xmlns="http://www.w3.org/2000/svg" width="21" height="17" viewBox="0 0 21 17" fill="none">
                  <g clipPath="url(#clip0_886_7078)">
                    <path d="M10.3889 1.0625C10.1259 1.0625 9.86621 1.10898 9.61947 1.19863L0.512963 4.56211C0.204543 4.67832 1.1433e-05 4.97715 1.1433e-05 5.3125C1.1433e-05 5.64785 0.204543 5.94668 0.512963 6.06289L2.3927 6.75684C1.86027 7.61348 1.55834 8.62617 1.55834 9.69199V10.625C1.55834 11.568 1.20772 12.5408 0.834369 13.3078C0.623345 13.7395 0.383102 14.1645 0.1039 14.5562C1.14341e-05 14.699 -0.0292073 14.885 0.0292302 15.0543C0.0876677 15.2236 0.224022 15.3498 0.392841 15.393L2.47062 15.9242C2.60697 15.9607 2.75307 15.9342 2.87319 15.8578C2.99331 15.7814 3.07772 15.6553 3.10369 15.5125C3.38289 14.0914 3.24329 12.8164 3.03551 11.9033C2.93163 11.4318 2.79203 10.9504 2.59723 10.5088V9.69199C2.59723 8.68926 2.92838 7.74297 3.50301 6.98594C3.92182 6.47129 4.46399 6.05625 5.10031 5.80059L10.1974 3.75195C10.4636 3.6457 10.7655 3.77852 10.8694 4.05078C10.9733 4.32305 10.8434 4.63184 10.5772 4.73809L5.48015 6.78672C5.07758 6.94941 4.72371 7.19844 4.43477 7.50391L9.61623 9.41641C9.86296 9.50605 10.1227 9.55254 10.3857 9.55254C10.6486 9.55254 10.9083 9.50605 11.1551 9.41641L20.2648 6.06289C20.5733 5.95 20.7778 5.64785 20.7778 5.3125C20.7778 4.97715 20.5733 4.67832 20.2648 4.56211L11.1583 1.19863C10.9116 1.10898 10.6519 1.0625 10.3889 1.0625ZM4.15557 13.5469C4.15557 14.7189 6.94758 15.9375 10.3889 15.9375C13.8302 15.9375 16.6222 14.7189 16.6222 13.5469L16.1255 8.71914L11.509 10.4258C11.1486 10.5586 10.7687 10.625 10.3889 10.625C10.0091 10.625 9.62597 10.5586 9.26885 10.4258L4.65229 8.71914L4.15557 13.5469Z" fill="black"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_886_7078">
                      <path d="M0 0H20.7778V17H0V0Z" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
        }));
        
        // Option: Tri des événements par date (du plus proche au plus éloigné)
        const sortedEvents = formattedEvents.sort((a, b) => {
          const dateA = new Date(response.data.evenements.find(e => e._id === a.id).dateDebut);
          const dateB = new Date(response.data.evenements.find(e => e._id === b.id).dateDebut);
          return dateA - dateB;
        });
        
        setEvents(sortedEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Impossible de récupérer les événements');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-[4px] border border-gray-200 flex flex-col mb-4 w-[700px]">
        <h2 className="font-bold text-2xl mb-4">Événements à venir</h2>
        <div className="flex justify-center p-6">
          <div className="text-center">Chargement des événements...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-[4px] border border-gray-200 flex flex-col mb-4 w-[700px]">
        <h2 className="font-bold text-2xl mb-4">Événements à venir</h2>
        <div className="flex justify-center p-6">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-[4px] border border-gray-200 flex flex-col mb-4 w-[700px]">              
      <h2 className="font-bold text-2xl mb-4">Événements à venir</h2>
      
      {events.length === 0 ? (
        <div className="text-center p-6">
          <p>Aucun événement à venir pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentEvents.map((event) => (
            <div key={event.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-start">
                <div className="bg-gray-100 p-1 rounded mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="17" viewBox="0 0 21 17" fill="none">
                    <g clipPath="url(#clip0_886_7078)">
                      <path d="M10.3889 1.0625C10.1259 1.0625 9.86621 1.10898 9.61947 1.19863L0.512963 4.56211C0.204543 4.67832 1.1433e-05 4.97715 1.1433e-05 5.3125C1.1433e-05 5.64785 0.204543 5.94668 0.512963 6.06289L2.3927 6.75684C1.86027 7.61348 1.55834 8.62617 1.55834 9.69199V10.625C1.55834 11.568 1.20772 12.5408 0.834369 13.3078C0.623345 13.7395 0.383102 14.1645 0.1039 14.5562C1.14341e-05 14.699 -0.0292073 14.885 0.0292302 15.0543C0.0876677 15.2236 0.224022 15.3498 0.392841 15.393L2.47062 15.9242C2.60697 15.9607 2.75307 15.9342 2.87319 15.8578C2.99331 15.7814 3.07772 15.6553 3.10369 15.5125C3.38289 14.0914 3.24329 12.8164 3.03551 11.9033C2.93163 11.4318 2.79203 10.9504 2.59723 10.5088V9.69199C2.59723 8.68926 2.92838 7.74297 3.50301 6.98594C3.92182 6.47129 4.46399 6.05625 5.10031 5.80059L10.1974 3.75195C10.4636 3.6457 10.7655 3.77852 10.8694 4.05078C10.9733 4.32305 10.8434 4.63184 10.5772 4.73809L5.48015 6.78672C5.07758 6.94941 4.72371 7.19844 4.43477 7.50391L9.61623 9.41641C9.86296 9.50605 10.1227 9.55254 10.3857 9.55254C10.6486 9.55254 10.9083 9.50605 11.1551 9.41641L20.2648 6.06289C20.5733 5.95 20.7778 5.64785 20.7778 5.3125C20.7778 4.97715 20.5733 4.67832 20.2648 4.56211L11.1583 1.19863C10.9116 1.10898 10.6519 1.0625 10.3889 1.0625ZM4.15557 13.5469C4.15557 14.7189 6.94758 15.9375 10.3889 15.9375C13.8302 15.9375 16.6222 14.7189 16.6222 13.5469L16.1255 8.71914L11.509 10.4258C11.1486 10.5586 10.7687 10.625 10.3889 10.625C10.0091 10.625 9.62597 10.5586 9.26885 10.4258L4.65229 8.71914L4.15557 13.5469Z" fill="black"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_886_7078">
                        <path d="M0 0H20.7778V17H0V0Z" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-sm">{event.title}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M11.9 1.4H10.5V0.7C10.5 0.514348 10.4263 0.336301 10.295 0.205025C10.1637 0.0737498 9.98565 0 9.8 0C9.61435 0 9.4363 0.0737498 9.30503 0.205025C9.17375 0.336301 9.1 0.514348 9.1 0.7V1.4H4.9V0.7C4.9 0.514348 4.82625 0.336301 4.69497 0.205025C4.5637 0.0737498 4.38565 0 4.2 0C4.01435 0 3.8363 0.0737498 3.70503 0.205025C3.57375 0.336301 3.5 0.514348 3.5 0.7V1.4H2.1C1.54305 1.4 1.0089 1.62125 0.615076 2.01508C0.221249 2.4089 0 2.94305 0 3.5V11.9C0 12.457 0.221249 12.9911 0.615076 13.3849C1.0089 13.7788 1.54305 14 2.1 14H11.9C12.457 14 12.9911 13.7788 13.3849 13.3849C13.7788 12.9911 14 12.457 14 11.9V3.5C14 2.94305 13.7788 2.4089 13.3849 2.01508C12.9911 1.62125 12.457 1.4 11.9 1.4ZM12.6 11.9C12.6 12.0857 12.5263 12.2637 12.395 12.395C12.2637 12.5263 12.0857 12.6 11.9 12.6H2.1C1.91435 12.6 1.7363 12.5263 1.60503 12.395C1.47375 12.2637 1.4 12.0857 1.4 11.9V7H12.6V11.9ZM12.6 5.6H1.4V3.5C1.4 3.31435 1.47375 3.1363 1.60503 3.00503C1.7363 2.87375 1.91435 2.8 2.1 2.8H3.5V3.5C3.5 3.68565 3.57375 3.8637 3.70503 3.99497C3.8363 4.12625 4.01435 4.2 4.2 4.2C4.38565 4.2 4.5637 4.12625 4.69497 3.99497C4.82625 3.8637 4.9 3.68565 4.9 3.5V2.8H9.1V3.5C9.1 3.68565 9.17375 3.8637 9.30503 3.99497C9.4363 4.12625 9.61435 4.2 9.8 4.2C9.98565 4.2 10.1637 4.12625 10.295 3.99497C10.4263 3.8637 10.5 3.68565 10.5 3.5V2.8H11.9C12.0857 2.8 12.2637 2.87375 12.395 3.00503C12.5263 3.1363 12.6 3.31435 12.6 3.5V5.6Z" fill="#FF7900"/>
                      </svg>
                      <span>{event.date}</span>
                      <span>{event.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '10px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3.16668 6.66559H3.16668V6.66334C3.16668 4.00236 5.33529 1.83334 8.00001 1.83334C10.6645 1.83334 12.8333 4.00215 12.8333 6.66668L12.8334 6.66893C12.8421 8.61982 11.6196 10.499 10.3046 11.9396C9.65652 12.6496 9.00622 13.231 8.51749 13.6351C8.31052 13.8062 8.13322 13.9449 7.99825 14.0475C7.52751 13.6951 6.56604 12.9296 5.62056 11.8865C4.3346 10.4677 3.15787 8.62228 3.16668 6.66559ZM4.83335 6.66668C4.83335 8.41615 6.25054 9.83334 8.00001 9.83334C9.74949 9.83334 11.1667 8.41615 11.1667 6.66668C11.1667 4.9172 9.74949 3.50001 8.00001 3.50001C6.25054 3.50001 4.83335 4.9172 4.83335 6.66668Z" stroke="#FF7900"/>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="bg-gray-800 text-white text-xs px-3 py-1 rounded-none">
                Accéder
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {events.length > 0 && (
        <div className="flex items-center justify-center space-x-2 mt-4">
          {/* Bouton Précédent */}
          <button 
            className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 bg-white cursor-pointer'}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Précédent
          </button>

          {/* Numéros de page */}
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
              // Si plus de 3 pages, ajuster l'affichage pour montrer autour de la page courante
              let pageToShow = i + 1;
              if (totalPages > 3 && currentPage > 2) {
                if (currentPage === totalPages) {
                  pageToShow = currentPage - 2 + i;
                } else {
                  pageToShow = currentPage - 1 + i;
                }
              }
              
              if (pageToShow <= totalPages) {
                return (
                  <button
                    key={pageToShow}
                    className={`w-8 h-8 flex items-center justify-center rounded border ${
                      pageToShow === currentPage ? 'bg-gray-800 text-white' : 'text-gray-500'
                    }`}
                    onClick={() => setCurrentPage(pageToShow)}
                  >
                    {pageToShow}
                  </button>
                );
              }
              return null;
            })}
          </div>

          {/* Bouton Suivant */}
          <button 
            className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'bg-gray-300 text-white cursor-not-allowed' : 'text-gray-500 bg-white cursor-pointer'}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default EventAvenir;