// app.js
// Interaktionslogik für CO₂-Emissionsdaten mit Vue 3

"use strict";

const { createApp } = Vue;

const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];

createApp({
  data() {
    return {
      emissions: [
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
      ],
      sortKey: null,
      sortDirection: "asc",
      filterCountry: "",
      filterCompany: ""
    };
  },
  computed: {
    normalizedFilterCountry() {
      return this.filterCountry.trim().toLowerCase();
    },
    normalizedFilterCompany() {
      return this.filterCompany.trim().toLowerCase();
    },
    filteredAndSortedEmissions() {
      let result = this.emissions.filter((row) => {
        const countryMatches =
          !this.normalizedFilterCountry ||
          row.country.toLowerCase().includes(this.normalizedFilterCountry);

        const companyMatches =
          !this.normalizedFilterCompany ||
          row.company.toLowerCase().includes(this.normalizedFilterCompany);

        return countryMatches && companyMatches;
      });

      if (!this.sortKey) {
        return result;
      }

      const key = this.sortKey;
      const direction = this.sortDirection;

      return [...result].sort((a, b) => {
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
    }
  },
  methods: {
    setSort(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortKey = key;
        this.sortDirection = "asc";
      }
    },
    headerLabel(key, baseLabel) {
      if (this.sortKey !== key) {
        return baseLabel;
      }
      const arrow = this.sortDirection === "asc" ? " ▲" : " ▼";
      return baseLabel + arrow;
    },
    resetFilters() {
      this.filterCountry = "";
      this.filterCompany = "";
    },
    applyLanguageLayout() {
      const htmlLang = (document.documentElement.lang || navigator.language || "").toLowerCase();
      const langCode = htmlLang.split("-")[0];

      if (RTL_LANGUAGES.includes(langCode)) {
        document.body.classList.add("rtl-layout");
      } else {
        document.body.classList.remove("rtl-layout");
      }
    }
  },
  mounted() {
    this.applyLanguageLayout();
  }
}).mount("#app");