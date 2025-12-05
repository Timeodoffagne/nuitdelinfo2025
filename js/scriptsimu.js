const slider = document.getElementById("prixNeuf");
const output = document.getElementById("prixOutput");

const labels = [
  "-200€", "200-400€", "400-600€", "600-800€", 
  "800-1000€", "1000-1250€", "1250-1500€", 
  "1500-1750€", "1750-2000€", "+2000€"
];

slider.addEventListener("input", function() {
  output.textContent = "Tranche sélectionnée : " + labels[this.value];
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".simulation-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Effacer les anciens résultats
        const oldResult = document.querySelector(".resultats");
        if (oldResult) oldResult.remove();

        // Récupération des valeurs
        const numPc = parseInt(document.getElementById("numPc").value);
        const tauxRecond = parseInt(document.getElementById("tauxRecond").value) / 100;
        const horizon = parseInt(document.getElementById("horizon").value);
        const profilUsage = document.getElementById("profilUsage").value;
        const prixwindows = parseFloat(document.getElementById("prixwindows").value);
        const poidpc = parseFloat(document.getElementById("poidpc").value);
        const prixTranche = parseInt(document.getElementById("prixNeuf").value);

        // Table de prix médian par tranche
        const prixMedians = [200, 300, 500, 700, 900, 1150, 1350, 1600, 1900, 2200];
        const prixNeuf = prixMedians[prixTranche];

        // Coefficients selon usage
        let alpha, bonusVie;
        switch (profilUsage) {
            case "college": alpha = 0.20; bonusVie = 3; break;
            case "lycee": alpha = 0.25; bonusVie = 2; break;
            case "universite": alpha = 0.30; bonusVie = 1.5; break;
        }

        // Calculs
        const nbRecond = Math.round(numPc * tauxRecond);
        const prixRecond = alpha * prixNeuf;

        const economiePC = nbRecond * (prixNeuf - prixRecond);
        const economieLicence = nbRecond * prixwindows;
        const economieTotale = (economiePC + economieLicence) * Math.floor(horizon / (5)); // cycles de 5 ans

        // Déchets évités
        const dechetsEvites = nbRecond * poidpc;

        // Pollution évitée (réaliste : 200–300 kg fabrication vs ~40 recond)
        let co2Fabrication = poidpc <= 3 ? 200 : 300;
        let co2Recond = 40;
        const co2EviteUnit = co2Fabrication - co2Recond;
        const co2EviteTotal = nbRecond * co2EviteUnit;

        // Bonus
        const kmVoiture = Math.round(co2EviteTotal / 0.2);
        const arbres = Math.round(co2EviteTotal / 25);

        // Affichage
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("resultats");
        resultDiv.innerHTML = `
            <h2>Résultats de la simulation</h2>
            <p>Argent économisé : <strong>${economieTotale.toFixed(2)} €</strong></p>
            <p>Déchets évités : <strong>${dechetsEvites.toFixed(1)} kg</strong></p>
            <p>Pollution évitée : <strong>${co2EviteTotal.toFixed(1)} kg de CO₂</strong></p>
            <p>Temps supplémentaire gagné par PC : <strong>${bonusVie} ans</strong></p>
            <p>Nombre de PC reconditionnés : <strong>${nbRecond}</strong></p>
            <p>Équivalent de la pollution d'une voiture économisé : <strong>${kmVoiture} km</strong></p>
            <p>Équivalent arbres : <strong>${arbres} arbres</strong></p>
        `;
        form.appendChild(resultDiv);
    });
});