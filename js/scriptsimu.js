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