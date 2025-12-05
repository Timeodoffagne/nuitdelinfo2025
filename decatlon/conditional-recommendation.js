function generateConditionalArticles() {
    const storedDataJSON = localStorage.getItem('finalFormData');
    const data = storedDataJSON ? JSON.parse(storedDataJSON) : {};
    
    // Conteneur où les articles conditionnels seront injectés (doit exister dans vos HTML)
    const container = document.getElementById('conditional-recommendations'); 
    
    if (!container) return;

    let htmlContent = '';
    
    //Pour la lecture des données
    const maladies = data.maladies_choisies || '';
    const envTravail = data.environnement_travail;
    const posture = data.poste_posture;
    const chargesLourdes = data.poste_charges_lourdes;

    
    htmlContent += '<h3>Articles de Santé & Bien-être (Basés sur vos préoccupations)</h3>';
    let santeArticlesFound = false;

    // Condition: Stress
    if (maladies.includes('Problèmes de stress/anxiété')) {
        htmlContent += `
            <div class="recommendation-item">
                <h4>Soulagement du Stress : Gélule Rhodiola Rosea</h4>
                <p>Pour l'anti-stress et la relaxation.</p>
                <a href="https://www.decathlon.fr/p/mp/nutrietco/rhodiola-rosea-bio-anti-stress-fatigue-anxiete-et-relaxation-60-gelules/_/R-p-69a3d95d-92c3-42b9-be6f-658e7b912194?mc=69a3d95d-92c3-42b9-be6f-658e7b912194_g78&fl=Neutre" target="_blank" title="Soulagement du Stress : Gélule Rhodiola Rosea">
                        <img 
                            src="../image/decathlon/Maladie/gelule_anti_stress.avif" 
                            alt="Pour l'anti-stress et la relaxation" 
                            style="width: 100%; max-width: 200px; height: auto; border-radius: 8px; cursor: pointer; display: block;"
                        />
                </a>
            </div>
        `;
        santeArticlesFound = true;
    }
    
    // Condition: Articulation
    if (maladies.includes("Problèmes d'articulation")) {
        htmlContent += `
            <div class="recommendation-item">
                <h4>Soutien Articulaire : Kit Tapes Kinésiologie</h4>
                <p>Bandes prédécoupées pour le soutien des articulations, tendons et muscles.</p>
                <a href="https://www.decathlon.fr/p/kit-de-tapes-kinesiologie-predecoupes-articulations-tendons-et-muscles/_/R-p-197323?mc=8781238" target="_blank" title="Soutien Articulaire : Kit Tapes Kinésiologie ">
                        <img 
                            src="../image/decathlon/maladie/tapes_articulations.avif" 
                            alt="Bandes prédécoupées pour le soutien des articulations, tendons et muscles" 
                            style="width: 100%; max-width: 200px; height: auto; border-radius: 8px; cursor: pointer; display: block;"
                        />
                </a>
            </div>
        `;
        santeArticlesFound = true;
    }

    // Condition: Sommeil
    if (maladies.includes('Problèmes de sommeil')) {
        htmlContent += `
            <div class="recommendation-item">
                <h4>Aide au Sommeil : Mélatonine Spray</h4>
                <p>Pour l'endormissement et le sommeil.</p>
                <a href="https://www.decathlon.fr/p/mp/nutrietco/melatonine-1-9mg-endormissement-sommeil-et-jetlag-format-spray-20ml/_/R-p-12d5d783-08a2-487e-9c1e-e51704141eb0?mc=12d5d783-08a2-487e-9c1e-e51704141eb0_g116&fl=Vanille" target="_blank" title="Aide au Sommeil : Mélatonine Spray ">
                        <img 
                            src="../image/decathlon/maladie/melatonine.avif" 
                            alt="Pour l'endormissement et le sommeil" 
                            style="width: 100%; max-width: 200px; height: auto; border-radius: 8px; cursor: pointer; display: block;"
                        />
                </a>
            </div>
        `;
        santeArticlesFound = true;
    }

    if (!santeArticlesFound) {
        htmlContent += '<p>— Aucune recommandation de santé spécifique nécessaire. —</p>';
    }
    
    
    htmlContent += '<h3>Articles Posture & Travail (Basés sur votre environnement)</h3>';
    let travailArticlesFound = false;

    // Condition: Travail en extérieur (si environnement est Physique)
    if (envTravail === 'Physique') {
        htmlContent += `
            <div class="recommendation-item">
                <h4>Travail Actif/Extérieur : Chaussures XA Pro 3D V9 GTX</h4>
                <p>Chaussures d'extérieur imperméables et robustes.</p>
                <a href="https://www.decathlon.fr/p/mp/salomon/chaussures-d-exterieur-salomon-xa-pro-3d-v9-gtx-adulte/_/R-p-44022a55-f149-48a5-bf5b-79de0f909700?mc=44022a55-f149-48a5-bf5b-79de0f909700_c1c1" target="_blank" title="Travail Actif/Extérieur : Chaussures XA Pro 3D V9 GTX ">
                        <img 
                            src="../image/decathlon/Travail/chaussure_running.avif" 
                            alt="Chaussures d'extérieur imperméables et robustes." 
                            style="width: 100%; max-width: 200px; height: auto; border-radius: 8px; cursor: pointer; display: block;"
                        />
                </a>
            </div>
        `;
        travailArticlesFound = true;
    }

    // Condition: Travail en intérieur (si environnement est Bureau)
    if (envTravail === 'Bureau') {
        htmlContent += `
            <div class="recommendation-item">
                <h4>Travail Assis/Intérieur : Ceinture Lombaire Correctrice</h4>
                <p>Ceinture pour soutenir la zone lombaire et corriger la posture.</p>
                <a href="https://www.decathlon.fr/p/ceinture-lombaire-adulte-correcteur-de-posture-noir/_/R-p-X8811950?mc=8811950" target="_blank" title="Travail Assis/Intérieur : Ceinture Lombaire Correctrice">
                        <img 
                            src="../image/decathlon/Travail/ceinture_lombaire.avif" 
                            alt="Ceinture pour soutenir la zone lombaire et corriger la posture." 
                            style="width: 100%; max-width: 200px; height: auto; border-radius: 8px; cursor: pointer; display: block;"
                        />
                </a>
                </div>
        `;
        travailArticlesFound = true;
    }
    
    // Condition: Posture Assis
    if (posture === 'Assis') { // Note: La posture Assis s'applique souvent au Bureau, mais peut être un complément.
        htmlContent += `
            <div class="recommendation-item">
                <h4>Poste Assis : Gym Ball (taille 1)</h4>
                <p>Idéal pour remplacer la chaise et renforcer les muscles du tronc.</p>
                <a href="https://www.decathlon.fr/p/gym-ball-taille-1-resistant-55-cm-rose/_/R-p-328533?mc=8603633&c=bleu" target="_blank" title="Poste Assis : Gym Ball (taille 1)">
                        <img 
                            src="../image/decathlon/Travail/gym_ball.avif" 
                            alt="Idéal pour remplacer la chaise et renforcer les muscles du tronc." 
                            style="width: 100%; max-width: 200px; height: auto; border-radius: 8px; cursor: pointer; display: block;"
                        />
                </a>
            </div>
        `;
        travailArticlesFound = true;
    }
    
    // Condition: Posture Debout
    if (posture === 'Debout') {
        htmlContent += `
            <div class="recommendation-item">
                <h4>Poste Debout : Matelas de Massage</h4>
                <p>Pour la détente après une longue journée debout.</p>
                <a href="https://www.decathlon.fr/p/mp/innovagoods/matelas-de-massage-par-vibration-innovagoods/_/R-p-e7824053-1b37-44c7-a1cd-7ad85170a3e1?mc=e7824053-1b37-44c7-a1cd-7ad85170a3e1_c255" target="_blank" title="Poste Debout : Matelas de Massage">
                        <img 
                            src="../image/decathlon/Travail/matelas_massant.avif" 
                            alt="Pour la détente après une longue journée debout." 
                            style="width: 100%; max-width: 200px; height: auto; border-radius: 8px; cursor: pointer; display: block;"
                        />
                </a>
            </div>
        `;
        travailArticlesFound = true;
    }

    // Condition: Charges Lourdes (Prioritaire)
    if (chargesLourdes === 'Oui') {
        htmlContent += `
            <div class="recommendation-item highlight">
                <h4>SÉCURITÉ : Ceinture de Maintien Lombaire</h4>
                <p>Si vous portez du lourd, le soutien du bas du dos est essentiel.</p>
                <a href="https://www.decathlon.fr/p/ceinture-de-maintien-lombaire-avec-straps-reglables-niveau-4/_/R-p-364449?mc=8941379&utm_source=chatgpt.com" target="_blank" title="SÉCURITÉ : Ceinture de Maintien Lombaire">
                        <img 
                            src="../image/decathlon/Travail/ceinture_dos.avif" 
                            alt="Si vous portez du lourd, le soutien du bas du dos est essentiel" 
                            style="width: 100%; max-width: 200px; height: auto; border-radius: 8px; cursor: pointer; display: block;"
                        />
                </a>
            </div>
        `;
        travailArticlesFound = true;
    }


    // 3. Insérer le contenu final
    if (container) {
        container.innerHTML = htmlContent;
    }
}

// Assurez-vous que le script s'exécute une fois que la page est chargée.
document.addEventListener('DOMContentLoaded', generateConditionalArticles);