export const getCountries = async () => {
  try {
    const res = await axios.get(
      "https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region"
    );
    return res.data;
  } catch (error) {
    console.error("Error while fetching rest countries", error);
    return [];
  }
};

export const searchCountryWithName = async (countryName) => {
  try {
    const res = await axios.get(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    return res.data;
  } catch (error) {
    console.error("Error while fetching rest countries based on name", error);
    return [];
  }
};

export const searchCountriesWithRegion = async (region) => {
  try {
    const res = await axios.get(
      `https://restcountries.com/v3.1/region/${region}`
    );
    return res.data;
  } catch (error) {
    console.error("Error while fetching rest countries based on region", error);
    return [];
  }
};
