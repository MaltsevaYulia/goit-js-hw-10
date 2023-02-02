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

  fetchCountries(country).then(renderListMarkup).catch(onFetchError);
}

function renderListMarkup(countries) {
  console.log('🚀 ~ countries', countries);
  let markup = '';
  if (countries.length >= 10) {
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
          return `<p class="counry-title"><svg width="40" height="20"><use href=${svg}></use></svg> ${official}</p>
        <p>capital: ${capital}</p>
        <p>population: ${population}</p>
        <p>languages: ${languages}</p>`;
        }
      )
      .join('');
    card.innerHTML = markup;
  } else {
    markup = countries
      .map(({ name: { official }, flags: { svg } }) => {
        // console.log(el);

        return `<li><svg width="40" height="20"><use href=${svg}></use></svg> ${official}</li>`;
      })
      .join('');
    list.innerHTML = markup;
  }
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
