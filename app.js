// app.js
// Logik für CO₂-Emissions-Tabelle: Daten, Filter, Sortierung, Layout

"use strict";

// Fiktive Emissionsdaten (Beispieldatensätze)
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
    country: "Germany",
    company: "SteelWorks GmbH",
    sector: "Industrie",
    year: 2022,
    emissions: 350.9
  },
  {
    country: "USA",
    company: "MegaOil Inc.",
    sector: "Öl & Gas",
    year: 2023,
    emissions: 980.1
  },
  {
    country: "USA",
    company: "CleanEnergy Co.",
    sector: "Energie",
    year: 2022,
    emissions: 150.4
  },
  {
    country: "France",
    company: "NuClear SA",
    sector: "Energie",
    year: 2023,
    emissions: 80.2
  },
  {
    country: "Japan",
    company: "Techno Motors",
    sector: "Automobil",
    year: 2023,
    emissions: 190.7
  },
  {
    country: "India",
    company: "CoalPower Ltd.",
    sector: "Energie",
    year: 2023,
    emissions: 730.0
  }
];

// Zustand für Sortierung und Filter
let currentSort = {
  key: null,
  direction: "asc" // "asc" oder "desc"
};

let currentFilter = {
  country: "",
  company: ""
};

// Sicheres Einfügen von Text (Schutz vor injiziertem Code)
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Initialisierung nach Laden des Dokuments
document.addEventListener("DOMContentLoaded", () => {
  applyLanguageLayout();
  setupSorting();
  setupFiltering();
  applyFiltersAndSort();
});

// Ausrichtung des lokalen Menüs je nach Sprache/Schriftkultur
function applyLanguageLayout() {
  const rtlLanguages = ["ar", "he", "fa", "ur"];
  const htmlLang = (document.documentElement.lang || navigator.language || "").toLowerCase();
  const langCode = htmlLang.split("-")[0];

  if (rtlLanguages.includes(langCode)) {
    document.body.classList.add("rtl-layout");
  }
}

// Tabelle rendern
function renderTable(data) {
  const tbody = document.querySelector("#emissions-table tbody");
  const noResults = document.getElementById("no-results");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    if (noResults) {
      noResults.classList.remove("d-none");
    }
    return;
  }

  if (noResults) {
    noResults.classList.add("d-none");
  }

  data.forEach((row) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${escapeHTML(row.country)}</td>
      <td>${escapeHTML(row.company)}</td>
      <td>${escapeHTML(row.sector)}</td>
      <td>${escapeHTML(row.year)}</td>
      <td>${escapeHTML(row.emissions.toFixed(1))}</td>
    `;

    tbody.appendChild(tr);
  });
}

// Sortierlogik für Tabelle
function setupSorting() {
  const headers = document.querySelectorAll("#emissions-table thead th[data-sort-key]");
  headers.forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sortKey;
      if (!key) return;

      if (currentSort.key === key) {
        // Richtung umdrehen
        currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
      } else {
        currentSort.key = key;
        currentSort.direction = "asc";
      }

      updateSortIndicators();
      applyFiltersAndSort();
    });
  });
}

// Filterlogik (Formular)
function setupFiltering() {
  const form = document.getElementById("filter-form");
  const resetButton = document.getElementById("reset-filters");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const countryInput = document.getElementById("country-filter");
      const companyInput = document.getElementById("company-filter");

      currentFilter.country = (countryInput?.value || "").trim().toLowerCase();
      currentFilter.company = (companyInput?.value || "").trim().toLowerCase();

      applyFiltersAndSort();
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      const countryInput = document.getElementById("country-filter");
      const companyInput = document.getElementById("company-filter");

      if (countryInput) countryInput.value = "";
      if (companyInput) companyInput.value = "";

      currentFilter.country = "";
      currentFilter.company = "";

      applyFiltersAndSort();
    });
  }
}

// Filter + Sortierung gemeinsam anwenden
function applyFiltersAndSort() {
  let result = EMISSIONS_DATA.filter((row) => {
    const countryMatches =
      !currentFilter.country ||
      row.country.toLowerCase().includes(currentFilter.country);
    const companyMatches =
      !currentFilter.company ||
      row.company.toLowerCase().includes(currentFilter.company);

    return countryMatches && companyMatches;
  });

  if (currentSort.key) {
    result = sortData(result, currentSort.key, currentSort.direction);
  }

  renderTable(result);
}

// Datensätze nach Spalte sortieren
function sortData(data, key, direction) {
  const sorted = [...data];

  sorted.sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (typeof valueA === "number" && typeof valueB === "number") {
      return direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    const textA = String(valueA).toLowerCase();
    const textB = String(valueB).toLowerCase();

    if (textA < textB) return direction === "asc" ? -1 : 1;
    if (textA > textB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
}

// Sortier-Indikatoren im Tabellenkopf aktualisieren
function updateSortIndicators() {
  const headers = document.querySelectorAll("#emissions-table thead th[data-sort-key]");
  headers.forEach((th) => {
    const label = th.dataset.label || th.textContent.trim();
    th.classList.remove("sort-active");

    if (currentSort.key === th.dataset.sortKey) {
      const arrow = currentSort.direction === "asc" ? "▲" : "▼";
      th.textContent = `${label} ${arrow}`;
      th.classList.add("sort-active");
    } else {
      th.textContent = label;
    }
  });
}