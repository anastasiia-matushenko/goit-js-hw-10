import './css/styles.css';
import { fetchCountries } from "./js/fetchCountries";
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector("#search-box");
const list = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

searchBox.addEventListener("input", debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(evt) {
    const searchValue = evt.target.value.trim();
    clearList();
   
    if (!searchValue) {
        return;
    }
    
    fetchCountries(searchValue)
        .then(response => {
            if (response.length > 10) {
                return Notify.info("Too many matches found. Please enter a more specific name.");
            }
                
            if (response.length >= 2 && response.length <= 10) {
                createList(response);
                return;
            }
                
            if (response.length === 1) {
                createCard(response);
                return;
            }  
        })
        .catch(onError);
};

function createList(countries) {
    const countryList = countries.reduce((acc, {
        name: { official },
        flags: { svg }
    }) =>
    acc +
        `<li class="country-item">
            <img src="${svg}" alt="flag" width="30">
            <span>${official}</span>   
        </li>`
    , "");

    list.insertAdjacentHTML("beforeend", countryList);
}

function createCard(arr) {
    const countryCard = arr.reduce((acc, {
        name: { official },
        flags: { svg },
        capital,
        population,
        languages }) =>
    acc +
        `<p class="country-name">
            <img src="${svg}" alt="flag" width="30">
            <span>${official}</span>
        </p>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages).join(", ")}</p>`
    , "");

    countryInfo.insertAdjacentHTML("beforeend", countryCard);
}

function clearList() {
    list.innerHTML = "";
    countryInfo.innerHTML = "";
};

function onError() {
    return Notify.failure("Oops, there is no country with that name");
};
