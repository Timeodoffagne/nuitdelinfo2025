// ===============================================
// AJOUT à transfer-data.js (à la fin)
// ===============================================

/**
 * Vérifie si le formulaire a été commencé et redirige si nécessaire.
 * @param {string} currentPage - Le nom du fichier de la page actuelle (ex: 'sexe.html').
 * @param {string} requiredPreviousDataKey - La clé de donnée requise (ex: 'pseudo').
 */
const checkFormStatus = (currentPage, requiredPreviousDataKey) => {
    // Les pages qui ne nécessitent pas de vérification préalable : pseudo.html et recapitulatif.html
    if (currentPage === 'pseudo.html' || currentPage === 'recapitulatif.html') {
        return; 
    }

    const dataString = sessionStorage.getItem('formData');
    
    // Si aucune donnée n'existe OU si la donnée précédente requise n'est pas là
    if (!dataString) {
        // Rediriger vers la page de départ
        console.warn(`Tentative d'accès direct à ${currentPage}. Redirection vers pseudo.html.`);
        window.location.replace('pseudo.html'); 
        return;
    }
    
    try {
        const formData = JSON.parse(dataString);
        
        // Exemple de vérification : sur age.html, il faut que 'sexe' soit rempli.
        if (!formData[requiredPreviousDataKey]) {
            console.warn(`La clé requise '${requiredPreviousDataKey}' manque pour ${currentPage}. Redirection vers pseudo.html.`);
            window.location.replace('pseudo.html');
        }
    } catch (e) {
        console.error("Erreur de lecture des données de session.", e);
        window.location.replace('pseudo.html');
    }
};

window.checkFormStatus = checkFormStatus;