'use strict';
let exerciseObjArr = [];
const $searchForm = document.querySelector('#search-form');
const $views = document.querySelectorAll('section');
const $beginBtn = document.querySelector('#begin');
const $cardList = document.querySelector('.card-list');
const $header = document.querySelector('header');
const $hamburger = document.querySelector('.hamburger');
const $hamburgerLinks = document.querySelector('.hamburger-links');
const $noResults = document.querySelector('.no-results');
const $detailsTitle = document.querySelector('.details-title');
const $detailsImg = document.querySelector('#details-img');
const $detailsMusclePrim = document.querySelector('#details-muscle-prim');
const $detailsMuscleSec = document.querySelector('#details-muscle-sec');
const $detailsEquipment = document.querySelector('#details-equipment');
const $detailsDescription = document.querySelector('#details-description');
const $exerciseDetailSection = document.querySelector('#details-section');
let $exercisesNodeList;
if (!$searchForm) throw new Error('no search form found');
if (!$views) throw new Error('no views found');
if (!$beginBtn) throw new Error('no begin button found');
if (!$cardList) throw new Error('no card list found');
if (!$header) throw new Error('no header found');
if (!$noResults) throw new Error('no results not found');
if (!$detailsTitle) throw new Error('no title details found');
if (!$detailsImg) throw new Error('no img details found');
if (!$detailsMusclePrim) throw new Error('no prim muscle details found');
if (!$detailsMuscleSec) throw new Error('no sec muscle details found');
if (!$detailsEquipment) throw new Error('no equipment details found');
if (!$detailsDescription) throw new Error('no description details found');
if (!$exerciseDetailSection) throw new Error('no exercise view section found');
function renderExercises(exerciseObj) {
  const $card = document.createElement('div');
  $card.setAttribute('class', 'card flex space-between');
  $card.setAttribute('data-base-id', `${exerciseObj.baseId}`);
  const $cardImg = document.createElement('img');
  $cardImg.setAttribute('src', exerciseObj.image);
  $cardImg.setAttribute('class', 'card-img');
  const $cardText = document.createElement('div');
  $cardText.setAttribute('class', 'card-text');
  const $cardTitle = document.createElement('h3');
  $cardTitle.textContent = exerciseObj.name;
  const $heart = document.createElement('i');
  $heart.setAttribute('class', 'fa-regular fa-heart');
  $heart.setAttribute('style', 'color: #FFC300;');
  $cardText.appendChild($cardTitle);
  $card.appendChild($cardImg);
  $card.appendChild($cardText);
  $card.appendChild($heart);
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
    favorite: false,
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
    exerciseObjArr = [];
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
    $exercisesNodeList = document.querySelectorAll('.card');
    if (!$exercisesNodeList) throw new Error('no exercise nodelist found');
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
function findExerciseByBaseId(baseId) {
  for (const exercise of exerciseObjArr) {
    if (exercise.baseId === baseId) {
      return exercise;
    }
  }
  return null;
}
function handleFavoriteClick(exerciseObj, targetIcon) {
  if (targetIcon.classList.contains('fa-regular')) {
    // favorited the exercise
    targetIcon.classList.remove('fa-regular');
    targetIcon.classList.add('fa-solid');
    data.favorites.push(exerciseObj);
    exerciseObj.favorite = true;
  } else if (targetIcon.classList.contains('fa-solid')) {
    //unfavorited the exercise
    targetIcon.classList.remove('fa-solid');
    targetIcon.classList.add('fa-regular');
    exerciseObj.favorite = false;
    let indexToRemove = -1;
    for (let i = 0; i < data.favorites.length; i++) {
      if (data.favorites[i].baseId === exerciseObj.baseId) {
        indexToRemove = i;
      }
    }
    data.favorites.splice(indexToRemove, 1);
  }
  console.log(data.favorites);
  data.currentExercise.pop();
}
function populateExerciseDetails(baseId) {
  $exerciseDetailSection.setAttribute('data-base-id', `${baseId}`);
  let exercise = findExerciseByBaseId(baseId);
  if (!exercise) return;
  $detailsTitle.textContent = exercise.name + ' ';
  const $heart = document.createElement('i');
  if (exercise.favorite) $heart.setAttribute('class', 'fa-solid fa-heart');
  if (!exercise.favorite) $heart.setAttribute('class', 'fa-regular fa-heart');
  $heart.setAttribute('style', 'color: #FFC300;');
  $detailsTitle.appendChild($heart);
  $detailsImg.setAttribute('src', exercise.image);
  if (exercise.primaryMuscles.length > 0) {
    $detailsMusclePrim.textContent = '';
    for (const muscle of exercise.primaryMuscles) {
      $detailsMusclePrim.textContent += `${muscle.name}, `;
    }
  }
  if (exercise.secondaryMuscles.length > 0) {
    $detailsMuscleSec.textContent = '';
    for (const muscle of exercise.secondaryMuscles) {
      $detailsMuscleSec.textContent += `${muscle.name}, `;
    }
  }
  if (exercise.equipment.length > 0) {
    $detailsEquipment.textContent = '';
    for (const equipment of exercise.equipment) {
      $detailsEquipment.textContent += `${equipment.name}, `;
    }
  }
  $detailsDescription.innerHTML = exercise.description;
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
  console.log($eventTarget);
  if ($eventTarget.classList.contains('hamburger')) {
    $hamburger?.classList.toggle('hidden');
    $hamburgerLinks?.classList.toggle('hidden');
  } else if ($eventTarget.classList.contains('fa-x')) {
    $hamburger?.classList.toggle('hidden');
    $hamburgerLinks?.classList.toggle('hidden');
  } else if ($eventTarget.classList.contains('exercises-view-anchor')) {
    viewSwap('exercises-view');
    if ($eventTarget.classList.contains('hamburger-link')) {
      $hamburger?.classList.toggle('hidden');
      $hamburgerLinks?.classList.toggle('hidden');
    }
  }
});
$cardList.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if (
    $eventTarget.closest('.card-list > .card') &&
    $eventTarget.tagName !== 'I'
  ) {
    const $card = $eventTarget.closest('.card');
    if ($card.dataset.baseId) {
      const cardBaseId = $card.dataset.baseId;
      viewSwap('exercise-details');
      populateExerciseDetails(parseInt(cardBaseId));
    }
  }
});
document.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.tagName !== 'I') return;
  if ($eventTarget.closest('.card-list > .card')) {
    const $card = $eventTarget.closest('.card');
    if ($card.dataset.baseId) {
      const cardBaseId = parseInt($card.dataset.baseId);
      let exercise = findExerciseByBaseId(cardBaseId);
      if (exercise) data.currentExercise.push(exercise);
    }
    console.log('card heart clicked');
  } else {
    const $section = $eventTarget.closest('section.details');
    if ($section.dataset.baseId) {
      let exercise = findExerciseByBaseId(parseInt($section.dataset.baseId));
      if (exercise) data.currentExercise.push(exercise);
    }
  }
  handleFavoriteClick(data.currentExercise[0], $eventTarget);
  console.log(exerciseObjArr[0]);
});
