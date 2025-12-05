// ==========================================================
// FICHIER: app.js
// Logique Centralisée pour le Questionnaire SPA (Single Page Application)
// INCLUT L'EASTER EGG, LE ROUTAGE ET LA GESTION DE LA TOUCHE ENTER
// ==========================================================

const form = document.getElementById('questionnaire-form');
const stepIndicator = document.getElementById('step-indicator');
const totalSteps = 9; 

// ==========================================================
// 1. FONCTIONS DE NAVIGATION ET VALIDATION
// ==========================================================

function updateStepIndicator(currentStep, stepTitle) {
    if (currentStep <= totalSteps) {
        stepIndicator.textContent = `Étape ${currentStep} sur ${totalSteps} : ${stepTitle}`;
    } else {
        stepIndicator.textContent = `Étape Finale : ${stepTitle}`;
    }
}

function goToStep(currentId, nextId, nextTitle) {
    const currentStep = document.getElementById(`step-${currentId}`);
    const nextStep = document.getElementById(`step-${nextId}`);
    
    if (currentStep) currentStep.classList.remove('active');
    if (nextStep) nextStep.classList.add('active');

    updateStepIndicator(nextId, nextTitle);
    
    if (nextId === 10) {
        displayRecapData();
    }
}

/**
 * Valide l'étape 1 et vérifie le pseudo pour l'Easter Egg.
 */
function validatePseudoAndNavigate() {
    const currentId = 1;
    const pseudoInput = document.querySelector('#step-1 input[name="pseudo"]');
    
    // 1. Validation de la longueur du pseudo (obligatoire car l'input a 'required')
    if (!pseudoInput || !pseudoInput.checkValidity()) {
        pseudoInput.reportValidity();
        return;
    }
    
    // 2. Vérification de l'Easter Egg
    const pseudo = pseudoInput.value.toLowerCase().trim();
    const forbiddenPseudos = ['intersport', 'nike', 'adidas'];

    if (forbiddenPseudos.includes(pseudo)) {
        // Collecte la seule donnée 'pseudo' avant de naviguer hors du SPA
        const formData = new FormData(form);
        let storedData = {};
        for (const [key, value] of formData.entries()) {
            storedData[key] = value;
        }
        localStorage.setItem('finalFormData', JSON.stringify(storedData));
        
        // Redirection vers le profil "Rebut de la Société"
        window.location.href = 'recommandations-rebut.html';
        return; 
    }

    // 3. Navigation normale (vers l'étape 2)
    goToStep(1, 2, 'Votre Sexe');
}

function validateAndNavigate(currentId, nextId, nextTitle) {
    const currentStepElement = document.getElementById(`step-${currentId}`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.type !== 'radio' && input.value.trim() === '') { isValid = false; input.reportValidity(); }
    });

    currentStepElement.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (radio.required) {
            const groupName = radio.name;
            if (!currentStepElement.querySelector(`input[name="${groupName}"]:checked`)) {
                isValid = false;
                if (radio === currentStepElement.querySelector(`input[name="${groupName}"]`)) { radio.reportValidity(); }
            }
        }
    });

    if (isValid) { goToStep(currentId, nextId, nextTitle); }
}

function handleHealthSubmission() {
    const checkboxes = document.querySelectorAll('#step-6 input[name="sante_choix"]:checked');
    let selectedProblems = [];
    checkboxes.forEach(cb => { selectedProblems.push(cb.value); });

    const maladiesChoisieInput = document.getElementById('maladies-choisies');
    maladiesChoisieInput.value = selectedProblems.join('; ');
    
    goToStep(6, 7, 'Environnement de travail');
}


function handleConditionalNavigation() {
    const currentId = 7;
    const currentStepElement = document.getElementById(`step-${currentId}`);
    const radioChecked = currentStepElement.querySelector('input[name="environnement_travail"]:checked');
    
    if (!radioChecked) { currentStepElement.querySelector('input[name="environnement_travail"]').reportValidity(); return; }

    const selectedValue = radioChecked.value;
    let nextId;
    let nextTitle;

    // LOGIQUE DE SAUT : (Étudiant, Retraite, Chômage/Inactif sautent les étapes 8 et 9)
    if (selectedValue === 'Retraite' || selectedValue === 'Chômage/Inactif' || selectedValue === 'Étudiant') {
        nextId = 10; 
        nextTitle = 'Votre Profil de Bien-être';
    } else {
        nextId = 8; 
        nextTitle = 'Posture de Travail';
    }
    
    goToStep(currentId, nextId, nextTitle);
}


// ==========================================================
// 2. ROUTAGE ET COLLECTE DES DONNÉES
// ==========================================================

