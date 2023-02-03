import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const list = document.querySelector('.country-list');
const card = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(evt) {
  const country = evt.target.value.trim();
  if (!country.length) {
    // console.log('Это пустой импут запрос не делаю');
    toClearPage();
    return;
  }
  
  fetchCountries(country)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(renderListMarkup)
    .catch(onFetchError);
}

function renderListMarkup(countries) {
  // console.log('🚀 ~ countries', countries);
  let markup = '';
  if (countries.length >= 10) {
    toClearPage();
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  } else if (countries.length === 1) {
    markup = countries
      .map(
        ({
          name: { official },
          flags: { svg },
          capital,
          population,
          languages,
        }) => {
          const lang = Object.values(languages);
          return `<p class="counry-title"><img width="40" height="20" src=${svg}> ${official}</p>
        <p class="text">capital: <span class="span">${capital}</span></p>
        <p class="text">population: <span class="span">${population}</span></p>
        <p class="text">languages: <span class="span">${lang}</span></p>`;
        }
      )
      .join('');
    toClearPage();
    card.innerHTML = markup;
  } else {
    markup = countries
      .map(({ name: { official }, flags: { svg } }) => {
        // console.log(el);
        return `<li><img src=${svg} width="40" height="20"> ${official}</li>`;
      })
      .join('');
    toClearPage();
    list.innerHTML = markup;
    
  }
}

function onFetchError() {
  toClearPage();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function toClearPage() {
  card.innerHTML = '';
  list.innerHTML = '';
}