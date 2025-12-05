
        // --- ÉTATS DU QUESTIONNAIRE ---
        // Liste ordonnée des ID d'étapes à parcourir. Les étapes dynamiques y seront insérées.
        let stepQueue = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7', 'step-summary'];
        let currentStepIndex = 0;
        
        const formData = {}; // Objet pour stocker les réponses (en mémoire seulement)

        // Définition des étapes conditionnelles pour chaque problème de santé
        const conditionalSteps = {
            'Douleurs au dos/Lombaires': ['dos-q1', 'dos-q2', 'dos-q3'],
            'Douleurs aux Genoux/Articulaires': ['genoux-q1', 'genoux-q2', 'genoux-q3'],
            'Problèmes de sommeil/Stress': ['sommeil-q1', 'sommeil-q2', 'sommeil-q3'],
            'Problèmes de circulation/Jambes lourdes': ['circulation-q1', 'circulation-q2', 'circulation-q3'],
            'Perte de masse musculaire': ['muscles-q1', 'muscles-q2', 'muscles-q3'],
        };

        // --- RÉFÉRENCES DOM ---
        const stepsContainer = document.getElementById('steps-container');
        const progressBar = document.getElementById('progress-bar');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const stepTitleEl = document.getElementById('step-title');
        const summaryDataEl = document.getElementById('summary-data');
        const submitButton = document.getElementById('submit-button');


        // --- GESTION DU QUESTIONNAIRE (Logique multi-étapes) ---
        
        // Met à jour la barre de progression et les boutons de navigation
        const updateUI = () => {
            const currentStepId = stepQueue[currentStepIndex];
            // La progression est calculée sur le nombre total d'étapes (y compris les étapes dynamiques et le résumé)
            const progress = currentStepIndex / (stepQueue.length - 1) * 100;
            
            progressBar.style.width = `${progress}%`;
            
            prevBtn.disabled = currentStepIndex === 0;
            // Le bouton Suivant est désactivé si l'étape n'est pas validée ou si c'est l'étape de résumé
            nextBtn.disabled = currentStepId === 'step-summary' || !window.validateStep(currentStepId);
            
            if (currentStepId === 'step-summary') {
                nextBtn.classList.add('hidden');
                submitButton.classList.remove('hidden');
                window.updateSummary();
            } else {
                nextBtn.classList.remove('hidden');
                submitButton.classList.add('hidden');
            }

            // Met à jour le titre affichant le numéro de l'étape par rapport au total dynamique
            const stepNumber = currentStepIndex + 1;
            const total = stepQueue.length;
            stepTitleEl.textContent = `Étape ${stepNumber} sur ${total}`;
        };

        // Affiche la bonne 'page' (étape)
        const renderStep = (index) => {
            document.querySelectorAll('.step-content').forEach(el => {
                el.classList.remove('active');
            });
            const currentStepId = stepQueue[index];
            const nextStepEl = document.getElementById(currentStepId);
            if (nextStepEl) {
                nextStepEl.classList.add('active');
            }
            window.updateUI();
        };

        // Rendre les fonctions accessibles globalement
        window.updateUI = updateUI;
        window.renderStep = renderStep;

        // Collecte les données de l'étape courante
        const collectData = (stepId) => {
            let value = null;
            let key = null;

            switch (stepId) {
                case 'step-1':
                    key = 'pseudo';
                    value = document.getElementById('input-pseudo').value.trim();
                    break;
                case 'step-2':
                    key = 'age_range';
                    const selectedAgeRange = document.querySelector('input[name="age_range"]:checked');
                    value = selectedAgeRange ? selectedAgeRange.value : null;
                    break;
                case 'step-3':
                    // Collecte des champs multiples pour cette étape
                    formData['taille_haut'] = document.getElementById('input-taille-haut').value.trim();
                    formData['taille_bas'] = document.getElementById('input-taille-bas').value.trim();
                    formData['pointure_chaussure'] = document.getElementById('input-pointure').value;
                    return; // Sort car le traitement de formData est déjà fait ci-dessus
                case 'step-4':
                    key = 'frequence_sport';
                    const selectedFreq = document.querySelector('input[name="sport_freq"]:checked');
                    value = selectedFreq ? selectedFreq.value : null;
                    break;
                case 'step-5':
                    key = 'maladies';
                    const selectedMaladies = Array.from(document.querySelectorAll('input[name="maladie"]:checked'))
                                                  .map(cb => cb.value);
                    value = selectedMaladies.join(', '); // Stocke sous forme de chaîne CSV
                    break;
                case 'step-6':
                    key = 'type_travail';
                    const selectedTravail = document.querySelector('input[name="type_travail"]:checked');
                    value = selectedTravail ? selectedTravail.value : null;
                    break;
                case 'step-7':
                    key = 'poste_travail';
                    const selectedPoste = document.querySelector('input[name="poste_travail"]:checked');
                    value = selectedPoste ? selectedPoste.value : null;
                    break;
                // Questions Dos (dynamiques)
                case 'dos-q1':
                    key = 'dos_q1_contexte_douleur';
                    value = document.querySelector('input[name="dos_q1"]:checked')?.value || null;
                    break;
                case 'dos-q2':
                    key = 'dos_q2_type_mouvement';
                    value = document.querySelector('input[name="dos_q2"]:checked')?.value || null;
                    break;
                case 'dos-q3':
                    key = 'dos_q3_type_soutien';
                    value = document.querySelector('input[name="dos_q3"]:checked')?.value || null;
                    break;
                // Questions Genoux (dynamiques)
                case 'genoux-q1':
                    key = 'genoux_q1_type_douleur';
                    value = document.querySelector('input[name="genoux_q1"]:checked')?.value || null;
                    break;
                case 'genoux-q2':
                    key = 'genoux_q2_mouvement_aggravant';
                    value = document.querySelector('input[name="genoux_q2"]:checked')?.value || null;
                    break;
                case 'genoux-q3':
                    key = 'genoux_q3_support';
                    value = document.querySelector('input[name="genoux_q3"]:checked')?.value || null;
                    break;
                // Questions Sommeil (dynamiques)
                case 'sommeil-q1':
                    key = 'sommeil_q1_frequence_trouble';
                    value = document.querySelector('input[name="sommeil_q1"]:checked')?.value || null;
                    break;
                case 'sommeil-q2':
                    key = 'sommeil_q2_manifestation';
                    value = document.querySelector('input[name="sommeil_q2"]:checked')?.value || null;
                    break;
                case 'sommeil-q3':
                    key = 'sommeil_q3_activite_recherchee';
                    value = document.querySelector('input[name="sommeil_q3"]:checked')?.value || null;
                    break;
                // Questions Circulation (dynamiques)
                case 'circulation-q1':
                    key = 'circulation_q1_moment_gene';
                    value = document.querySelector('input[name="circulation_q1"]:checked')?.value || null;
                    break;
                case 'circulation-q2':
                    key = 'circulation_q2_temperature';
                    value = document.querySelector('input[name="circulation_q2"]:checked')?.value || null;
                    break;
                case 'circulation-q3':
                    key = 'circulation_q3_activite_soulagement';
                    value = document.querySelector('input[name="circulation_q3"]:checked')?.value || null;
                    break;
                // Questions Muscles (dynamiques)
                case 'muscles-q1':
                    key = 'muscles_q1_objectif_principal';
                    value = document.querySelector('input[name="muscles_q1"]:checked')?.value || null;
                    break;
                case 'muscles-q2':
                    key = 'muscles_q2_type_exercice';
                    value = document.querySelector('input[name="muscles_q2"]:checked')?.value || null;
                    break;
                case 'muscles-q3':
                    key = 'muscles_q3_lieu_entrainement';
                    value = document.querySelector('input[name="muscles_q3"]:checked')?.value || null;
                    break;
            }
            // Sauvegarde la valeur si une clé et une valeur non nulles sont trouvées
            if (key && value !== null) {
                formData[key] = value;
            }
        };

        window.collectData = collectData; // Rendre accessible globalement

        // Valide l'étape courante (ajoute/retire les messages d'erreur)
        const validateStep = (stepId) => {
            let isValid = false;
            // Masque tous les messages d'erreur à chaque validation
            document.querySelectorAll(`[id^='error-']`).forEach(el => el.classList.add('hidden'));

            switch (stepId) {
                case 'step-1':
                    const pseudo = document.getElementById('input-pseudo').value.trim();
                    isValid = pseudo.length > 2;
                    if (!isValid) document.getElementById('error-pseudo').classList.remove('hidden');
                    break;
                case 'step-2':
                    isValid = !!document.querySelector('input[name="age_range"]:checked');
                    if (!isValid) document.getElementById('error-age').classList.remove('hidden');
                    break;
                case 'step-3':
                    const haut = document.getElementById('input-taille-haut').value.trim();
                    const bas = document.getElementById('input-taille-bas').value.trim();
                    const pointure = document.getElementById('input-pointure').value;
                    isValid = haut.length > 0 && bas.length > 0 && pointure && parseInt(pointure, 10) >= 20;
                    if (!isValid) document.getElementById('error-taille').classList.remove('hidden');
                    break;
                case 'step-4':
                    isValid = !!document.querySelector('input[name="sport_freq"]:checked');
                    if (!isValid) document.getElementById('error-sport').classList.remove('hidden');
                    break;
                case 'step-5':
                    // On permet de passer même sans cocher, mais on pourrait rendre obligatoire
                    isValid = true;
                    break;
                case 'step-6':
                    isValid = !!document.querySelector('input[name="type_travail"]:checked');
                    if (!isValid) document.getElementById('error-travail').classList.remove('hidden');
                    break;
                case 'step-7':
                    isValid = !!document.querySelector('input[name="poste_travail"]:checked');
                    if (!isValid) document.getElementById('error-poste').classList.remove('hidden');
                    break;
                // Logique pour les questions dynamiques (Doit avoir un choix fait)
                case 'dos-q1': case 'dos-q2': case 'dos-q3':
                case 'genoux-q1': case 'genoux-q2': case 'genoux-q3':
                case 'sommeil-q1': case 'sommeil-q2': case 'sommeil-q3':
                case 'circulation-q1': case 'circulation-q2': case 'circulation-q3':
                case 'muscles-q1': case 'muscles-q2': case 'muscles-q3':
                    const radioGroupName = stepId.replace('-', '_').replace('-q', '_q').split('_').slice(0, 2).join('_');
                    isValid = !!document.querySelector(`input[name="${radioGroupName}"]:checked`);
                    if (!isValid) document.getElementById(`error-${stepId}`).classList.remove('hidden');
                    break;
                case 'step-summary':
                    isValid = true;
                    break;
            }
            return isValid;
        };
        
        window.validateStep = validateStep; // Rendre accessible globalement

        // Construit la file d'attente d'étapes en fonction des sélections de maladies
        const buildStepQueue = () => {
            // Recommence avec les étapes de base jusqu'à l'étape 7
            let newQueue = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7'];
            
            // Récupère les maladies sélectionnées (depuis l'objet formData qui a été mis à jour à l'étape 5)
            const selectedMaladies = formData.maladies ? formData.maladies.split(', ').filter(m => m.length > 0) : [];

            // Insère les étapes conditionnelles si une maladie correspondante est sélectionnée
            for (const maladie of selectedMaladies) {
                if (conditionalSteps[maladie]) {
                    newQueue = newQueue.concat(conditionalSteps[maladie]);
                }
            }

            // Ajoute toujours l'étape de résumé à la fin
            newQueue.push('step-summary');
            
            stepQueue = newQueue;
            console.log("File d'étapes mise à jour (dynamique):", stepQueue);
        };
        
        // Passe à l'étape suivante
        window.nextStep = () => {
            const currentStepId = stepQueue[currentStepIndex];

            if (currentStepIndex < stepQueue.length - 1) {
                // 1. Validation de l'étape actuelle
                if (!window.validateStep(currentStepId)) {
                    // AJOUT D'UN MESSAGE D'ERREUR CLAIR DANS LA CONSOLE
                    console.error(`Validation échouée pour l'étape ${currentStepIndex + 1} (${currentStepId}). Veuillez remplir tous les champs obligatoires.`);
                    return;
                }
                
                // 2. Collecte des données de l'étape actuelle
                window.collectData(currentStepId);
                
                // 3. LOGIQUE DYNAMIQUE: Après l'Étape 5 (Maladies), on construit le parcours
                if (currentStepId === 'step-5') {
                    buildStepQueue();
                }

                // 4. Passage à l'étape suivante
                currentStepIndex++;
                window.renderStep(currentStepIndex);
            }
        };

        // Revient à l'étape précédente
        window.prevStep = () => {
            if (currentStepIndex > 0) {
                currentStepIndex--;
                window.renderStep(currentStepIndex);
            }
        };

        // Met à jour le résumé final
        window.updateSummary = () => {
            let summaryHTML = `<p class="mb-2"><strong class="font-semibold text-blue-600">Pseudo:</strong> ${formData.pseudo || 'N/A'}</p>`;
            
            // Labels de traduction pour l'affichage
            const labels = {
                age_range: "Tranche d'Âge",
                taille_haut: "Taille Vêtement Haut",
                taille_bas: "Taille Vêtement Bas",
                pointure_chaussure: "Pointure Chaussures",
                frequence_sport: "Fréquence Sportive",
                maladies: "Problèmes de Santé (Sélection)",
                type_travail: "Type de Travail",
                poste_travail: "Poste de Travail",
                // Labels spécifiques aux questions dynamiques
                dos_q1_contexte_douleur: "Dos : Contexte de la douleur",
                dos_q2_type_mouvement: "Dos : Type de mouvement aggravant",
                dos_q3_type_soutien: "Dos : Type de soutien",
                genoux_q1_type_douleur: "Genoux : Type de douleur",
                genoux_q2_mouvement_aggravant: "Genoux : Mouvement aggravant",
                genoux_q3_support: "Genoux : Support recherché",
                sommeil_q1_frequence_trouble: "Sommeil : Fréquence du trouble",
                sommeil_q2_manifestation: "Sommeil : Manifestation principale",
                sommeil_q3_activite_recherchee: "Sommeil : Activité recherchée",
                circulation_q1_moment_gene: "Circulation : Moment de la gêne",
                circulation_q2_temperature: "Circulation : Influence de la température",
                circulation_q3_activite_soulagement: "Circulation : Activité de soulagement",
                muscles_q1_objectif_principal: "Muscles : Objectif principal",
                muscles_q2_type_exercice: "Muscles : Type d'exercice préféré",
                muscles_q3_lieu_entrainement: "Muscles : Lieu d'entraînement",
            };

            // Ajout des réponses au résumé
            for (const key in formData) {
                if (formData.hasOwnProperty(key) && key !== 'pseudo') {
                    summaryHTML += `<p><strong class="font-medium text-gray-700">${labels[key] || key}:</strong> ${formData[key] || 'Non renseigné'}</p>`;
                }
            }

            summaryDataEl.innerHTML = summaryHTML;
            submitButton.disabled = false;
        };


        // --- SOUMISSION DES DONNÉES (SIMPLE AFFICHAGE AU LIEU DE LA BDD) ---
        window.submitForm = () => {
            submitButton.disabled = true;
            document.getElementById('error-message').classList.add('hidden');
            
            // Simule la soumission
            document.getElementById('status-message').textContent = `✅ Réponses collectées en mémoire ! Prêt à passer à l'étape de sauvegarde de la base de données.`;
            document.getElementById('status-message').classList.remove('hidden');
            
            console.log("Données du formulaire (en mémoire) :", formData);
        };


        // --- DÉMARRAGE DE L'APPLICATION ---
        window.renderStep(currentStepIndex); // Affiche la première étape
        
        // Écouteur pour la validation en temps réel
        stepsContainer.addEventListener('input', (event) => {
            // S'assure de ne valider que l'étape active
            if (event.target.closest(`.step-content.active`)) {
                window.updateUI();
            }
        });
        