import './css/styles.css';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  evt.preventDefault();
  const countryName = evt.target.value.trim();
  clearCountryList();
  clearCuontryInfoContainer();

  if (!countryName) {
    clearCountryList();
    return;
  }
  fetchCountries(countryName)
    .then(response => {
      if (response.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      return response;
    })
    .then(response => {
      if (response && response.length >= 2 && response.length <= 10) {
        countryList.insertAdjacentHTML(
          'beforeend',
          renderCountryList(response)
        );
      }
      return response;
    })
    .then(response => {
      if (response && response.length == 1) {
        countryInfo.insertAdjacentHTML(
          'beforeend',
          renderCountryInfo(response)
        );
      }
    });
}
function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1';

  return fetch(`${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages
`).then(response => response.json());
}

function makeCountryItemMarkup({ name, flags }) {
  return `
    <li class="country-item">
    <img src="${flags.svg}" alt="flag of ${name.official}" width="30">
    <p class="country-name">${name.official}</p>
    </li>
    `;
}

function renderCountryList(response) {
  return response.map(makeCountryItemMarkup).join('');
}
function makeCountryInfoMarkup({
  name,
  capital,
  population,
  flags,
  languages,
}) {
  const lang = Object.values(languages).join(', ');
  return `
      <div class="country-wraper">
      <img src="${flags.svg}" alt="flag of ${name.official}" width="30" />
      <p class="country-info-name">${name.official}</p>
    </div>
    <p class="country-info-title">
      Capital: <span class="country-info-text">${capital}</span>
    </p>
    <p class="country-info-title">
      Population: <span class="country-info-text">${population}</span>
    </p>
    <p class="country-info-title">
      Languages: <span class="country-info-text">${lang}</span>
    </p>
    `;
}
function renderCountryInfo(response) {
  return response.map(makeCountryInfoMarkup).join('');
}
function clearCountryList() {
  countryList.innerHTML = '';
}
function clearCuontryInfoContainer() {
  countryInfo.innerHTML = '';
}