function displayRecapData() {
    const recapContainer = document.getElementById('recap-data-container');
    const formData = new FormData(form);
    if (!recapContainer) return;

    let storedData = {};
    for (const [key, value] of formData.entries()) {
        if (key === 'sante_choix') continue; 
        storedData[key] = value;
    }
    
    localStorage.setItem('finalFormData', JSON.stringify(storedData));
    
    // TEMPORAIRE : AFFICHE LES DONNÉES BRUTES
    let html = '<h3>Données collectées (pour vérification) :</h3>';
    html += '<ul style="list-style-type: disc; padding-left: 20px;">';
    for (const key in storedData) {
        if (storedData.hasOwnProperty(key) && key !== 'prev_data') {
            html += `<li style="margin-bottom: 5px;"><strong>${key.toUpperCase().replace(/_/g, ' ')}:</strong> ${storedData[key]}</li>`;
        }
    }
    html += '</ul>';
    
    recapContainer.innerHTML = html; 
}

function getProfile(data) {
    const age = data.age_range;
    const sportFreq = data.frequence_sport;
    const sante = data.maladies_choisies ? data.maladies_choisies.split(';').length : 0;
    const posture = data.poste_posture;
    const envTravail = data.environnement_travail;

    // Aides pour la lecture des conditions
    const isUnder35 = (age === '18-25' || age === '26-35');
    const is35 = (age === '36-50'); 
    const isSport4Plus = (sportFreq === 'Plus de 4 fois');
    const isSportLess1 = (sportFreq === 'Moins de 1 fois');
    const isSport1To4 = (sportFreq === '1 à 4 fois');
    const isLowHealthIssue = (sante <= 1);
    const isWorkAssis = (posture === 'Assis');
    const isWorkDebout = (posture === 'Debout');
    const isNoWork = (envTravail === 'Étudiant' || envTravail === 'Retraite' || envTravail === 'Chômage/Inactif');


    // --- Profils basés sur les conditions strictes (ordre important) ---

    // 1. Profil "Sportif"
    if (isUnder35 && isSport4Plus && isLowHealthIssue && (isWorkAssis || isWorkDebout)) {
        return 'Sportif';
    }

    // 2. Profil "Crise de la quarantaine"
    if (is35 && isSport4Plus) { 
        return 'CriseDeLaQuarantaine';
    }

    // 3. Profil "Flemmard"
    if (isUnder35 && isSportLess1 && isLowHealthIssue && isWorkAssis) {
        return 'Flemmard';
    }

    // 4. Profil "Bolosse"
    if (isSport1To4 && isNoWork) {
        return 'Bolosse';
    }
    
    // 5. Profil "Mid" (Reste des personnes, utilisé comme par défaut)
    return 'Mid';
}


function goToNextPage() {
    const storedDataJSON = localStorage.getItem('finalFormData');
    const storedData = storedDataJSON ? JSON.parse(storedDataJSON) : {};
    
    const profile = getProfile(storedData); 

    let destinationUrl = '';

    switch (profile) {
        case 'Flemmard':
            destinationUrl = 'recommandations-flemmard.html';
            break;
        case 'Sportif':
            destinationUrl = 'recommandations-sportif.html';
            break;
        case 'Bolosse':
            destinationUrl = 'recommandations-bolosse.html';
            break;
        case 'CriseDeLaQuarantaine':
            destinationUrl = 'recommandations-crise-quarantaine.html';
            break;
        case 'Mid':
        default: 
            destinationUrl = 'recommandations-mid.html';
    }
    
    window.location.href = destinationUrl;
}


// ==========================================================
// 3. GESTION DES ÉVÉNEMENTS CLAVIER (TOUCHE ENTRÉE)
// ==========================================================

function handleKeyPress(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        event.preventDefault(); 
        
        const activeStepElement = document.querySelector('.form-step.active');
        if (!activeStepElement) return;

        const nextButton = activeStepElement.querySelector('.btn-primary');
        
        if (nextButton) {
            nextButton.click();
        }
    }
}

// ==========================================================
// 4. INITIALISATION
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialisation de l'affichage (étape 1)
    const allSteps = document.querySelectorAll('.form-step');
    allSteps.forEach(step => step.classList.remove('active'));
    
    // Déclenche la fonction de validation spécifique pour l'étape 1 via le bouton
    const startStep = document.getElementById('step-1');
    if(startStep) {
        startStep.classList.add('active');
        updateStepIndicator(1, 'Votre identifiant');
    }
    
    // 2. Nettoie le localStorage
    localStorage.removeItem('finalFormData'); 
    
    // 3. ATTACHE L'ÉCOUTEUR DE TOUCHE AU FORMULAIRE
    const currentForm = document.getElementById('questionnaire-form');
    if (currentForm) {
        currentForm.addEventListener('keypress', handleKeyPress);
    }
});

// ==========================================================
// 5. EXPOSITION DES FONCTIONS AU CONTEXTE GLOBAL
// ==========================================================
window.goToStep = goToStep;
window.validateAndNavigate = validateAndNavigate;
window.handleHealthSubmission = handleHealthSubmission;
window.handleConditionalNavigation = handleConditionalNavigation;
window.goToNextPage = goToNextPage;
window.displayRecapData = displayRecapData;
window.validatePseudoAndNavigate = validatePseudoAndNavigate; // NOUVELLE FONCTION EXPOSÉE