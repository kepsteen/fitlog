'use strict';
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
const $workoutsSection = document.querySelector('.workouts');
const $navAnchorNodeList = document.querySelectorAll('.nav-links a');
const $weightPlateSpinner = document.querySelector('#loading-img');
const $penguinPressImg = document.querySelector('.penguin-press-img');
const $exerciseSearch = document.querySelector('#exercise-search');
const $cardLists = document.querySelectorAll('.card-list');
const $addExerciseFormSubmitBtn = document.querySelector(
  '#add-exercise-form button',
);
const $addExerciseFormItemsContainer = document.querySelector(
  '.add-exercise-form-items',
);
const $loadingOverlay = document.querySelector('.loading-overlay');
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
if (!$workoutsSection) throw new Error('no workouts section');
if (!$navAnchorNodeList) throw new Error('no nav-links anchor node list found');
if (!$weightPlateSpinner) throw new Error('no weight plate spinner found');
if (!$penguinPressImg) throw new Error('no penguin press img found');
if (!$exerciseSearch) throw new Error('no exercise search input found');
if (!$cardLists) throw new Error('no card lists found');
if (!$addExerciseFormSubmitBtn)
  throw new Error('no add exercise form submit button');
if (!$addExerciseFormItemsContainer)
  throw new Error('no add exercise form items found');
