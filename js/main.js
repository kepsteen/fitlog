'use strict';
const $searchForm = document.querySelector('#search-form');
const $views = document.querySelectorAll('section');
const $beginBtn = document.querySelector('#begin');
const $cardList = document.querySelector('.card-list');
const $header = document.querySelector('header');
const $hamburger = document.querySelector('.hamburger');
const $hamburgerLinks = document.querySelector('.hamburger-links');
const $noResults = document.querySelector('.no-results');
if (!$searchForm) throw new Error('no search form found');
if (!$views) throw new Error('no views found');
if (!$beginBtn) throw new Error('no begin button found');
if (!$cardList) throw new Error('no card list found');
if (!$header) throw new Error('no header found');
if (!$noResults) throw new Error('no results not found');
function renderExercises(exerciseObj) {
  const $card = document.createElement('div');
  $card.setAttribute('class', 'card flex');
  const $cardImg = document.createElement('img');
  $cardImg.setAttribute('src', exerciseObj.image);
  $cardImg.setAttribute('class', 'card-img');
  const $cardText = document.createElement('div');
  $cardText.setAttribute('class', 'card-text');
  const $cardTitle = document.createElement('h3');
  $cardTitle.textContent = exerciseObj.name;
  const $cardCaption = document.createElement('p');
  $cardCaption.innerHTML = exerciseObj.description;
  $cardText.appendChild($cardTitle);
  $cardText.appendChild($cardCaption);
  $card.appendChild($cardImg);
  $card.appendChild($cardText);
  return $card;
}
async function fetchExerciseDetails(baseId, id, img) {
  const response = await fetch(
    `https://wger.de/api/v2/exercisebaseinfo/${baseId}/`,
  );
  if (!response.ok) {
    throw new Error(`HTTP Error: Status ${response.status}`);
  }
  const data = await response.json();
  const primaryMuscles = [];
  const secondaryMuscles = [];
  const equipment = [];
  let exerciseName = '';
  let exerciseDescription = '';
  for (const muscle of data.muscles) {
    primaryMuscles.push({
      name: muscle.name,
      nameEn: muscle.name_en,
      id: muscle.id,
    });
  }
  for (const muscle of data.muscles_secondary) {
    secondaryMuscles.push({
      name: muscle.name,
      nameEn: muscle.name_en,
      id: muscle.id,
    });
  }
  for (const exercise of data.exercises) {
    if (exercise.id === id) {
      exerciseName = exercise.name;
      exerciseDescription = exercise.description;
    }
  }
  for (const element of data.equipment) {
    equipment.push({
      id: element.id,
      name: element.name,
    });
  }
  const exerciseObj = {
    name: exerciseName,
    description: exerciseDescription,
    primaryMuscles,
    secondaryMuscles,
    equipment,
    baseId,
    image: img,
    id,
  };
  return exerciseObj;
}
async function fetchExerciseSearchData(term) {
  try {
    const response = await fetch(
      `https://wger.de/api/v2/exercise/search/?language=2&term=${term}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP Error: Status ${response.status}`);
    }
    const data = await response.json();
    const exerciseObjArr = [];
    for (let i = 0; i < data.suggestions.length; i++) {
      if (data.suggestions[i].data.image !== null) {
        const exerciseObj = await fetchExerciseDetails(
          data.suggestions[i].data.base_id,
          data.suggestions[i].data.id,
          'https://wger.de' + data.suggestions[i].data.image,
        );
        exerciseObjArr.push(exerciseObj);
      }
    }
    if (exerciseObjArr.length > 0) {
      exerciseObjArr.forEach((element) => {
        $cardList.appendChild(renderExercises(element));
      });
      $noResults?.classList.add('hidden');
    } else {
      $noResults?.classList.remove('hidden');
    }
  } catch (error) {
    console.log(error);
  }
}
function viewSwap(view) {
  for (let i = 0; i < $views.length; i++) {
    if ($views[i].dataset.view === view) {
      $views[i].classList.remove('hidden');
    } else {
      $views[i].classList.add('hidden');
    }
  }
}
function clearCardList() {
  while ($cardList.hasChildNodes()) {
    const child = $cardList.firstChild;
    $cardList.removeChild(child);
  }
}
$beginBtn.addEventListener('click', () => {
  viewSwap('exercises-view');
});
$searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearCardList();
  const $exerciseSearch = document.querySelector('#exercise-search');
  if (!$exerciseSearch) throw new Error('no exercise search input found');
  fetchExerciseSearchData($exerciseSearch.value);
  $searchForm.reset();
});
$header.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.classList.contains('hamburger')) {
    $hamburger?.classList.toggle('hidden');
    $hamburgerLinks?.classList.toggle('hidden');
  } else if ($eventTarget.classList.contains('fa-x')) {
    $hamburger?.classList.toggle('hidden');
    $hamburgerLinks?.classList.toggle('hidden');
  }
});
