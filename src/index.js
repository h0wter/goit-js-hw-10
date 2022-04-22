import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
};

refs.input.addEventListener('input', debounce(onInput, 300));

function onInput(e) {
  refs.list.innerHTML = '';
  if (!e.target.value) {
    return;
  }
  fetchCountries(e.target.value.trim())
    .then(data => {
      if (data.length > 10) {
        return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      }

      if (data.length > 1) {
        const markup = data
          .map(({ name, flags }) => {
            return `<li class='country'><img class='country-flag' src='${flags.svg}' alt='${name.common}'><p>${name.common}<p></li>`;
          })
          .join('');
        refs.list.insertAdjacentHTML('beforeend', markup);
        return;
      }
      const markup = `<h1><img class='country-flag' src='${data[0].flags.svg}' alt='${
        data[0].name.common
      }'>${data[0].name.common}</h1><ul><li><span>Capital: </span>${
        data[0].capital
      }</li><li><span>Poputalion: </span>${
        data[0].population
      }</li><li><span>Languages: </span>${Object.values(data[0].languages).join(', ')}</li></ul>`;
      refs.list.insertAdjacentHTML('beforeend', markup);
      console.log(data);
    })
    .catch(() => Notiflix.Notify.failure('Oops, there is no country with that name'));
}

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`,
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
