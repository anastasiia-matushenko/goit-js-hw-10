export function fetchCountries(country) {
    const BASE_URL = "https://restcountries.com/v3.1/";
    const endPoint = "name/";
    const fields = "name,capital,flags,population,languages"

    return fetch(`${BASE_URL}${endPoint}${country}?fields=${fields}`)
        .then(resp => {
            if (!resp.ok) {
                throw new Error();
            }
            return resp.json();
        });
};

