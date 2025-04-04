// Function to determine formation status based on dates
const determineFormationStatus = (dateDebut, dateFin) => {
    const currentDate = new Date();
    
    // If dateDebut is in the future, status is "Avenir"
    if (dateDebut && new Date(dateDebut) > currentDate) {
      return "Avenir";
    }
    
    // If dateDebut is in the past or today, and dateFin is in the future or not set, status is "En Cours"
    if ((dateDebut && new Date(dateDebut) <= currentDate) && 
        (!dateFin || new Date(dateFin) >= currentDate)) {
      return "En Cours";
    }
    
    // If dateFin is in the past, status is "Terminé"
    if (dateFin && new Date(dateFin) < currentDate) {
      return "Terminé";
    }
    
    // Default status if dates are not properly set
    return "Avenir";
};

module.exports = {
    determineFormationStatus
}