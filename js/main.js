'use strict';
const rootURL = 'https://wger.de/api/v2/';
console.log(rootURL);
const $searchForm = document.querySelector('#search-form');
if (!$searchForm) throw new Error('no search form found');
async function fetchExerciseSearchData(term) {
  try {
    const response = await fetch(
      `https://wger.de/api/v2/exercise/search/?language=2&term=${term}&limit=100`,
    );
    if (!response.ok) {
      throw new Error(`HTTP Error: Status ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
$searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const $exerciseSearch = document.querySelector('#exercise-search');
  if (!$exerciseSearch) throw new Error('no exercise search input found');
  fetchExerciseSearchData($exerciseSearch.value);
});
