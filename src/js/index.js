import { fetchCountries } from './fetschCountries';

import '../css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const mainTitleEl = document.querySelector('.main-title');
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

mainTitleEl.textContent = 'Please enter name of country';

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const countryName = inputEl.value;

  if (countryName === '') {
    listEl.innerHTML = '';
    infoEl.innerHTML = '';
    return;
  }

  if (!countryName.trim()) {
    listEl.innerHTML = '';
    infoEl.innerHTML = '';
    Notiflix.Notify.info('The string must not be empty');
    return;
  }

  fetchCountries(countryName.trim())
    .then(onSuccess)
    .catch(error => {
      if (error.message === '404') {
        listEl.innerHTML = '';
        infoEl.innerHTML = '';
        Notiflix.Notify.warning('Oops, there is no country with that name');
      }
      console.log(error);
    });
}

function onSuccess(arr) {
  if (arr.length > 10) {
    Notiflix.Notify.failure(
      'Too many matches found. Please enter a more specific name'
    );
    listEl.innerHTML = '';
    infoEl.innerHTML = '';
    return;
  }

  if (arr.length === 1) {
    listEl.innerHTML = '';
    infoEl.innerHTML = '';
    createMarkupInfo(arr);
    return;
  }
  createMarkupList(arr);
}

function createMarkupList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `<li class = "country-item">
      <img class = "flag-img" src =${flags?.svg} alt =${flags?.alt}>
    <p class = "name-in-list">${name?.official}</p>
    </li>`;
    })
    .join('');
  infoEl.innerHTML = '';
  listEl.innerHTML = markup;
}

function createMarkupInfo(countries) {
  const markup = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `<div class = "main-wrapper"><img class = "flag-img" src = ${
        flags?.svg
      }> 
      <h2 class = "info-country-name">${name?.official}</h2>
      </div>
      <p class = "info-text"><b class = "info-title">Capital:</b>${capital}</p>
      <p class = "info-text"><b class = "info-title">Population:</b>${population}</p>
      <p class = "info-text"><b class = "info-title">Languages:</b>${Object.values(
        languages
      )}</p>`;
    })
    .join('');

  infoEl.innerHTML = markup;
}
