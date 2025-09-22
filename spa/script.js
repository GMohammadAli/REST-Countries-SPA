import {
  getCountries,
  searchCountriesWithRegion,
  searchCountryWithName,
} from "../api/ApiService.js";

// Sources -> https://developer.mozilla.org/en-US/docs/Web/API/History_API

const countriesListingInitialDOMContent = `
    <!-- Navbar -->
    <header class="flex justify-between items-center p-6 shadow-md bg-white">
      <h1 class="text-xl font-bold">REST Countries SPA (Vanilla JS)</h1>
    </header>
    <div class="flex flex-col sm:flex-row justify-between p-6 gap-6">
      <!-- Search Bar with Icon -->
      <div class="relative w-full sm:w-1/3">
        <!-- Icon -->
        <span
          class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"
        >
          <!-- Heroicons Search Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
            />
          </svg>
        </span>

        <!-- Input -->
        <input
          type="text"
          placeholder="Search for a country..."
          class="w-full pl-10 p-3 rounded shadow outline-none border border-gray-200 focus:ring-2 focus:ring-blue-400"
          id="search-bar"
        />
      </div>

      <!-- Region Selector -->
      <div>
        <label for="regionSelect" class="sr-only">Filter By Region</label>
        <select
          id="regionSelect"
          class="p-3 rounded shadow outline-none border border-gray-200 focus:ring-2 focus:ring-blue-400 w-52"
        >
          <option value="">Filter by Region</option>
          <option value="africa">Africa</option>
          <option value="america">America</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="oceania">Oceania</option>
        </select>
      </div>
    </div>

    <!-- Countries Grid -->
    <main
      class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 px-6 pb-10"
      id="main-content"
    >
      Loading...
    </main>`;

const countryDetailsInitialDOMContent = `<!-- Navbar -->
    <header class="flex justify-between items-center p-6 shadow-md bg-white">
      <h1 class="text-xl font-bold">Where in the world?</h1>
      <button class="flex items-center gap-2">🌙 Dark Mode</button>
    </header>

    <div class="max-w-6xl mx-auto p-6">
      <button
        id="country-back-button-twice"
        class="px-5 py-2 mb-8 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
      >
        Go Back 2 pages
      </button>

      <!-- Back button -->
      <button
        id="country-back-button"
        class="px-5 py-2 mb-8 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
      >
        Back
      </button>

      <button
        id="country-forward-button"
        class="px-5 py-2 mb-8 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
      >
        Forward
      </button>

      <button
        id="country-forward-button-twice"
        class="px-5 py-2 mb-8 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
      >
        Go Forward 2 pages
      </button>

      <button
        id="country-list-button"
        class="px-5 py-2 mb-8 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100"
      >
        Country Listing
      </button>

      <div
        class="country-details-card flex flex-col md:flex-row gap-12 items-start"
      >
        Loading...
      </div>
    </div>`;

const routes = {
  "#/": {
    pageName: "countries-listing",
    initialDOMContent: countriesListingInitialDOMContent,
  },
  "#/country": {
    pageName: "country-details",
    initialDOMContent: countryDetailsInitialDOMContent,
  },
};

const loadInitialDOM = (routeKey) => {
  document.body.innerHTML = routes[routeKey].initialDOMContent;
};

const navigateToPage = (hash) => {
  console.log({ loc: location.hash, hash: hash });
  location.hash = hash; // updates URL
};

/* Country Listing Code - Start */
const loadCountriesListIntoDOM = async () => {
  loadCountriesIntoDOM();
  let timeoutID = null;

  document.getElementById("search-bar").addEventListener("input", (e) => {
    if (timeoutID) clearTimeout(timeoutID);
    const value = e.target.value;
    //debounced search api calls, reduces load on the server
    timeoutID = setTimeout(() => fetchAndRenderFilteredCountries(value), 500);
  });

  document.getElementById("regionSelect").addEventListener("input", (e) => {
    const value = e.target.value;
    fetchAndRenderFilteredCountries(value, true);
  });

  document.getElementById("main-content").addEventListener("click", (e) => {
    const card = e.target.closest(".country-card");
    if (card) {
      const countryName = card.querySelector("h2")?.innerText;
      console.log("Clicked country:", countryName);
      navigateToPage(`/country?countryName=${countryName.toLowerCase()}`);
    }
  });
};

const loadCountriesIntoDOM = async () => {
  const countriesData = await getCountries();

  if (!countriesData) return;

  replaceDOM(countriesData);
};

const replaceDOM = (countriesData) => {
  const DOMContent =
    !countriesData || countriesData.length <= 0
      ? `<div> No Results Found</div>`
      : countriesData
          .map(
            (
              country
            ) => `<div class="country-card bg-white rounded-lg shadow-md overflow-hidden" data-code="${
              country.name?.common
            }">
        <img
          src=${country.flags?.svg}
          alt=${country.name?.common}
          class="w-full h-40 object-cover"
        />
        <div class="p-6">
          <h2 class="text-lg font-bold mb-4"> ${
            country.name?.common || "Unknown"
          }</h2>
          <p><span class="font-semibold">Population:</span> ${
            country.population
          }</p>
          <p><span class="font-semibold">Region:</span> ${country.region}</p>
          <p><span class="font-semibold">Capital:</span> ${
            country.capital?.join(",") || "Unknown"
          }</p>
        </div>
      </div>`
          )
          .join("");

  const mainElement = document.getElementById("main-content");
  mainElement.innerHTML = DOMContent;
};

