'use strict';
let exerciseObjArr = [];
const $searchForm = document.querySelector('#search-form');
const $views = document.querySelectorAll('section');
const $beginBtn = document.querySelector('#begin');
const $exercisesCardList = document.querySelector('#exercises-card-list');
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
const $detailsHeart = document.querySelector('.title-container > .fa-heart');
const $favoritesCardList = document.querySelector('#favorites-card-list');
const $favoritesCta = document.querySelector('#favorites-cta');
const $newWorkoutForm = document.querySelector('.new-workout-form');
const $addExerciseBtn = document.querySelector('.add-exercise-btn');
const $addExerciseModal = document.querySelector('.add-exercise-modal');
const $addExerciseForm = document.querySelector('#add-exercise-form');
if (!$searchForm) throw new Error('no search form found');
if (!$views) throw new Error('no views found');
if (!$beginBtn) throw new Error('no begin button found');
if (!$exercisesCardList) throw new Error('no card list found');
if (!$header) throw new Error('no header found');
if (!$noResults) throw new Error('no results not found');
if (!$detailsTitle) throw new Error('no title details found');
if (!$detailsImg) throw new Error('no img details found');
if (!$detailsMusclePrim) throw new Error('no prim muscle details found');
if (!$detailsMuscleSec) throw new Error('no sec muscle details found');
if (!$detailsEquipment) throw new Error('no equipment details found');
if (!$detailsDescription) throw new Error('no description details found');
if (!$exerciseDetailSection) throw new Error('no exercise view section found');
if (!$detailsHeart) throw new Error('no heart found');
if (!$favoritesCardList) throw new Error('no favorite cardlist found');
if (!$favoritesCta) throw new Error('no favorites cta found');
if (!$newWorkoutForm) throw new Error('no new workout form');
if (!$addExerciseBtn) throw new Error('no add exercise btn found');
if (!$addExerciseModal) throw new Error('no add exercise modal found');
if (!$addExerciseForm) throw new Error('no add exercise form found');
function renderExercises(exerciseObj) {
  const $card = document.createElement('div');
  $card.setAttribute('class', 'card flex space-between');
  $card.setAttribute('data-base-id', `${exerciseObj.baseId}`);
  const $cardImg = document.createElement('img');
  $cardImg.setAttribute('src', exerciseObj.image);
  $cardImg.setAttribute('class', 'card-img');
  const $cardText = document.createElement('div');
  $cardText.setAttribute('class', 'card-text flex flex-col space-between');
  const $cardTitle = document.createElement('h3');
  $cardTitle.textContent = exerciseObj.name;
  const $cardIcons = document.createElement('div');
  $cardIcons.setAttribute('class', 'card-icons flex justify-end');
  const $heart = document.createElement('i');
  if (exerciseObj.favorite) {
    $heart.setAttribute('class', 'fa-solid fa-heart');
  } else {
    $heart.setAttribute('class', 'fa-regular fa-heart');
  }
  $heart.setAttribute('style', 'color: #FFC300;');
  const $pencil = document.createElement('i');
  $pencil.setAttribute('class', 'fa-solid fa-pen-to-square');
  $pencil.setAttribute('style', 'color: #001d3d');
  $cardIcons.appendChild($pencil);
  $cardIcons.appendChild($heart);
  $cardText.appendChild($cardTitle);
  $cardText.appendChild($cardIcons);
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
  let favorited = false;
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
  for (const element of fitlogData.favorites) {
    if (baseId === element.baseId) {
      favorited = true;
    }
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
    favorite: favorited,
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
        $exercisesCardList.appendChild(renderExercises(element));
      });
      $noResults?.classList.add('hidden');
    } else {
      $noResults?.classList.remove('hidden');
    }
  } catch (error) {
    console.error(error);
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
  while ($exercisesCardList.hasChildNodes()) {
    const child = $exercisesCardList.firstChild;
    $exercisesCardList.removeChild(child);
  }
}
function findExerciseByBaseId(baseId) {
  for (const exercise of exerciseObjArr) {
    if (exercise.baseId === baseId) {
      return exercise;
    }
  }
  for (const exercise of fitlogData.favorites) {
    if (exercise.baseId === baseId) {
      return exercise;
    }
  }
  return null;
}
function handleFavoriteClick(exerciseObj, targetIcon) {
  const $favoritesNodeList = document.querySelectorAll(
    '#favorites-card-list > .card',
  );
  if (!$favoritesNodeList) throw new Error('no favorites node list found');
  if (targetIcon.classList.contains('fa-regular')) {
    targetIcon.classList.remove('fa-regular');
    targetIcon.classList.add('fa-solid');
    exerciseObj.favorite = true;
    fitlogData.favorites.push(exerciseObj);
    $favoritesCardList.appendChild(renderExercises(exerciseObj));
    $favoritesCta.classList.add('hidden');
  } else if (targetIcon.classList.contains('fa-solid')) {
    targetIcon.classList.remove('fa-solid');
    targetIcon.classList.add('fa-regular');
    exerciseObj.favorite = false;
    let indexToRemove = -1;
    for (let i = 0; i < fitlogData.favorites.length; i++) {
      if (fitlogData.favorites[i].baseId === exerciseObj.baseId) {
        indexToRemove = i;
      }
    }
    fitlogData.favorites.splice(indexToRemove, 1);
    for (let i = 0; i < $favoritesNodeList.length; i++) {
      const nodeBaseId = $favoritesNodeList[i].dataset.baseId;
      if (parseInt(nodeBaseId) === exerciseObj.baseId) {
        $favoritesCardList.removeChild($favoritesNodeList[i]);
      }
    }
    if (fitlogData.favorites.length === 0)
      $favoritesCta.classList.remove('hidden');
  }
  const $exercisesNodeList = document.querySelectorAll(
    '#exercises-card-list > .card',
  );
  if (!$exercisesNodeList) throw new Error('no exercise nodelist found');
  for (let i = 0; i < $exercisesNodeList.length; i++) {
    const nodeBaseId = $exercisesNodeList[i].dataset.baseId;
    if (parseInt(nodeBaseId) === exerciseObj.baseId) {
      const $heartIcon = $exercisesNodeList[i].lastElementChild;
      if (exerciseObj.favorite) {
        $heartIcon?.classList.remove('fa-regular');
        $heartIcon?.classList.add('fa-solid');
      } else {
        $heartIcon?.classList.add('fa-regular');
        $heartIcon?.classList.remove('fa-solid');
      }
    }
  }
}
function populateExerciseDetails(exercise) {
  $exerciseDetailSection.setAttribute('data-base-id', `${exercise.baseId}`);
  $detailsTitle.textContent = exercise.name + ' ';
  if (exercise.favorite)
    $detailsHeart.setAttribute('class', 'fa-solid fa-heart');
  if (!exercise.favorite)
    $detailsHeart.setAttribute('class', 'fa-regular fa-heart');
  $detailsImg.setAttribute('src', exercise.image);
  if (exercise.primaryMuscles.length > 0) {
    $detailsMusclePrim.textContent = '';
    for (const muscle of exercise.primaryMuscles) {
      $detailsMusclePrim.textContent += `${muscle.name}, `;
    }
  } else {
    $detailsMusclePrim.textContent = 'no data found.';
  }
  if (exercise.secondaryMuscles.length > 0) {
    $detailsMuscleSec.textContent = '';
    for (const muscle of exercise.secondaryMuscles) {
      $detailsMuscleSec.textContent += `${muscle.name}, `;
    }
  } else {
    $detailsMuscleSec.textContent = 'no data found.';
  }
  if (exercise.equipment.length > 0) {
    $detailsEquipment.textContent = '';
    for (const equipment of exercise.equipment) {
      $detailsEquipment.textContent += `${equipment.name}, `;
    }
  } else {
    $detailsEquipment.textContent = 'no data found.';
  }
  $detailsDescription.innerHTML = exercise.description;
}
function renderAddExerciseForm() {
  fitlogData.workouts.forEach((workout) => {
    const $div = document.createElement('div');
    const $label = document.createElement('label');
    $label.setAttribute('for', `${workout.workoutId}`);
    $label.textContent = `${workout.name}`;
    const $checkbox = document.createElement('input');
    $checkbox.setAttribute('type', 'checkbox');
    $checkbox.setAttribute('name', `workout-${workout.workoutId}-checkbox`);
    $checkbox.setAttribute('id', `workout-${workout.workoutId}`);
    $checkbox.setAttribute('value', `${workout.workoutId}`);
    $div.appendChild($label);
    $div.appendChild($checkbox);
    $addExerciseForm.appendChild($div);
  });
  const $div = document.createElement('div');
  $div.setAttribute('class', 'flex justify-center');
  const $submitBtn = document.createElement('button');
  $submitBtn.setAttribute('type', 'submit');
  $submitBtn.setAttribute('class', 'yellow-btn');
  $submitBtn.textContent = 'Submit';
  $div.appendChild($submitBtn);
  $addExerciseForm.appendChild($div);
}
document.addEventListener('DOMContentLoaded', () => {
  fitlogData.favorites.forEach((exercise) => {
    $favoritesCardList.appendChild(renderExercises(exercise));
  });
  if (fitlogData.favorites.length === 0)
    $favoritesCta.classList.remove('hidden');
});
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
  } else if ($eventTarget.classList.contains('exercises-view-anchor')) {
    viewSwap('exercises-view');
    if ($eventTarget.classList.contains('hamburger-link')) {
      $hamburger?.classList.toggle('hidden');
      $hamburgerLinks?.classList.toggle('hidden');
    }
  } else if ($eventTarget.classList.contains('favorites-view-anchor')) {
    viewSwap('favorites-view');
    if ($eventTarget.classList.contains('hamburger-link')) {
      $hamburger?.classList.toggle('hidden');
      $hamburgerLinks?.classList.toggle('hidden');
    }
  } else if ($eventTarget.classList.contains('new-workout-view-anchor')) {
    viewSwap('new-workout');
    if ($eventTarget.classList.contains('hamburger-link')) {
      $hamburger?.classList.toggle('hidden');
      $hamburgerLinks?.classList.toggle('hidden');
    }
  } else if ($eventTarget.classList.contains('home-view-anchor')) {
    viewSwap('home');
  }
});
$exercisesCardList.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.closest('.card-list > .card')) {
    const $card = $eventTarget.closest('.card');
    if ($card.dataset.baseId) {
      const cardBaseId = $card.dataset.baseId;
      if ($eventTarget.tagName !== 'I') {
        const exercise = findExerciseByBaseId(parseInt(cardBaseId));
        if (!exercise) return;
        fitlogData.viewing = exercise;
        populateExerciseDetails(exercise);
        viewSwap('exercise-details');
      } else if (
        $eventTarget.tagName === 'I' &&
        $eventTarget.classList.contains('fa-heart')
      ) {
        const exercise = findExerciseByBaseId(parseInt(cardBaseId));
        if (exercise) handleFavoriteClick(exercise, $eventTarget);
        fitlogData.viewing = exercise;
      } else if ($eventTarget.classList.contains('fa-pen-to-square')) {
        const exercise = findExerciseByBaseId(parseInt(cardBaseId));
        fitlogData.viewing = exercise;
        renderAddExerciseForm();
        $addExerciseModal.showModal();
      }
    }
  }
});
$favoritesCardList.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.closest('.card-list > .card')) {
    const $card = $eventTarget.closest('.card');
    if ($card.dataset.baseId) {
      const cardBaseId = $card.dataset.baseId;
      if ($eventTarget.tagName !== 'I') {
        const exercise = findExerciseByBaseId(parseInt(cardBaseId));
        if (!exercise) return;
        fitlogData.viewing = exercise;
        populateExerciseDetails(exercise);
        viewSwap('exercise-details');
      } else if (
        $eventTarget.tagName === 'I' &&
        $eventTarget.classList.contains('fa-heart')
      ) {
        const exercise = findExerciseByBaseId(parseInt(cardBaseId));
        if (exercise) handleFavoriteClick(exercise, $eventTarget);
      } else if ($eventTarget.classList.contains('fa-pen-to-square')) {
        const exercise = findExerciseByBaseId(parseInt(cardBaseId));
        fitlogData.viewing = exercise;
        renderAddExerciseForm();
        $addExerciseModal.showModal();
      }
    }
  }
});
$exerciseDetailSection.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  const $section = $eventTarget.closest('section.details');
  const exercise = findExerciseByBaseId(parseInt($section.dataset.baseId));
  if (
    $eventTarget.tagName === 'I' &&
    $eventTarget.classList.contains('fa-heart')
  ) {
    if (exercise) handleFavoriteClick(exercise, $eventTarget);
  } else if ($eventTarget.classList.contains('add-exercise-btn')) {
    renderAddExerciseForm();
    if (exercise) $addExerciseModal.showModal();
  }
});
$favoritesCta.addEventListener('click', () => {
  viewSwap('exercises-view');
});
$newWorkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const $formElements = $newWorkoutForm.elements;
  const newWorkout = {
    name: $formElements.name.value,
    days: parseInt($formElements.days.value),
    exercises: [],
    workoutId: fitlogData.nextWorkoutId,
  };
  fitlogData.nextWorkoutId++;
  fitlogData.workouts.push(newWorkout);
  $newWorkoutForm.reset();
  viewSwap('exercises-view');
});
$addExerciseModal.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.classList.contains('fa-x')) {
    $addExerciseModal.close();
    while ($addExerciseForm.hasChildNodes()) {
      if ($addExerciseForm.firstChild) {
        $addExerciseForm.removeChild($addExerciseForm.firstChild);
      }
    }
  }
});
$addExerciseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const selectedWorkoutIds = [];
  const checkboxes = $addExerciseForm.querySelectorAll(
    '#add-exercise-form input[type="checkbox"]:checked',
  );
  checkboxes.forEach((checkbox) => {
    const $checkbox = checkbox;
    selectedWorkoutIds.push(parseInt($checkbox.value));
  });
  const currentExercise = fitlogData.viewing;
  const selectedWorkouts = fitlogData.workouts.filter((workout) =>
    selectedWorkoutIds.includes(workout.workoutId),
  );
  selectedWorkouts.forEach((workout) => {
    workout.exercises.push(currentExercise);
  });
  $addExerciseForm.reset();
  $addExerciseModal.close();
  while ($addExerciseForm.hasChildNodes()) {
    if ($addExerciseForm.firstChild) {
      $addExerciseForm.removeChild($addExerciseForm.firstChild);
    }
  }
});
fitlogData.workouts = [];
