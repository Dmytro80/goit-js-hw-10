import './css/styles.css';
import { fetchCountries } from './api-service';
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
        renderCountryList(response);
      }
      return response;
    })
    .then(response => {
      if (response && response.length == 1) {
        renderCountryInfo(response);
      }
    })
    .catch(Error => Notify.failure('Oops, there is no country with that name'));
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
  const countryListMarkup = response.map(makeCountryItemMarkup).join('');
  return countryList.insertAdjacentHTML('beforeend', countryListMarkup);
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
  const countryInfoMarkup = response.map(makeCountryInfoMarkup).join('');
  return countryInfo.insertAdjacentHTML('beforeend', countryInfoMarkup);
}
function clearCountryList() {
  countryList.innerHTML = '';
}
function clearCuontryInfoContainer() {
  countryInfo.innerHTML = '';
}
