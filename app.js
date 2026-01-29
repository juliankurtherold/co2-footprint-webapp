// app.js
// Einstiegspunkt für unsere CO₂-Webanwendung

// Beispiel-Datensatz (fiktive Werte – erweitern wir später)
const EMISSIONS_DATA = [
  {
    country: "Germany",
    company: "GreenCorp",
    sector: "Energie",
    year: 2023,
    emissions: 120.5
  },
  {
    country: "Germany",
    company: "AutoTech AG",
    sector: "Automobil",
    year: 2023,
    emissions: 210.3
  },
  {
    country: "USA",
    company: "MegaOil Inc.",
    sector: "Öl & Gas",
    year: 2023,
    emissions: 980.1
  },
  {
    country: "France",
    company: "NuClear SA",
    sector: "Energie",
    year: 2023,
    emissions: 80.2
  }
];

// Hilfsfunktion zum sicheren Einfügen von Text (verhindert injizierten Code)
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Tabelle beim Laden der Seite befüllen
document.addEventListener("DOMContentLoaded", () => {
  renderTable(EMISSIONS_DATA);
});

function renderTable(data) {
  const tbody = document.querySelector("#emissions-table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  data.forEach((row) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${escapeHTML(row.country)}</td>
      <td>${escapeHTML(row.company)}</td>
      <td>${escapeHTML(row.sector)}</td>
      <td>${escapeHTML(row.year)}</td>
      <td>${escapeHTML(row.emissions)}</td>
    `;

    tbody.appendChild(tr);
  });
}