const fetchAndRenderFilteredCountries = async (
  value,
  isRegionSearch = false
) => {
  if (!value) return loadCountriesIntoDOM();
  const filteredCountries = isRegionSearch
    ? await searchCountriesWithRegion(value)
    : await searchCountryWithName(value);

  replaceDOM(filteredCountries);
};

/* Country Listings Code - End */

/* Country Details Code - Start */

const getBorderCountryDetails = async (borders) => {
  if (!borders || borders.length === 0) return [];

  const promises = borders.map(async (border) => {
    const result = await searchCountryWithName(border);
    return result[0] || null;
  });

  return Promise.all(promises);
};

const loadCountryDOM = async (countryName) => {
  const country = (await searchCountryWithName(countryName))[0];

  if (!country) return;

  const currencies = Object.keys(country?.currencies).join(", ");
  const languages = Object.values(country?.languages).join(", ");

  const nativeName =
    country.name?.nativeName[Object.keys(country.name?.nativeName).pop()]
      .common;

  //pre-fetching border country details
  const borderCountryDetails = (
    await getBorderCountryDetails(country?.borders)
  ).filter((val) => !!val);

  const DOMContent = `<div class="country-details-card flex flex-col md:flex-row gap-12 items-start">
        <!-- Flag -->
        <img
          src=${country.flags?.svg}
          alt=${country.name?.common}
          class="w-full md:w-1/2 rounded-md shadow-md"
        />

        <!-- Info -->
        <div class="flex-1">
          <h2 class="text-3xl font-bold mb-6"> ${
            country.name?.common || "Unknown"
          }</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div class="space-y-2">
              <p><span class="font-semibold">Native Name:</span> ${nativeName}</p>
              <p><span class="font-semibold">Population:</span> ${
                country.population
              }</p>
              <p><span class="font-semibold">Region:</span> ${
                country.region
              }</p>
              <p>
                <span class="font-semibold">Sub Region:</span> ${
                  country.subregion
                }
              </p>
              <p><span class="font-semibold">Capital:</span> ${
                country.capital?.join(",") || "Unknown"
              }</p>
            </div>
            <div class="space-y-2">
              <p><span class="font-semibold">Top Level Domain:</span> ${country.tld.join(
                ", "
              )}</p>
              <p><span class="font-semibold">Currencies:</span> ${currencies} </p>
              <p>
                <span class="font-semibold">Languages:</span> ${languages}
              </p>
            </div>
          </div>
          
          <!-- Border Countries -->
              ${
                Object.keys(borderCountryDetails).length > 0
                  ? `<div id="border-countries" class="flex flex-wrap items-center gap-2">
                    <span class="font-semibold">Border Countries:</span>
                    ${borderCountryDetails
                      .map(
                        (borderCountry) =>
                          `<button class="border-country-card px-4 py-1 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100">
                                ${borderCountry.name?.common}
                            </button>`
                      )
                      .join("")}
                  </div>`
                  : ""
              }
        </div>
      </div>`;

  const mainElement = document.getElementsByClassName(
    "country-details-card"
  )[0];
  mainElement.innerHTML = DOMContent;
};

const loadCountryDetailsIntoDOM = () => {
  const params = new URLSearchParams(location.hash.split("?")[1]);
  const countryName = params.get("countryName");

  console.log("Country:", countryName);

  loadCountryDOM(countryName);

  document
    .getElementById("country-back-button")
    .addEventListener("click", (e) => {
      // history.go(-1);
      history.back();
    });
  document
    .getElementById("country-back-button-twice")
    .addEventListener("click", (e) => {
      history.go(-2);
    });
  document
    .getElementById("country-forward-button")
    .addEventListener("click", () => {
      // history.go(1);
      history.forward();
    });
  document
    .getElementById("country-forward-button-twice")
    .addEventListener("click", () => {
      history.go(2);
    });

  document
    .getElementById("country-list-button")
    .addEventListener("click", () => {
      navigateToPage("/");
    });

  document.body.addEventListener("click", (e) => {
    const card = e.target.closest(".border-country-card");
    console.log("Clicked: ", card);
    if (card) {
      const countryName = card.innerText.trim();
      console.log("Clicked border country:", countryName);
      navigateToPage(`/country?countryName=${countryName.toLowerCase()}`);
    }
  });
};

/* Country Details Code - End */
const renderRoute = () => {
  // extract hash route without query string
  const routeKey = location.hash.split("?")[0];
  const route = routes[routeKey] || routes["#/"];

  loadInitialDOM(routeKey || "#/");

  switch (route.pageName) {
    case "country-details":
      loadCountryDetailsIntoDOM();
      break;
    case "countries-listing":
    default:
      loadCountriesListIntoDOM();
      break;
  }
};

window.addEventListener("DOMContentLoaded", renderRoute);

// Handle back/forward navigation from browser
// as well as forward and back buttons click
window.addEventListener("hashchange", renderRoute);
