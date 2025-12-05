// ==========================================================
// FICHIER: app.js
// Logique Centralisée pour le Questionnaire SPA (Single Page Application)
// Gère la navigation entre les étapes et la collecte finale des données.
// ==========================================================

const form = document.getElementById('questionnaire-form');
const stepIndicator = document.getElementById('step-indicator');
const totalSteps = 9; // Nombre total d'étapes avant le récapitulatif

/**
 * Met à jour l'indicateur d'étape dans l'en-tête.
 * @param {number} currentStep Le numéro de l'étape affichée.
 * @param {string} stepTitle Le titre de l'étape.
 */
function updateStepIndicator(currentStep, stepTitle) {
    if (currentStep <= totalSteps) {
        stepIndicator.textContent = `Étape ${currentStep} sur ${totalSteps} : ${stepTitle}`;
    } else {
        stepIndicator.textContent = `Étape Finale : ${stepTitle}`;
    }
}

/**
 * Affiche l'étape suivante et cache l'étape actuelle.
 */
function goToStep(currentId, nextId, nextTitle) {
    const currentStep = document.getElementById(`step-${currentId}`);
    const nextStep = document.getElementById(`step-${nextId}`);
    
    if (currentStep) currentStep.classList.remove('active');
    if (nextStep) nextStep.classList.add('active');

    updateStepIndicator(nextId, nextTitle);
    
    // Si on atteint le récapitulatif (step-10)
    if (nextId === 10) {
        displayRecapData();
    }
}

/**
 * Valide l'étape actuelle et passe à la suivante si la validation est OK.
 */
function validateAndNavigate(currentId, nextId, nextTitle) {
    const currentStepElement = document.getElementById(`step-${currentId}`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    
    let isValid = true;
    
    inputs.forEach(input => {
        // Vérification simple des champs requis (texte, nombre, select)
        if (input.type !== 'radio' && input.value.trim() === '') {
            isValid = false;
            input.reportValidity();
        }
    });

    // Vérification spécifique pour les groupes de radios requis
    currentStepElement.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (radio.required) {
            const groupName = radio.name;
            if (!currentStepElement.querySelector(`input[name="${groupName}"]:checked`)) {
                isValid = false;
                // Tente de déclencher la validation native sur le premier élément du groupe
                if (radio === currentStepElement.querySelector(`input[name="${groupName}"]`)) {
                    radio.reportValidity();
                }
            }
        }
    });

    if (isValid) {
        goToStep(currentId, nextId, nextTitle);
    }
}

/**
 * Gère la soumission spécifique de l'Étape 6 (Problèmes de Santé) et prépare la donnée.
 */
function handleHealthSubmission() {
    const checkboxes = document.querySelectorAll('#step-6 input[name="sante_choix"]:checked');
    let selectedProblems = [];

    checkboxes.forEach(cb => { selectedProblems.push(cb.value); });

    // Agrégation des choix dans le champ caché maladies_choisies
    const maladiesChoisieInput = document.getElementById('maladies-choisies');
    maladiesChoisieInput.value = selectedProblems.join('; ');
    
    // Pas de validation requise pour les checkboxes, on passe directement à l'étape 7
    goToStep(6, 7, 'Environnement de travail');
}


/**
 * Gère la navigation conditionnelle pour l'Étape 7 (Environnement de Travail).
 */
function handleConditionalNavigation() {
    const currentId = 7;
    const currentStepElement = document.getElementById(`step-${currentId}`);
    
    const radioChecked = currentStepElement.querySelector('input[name="environnement_travail"]:checked');
    
    // 1. Validation radio
    if (!radioChecked) {
        currentStepElement.querySelector('input[name="environnement_travail"]').reportValidity();
        return;
    }

    const selectedValue = radioChecked.value;
    let nextId;
    let nextTitle;

    // LOGIQUE DE SAUT : si Retraite ou Chômage/Inactif ou Étudiant, on saute les étapes 8 et 9
    if (selectedValue === 'Retraite' || selectedValue === 'Chômage/Inactif' || selectedValue === 'Étudiant') {
        nextId = 10; // Saut direct au récapitulatif
        nextTitle = 'Votre Profil de Bien-être';
    } else {
        nextId = 8; // Continuer vers l'étape 8
        nextTitle = 'Posture de Travail';
    }
    
    goToStep(currentId, nextId, nextTitle);
}

/**
 * Collecte TOUTES les données du formulaire et les affiche.
 */
function displayRecapData() {
    const recapContainer = document.getElementById('recap-data-container');
    const formData = new FormData(form);
    
    if (!recapContainer) return;

    let storedData = {};
    
    // 1. Collecte des données du formulaire (tous les champs visibles et cachés)
    for (const [key, value] of formData.entries()) {
        if (key === 'sante_choix') continue; // Ignorer le name brut des checkboxes
        
        // Stocke la valeur
        storedData[key] = value;
    }
    
    // 2. Affichage
    let html = '<h3>Réponses collectées :</h3>';
    html += '<ul style="list-style-type: disc; padding-left: 20px;">';
    
    if (Object.keys(storedData).length === 0) {
        html = '<p>Aucune donnée de questionnaire trouvée.</p>';
    } else {
        for (const key in storedData) {
            if (storedData.hasOwnProperty(key) && key !== 'prev_data') {
                html += `<li style="margin-bottom: 5px;"><strong>${key.toUpperCase().replace(/_/g, ' ')}:</strong> ${storedData[key]}</li>`;
            }
        }
    }
    html += '</ul>';
    
    recapContainer.innerHTML = html;
    
    // Sauvegarde de l'objet final dans le localStorage (pour la page de recommandations inter-page)
    localStorage.setItem('finalFormData', JSON.stringify(storedData));
}

/**
 * Pour aller à la page finale de recommandations (inter-page).
 */
function goToNextPage(url) {
    // Le localStorage a déjà été mis à jour par displayRecapData()
    window.location.href = url;
}


// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de l'affichage
    const allSteps = document.querySelectorAll('.form-step');
    allSteps.forEach(step => step.classList.remove('active'));
    document.getElementById('step-1').classList.add('active');
    updateStepIndicator(1, 'Votre identifiant');
    
    // Nettoie le localStorage au démarrage pour un nouveau questionnaire propre
    localStorage.removeItem('finalFormData'); 
});

// Exposer les fonctions au contexte global (nécessaire pour les appels onclick dans le HTML)
window.goToStep = goToStep;
window.validateAndNavigate = validateAndNavigate;
window.handleHealthSubmission = handleHealthSubmission;
window.handleConditionalNavigation = handleConditionalNavigation;
window.goToNextPage = goToNextPage;
window.displayRecapData = displayRecapData;