import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  clearOutput();

  if (!e.target.value) {
    return;
  }

  fetchCountries(e.target.value.trim())
    .then(data => {
      if (data.length > 10) {
        return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      }

      if (data.length > 1) {
        const markup = createListMarkup(data);
        addListMarkup(markup);
        return;
      }

      const markup = createCardMarkup(data[0]);
      addCardMarkup(markup);
    })
    .catch(() => Notiflix.Notify.failure('Oops, there is no country with that name'));
}

function clearOutput() {
  refs.list.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function createListMarkup(data) {
  return data
    .map(({ name, flags }) => {
      return `<li class='country'><img class='country-flag' src='${flags.svg}' alt='${name}'><p>${name}<p></li>`;
    })
    .join('');
}

function createCardMarkup(data) {
  const languages = data.languages.map(lang => lang.name);
  return `<h1><img class='country-flag' src='${data.flags.svg}' alt='${data.name}'>${
    data.name
  }</h1><ul><li><span>Capital: </span>${data.capital}</li><li><span>Poputalion: </span>${
    data.population
  }</li><li><span>Languages: </span>${languages.join(', ')}</li></ul>`;
}

function addListMarkup(markup) {
  refs.list.insertAdjacentHTML('beforeend', markup);
}

function addCardMarkup(markup) {
  refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}