if (!$loadingOverlay) throw new Error('no loading overlay found');
function renderExercises(simpleExerciseObj) {
  const $card = document.createElement('div');
  $card.setAttribute('class', 'card flex space-between');
  $card.setAttribute('data-base-id', `${simpleExerciseObj.baseId}`);
  const $cardImg = document.createElement('img');
  $cardImg.setAttribute('src', simpleExerciseObj.image);
  $cardImg.setAttribute('class', 'card-img');
  const $cardText = document.createElement('div');
  $cardText.setAttribute('class', 'card-text flex flex-col space-between');
  const $cardTitle = document.createElement('h3');
  $cardTitle.textContent = simpleExerciseObj.name;
  const $cardIcons = document.createElement('div');
  $cardIcons.setAttribute('class', 'card-icons flex justify-end');
  const $heart = document.createElement('i');
  if (simpleExerciseObj.favorite) {
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
async function fetchExerciseDetails(simpleExerciseObj) {
  $loadingOverlay.classList.remove('hidden');
  try {
    const response = await fetch(
      `https://wger.de/api/v2/exercisebaseinfo/${simpleExerciseObj.baseId}/`,
    );
    if (!response.ok) {
      throw new Error(`HTTP Error: Status ${response.status}`);
    }
    const data = await response.json();
    $loadingOverlay.classList.add('hidden');
    const primaryMuscles = [];
    const secondaryMuscles = [];
    const equipment = [];
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
      if (exercise.id === simpleExerciseObj.id) {
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
      if (simpleExerciseObj.baseId === element.baseId) {
        simpleExerciseObj.favorite = true;
      }
    }
    const exerciseObj = {
      ...simpleExerciseObj,
      description: exerciseDescription,
      primaryMuscles,
      secondaryMuscles,
      equipment,
    };
    populateExerciseDetails(exerciseObj);
  } catch (error) {
    console.error('error', error);
  } finally {
    $loadingOverlay.classList.add('hidden');
  }
}
async function fetchExerciseSearchData(term) {
  $noResults.classList.add('hidden');
  $weightPlateSpinner.classList.add('hidden');
  $penguinPressImg.classList.add('hidden');
  let loadingImg = $weightPlateSpinner;
  if (term === 'bench press') loadingImg = $penguinPressImg;
  if (loadingImg) loadingImg.classList.remove('hidden');
  try {
    const response = await fetch(
      `https://wger.de/api/v2/exercise/search/?language=2&term=${term}`,
    );
    if (!response.ok) {
      throw new Error(`HTTP Error: Status ${response.status}`);
    }
    const data = await response.json();
    fitlogData.exerciseSearchResults = [];
    for (let i = 0; i < data.suggestions.length; i++) {
      if (data.suggestions[i].data.image !== null) {
        const simpleExerciseObj = {
          baseId: data.suggestions[i].data.base_id,
          id: data.suggestions[i].data.id,
          name: data.suggestions[i].value,
          image: 'https://wger.de' + data.suggestions[i].data.image,
          favorite: false,
        };
        if (findExerciseInCardList(simpleExerciseObj.baseId)) {
          simpleExerciseObj.favorite = true;
        }
        fitlogData.exerciseSearchResults.push(simpleExerciseObj);
      }
    }
    if (fitlogData.exerciseSearchResults.length) {
      fitlogData.exerciseSearchResults.forEach((element) => {
        $exercisesCardList.appendChild(renderExercises(element));
      });
      $noResults.classList.add('hidden');
    } else {
      $noResults.classList.remove('hidden');
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (loadingImg) loadingImg.classList.add('hidden');
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
  if ($navAnchorNodeList) {
    for (let i = 0; i < $navAnchorNodeList.length; i++) {
      if ($navAnchorNodeList[i].dataset.view === view) {
        $navAnchorNodeList[i].classList.add('active-link');
      } else {
        $navAnchorNodeList[i].classList.remove('active-link');
      }
    }
  }
  fitlogData.currentView = view;
}
function clearCardList() {
  while ($exercisesCardList.hasChildNodes()) {
    const child = $exercisesCardList.firstChild;
    $exercisesCardList.removeChild(child);
  }
}
function findExerciseInCardList(baseId) {
  for (const simpleExercise of fitlogData.exerciseSearchResults) {
    if (simpleExercise.baseId === baseId) {
      return simpleExercise;
    }
  }
  for (const exercise of fitlogData.favorites) {
    if (exercise.baseId === baseId) {
      return exercise;
    }
  }
  return null;
}
function handleFavoriteClick(simpleExerciseObj, targetIcon) {
  const $favoritesNodeList = document.querySelectorAll(
    '#favorites-card-list > .card',
  );
  if (!$favoritesNodeList) throw new Error('no favorites node list found');
  if (targetIcon.classList.contains('fa-regular')) {
    targetIcon.classList.remove('fa-regular');
    targetIcon.classList.add('fa-solid');
    simpleExerciseObj.favorite = true;
    fitlogData.favorites.push(simpleExerciseObj);
    $favoritesCardList.appendChild(renderExercises(simpleExerciseObj));
    $favoritesCta.classList.add('hidden');
  } else if (targetIcon.classList.contains('fa-solid')) {
    targetIcon.classList.remove('fa-solid');
    targetIcon.classList.add('fa-regular');
    simpleExerciseObj.favorite = false;
    let indexToRemove = -1;
    for (let i = 0; i < fitlogData.favorites.length; i++) {
      if (fitlogData.favorites[i].baseId === simpleExerciseObj.baseId) {
        indexToRemove = i;
      }
    }
    fitlogData.favorites.splice(indexToRemove, 1);
    for (let i = 0; i < $favoritesNodeList.length; i++) {
      const nodeBaseId = $favoritesNodeList[i].dataset.baseId;
      if (parseInt(nodeBaseId) === simpleExerciseObj.baseId) {
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
    if (parseInt(nodeBaseId) === simpleExerciseObj.baseId) {
      const $heartIcon = $exercisesNodeList[i].querySelector('.fa-heart');
      if (!$heartIcon) throw new Error('no heart icon found');
      if (simpleExerciseObj.favorite) {
        $heartIcon.classList.remove('fa-regular');
        $heartIcon.classList.add('fa-solid');
      } else {
        $heartIcon.classList.add('fa-regular');
        $heartIcon.classList.remove('fa-solid');
      }
    }
  }
}
function populateExerciseDetails(exerciseObj) {
  $exerciseDetailSection.setAttribute('data-base-id', `${exerciseObj.baseId}`);
  $detailsTitle.textContent = exerciseObj.name + ' ';
  if (exerciseObj.favorite)
    $detailsHeart.setAttribute('class', 'fa-solid fa-heart');
  if (!exerciseObj.favorite)
    $detailsHeart.setAttribute('class', 'fa-regular fa-heart');
  $detailsImg.setAttribute('src', exerciseObj.image);
  if (exerciseObj.primaryMuscles.length > 0) {
    $detailsMusclePrim.textContent = '';
    for (const muscle of exerciseObj.primaryMuscles) {
      $detailsMusclePrim.textContent += `${muscle.name}, `;
    }
  } else {
    $detailsMusclePrim.textContent = 'no data found.';
  }
  if (exerciseObj.secondaryMuscles.length > 0) {
    $detailsMuscleSec.textContent = '';
    for (const muscle of exerciseObj.secondaryMuscles) {
      $detailsMuscleSec.textContent += `${muscle.name}, `;
    }
  } else {
    $detailsMuscleSec.textContent = 'no data found.';
  }
  if (exerciseObj.equipment.length > 0) {
    $detailsEquipment.textContent = '';
    for (const equipment of exerciseObj.equipment) {
      $detailsEquipment.textContent += `${equipment.name}, `;
    }
  } else {
    $detailsEquipment.textContent = 'no data found.';
  }
  $detailsDescription.innerHTML = exerciseObj.description;
}
function renderAddToWorkoutForm() {
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
    $addExerciseFormItemsContainer.appendChild($div);
  });
}
function appendToAddToWorkoutForm(workout) {
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
  $addExerciseFormItemsContainer.appendChild($div);
}
function renderWorkouts(workout) {
  const $workoutDiv = document.createElement('div');
  $workoutDiv.setAttribute('class', 'workout');
  $workoutDiv.setAttribute('data-workout-id', `${workout.workoutId}`);
  const $workoutTitleDiv = document.createElement('div');
  $workoutTitleDiv.setAttribute('class', 'workout-title flex');
  $workoutTitleDiv.setAttribute('style', 'gap: 10px');
  const $workoutTitleH1 = document.createElement('h1');
  $workoutTitleH1.textContent = workout.name;
  const $iconContainerDiv = document.createElement('div');
  $iconContainerDiv.setAttribute('class', 'caret-container flex align-center');
  const $icon = document.createElement('i');
  $icon.setAttribute('class', 'fa-solid fa-caret-right caret');
  $icon.setAttribute('data-workout-id', `${workout.workoutId}`);
  $iconContainerDiv.appendChild($icon);
  $workoutTitleDiv.appendChild($workoutTitleH1);
  $workoutTitleDiv.appendChild($iconContainerDiv);
  const $workoutDataContainer = document.createElement('div');
  $workoutDataContainer.setAttribute(
    'class',
    'workout-data-container flex hidden',
  );
  $workoutDataContainer.setAttribute('style', 'gap: 20px');
  $workoutDataContainer.setAttribute('data-workout-id', `${workout.workoutId}`);
  const $exercisesDiv = document.createElement('div');
  $exercisesDiv.setAttribute('class', 'exercises');
  if (workout.exercises.length === 0) $exercisesDiv.classList.add('hidden');
  const $exercisesH3 = document.createElement('h3');
  $exercisesH3.textContent = 'Exercises';
  const $exercisesUl = document.createElement('ul');
  workout.exercises.forEach((exercise) => {
    const $exerciseLi = document.createElement('li');
    $exerciseLi.setAttribute('data-base-id', `${exercise.baseId}`);
    $exerciseLi.setAttribute('data-workout-id', `${workout.workoutId}`);
    $exerciseLi.setAttribute('draggable', 'true');
    const $strong = document.createElement('strong');
    $strong.textContent = exercise.name + ':';
    $exerciseLi.appendChild($strong);
    const xmark = document.createElement('i');
    xmark.setAttribute('class', 'fa-solid fa-xmark hidden');
    xmark.setAttribute('style', 'color: #f1095a;');
    const textNode = document.createTextNode(' 3 x 10-12 reps');
    $exerciseLi.appendChild(textNode);
    $exerciseLi.appendChild(xmark);
    $exercisesUl.appendChild($exerciseLi);
  });
  const $exercisesH3span = document.createElement('span');
  $exercisesH3span.textContent = ' (Drag exercise to assign)';
  $exercisesH3.appendChild($exercisesH3span);
  $exercisesDiv.appendChild($exercisesH3);
  $exercisesDiv.appendChild($exercisesUl);
  $workoutDataContainer.appendChild($exercisesDiv);
  const $daysContainerDiv = document.createElement('div');
  $daysContainerDiv.setAttribute('class', 'days-container flex wrap');
  for (let i = 0; i < workout.days.length; i++) {
    const numDay = i + 1;
    const $dayDiv = document.createElement('div');
    $dayDiv.setAttribute('class', 'day');
    const $dayH3 = document.createElement('h3');
    $dayH3.textContent = `Day ${numDay}`;
    const $dayUl = document.createElement('ul');
    $dayUl.setAttribute('data-num-day', `${numDay}`);
    $dayUl.setAttribute('class', `target-${workout.workoutId}`);
    workout.days[i][numDay].forEach((exercise) => {
      const $exerciseLi = document.createElement('li');
      $exerciseLi.setAttribute('data-base-id', `${exercise.baseId}`);
      $exerciseLi.setAttribute('data-workout-id', `${workout.workoutId}`);
      const $strong = document.createElement('strong');
      $strong.textContent = exercise.name + ':';
      $exerciseLi.appendChild($strong);
      const xmark = document.createElement('i');
      xmark.setAttribute('class', 'fa-solid fa-xmark hidden');
      xmark.setAttribute('style', 'color: #f1095a;');
      const textNode = document.createTextNode(' 3 x 10-12 reps');
      $exerciseLi.appendChild(textNode);
      $exerciseLi.appendChild(xmark);
      $dayUl.appendChild($exerciseLi);
    });
    $dayDiv.appendChild($dayH3);
    $dayDiv.appendChild($dayUl);
    $daysContainerDiv.appendChild($dayDiv);
  }
  $workoutDataContainer.appendChild($daysContainerDiv);
  $workoutDiv.appendChild($workoutTitleDiv);
  $workoutDiv.appendChild($workoutDataContainer);
  return $workoutDiv;
}
function handleCaretClick(workoutId, caretIcon) {
  const $workoutNodeList = document.querySelectorAll('.workout-data-container');
  $workoutNodeList.forEach((workoutNode) => {
    if (!workoutNode.dataset.workoutId) return;
    if (parseInt(workoutNode.dataset.workoutId) === workoutId) {
      if (caretIcon.classList.contains('fa-caret-down')) {
        caretIcon.classList.remove('fa-caret-down');
        caretIcon.classList.add('fa-caret-right');
        workoutNode.classList.add('hidden');
      } else if (caretIcon.classList.contains('fa-caret-right')) {
        caretIcon.classList.remove('fa-caret-right');
        caretIcon.classList.add('fa-caret-down');
        workoutNode.classList.remove('hidden');
      }
    } else if (parseInt(workoutNode.dataset.workoutId) !== workoutId) {
      const caretNodeList = document.querySelectorAll('.fa-caret-down');
      caretNodeList.forEach((caret) => {
        if (!caret.dataset.workoutId) return;
        if (parseInt(caret.dataset.workoutId) !== workoutId) {
          caret.classList.remove('fa-caret-down');
          caret.classList.add('fa-caret-right');
        }
      });
      workoutNode.classList.add('hidden');
    }
  });
}
function createDragNDropEventListeners(workoutId) {
  const $workout = document.querySelector(`[data-workout-id="${workoutId}"]`);
  if (!$workout) throw new Error('no workout container found');
  const $exercisesNodeList = $workout.querySelectorAll(
    `li[data-workout-id="${workoutId}"]`,
  );
  if (!$exercisesNodeList) throw new Error('no exercises container list found');
  $exercisesNodeList.forEach((exerciseElement) => {
    exerciseElement.addEventListener('dragstart', (dragstartEvent) => {
      if (dragstartEvent.dataTransfer) {
        dragstartEvent.dataTransfer.clearData();
        dragstartEvent.dataTransfer.setData(
          'text/plain',
          exerciseElement.dataset.baseId,
        );
      }
    });
  });
  const $targetsNodeList = $workout.querySelectorAll(`.target-${workoutId}`);
  if (!$targetsNodeList) throw new Error('no targets node list found');
  $targetsNodeList.forEach((droppableElement) => {
    if (!droppableElement) return;
    droppableElement.addEventListener('dragover', (dragoverEvent) => {
      dragoverEvent.preventDefault();
    });
    droppableElement.addEventListener('dragenter', (dragoverEvent) => {
      dragoverEvent.preventDefault();
      droppableElement.classList.add('dragover');
    });
    droppableElement.addEventListener('dragleave', (dragoverEvent) => {
      dragoverEvent.preventDefault();
      droppableElement.classList.remove('dragover');
    });
    droppableElement.addEventListener('drop', (dropEvent) => {
      dropEvent.preventDefault();
      droppableElement.classList.remove('dragover');
      if (dropEvent.dataTransfer) {
        const data = dropEvent.dataTransfer.getData('text');
        const source = $workout.querySelector(`[data-base-id="${data}"]`);
        if (source) {
          source.setAttribute('draggable', 'false');
          droppableElement.appendChild(source);
        }
        const $eventTarget = dropEvent.target;
        const targetNumDay = $eventTarget.closest('ul')?.dataset.numDay;
        if (!targetNumDay) return;
        assignExercisesToDays(
          parseInt(data),
          parseInt(targetNumDay),
          workoutId,
        );
        dropEvent.dataTransfer.clearData();
      }
    });
  });
}
function renderAddedExercise(workoutIdArr, exercise) {
  const $workoutsNodeList = document.querySelectorAll('.workout');
  workoutIdArr.forEach((id) => {
    for (const workoutNode of $workoutsNodeList) {
      if (
        workoutNode.dataset.workoutId &&
        id === parseInt(workoutNode.dataset.workoutId)
      ) {
        const li = document.createElement('li');
        li.setAttribute('data-base-id', `${exercise.baseId}`);
        li.setAttribute('data-workout-id', `${workoutNode.dataset.workoutId}`);
        li.setAttribute('draggable', 'true');
        const $strong = document.createElement('strong');
        $strong.textContent = exercise.name + ':';
        const xmark = document.createElement('i');
        xmark.setAttribute('class', 'fa-solid fa-xmark hidden');
        xmark.setAttribute('style', 'color: #f1095a;');
        li.appendChild($strong);
        const textNode = document.createTextNode(' 3 x 10-12 reps');
        li.appendChild(textNode);
        li.appendChild(xmark);
        const $exercisesDiv = workoutNode.querySelector('.exercises');
        if (!$exercisesDiv) throw new Error('no exercises div found');
        $exercisesDiv.classList.remove('hidden');
        const $ulElement = workoutNode.querySelector('.exercises > ul');
        if (!$ulElement) throw new Error('no ul element found');
        $ulElement.appendChild(li);
        const newExerciseElement = workoutNode.querySelector(
          `[data-base-id='${exercise.baseId}']`,
        );
        if (newExerciseElement) {
          newExerciseElement.addEventListener('dragstart', (event) => {
            if (event.dataTransfer) {
              event.dataTransfer.clearData();
              event.dataTransfer.setData(
                'text/plain',
                newExerciseElement.dataset.baseId,
              );
            }
          });
        }
      }
    }
  });
}
function assignExercisesToDays(baseId, numDay, workoutId) {
  for (const workout of fitlogData.workouts) {
    if (workout.workoutId === workoutId) {
      let indexToRemove = null;
      for (let i = 0; i < workout.exercises.length; i++) {
        if (workout.exercises[i].baseId === baseId) {
          indexToRemove = i;
          break;
        }
      }
      if (indexToRemove !== null) {
        const exerciseRemoved = workout.exercises.splice(indexToRemove, 1);
        const foundDay = workout.days.find((day) => day[numDay] !== undefined);
        if (!foundDay) return;
        foundDay[numDay].push(exerciseRemoved[0]);
      }
    }
  }
}
function createMouseoverEventListeners(workoutId) {
  const $workoutDataContainer = document.querySelector(
    `.workout[data-workout-id="${workoutId}"]`,
  );
  if (!$workoutDataContainer)
    throw new Error('no workout data container found');
  $workoutDataContainer.addEventListener('mouseover', (event) => {
    const $eventTarget = event.target;
    if ($eventTarget.tagName === 'LI') {
      const xmark = $eventTarget.querySelector('.fa-xmark');
      if (!xmark) throw new Error('no xmark found');
      xmark.classList.remove('hidden');
      setTimeout(() => {
        xmark.classList.add('hidden');
      }, 1000);
    }
  });
  $workoutDataContainer.addEventListener('click', (event) => {
    const $eventTarget = event.target;
    if (
      $eventTarget.tagName === 'I' &&
      $eventTarget.classList.contains('fa-xmark')
    ) {
      const $exerciseLiToRemove = $eventTarget.closest('li');
      if (!$exerciseLiToRemove.dataset.baseId) return;
      if (!$exerciseLiToRemove.dataset.workoutId) return;
      let indexToRemove = null;
      for (const workout of fitlogData.workouts) {
        if (
          workout.workoutId === parseInt($exerciseLiToRemove.dataset.workoutId)
        ) {
          for (let i = 0; i < workout.exercises.length; i++) {
            if (
              workout.exercises[i].baseId ===
              parseInt($exerciseLiToRemove.dataset.baseId)
            ) {
              indexToRemove = i;
            }
          }
          if (indexToRemove !== null) {
            workout.exercises.splice(indexToRemove, 1);
          }
          if (indexToRemove === null) {
            let removeObject = null;
            for (let dayIndex = 0; dayIndex < workout.days.length; dayIndex++) {
              const day = workout.days[dayIndex];
              for (const [dayKey, exercises] of Object.entries(day)) {
                for (
                  let exerciseIndex = 0;
                  exerciseIndex < exercises.length;
                  exerciseIndex++
                ) {
                  if (
                    exercises[exerciseIndex].baseId ===
                    parseInt($exerciseLiToRemove.dataset.baseId)
                  ) {
                    removeObject = { dayIndex, dayKey, exerciseIndex };
                  }
                }
              }
            }
            if (removeObject) {
              workout.days[removeObject.dayIndex][
                parseInt(removeObject.dayKey)
              ].splice(removeObject.exerciseIndex, 1);
            }
          }
        }
      }
      $exerciseLiToRemove.remove();
    }
  });
}
document.addEventListener('DOMContentLoaded', async () => {
  fitlogData.favorites.forEach((exercise) => {
    $favoritesCardList.appendChild(renderExercises(exercise));
  });
  fitlogData.exerciseSearchResults.forEach((element) => {
    $exercisesCardList.appendChild(renderExercises(element));
  });
  renderAddToWorkoutForm();
  if (fitlogData.favorites.length === 0)
    $favoritesCta.classList.remove('hidden');
  fitlogData.workouts.forEach((workout) => {
    $workoutsSection.appendChild(renderWorkouts(workout));
    createDragNDropEventListeners(workout.workoutId);
    createMouseoverEventListeners(workout.workoutId);
  });
  if (fitlogData.viewing && fitlogData.currentView === 'exercise-details') {
    await fetchExerciseDetails(fitlogData.viewing);
  }
  viewSwap(fitlogData.currentView);
});
$workoutsSection.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if (
    $eventTarget.tagName === 'I' &&
    $eventTarget.classList.contains('caret')
  ) {
    const $workoutContainer = $eventTarget.closest('.workout');
    const workoutId = $workoutContainer.dataset.workoutId;
    if (workoutId) handleCaretClick(parseInt(workoutId), $eventTarget);
  }
});
$beginBtn.addEventListener('click', () => {
  viewSwap('exercises-view');
});
$searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearCardList();
  fetchExerciseSearchData($exerciseSearch.value);
  $searchForm.reset();
});
$header.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if (
    $eventTarget.classList.contains('menu') ||
    $eventTarget.classList.contains('hamburger')
  ) {
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
  } else if ($eventTarget.classList.contains('workouts-view-anchor')) {
    viewSwap('workouts-view');
    if ($eventTarget.classList.contains('hamburger-link')) {
      $hamburger?.classList.toggle('hidden');
      $hamburgerLinks?.classList.toggle('hidden');
    }
  }
});
$cardLists.forEach(($cardList) => {
  $cardList.addEventListener('click', async (event) => {
    const $eventTarget = event.target;
    if ($eventTarget.closest('.card-list > .card')) {
      const $card = $eventTarget.closest('.card');
      if ($card.dataset.baseId) {
        const cardBaseId = $card.dataset.baseId;
        if ($eventTarget.tagName !== 'I') {
          const simpleExercise = findExerciseInCardList(parseInt(cardBaseId));
          if (!simpleExercise) return;
          await fetchExerciseDetails(simpleExercise);
          viewSwap('exercise-details');
        } else if (
          $eventTarget.tagName === 'I' &&
          $eventTarget.classList.contains('fa-heart')
        ) {
          const exercise = findExerciseInCardList(parseInt(cardBaseId));
          if (exercise) handleFavoriteClick(exercise, $eventTarget);
        } else if ($eventTarget.classList.contains('fa-pen-to-square')) {
          const exercise = findExerciseInCardList(parseInt(cardBaseId));
          fitlogData.viewing = exercise;
          $addExerciseModal.showModal();
        }
      }
    }
  });
});
$exerciseDetailSection.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  const $section = $eventTarget.closest('section.details-view');
  const exercise = findExerciseInCardList(parseInt($section.dataset.baseId));
  if (
    $eventTarget.tagName === 'I' &&
    $eventTarget.classList.contains('fa-heart')
  ) {
    if (exercise) handleFavoriteClick(exercise, $eventTarget);
  } else if ($eventTarget.classList.contains('add-exercise-btn')) {
    if (exercise) $addExerciseModal.showModal();
  }
});
$favoritesCta.addEventListener('click', () => {
  viewSwap('exercises-view');
});
$newWorkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const $formElements = $newWorkoutForm.elements;
  const numDays = parseInt($formElements.days.value);
  const dayObjArr = [];
  for (let i = 1; i <= numDays; i++) {
    const dayObject = {};
    dayObject[i] = [];
    dayObjArr.push(dayObject);
  }
  const newWorkout = {
    name: $formElements.name.value,
    days: dayObjArr,
    exercises: [],
    workoutId: fitlogData.nextWorkoutId,
  };
  fitlogData.nextWorkoutId++;
  fitlogData.workouts.push(newWorkout);
  $newWorkoutForm.reset();
  viewSwap('exercises-view');
  $workoutsSection.appendChild(renderWorkouts(newWorkout));
  createDragNDropEventListeners(newWorkout.workoutId);
  createMouseoverEventListeners(newWorkout.workoutId);
  appendToAddToWorkoutForm(newWorkout);
});
$addExerciseModal.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  if ($eventTarget.classList.contains('fa-x')) {
    $addExerciseModal.close();
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
  renderAddedExercise(selectedWorkoutIds, currentExercise);
});
